# Aarvisac Control — Backend

Minimal Express + Nodemailer backend for the Aarvisac Control marketing site. It exposes two
public endpoints (`/api/contact` and `/api/get-quote`) that validate incoming form submissions
and email them via SMTP to the company inbox.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` with real SMTP credentials:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` — your SMTP provider's connection details.
- `SMTP_USER` / `SMTP_PASS` — SMTP account credentials.
- `MAIL_TO` — inbox that should receive new enquiries (e.g. `sales@aarvicontrol.com`).
- `PORT` — port this server listens on (defaults to `5000`).
- `CORS_ORIGIN` — the frontend origin(s) allowed to call this API (comma-separated for multiple).

> **Gmail note:** if you use Gmail as the SMTP host, you'll need an
> [App Password](https://support.google.com/accounts/answer/185833) — Google blocks plain SMTP
> login with your normal account password by default. `SMTP_HOST` is fully configurable, though,
> so any SMTP provider (Zoho, Office365, SendGrid SMTP relay, your hosting provider, etc.) works
> the same way.

## Using Hostinger Email

This is the provider used on the live server. Steps:

1. In [hPanel](https://hpanel.hostinger.com/), go to **Emails** and create (or use an existing)
   mailbox on your domain, e.g. `sales@yourdomain.com`. Note its password — Hostinger doesn't
   generate a separate "app password"; it's the mailbox's real login password.
2. Set in `.env`:
   ```
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=sales@yourdomain.com
   SMTP_PASS=<the mailbox password>
   MAIL_TO=sales@yourdomain.com
   ```
   Port `465` (SSL, `SMTP_SECURE=true`) is Hostinger's recommended setting. If your host blocks
   465, `587` with `SMTP_SECURE=false` (STARTTLS) also works.
3. **The "From" address must be the same mailbox as `SMTP_USER`** — Hostinger (like most
   providers) will reject or spam-flag mail claiming to be "from" an address it didn't
   authenticate as. `mailer.js` already sends `from: SMTP_USER`, so just make sure `SMTP_USER`
   is the real sending mailbox.
4. Sanity-check the credentials without sending a real email:
   ```bash
   node -e "require('dotenv/config');const n=require('nodemailer');n.createTransport({host:process.env.SMTP_HOST,port:+process.env.SMTP_PORT,secure:process.env.SMTP_SECURE==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}).verify().then(()=>console.log('OK')).catch(e=>console.error(e.message))"
   ```
5. If your registrar/host has DNS access, add **SPF** (and DKIM if Hostinger provides it in
   hPanel) records for your domain — without them, mail sent through Hostinger's SMTP is more
   likely to land in the recipient's spam folder.

## Run locally

```bash
npm run dev
```

This starts the server with `node --watch` (auto-restarts on file changes), listening on
`http://localhost:5000` (or whatever `PORT` is set to).

For a one-off production-style run:

```bash
npm start
```

## Production deployment

This server is a separate deployable unit from the static Vite frontend — it is **not** part of
the `dist/` build output. In production it should run as its own long-lived Node process, for
example:

- Behind [PM2](https://pm2.keymetrics.io/) on a VPS.
- As a small Docker container.
- On a platform like [Render](https://render.com/) or [Railway](https://railway.app/).

The frontend talks to this backend over HTTP using the `VITE_API_URL` environment variable it
reads at build time (e.g. `VITE_API_URL=https://api.aarvicontrol.com`) — make sure that URL
points at wherever this server ends up deployed, and that `CORS_ORIGIN` here includes the
frontend's deployed origin.

## API

### `GET /api/health`

Returns `{ "status": "ok" }`. Useful for uptime checks.

### `POST /api/contact`

```json
{
  "name": "string",
  "phone": "string (10 digits)",
  "countryCode": "string, e.g. +91",
  "countryName": "string, e.g. India",
  "email": "string, optional",
  "subject": "string",
  "enquiryType": "Product Enquiry | Service Enquiry | Training Enquiry | Other",
  "message": "string"
}
```

### `POST /api/get-quote`

```json
{
  "name": "string",
  "company": "string, optional",
  "phone": "string (10 digits)",
  "countryCode": "string, e.g. +91",
  "countryName": "string, e.g. India",
  "email": "string, optional",
  "enquiryType": "Product | Service | Training | Other",
  "message": "string"
}
```

Both endpoints respond with:

- `200` — `{ "success": true, "message": "..." }`
- `422` — `{ "success": false, "message": "Validation failed", "errors": { "field": "reason" } }`
- `500` — `{ "success": false, "message": "Something went wrong. Please try again later." }`

Both endpoints are rate-limited to 10 requests per 10 minutes per IP.
