import mysql from "mysql2/promise";
import "dotenv/config";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "aarvisac_blog";

let dbPool = null;
let isDbAvailable = false;

export function getDbStatus() {
  return isDbAvailable;
}

export function getPool() {
  if (!dbPool) {
    try {
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
    } catch (e) {
      console.warn("[MySQL Pool Creation Warning]", e.message);
    }
  }
  return dbPool;
}

export const seedPosts = [
  {
    id: "plc-scada-integration-services",
    slug: "plc-scada-integration-services",
    path: "/blog/plc-scada-integration-services",
    title: "PLC SCADA Integration Services | Smart Industrial Automation",
    excerpt: "For years, many industries relied on standalone automation systems. One machine handled production, another tracked performance, while someone else manually collected data. Today, that approach causes delays and downtime. Integrated PLC & SCADA systems connect your entire plant floor into one unified intelligent network.",
    category: "Automation",
    tags: JSON.stringify(["Automation", "PLC", "SCADA", "Smart Industrial Automation"]),
    date: "06 Aug 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "6 min read",
    thumb: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "PLC SCADA Integration Services",
    imageTitle: "PLC SCADA Integration Services | Smart Industrial Automation",
    imageCaption: "Integrated Industrial Automation & Control Architecture",
    metaTitle: "PLC SCADA Integration Services | Smart Industrial Automation",
    metaDescription: "Professional PLC SCADA integration services for smart industrial automation and centralized plant monitoring.",
    canonicalUrl: "https://aarvisac.com/blog/plc-scada-integration-services",
    ogImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["PLC", "SCADA", "Industrial Automation", "Aarvisac Control"]),
    status: "published",
    content: `
      <h2>PLC SCADA Integration Services | Smart Industrial Automation</h2>
      <p>For years, many industries relied on standalone automation systems. One machine handled production, another tracked performance, while someone else manually collected operational logs. Today, that fragmented approach causes delays, high maintenance overheads, and unplanned downtime.</p>
      <p>Modern industrial facilities require integrated PLC & SCADA architecture to connect field instruments, sensors, and controllers into a unified digital network.</p>
      <h3>Key Benefits of Integrated Control Systems</h3>
      <ul>
        <li>Real-time centralized visualization and supervisory monitoring.</li>
        <li>Automated alarm logging and predictive breakdown alerts.</li>
        <li>Seamless data acquisition and ERP system synchronization.</li>
      </ul>
      <blockquote class="blog-quote">
        "Integration turns isolated machine data into actionable operational intelligence."
      </blockquote>
      <p>Contact the engineering experts at Aarvisac Control for custom turnkey PLC & SCADA integration tailored to your manufacturing requirements.</p>
    `,
  },
  {
    id: "plc-control-panel-manufacturer-in-india",
    slug: "plc-control-panel-manufacturer-in-india",
    path: "/blog/plc-control-panel-manufacturer-in-india",
    title: "PLC Control Panel Manufacturer in India | Complete Guide",
    excerpt: "And if you've ever wondered why a modern manufacturing line runs with remarkable precision while another struggles with delays, unnecessary downtime, and inconsistent output, the answer usually lies inside the electrical control panel.",
    category: "Automation",
    tags: JSON.stringify(["Automation", "Electrical Panel", "PLC Control Panel"]),
    date: "06 Aug 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "5 min read",
    thumb: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "PLC Control Panel Manufacturer in India",
    imageTitle: "PLC Control Panel Design and Manufacturing",
    imageCaption: "Custom Built Industrial PLC Automation Control Panels",
    metaTitle: "PLC Control Panel Manufacturer in India | Complete Guide",
    metaDescription: "Leading custom PLC control panel manufacturer in India offering turnkey panel fabrication, testing, and commissioning.",
    canonicalUrl: "https://aarvisac.com/blog/plc-control-panel-manufacturer-in-india",
    ogImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["PLC Control Panel", "Electrical Panel", "Industrial Automation"]),
    status: "published",
    content: `
      <h2>PLC Control Panel Manufacturer in India | Complete Guide</h2>
      <p>And if you've ever wondered why a modern manufacturing line runs with remarkable precision while another struggles with delays, unnecessary downtime, and inconsistent output, the answer usually lies inside the electrical control panel.</p>
      <p>As a leading PLC control panel manufacturer in India, Aarvisac Control designs, fabricates, and tests custom automation panels engineered for harsh industrial environments.</p>
      <h3>What Makes a High-Performance PLC Control Panel?</h3>
      <ul>
        <li>Precision wiring layout with clear ferrule marking and thermal management.</li>
        <li>High-grade IP-rated enclosures for dust and moisture protection.</li>
        <li>Thorough factory acceptance testing (FAT) before site dispatch.</li>
      </ul>
      <p>Upgrade your factory power distribution and automation controls with turnkey engineering from Aarvisac Control.</p>
    `,
  },
  {
    id: "dcs-system-integrator-in-india",
    slug: "dcs-system-integrator-in-india",
    path: "/blog/dcs-system-integrator-in-india",
    title: "DCS System Integrator in India: Complete Guide to Process Automation",
    excerpt: "The real challenge isn't buying a Distributed Control System (DCS). It's making every controller, instrument, sensor, and production line speak the same language. That is where an experienced DCS system integrator makes all the difference.",
    category: "Automation",
    tags: JSON.stringify(["Automation", "DCS", "Process Automation"]),
    date: "06 Aug 2026",
    author: "Aarvisac Control Engineering Team",
    readTime: "7 min read",
    thumb: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80",
    large: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    imageAlt: "DCS System Integrator in India",
    imageTitle: "Distributed Control System (DCS) Engineering",
    imageCaption: "Comprehensive Process Automation & DCS System Architecture",
    metaTitle: "DCS System Integrator in India: Complete Guide to Process Automation",
    metaDescription: "Expert DCS system integrator in India delivering end-to-end process control, redundancy, and automation solutions.",
    canonicalUrl: "https://aarvisac.com/blog/dcs-system-integrator-in-india",
    ogImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    robots: "index, follow",
    keywords: JSON.stringify(["DCS", "Process Automation", "Industrial Automation"]),
    status: "published",
    content: `
      <h2>DCS System Integrator in India: Complete Guide to Process Automation</h2>
      <p>The real challenge isn't buying a Distributed Control System (DCS). It's making every controller, instrument, sensor, and production line speak the same language. That is where an experienced DCS system integrator makes all the difference.</p>
      <p>Distributed Control Systems handle continuous batch processes with high I/O counts, requiring fault tolerance, dual redundancy, and high operational uptime.</p>
      <h3>Why Choose Aarvisac Control for DCS Integration?</h3>
      <ul>
        <li>Proven expertise in chemical, pharmaceutical, power, and manufacturing plants.</li>
        <li>Dual-redundant CPU, power supply, and network architecture configuration.</li>
        <li>End-to-end commissioning and 24/7 technical engineering support.</li>
      </ul>
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

    isDbAvailable = true;
    console.log(`[MySQL] Connected and schema verified for database '${DB_NAME}'`);
    return true;
  } catch (err) {
    isDbAvailable = false;
    console.warn("[MySQL Initialization Warning]", err.message);
    console.warn("[MySQL] Server running with High-Performance Memory Fallback.");
    return false;
  }
}
