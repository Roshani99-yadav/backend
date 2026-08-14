import mysql from "mysql2/promise";
import "dotenv/config";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "aarvisac_blog";

let dbPool = null;

export function getPool() {
  if (!dbPool) {
    dbPool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return dbPool;
}

export const seedPosts = [
  {
    id: "plc-vs-scada-vs-dcs",
    slug: "plc-vs-scada-vs-dcs",
    path: "/blog/plc-vs-scada-vs-dcs",
    title: "PLC vs SCADA vs DCS: Choosing the Right Automation System for Your Plant",
    excerpt: "PLC, SCADA and DCS are often used interchangeably, but they solve different problems. Here's how to tell them apart and choose the right one for your plant.",
    category: "Automation",
    tags: JSON.stringify(["Automation", "PLC", "SCADA", "DCS"]),
    date: "12 Feb 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "6 min read",
    thumb: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "PLC SCADA DCS Automation Panel",
    imageTitle: "PLC vs SCADA vs DCS Control Systems",
    imageCaption: "Modern Industrial Control System Setup",
    metaTitle: "PLC vs SCADA vs DCS: Choosing the Right Automation System",
    metaDescription: "Detailed comparison guide between PLC, SCADA, and DCS systems for plant automation.",
    canonicalUrl: "https://aarvisac.com/blog/plc-vs-scada-vs-dcs",
    ogImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["PLC", "SCADA", "DCS", "Industrial Automation"]),
    status: "published",
    content: `
      <h2>Understanding PLC vs SCADA vs DCS</h2>
      <p>PLC, SCADA and DCS are often used interchangeably, but they solve different problems. Here's how to tell them apart and choose the right one for your plant.</p>
      <p>In modern industrial automation, selecting the optimal control system design is vital for operation efficiency, safety, and scalability. Below are key highlights to consider when evaluating your facility's requirements.</p>
      <h3>Key Takeaways</h3>
      <ul>
        <li>High operational uptime and minimal downtime.</li>
        <li>Seamless integration with field instrumentation and sensors.</li>
        <li>Scalable architecture for future plant expansions.</li>
      </ul>
      <blockquote class="blog-quote">
        "Automation is not just about technology—it is about reliability, precision, and predictability in industrial processes."
      </blockquote>
      <p>For more detailed technical consulting and turnkey engineering, reach out to our team at Aarvisac Control.</p>
    `,
  },
  {
    id: "electrical-panel-upgrade-signs",
    slug: "electrical-panel-upgrade-signs",
    path: "/blog/electrical-panel-upgrade-signs",
    title: "5 Warning Signs Your Electrical Control Panel Needs an Upgrade",
    excerpt: "An aging control panel doesn't fail all at once — it gives warnings first. Here are five signs it's time to plan a retrofit before it costs you downtime.",
    category: "Upgrades & Retrofits",
    tags: JSON.stringify(["Upgrades & Retrofits", "Electrical Panel"]),
    date: "28 Feb 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "5 min read",
    thumb: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Electrical Control Panel Maintenance",
    imageTitle: "Control Panel Retrofit Signs",
    imageCaption: "Electrical Control Panel System Inspection",
    metaTitle: "5 Warning Signs Your Electrical Control Panel Needs an Upgrade",
    metaDescription: "Discover key warning signs of an aging electrical control panel and how retrofitting prevents downtime.",
    canonicalUrl: "https://aarvisac.com/blog/electrical-panel-upgrade-signs",
    ogImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["Electrical Panel", "Preventive Maintenance", "Control Systems"]),
    status: "published",
    content: `
      <h2>5 Warning Signs Your Electrical Control Panel Needs an Upgrade</h2>
      <p>An aging control panel doesn't fail all at once — it gives warnings first. Here are five signs it's time to plan a retrofit before it costs you downtime.</p>
      <h3>Frequent Nuisance Tripping</h3>
      <p>If breakers or overloads trip without a clear heavy load increase, internal components may be degraded due to thermal stress.</p>
      <h3>Obsolete Components & Lack of Spares</h3>
      <p>Legacy PLCs, relays, or contactors that are discontinued pose massive risk during breakdowns.</p>
    `,
  },
  {
    id: "preventive-maintenance-reduces-downtime",
    slug: "preventive-maintenance-reduces-downtime",
    path: "/blog/preventive-maintenance-reduces-downtime",
    title: "Why Preventive Maintenance Is the Key to Reducing Industrial Downtime",
    excerpt: "Unplanned downtime is one of the most expensive problems in manufacturing. A structured preventive maintenance program is still the most reliable fix.",
    category: "Operations & Maintenance",
    tags: JSON.stringify(["Operations & Maintenance", "Preventive Maintenance"]),
    date: "10 Mar 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "5 min read",
    thumb: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "Industrial Preventive Maintenance Engineering",
    imageTitle: "Preventive Maintenance for Downtime Reduction",
    imageCaption: "Regular Plant Maintenance Work",
    metaTitle: "Why Preventive Maintenance Reduces Industrial Downtime",
    metaDescription: "Learn how structured preventive maintenance minimizes plant downtime and protects equipment.",
    canonicalUrl: "https://aarvisac.com/blog/preventive-maintenance-reduces-downtime",
    ogImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["Preventive Maintenance", "Industrial Automation"]),
    status: "published",
    content: `
      <h2>Why Preventive Maintenance Is the Key to Reducing Industrial Downtime</h2>
      <p>Unplanned downtime is one of the most expensive problems in manufacturing. A structured preventive maintenance program is still the most reliable fix.</p>
      <h3>Scheduled Inspections & Thermal Imaging</h3>
      <p>Regular thermal scans highlight loose connections and hot spots before component failure leads to catastrophic line stops.</p>
    `,
  },
];

