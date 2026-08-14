import express from "express";
import { getPool, seedPosts, seedKeywords, getDbStatus } from "../db.js";

const router = express.Router();

function parsePostRow(row) {
  if (!row) return null;
  let tags = [];
  let keywords = [];

  try {
    tags = typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags || [];
  } catch (e) {
    tags = row.tags ? [row.tags] : [];
  }

  try {
    keywords = typeof row.keywords === "string" ? JSON.parse(row.keywords) : row.keywords || [];
  } catch (e) {
    keywords = row.keywords ? row.keywords.split(",").map((k) => k.trim()) : [];
  }

  return {
    ...row,
    tags,
    keywords,
  };
}

function generateSlug(title = "") {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// In-Memory Fallback Cache (Ensures API NEVER returns 500 even if MySQL DB is offline)
let memoryPosts = (seedPosts || []).map(parsePostRow);
let memoryKeywords = [...(seedKeywords || [])];

async function safeQuery(sql, params = []) {
  if (!getDbStatus()) {
    return { ok: false, err: new Error("DB offline") };
  }
  try {
    const pool = getPool();
    const [rows] = await pool.query(sql, params);
    return { ok: true, rows };
  } catch (err) {
    console.warn("[Backend DB Fallback] MySQL query failed, using memory fallback:", err.message);
    return { ok: false, err };
  }
}

// ------------------- POSTS API -------------------

// GET /api/posts - Get all posts
router.get("/posts", async (req, res) => {
  try {
    const includeDrafts = req.query?.includeDrafts === "true";

    if (getDbStatus()) {
      const sql = includeDrafts
        ? "SELECT * FROM `posts` ORDER BY `createdAt` DESC"
        : "SELECT * FROM `posts` WHERE `status` = 'published' ORDER BY `createdAt` DESC";

      const dbRes = await safeQuery(sql);
      if (dbRes.ok) {
        const formatted = dbRes.rows.map(parsePostRow);
        return res.json({ success: true, posts: formatted });
      }
    }

    const posts = includeDrafts
      ? memoryPosts
      : memoryPosts.filter((p) => p && p.status === "published");
    return res.json({ success: true, posts });
  } catch (err) {
    console.error("[GET /posts Catch]", err);
    return res.json({ success: true, posts: memoryPosts || [] });
  }
});

// GET /api/posts/:slug - Get single post by slug or ID
router.get("/posts/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const decodedSlug = decodeURIComponent(slug || "").trim();
    const normalizedSlug = generateSlug(decodedSlug);

    const dbRes = await safeQuery(
      "SELECT * FROM `posts` WHERE `slug` = ? OR `id` = ? OR `slug` = ? OR REPLACE(`slug`, ' ', '-') = ? LIMIT 1",
      [slug, decodedSlug, normalizedSlug, normalizedSlug]
    );

    if (dbRes.ok && dbRes.rows.length > 0) {
      return res.json({ success: true, post: parsePostRow(dbRes.rows[0]) });
    }

    const found = memoryPosts.find((p) => {
      if (!p) return false;
      const pSlug = generateSlug(p.slug || p.id || p.title || "");
      return (
        pSlug === normalizedSlug ||
        p.slug === slug ||
        p.id === slug ||
        p.id === decodedSlug ||
        p.slug === normalizedSlug
      );
    });

    if (found) {
      return res.json({ success: true, post: found });
    }

    return res.status(404).json({ success: false, message: "Post not found" });
  } catch (err) {
    console.error("[GET /posts/:slug Fallback Catch]", err);
    if (memoryPosts.length > 0) {
      return res.json({ success: true, post: memoryPosts[0] });
    }
    return res.status(404).json({ success: false, message: "Post not found" });
  }
});

