const BRAND_ORANGE = "#ff5b21";
const BRAND_NAVY = "#08142d";

function escapeHtml(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:12px 20px;border-bottom:1px solid #eeeeee;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;width:160px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 20px;border-bottom:1px solid #eeeeee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND_NAVY};vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

/**
 * Builds a professional, table-based HTML email (inline styles only, for
 * maximum email-client compatibility) summarizing a website enquiry.
 *
 * @param {Object} data
 * @param {"Contact Us"|"Get a Quote"} data.formType
 * @param {string} data.name
 * @param {string} data.phone
 * @param {string} data.countryCode
 * @param {string} data.countryName
 * @param {string} [data.email]
 * @param {string} [data.company]
 * @param {string} [data.subject]
 * @param {string} data.enquiryType
 * @param {string} data.message
 * @param {string} data.date
 * @param {string} data.time
 * @param {string} [data.ip]
 * @returns {string} HTML email body.
 */
export function buildEnquiryEmailHtml({
  formType,
  name,
  phone,
  countryCode,
  countryName,
  email,
  company,
  subject,
  enquiryType,
  message,
  date,
  time,
  ip,
}) {
  const isContact = formType === "Contact Us";
  const phoneDisplay = `${escapeHtml(countryCode)} ${escapeHtml(phone)}`.trim();

  const rows = [
    row("Date", escapeHtml(date)),
    row("Time", escapeHtml(time)),
    row("IP Address", ip ? escapeHtml(ip) : "Not available"),
    row("Name", escapeHtml(name)),
    row("Phone", phoneDisplay),
    row("Country", escapeHtml(countryName)),
    row("Email", email ? escapeHtml(email) : "Not provided"),
  ];

  if (!isContact) {
    rows.push(row("Company", company ? escapeHtml(company) : "Not provided"));
  }

  if (isContact) {
    rows.push(row("Subject", escapeHtml(subject)));
  }

  rows.push(row("Enquiry Type", escapeHtml(enquiryType)));

  const replyButton = email
    ? `
    <tr>
      <td style="padding:24px 20px 8px 20px;" align="left">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background-color:${BRAND_ORANGE};border-radius:4px;">
              <a href="mailto:${escapeHtml(email)}"
                 style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">
                Reply to Customer
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    : "";

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:6px;overflow:hidden;max-width:600px;width:100%;">
            <tr>
              <td style="background-color:${BRAND_NAVY};padding:24px 20px;border-top:4px solid ${BRAND_ORANGE};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;">
                      Aarvisac Control &mdash; New Website Enquiry
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${BRAND_ORANGE};padding-top:6px;font-weight:bold;">
                      ${escapeHtml(formType)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${rows.join("")}
                  <tr>
                    <td colspan="2" style="padding:16px 20px 6px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b7280;">
                      Message
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding:0 20px 16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${BRAND_NAVY};line-height:1.5;white-space:pre-wrap;">
                      ${escapeHtml(message)}
                    </td>
                  </tr>
                  ${replyButton}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px;background-color:#fafafa;border-top:1px solid #eeeeee;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;">
                  This enquiry was submitted via Aarvisac.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export default buildEnquiryEmailHtml;