export const seedKeywords = [
  { name: "PLC", category: "Automation", impact: "High", searchVol: "12.5k/mo", description: "Programmable Logic Controller topics", targetUrl: "/blog/plc-vs-scada-vs-dcs" },
  { name: "SCADA", category: "Automation", impact: "High", searchVol: "18.2k/mo", description: "Supervisory Control and Data Acquisition", targetUrl: "/blog/plc-vs-scada-vs-dcs" },
  { name: "DCS", category: "Automation", impact: "Medium", searchVol: "9.1k/mo", description: "Distributed Control Systems", targetUrl: "/blog/plc-vs-scada-vs-dcs" },
  { name: "Electrical Panel", category: "Upgrades", impact: "High", searchVol: "15.0k/mo", description: "Control Panel manufacturing & retrofits", targetUrl: "/blog/electrical-panel-upgrade-signs" },
  { name: "Preventive Maintenance", category: "Maintenance", impact: "High", searchVol: "22.4k/mo", description: "Routine maintenance and downtime reduction", targetUrl: "/blog/preventive-maintenance-reduces-downtime" },
  { name: "Industrial Automation", category: "Automation", impact: "High", searchVol: "35.0k/mo", description: "General factory & plant automation", targetUrl: "" },
  { name: "Control Systems", category: "Engineering", impact: "Medium", searchVol: "11.2k/mo", description: "Engineering control systems design", targetUrl: "" },
  { name: "Aarvisac Control", category: "Branding", impact: "High", searchVol: "5.4k/mo", description: "Brand keywords and solution offerings", targetUrl: "" },
];

export async function initDb() {
  try {
    // Step 1: Connect without database specified to create database if not exists
    const rootConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      connectTimeout: 3000,
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await rootConnection.end();

    const pool = getPool();

    // Step 2: Create posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`posts\` (
        \`id\` VARCHAR(255) PRIMARY KEY,
        \`slug\` VARCHAR(255) UNIQUE NOT NULL,
        \`path\` VARCHAR(255),
        \`title\` VARCHAR(255) NOT NULL,
        \`excerpt\` TEXT,
        \`category\` VARCHAR(100),
        \`tags\` JSON,
        \`date\` VARCHAR(100),
        \`author\` VARCHAR(255),
        \`readTime\` VARCHAR(50),
        \`thumb\` TEXT,
        \`large\` TEXT,
        \`imageAlt\` VARCHAR(255),
        \`imageTitle\` VARCHAR(255),
        \`imageCaption\` TEXT,
        \`metaTitle\` VARCHAR(255),
        \`metaDescription\` TEXT,
        \`canonicalUrl\` VARCHAR(255),
        \`ogImage\` TEXT,
        \`robots\` VARCHAR(100),
        \`keywords\` JSON,
        \`status\` ENUM('published', 'draft') DEFAULT 'published',
        \`content\` LONGTEXT,
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Step 3: Create keywords table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS \`keywords\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) UNIQUE NOT NULL,
        \`category\` VARCHAR(100),
        \`impact\` VARCHAR(50),
        \`searchVol\` VARCHAR(50),
        \`description\` TEXT,
        \`targetUrl\` VARCHAR(255),
        \`createdAt\` DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Step 4: Seed initial posts if empty
    const [rowsPosts] = await pool.query(`SELECT COUNT(*) as count FROM \`posts\``);
    if (rowsPosts[0].count === 0) {
      for (const p of seedPosts) {
        await pool.query(
          `INSERT INTO \`posts\` (id, slug, path, title, excerpt, category, tags, date, author, readTime, thumb, large, imageAlt, imageTitle, imageCaption, metaTitle, metaDescription, canonicalUrl, ogImage, robots, keywords, status, content) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            p.slug,
            p.path,
            p.title,
            p.excerpt,
            p.category,
            p.tags,
            p.date,
            p.author,
            p.readTime,
            p.thumb,
            p.large,
            p.imageAlt,
            p.imageTitle,
            p.imageCaption,
            p.metaTitle,
            p.metaDescription,
            p.canonicalUrl,
            p.ogImage,
            p.robots,
            p.keywords,
            p.status,
            p.content,
          ]
        );
      }
      console.log("[MySQL] Seeded initial blog posts successfully.");
    }

    // Step 5: Seed initial keywords if empty
    const [rowsKw] = await pool.query(`SELECT COUNT(*) as count FROM \`keywords\``);
    if (rowsKw[0].count === 0) {
      for (const k of seedKeywords) {
        await pool.query(
          `INSERT INTO \`keywords\` (name, category, impact, searchVol, description, targetUrl)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [k.name, k.category, k.impact, k.searchVol, k.description, k.targetUrl]
        );
      }
      console.log("[MySQL] Seeded initial keywords successfully.");
    }

    console.log(`[MySQL] Connected and schema verified for database '${DB_NAME}'`);
    return true;
  } catch (err) {
    console.error("[MySQL Initialization Warning]", err.message);
    console.warn("[MySQL] Server will run with API fallback if MySQL server is offline.");
    return false;
  }
}
