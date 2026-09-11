
interface AdminMessageEmailOptions {
  firstName: string;
  subject: string;
  message: string;
  logoUrl?: string;
}

export function getAdminMessageEmail({
  firstName,
  subject,
  message,
  logoUrl,
}: AdminMessageEmailOptions) {
  const emailSubject =
    subject || "You have a new message from NAXODEX";

  const safeFirstName = escapeHtml(firstName);
  const safeSubject = escapeHtml(emailSubject);

  /*
   * Escape the message before placing it into HTML.
   *
   * Preserve line breaks so an administrator's message keeps
   * its formatting inside the email.
   */
  const safeMessage = escapeHtml(message).replace(
    /\r?\n/g,
    "<br />"
  );

  const safeLogoUrl = logoUrl
    ? escapeHtml(logoUrl)
    : "";

  const logoMarkup = safeLogoUrl
    ? `
      <img
        src="${safeLogoUrl}"
        alt="NAXODEX"
        width="190"
        style="
          display:block;
          width:190px;
          max-width:100%;
          height:auto;
          border:0;
          outline:none;
          text-decoration:none;
          margin:0 auto;
        "
      />
    `
    : `
      <div
        style="
          font-size:29px;
          line-height:1;
          letter-spacing:8px;
          font-weight:700;
          color:#d4af37;
        "
      >
        NAXODEX
      </div>
    `;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="color-scheme"
    content="dark"
  />

  <meta
    name="supported-color-schemes"
    content="dark"
  />

  <title>${safeSubject}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    width:100%;
    background:#030303;
    font-family:Arial,Helvetica,sans-serif;
    color:#ffffff;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    role="presentation"
    style="
      width:100%;
      background:#030303;
    "
  >
    <tr>
      <td
        align="center"
        style="
          padding:48px 16px;
        "
      >

        <!-- MAIN CONTAINER -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="
            width:100%;
            max-width:640px;
            background:#0a0a0a;
            border:1px solid #292929;
          "
        >

          <!-- BRAND HEADER -->

          <tr>
            <td
              align="center"
              style="
                padding:42px 30px 36px;
                background:#080808;
              "
            >

              ${logoMarkup}

              <div
                style="
                  margin-top:16px;
                  font-size:10px;
                  line-height:1.5;
                  letter-spacing:3px;
                  font-weight:400;
                  color:#777777;
                  text-transform:uppercase;
                "
              >
                Wealth &nbsp;•&nbsp; Legacy &nbsp;•&nbsp; Security
              </div>

            </td>
          </tr>

          <!-- GOLD ACCENT -->

          <tr>
            <td
              style="
                height:2px;
                background:#d4af37;
                font-size:0;
                line-height:0;
              "
            >
              &nbsp;
            </td>
          </tr>

          <!-- MESSAGE HEADER -->

          <tr>
            <td
              style="
                padding:52px 46px 20px;
              "
            >

              <p
                style="
                  margin:0 0 14px;
                  font-size:11px;
                  line-height:1.5;
                  letter-spacing:3px;
                  font-weight:700;
                  color:#d4af37;
                  text-transform:uppercase;
                "
              >
                Account message
              </p>

              <h1
                style="
                  margin:0 0 26px;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:36px;
                  line-height:1.2;
                  font-weight:400;
                  letter-spacing:-0.5px;
                  color:#ffffff;
                "
              >
                You have a new<br />
                <span style="color:#d4af37;">
                  message.
                </span>
              </h1>

              <p
                style="
                  margin:0;
                  font-size:17px;
                  line-height:1.8;
                  color:#d0d0d0;
                "
              >
                Hello ${safeFirstName},
              </p>

            </td>
          </tr>

          <!-- MESSAGE CARD -->

          <tr>
            <td
              style="
                padding:0 46px 36px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background:#101010;
                  border:1px solid #292929;
                "
              >
                <tr>
                  <td
                    style="
                      padding:28px 26px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 10px;
                        font-size:10px;
                        line-height:1.5;
                        letter-spacing:2px;
                        font-weight:700;
                        color:#d4af37;
                        text-transform:uppercase;
                      "
                    >
                      Message
                    </p>

                    <h2
                      style="
                        margin:0 0 22px;
                        font-family:Georgia,'Times New Roman',serif;
                        font-size:22px;
                        line-height:1.4;
                        font-weight:400;
                        color:#ffffff;
                      "
                    >
                      ${safeSubject}
                    </h2>

                    <div
                      style="
                        height:1px;
                        background:#292929;
                        margin:0 0 22px;
                      "
                    ></div>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:1.9;
                        color:#b5b5b5;
                      "
                    >
                      ${safeMessage}
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- NOTIFICATION NOTICE -->

          <tr>
            <td
              style="
                padding:0 46px 44px;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:13px;
                  line-height:1.8;
                  color:#777777;
                "
              >
                This message was also delivered to your
                NAXODEX notification center. You can sign in
                to your account to view your messages and
                account activity.
              </p>

            </td>
          </tr>

          <!-- DIVIDER -->

          <tr>
            <td
              style="
                padding:0 46px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
              >
                <tr>
                  <td
                    style="
                      height:1px;
                      background:#292929;
                      font-size:0;
                      line-height:0;
                    "
                  >
                    &nbsp;
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- BRAND MESSAGE -->

          <tr>
            <td
              align="center"
              style="
                padding:38px 46px 42px;
              "
            >

              <p
                style="
                  margin:0 0 12px;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:21px;
                  line-height:1.4;
                  font-weight:400;
                  color:#ffffff;
                "
              >
                Your wealth.<br />
                Your strategy.<br />
                <span style="color:#d4af37;">
                  Your legacy.
                </span>
              </p>

              <p
                style="
                  margin:18px 0 0;
                  font-size:12px;
                  line-height:1.7;
                  letter-spacing:0.5px;
                  color:#666666;
                "
              >
                Built for the wealth you create today<br />
                and the legacy you leave tomorrow.
              </p>

            </td>
          </tr>

          <!-- SECURITY NOTICE -->

          <tr>
            <td
              style="
                padding:0 30px 38px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  background:#101010;
                  border:1px solid #242424;
                "
              >
                <tr>
                  <td
                    style="
                      padding:22px 24px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 9px;
                        font-size:11px;
                        line-height:1.5;
                        letter-spacing:2px;
                        font-weight:700;
                        color:#d4af37;
                        text-transform:uppercase;
                      "
                    >
                      Security Notice
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:12px;
                        line-height:1.75;
                        color:#777777;
                      "
                    >
                      NAXODEX will never ask you to provide
                      your password, verification codes, or
                      private wallet credentials by email.
                      If you did not expect this message,
                      please contact support through your
                      account.
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->

          <tr>
            <td
              align="center"
              style="
                padding:30px 30px 34px;
                background:#070707;
                border-top:1px solid #202020;
              "
            >

              ${logoMarkup}

              <p
                style="
                  margin:16px 0 8px;
                  font-size:11px;
                  line-height:1.6;
                  color:#666666;
                "
              >
                A modern approach to structured wealth and legacy.
              </p>

              <p
                style="
                  margin:0;
                  font-size:10px;
                  line-height:1.6;
                  color:#444444;
                "
              >
                This is an automated message from NAXODEX.
                Please do not reply to this email.
              </p>

            </td>
          </tr>

        </table>

        <!-- COPYRIGHT -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          role="presentation"
          style="
            max-width:640px;
          "
        >
          <tr>
            <td
              align="center"
              style="
                padding:20px 20px 0;
                font-size:10px;
                line-height:1.6;
                color:#3f3f3f;
              "
            >
              © ${new Date().getFullYear()}
              NAXODEX. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;

  const text = `
NAXODEX — NEW ACCOUNT MESSAGE

Hello ${firstName},

You have received a new message from NAXODEX.

${emailSubject}

--------------------------------------------------

${message}

--------------------------------------------------

This message was also delivered to your NAXODEX
notification center.

You can sign in to your account to view your messages
and account activity.

YOUR WEALTH.
YOUR STRATEGY.
YOUR LEGACY.

Built for the wealth you create today and the legacy
you leave tomorrow.

SECURITY NOTICE

NAXODEX will never ask you to provide your password,
verification codes, or private wallet credentials by email.

If you did not expect this message, please contact support
through your account.

This is an automated message from NAXODEX.
Please do not reply to this email.

© ${new Date().getFullYear()} NAXODEX. All rights reserved.
`;

  return {
    subject: emailSubject,
    html,
    text,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