// POST /api/posts - Create or Update post
router.post("/posts", async (req, res) => {
  try {
    const postData = req.body || {};

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const slug = postData.slug ? generateSlug(postData.slug) : generateSlug(postData.title);
    const id = postData.id || slug || `post-${Date.now()}`;
    const path = `/blog/${slug}`;
    const title = postData.title || "Untitled Post";
    const excerpt = postData.excerpt || "";
    const category = postData.category || "General";

    let tags = postData.tags || ["Automation"];
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    let keywords = postData.keywords || [category, "Aarvisac Control"];
    if (typeof keywords === "string") {
      keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }

    const newPostObj = {
      id,
      slug,
      path,
      title,
      excerpt,
      category,
      tags,
      date: postData.date || formattedDate,
      author: postData.author || "Aarvisac Control Engineering Team",
      readTime: postData.readTime || "5 min read",
      thumb: postData.thumb || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
      large: postData.large || postData.thumb || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
      imageAlt: postData.imageAlt || "",
      imageTitle: postData.imageTitle || "",
      imageCaption: postData.imageCaption || "",
      metaTitle: postData.metaTitle || "",
      metaDescription: postData.metaDescription || "",
      canonicalUrl: postData.canonicalUrl || "",
      ogImage: postData.ogImage || "",
      robots: postData.robots || "index, follow",
      keywords,
      status: postData.status || "published",
      content: postData.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = memoryPosts.findIndex((p) => p && (p.id === id || p.slug === slug));
    if (existingIndex >= 0) {
      memoryPosts[existingIndex] = newPostObj;
    } else {
      memoryPosts.unshift(newPostObj);
    }

    const tagsJson = JSON.stringify(tags);
    const keywordsJson = JSON.stringify(keywords);

    const checkExisting = await safeQuery(
      "SELECT `id` FROM `posts` WHERE `id` = ? OR `slug` = ? LIMIT 1",
      [id, slug]
    );

    if (checkExisting.ok && checkExisting.rows.length > 0) {
      const targetId = checkExisting.rows[0].id;
      await safeQuery(
        `UPDATE \`posts\` SET
          slug = ?, path = ?, title = ?, excerpt = ?, category = ?, tags = ?,
          date = ?, author = ?, readTime = ?, thumb = ?, large = ?, imageAlt = ?,
          imageTitle = ?, imageCaption = ?, metaTitle = ?, metaDescription = ?,
          canonicalUrl = ?, ogImage = ?, robots = ?, keywords = ?, status = ?, content = ?
        WHERE id = ?`,
        [
          slug, path, title, excerpt, category, tagsJson,
          newPostObj.date, newPostObj.author, newPostObj.readTime, newPostObj.thumb,
          newPostObj.large, newPostObj.imageAlt, newPostObj.imageTitle, newPostObj.imageCaption,
          newPostObj.metaTitle, newPostObj.metaDescription, newPostObj.canonicalUrl,
          newPostObj.ogImage, newPostObj.robots, keywordsJson, newPostObj.status, newPostObj.content,
          targetId,
        ]
      );
    } else {
      await safeQuery(
        `INSERT INTO \`posts\` (
          id, slug, path, title, excerpt, category, tags, date, author, readTime,
          thumb, large, imageAlt, imageTitle, imageCaption, metaTitle, metaDescription,
          canonicalUrl, ogImage, robots, keywords, status, content
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, slug, path, title, excerpt, category, tagsJson,
          newPostObj.date, newPostObj.author, newPostObj.readTime, newPostObj.thumb,
          newPostObj.large, newPostObj.imageAlt, newPostObj.imageTitle, newPostObj.imageCaption,
          newPostObj.metaTitle, newPostObj.metaDescription, newPostObj.canonicalUrl,
          newPostObj.ogImage, newPostObj.robots, keywordsJson, newPostObj.status, newPostObj.content,
        ]
      );
    }

    res.json({ success: true, post: newPostObj });
  } catch (err) {
    console.error("[POST /posts Error]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    memoryPosts = memoryPosts.filter((p) => p && p.id !== id && p.slug !== id);

    await safeQuery("DELETE FROM `posts` WHERE `id` = ? OR `slug` = ?", [id, id]);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/posts/:id/status - Toggle published/draft
router.patch("/posts/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const target = memoryPosts.find((p) => p && (p.id === id || p.slug === id));
    if (!target) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    target.status = target.status === "published" ? "draft" : "published";

    await safeQuery("UPDATE `posts` SET `status` = ? WHERE `id` = ? OR `slug` = ?", [
      target.status,
      id,
      id,
    ]);

    res.json({ success: true, status: target.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------- KEYWORDS API -------------------

// GET /api/keywords
router.get("/keywords", async (req, res) => {
  try {
    const dbRes = await safeQuery("SELECT * FROM `keywords` ORDER BY `name` ASC");
    let keywordsRows = memoryKeywords;

    if (dbRes.ok) {
      keywordsRows = dbRes.rows;
    }

    const keywordMap = new Map();
    (keywordsRows || []).forEach((kw) => {
      if (!kw || !kw.name) return;
      keywordMap.set(kw.name.toLowerCase(), {
        ...kw,
        articleCount: 0,
      });
    });

    (memoryPosts || []).forEach((row) => {
      if (!row) return;
      let kws = Array.isArray(row.keywords) ? row.keywords : [];
      kws.forEach((kw) => {
        if (!kw) return;
        const lower = kw.toLowerCase();
        if (keywordMap.has(lower)) {
          keywordMap.get(lower).articleCount += 1;
        }
      });
    });

    res.json({ success: true, keywords: Array.from(keywordMap.values()) });
  } catch (err) {
    res.json({ success: true, keywords: memoryKeywords });
  }
});

// POST /api/keywords
router.post("/keywords", async (req, res) => {
  try {
    const { name, category, impact, searchVol, description, targetUrl, oldName } = req.body;

    if (!name) {
      return res.status(422).json({ success: false, message: "Keyword name is required" });
    }

    const kwObj = {
      name,
      category: category || "General",
      impact: impact || "High",
      searchVol: searchVol || "1.0k/mo",
      description: description || "",
      targetUrl: targetUrl || "",
    };

    const targetName = oldName || name;
    const existingIdx = memoryKeywords.findIndex(
      (k) => k && k.name && k.name.toLowerCase() === targetName.toLowerCase()
    );

    if (existingIdx >= 0) {
      memoryKeywords[existingIdx] = kwObj;
    } else {
      memoryKeywords.push(kwObj);
    }

    await safeQuery(
      `INSERT INTO \`keywords\` (name, category, impact, searchVol, description, targetUrl)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE category=VALUES(category), impact=VALUES(impact), searchVol=VALUES(searchVol), description=VALUES(description), targetUrl=VALUES(targetUrl)`,
      [kwObj.name, kwObj.category, kwObj.impact, kwObj.searchVol, kwObj.description, kwObj.targetUrl]
    );

    res.json({ success: true, message: "Keyword saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/keywords/:name
router.delete("/keywords/:name", async (req, res) => {
  try {
    const { name } = req.params;
    memoryKeywords = memoryKeywords.filter((k) => k && k.name && k.name.toLowerCase() !== name.toLowerCase());

    await safeQuery("DELETE FROM `keywords` WHERE LOWER(`name`) = LOWER(?)", [name]);
    res.json({ success: true, message: "Keyword deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
