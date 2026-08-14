import express from "express";
import { getPool } from "../db.js";

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

// ------------------- POSTS API -------------------

// GET /api/posts - Get all posts (filtered by status)
router.get("/posts", async (req, res, next) => {
  try {
    const pool = getPool();
    const includeDrafts = req.query.includeDrafts === "true";

    let query = "SELECT * FROM `posts` ORDER BY `createdAt` DESC";
    if (!includeDrafts) {
      query = "SELECT * FROM `posts` WHERE `status` = 'published' ORDER BY `createdAt` DESC";
    }

    const [rows] = await pool.query(query);
    const formatted = rows.map(parsePostRow);
    res.json({ success: true, posts: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/posts/:slug - Get post by slug or ID
router.get("/posts/:slug", async (req, res, next) => {
  try {
    const pool = getPool();
    const { slug } = req.params;
    const decodedSlug = decodeURIComponent(slug).trim();
    const normalizedSlug = generateSlug(decodedSlug);

    const [rows] = await pool.query(
      "SELECT * FROM `posts` WHERE `slug` = ? OR `id` = ? OR `slug` = ? OR REPLACE(`slug`, ' ', '-') = ? LIMIT 1",
      [slug, decodedSlug, normalizedSlug, normalizedSlug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, post: parsePostRow(rows[0]) });
  } catch (err) {
    next(err);
  }
});

// POST /api/posts - Save or update a post
router.post("/posts", async (req, res, next) => {
  try {
    const pool = getPool();
    const postData = req.body || {};

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const slug = postData.slug || generateSlug(postData.title);
    const id = postData.id || slug || `post-${Date.now()}`;
    const path = `/blog/${slug}`;
    const title = postData.title || "Untitled Post";
    const excerpt = postData.excerpt || "";
    const category = postData.category || "General";

    let tags = postData.tags || ["Automation"];
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    const tagsJson = JSON.stringify(tags);

    let keywords = postData.keywords || [category, "Aarvisac Control"];
    if (typeof keywords === "string") {
      keywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    }
    const keywordsJson = JSON.stringify(keywords);

    const date = postData.date || formattedDate;
    const author = postData.author || "Aarvisac Control Engineering Team";
    const readTime = postData.readTime || "5 min read";
    const thumb = postData.thumb || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80";
    const large = postData.large || thumb;
    const imageAlt = postData.imageAlt || "";
    const imageTitle = postData.imageTitle || "";
    const imageCaption = postData.imageCaption || "";
    const metaTitle = postData.metaTitle || "";
    const metaDescription = postData.metaDescription || "";
    const canonicalUrl = postData.canonicalUrl || "";
    const ogImage = postData.ogImage || "";
    const robots = postData.robots || "index, follow";
    const status = postData.status || "published";
    const content = postData.content || "";

    const [existing] = await pool.query(
      "SELECT `id` FROM `posts` WHERE `id` = ? OR `slug` = ? LIMIT 1",
      [id, slug]
    );

    if (existing.length > 0) {
      const targetId = existing[0].id;
      await pool.query(
        `UPDATE \`posts\` SET
          slug = ?, path = ?, title = ?, excerpt = ?, category = ?, tags = ?,
          date = ?, author = ?, readTime = ?, thumb = ?, large = ?, imageAlt = ?,
          imageTitle = ?, imageCaption = ?, metaTitle = ?, metaDescription = ?,
          canonicalUrl = ?, ogImage = ?, robots = ?, keywords = ?, status = ?, content = ?
        WHERE id = ?`,
        [
          slug, path, title, excerpt, category, tagsJson,
          date, author, readTime, thumb, large, imageAlt,
          imageTitle, imageCaption, metaTitle, metaDescription,
          canonicalUrl, ogImage, robots, keywordsJson, status, content,
          targetId,
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO \`posts\` (
          id, slug, path, title, excerpt, category, tags, date, author, readTime,
          thumb, large, imageAlt, imageTitle, imageCaption, metaTitle, metaDescription,
          canonicalUrl, ogImage, robots, keywords, status, content
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, slug, path, title, excerpt, category, tagsJson, date, author, readTime,
          thumb, large, imageAlt, imageTitle, imageCaption, metaTitle, metaDescription,
          canonicalUrl, ogImage, robots, keywordsJson, status, content,
        ]
      );
    }

    const [saved] = await pool.query("SELECT * FROM `posts` WHERE `id` = ? OR `slug` = ? LIMIT 1", [id, slug]);
    res.json({ success: true, post: parsePostRow(saved[0]) });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/posts/:id", async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    await pool.query("DELETE FROM `posts` WHERE `id` = ? OR `slug` = ?", [id, id]);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/posts/:id/status - Toggle published/draft status
router.patch("/posts/:id/status", async (req, res, next) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [rows] = await pool.query("SELECT `id`, `status` FROM `posts` WHERE `id` = ? OR `slug` = ? LIMIT 1", [id, id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newStatus = rows[0].status === "published" ? "draft" : "published";
    await pool.query("UPDATE `posts` SET `status` = ? WHERE `id` = ?", [newStatus, rows[0].id]);

    res.json({ success: true, status: newStatus });
  } catch (err) {
    next(err);
  }
});

// ------------------- KEYWORDS API -------------------

// GET /api/keywords - Get keywords with article counts
router.get("/keywords", async (req, res, next) => {
  try {
    const pool = getPool();
    const [keywordsRows] = await pool.query("SELECT * FROM `keywords` ORDER BY `name` ASC");
    const [postsRows] = await pool.query("SELECT `keywords` FROM `posts`");

    const keywordMap = new Map();
    keywordsRows.forEach((kw) => {
      keywordMap.set(kw.name.toLowerCase(), {
        ...kw,
        articleCount: 0,
      });
    });

    postsRows.forEach((row) => {
      let kws = [];
      try {
        kws = typeof row.keywords === "string" ? JSON.parse(row.keywords) : row.keywords || [];
      } catch (e) {
        kws = row.keywords ? row.keywords.split(",").map((k) => k.trim()) : [];
      }

      kws.forEach((kw) => {
        if (!kw) return;
        const lower = kw.toLowerCase();
        if (keywordMap.has(lower)) {
          const item = keywordMap.get(lower);
          item.articleCount += 1;
        }
      });
    });

    res.json({ success: true, keywords: Array.from(keywordMap.values()) });
  } catch (err) {
    next(err);
  }
});

// POST /api/keywords - Save or Update keyword
router.post("/keywords", async (req, res, next) => {
  try {
    const pool = getPool();
    const { name, category, impact, searchVol, description, targetUrl, oldName } = req.body;

    if (!name) {
      return res.status(422).json({ success: false, message: "Keyword name is required" });
    }

    const targetName = oldName || name;
    const [existing] = await pool.query("SELECT * FROM `keywords` WHERE LOWER(`name`) = LOWER(?) LIMIT 1", [targetName]);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE \`keywords\` SET name = ?, category = ?, impact = ?, searchVol = ?, description = ?, targetUrl = ? WHERE id = ?`,
        [name, category || "General", impact || "High", searchVol || "1.0k/mo", description || "", targetUrl || "", existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO \`keywords\` (name, category, impact, searchVol, description, targetUrl) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, category || "General", impact || "High", searchVol || "1.0k/mo", description || "", targetUrl || ""]
      );
    }

    // If keyword name changed, update post keywords references in posts table
    if (oldName && oldName.toLowerCase() !== name.toLowerCase()) {
      const [allPosts] = await pool.query("SELECT `id`, `keywords` FROM `posts`");
      for (const p of allPosts) {
        let postKws = [];
        try {
          postKws = typeof p.keywords === "string" ? JSON.parse(p.keywords) : p.keywords || [];
        } catch (e) {
          postKws = p.keywords ? p.keywords.split(",").map((k) => k.trim()) : [];
        }

        let modified = false;
        const updatedKws = postKws.map((k) => {
          if (k.toLowerCase() === oldName.toLowerCase()) {
            modified = true;
            return name;
          }
          return k;
        });

        if (modified) {
          await pool.query("UPDATE `posts` SET `keywords` = ? WHERE `id` = ?", [JSON.stringify(updatedKws), p.id]);
        }
      }
    }

    res.json({ success: true, message: "Keyword saved successfully" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/keywords/:name - Delete keyword
router.delete("/keywords/:name", async (req, res, next) => {
  try {
    const pool = getPool();
    const { name } = req.params;

    await pool.query("DELETE FROM `keywords` WHERE LOWER(`name`) = LOWER(?)", [name]);

    // Also remove keyword reference from posts
    const [allPosts] = await pool.query("SELECT `id`, `keywords` FROM `posts`");
    for (const p of allPosts) {
      let postKws = [];
      try {
        postKws = typeof p.keywords === "string" ? JSON.parse(p.keywords) : p.keywords || [];
      } catch (e) {
        postKws = p.keywords ? p.keywords.split(",").map((k) => k.trim()) : [];
      }

      const filteredKws = postKws.filter((k) => k.toLowerCase() !== name.toLowerCase());
      if (filteredKws.length !== postKws.length) {
        await pool.query("UPDATE `posts` SET `keywords` = ? WHERE `id` = ?", [JSON.stringify(filteredKws), p.id]);
      }
    }

    res.json({ success: true, message: "Keyword deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
