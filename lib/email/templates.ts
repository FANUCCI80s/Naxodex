function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function loginOtpEmail(
  firstName: string,
  code: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeCode = escapeHtml(code);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  const logoUrl = appUrl
    ? `${appUrl}/branding/NAXODEX-logo.png`
    : "";

  const logoMarkup = logoUrl
    ? `
      <img
        src="${escapeHtml(logoUrl)}"
        alt="NAXODEX"
        width="190"
        style="
          display:block;
          width:190px;
          max-width:100%;
          height:auto;
          margin:0 auto;
          border:0;
          outline:none;
          text-decoration:none;
        "
      />
    `
    : `
      <div
        style="
          font-family:Georgia,'Times New Roman',serif;
          font-size:30px;
          line-height:1;
          letter-spacing:7px;
          font-weight:700;
          color:#d4af37;
        "
      >
        NAXODEX
      </div>
    `;

  return {
    subject: "Your NAXODEX verification code",

    text: `Hello ${firstName},

Your NAXODEX verification code is:

${code}

This code expires in 10 minutes.

For your security, never share this code with anyone. NAXODEX will never ask you to provide your verification code by phone, email, or message.

If you did not attempt to sign in to your NAXODEX account, please secure your account immediately.

NAXODEX

Wealth • Legacy • Security`,

    html: `
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
  <title>NAXODEX Verification Code</title>
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
                  color:#777777;
                  text-transform:uppercase;
                "
              >
                Wealth &nbsp;•&nbsp; Legacy &nbsp;•&nbsp; Security
              </div>
            </td>
          </tr>

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

          <tr>
            <td
              align="center"
              style="
                padding:52px 42px 20px;
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
                Account Security
              </p>

              <h1
                style="
                  margin:0 0 22px;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:34px;
                  line-height:1.25;
                  font-weight:400;
                  color:#ffffff;
                "
              >
                Verification Code
              </h1>

              <p
                style="
                  margin:0 0 18px;
                  font-size:16px;
                  line-height:1.7;
                  color:#d0d0d0;
                "
              >
                Hello ${safeFirstName},
              </p>

              <p
                style="
                  margin:0 auto;
                  max-width:470px;
                  font-size:15px;
                  line-height:1.8;
                  color:#999999;
                "
              >
                Use the verification code below to
                securely complete your NAXODEX sign-in.
              </p>
            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                padding:28px 42px 36px;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  max-width:460px;
                  background:#111111;
                  border:1px solid #3a321d;
                "
              >
                <tr>
                  <td
                    align="center"
                    style="
                      padding:30px 20px 28px;
                    "
                  >
                    <p
                      style="
                        margin:0 0 14px;
                        font-size:10px;
                        line-height:1.5;
                        letter-spacing:3px;
                        font-weight:700;
                        color:#777777;
                        text-transform:uppercase;
                      "
                    >
                      Verification Code
                    </p>

                    <div
                      style="
                        margin:0;
                        padding:16px 12px;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:40px;
                        line-height:1.2;
                        font-weight:700;
                        letter-spacing:10px;
                        color:#ffffff;
                      "
                    >
                      ${safeCode}
                    </div>

                    <div
                      style="
                        width:80px;
                        height:2px;
                        margin:16px auto 18px;
                        background:#d4af37;
                      "
                    ></div>

                    <p
                      style="
                        margin:0;
                        font-size:12px;
                        line-height:1.6;
                        color:#777777;
                      "
                    >
                      Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:0 42px 38px;
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
                  background:#0d0d0d;
                  border-left:2px solid #d4af37;
                "
              >
                <tr>
                  <td
                    style="
                      padding:18px 20px;
                    "
                  >
                    <p
                      style="
                        margin:0 0 7px;
                        font-size:11px;
                        line-height:1.5;
                        font-weight:700;
                        letter-spacing:1.5px;
                        color:#d4af37;
                        text-transform:uppercase;
                      "
                    >
                      Time Sensitive
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:13px;
                        line-height:1.7;
                        color:#888888;
                      "
                    >
                      This verification code is valid for
                      10 minutes. Once it expires, you will
                      need to request a new code.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:0 30px 42px;
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
                      If you did not attempt to sign in to
                      your NAXODEX account, please secure
                      your account and contact support if
                      necessary.
                    </p>

                    <p
                      style="
                        margin:12px 0 0;
                        font-size:12px;
                        line-height:1.75;
                        color:#777777;
                      "
                    >
                      Never share this verification code with
                      anyone. NAXODEX will never ask you to
                      provide your verification code by phone,
                      email, or message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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
                  margin:14px 0 7px;
                  font-size:11px;
                  line-height:1.6;
                  color:#666666;
                "
              >
                Wealth &nbsp;•&nbsp; Legacy &nbsp;•&nbsp; Security
              </p>

              <p
                style="
                  margin:0;
                  font-size:10px;
                  line-height:1.6;
                  color:#444444;
                "
              >
                This is an automated security message from
                NAXODEX. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>

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
`,
  };
}

export function passwordResetOtpEmail(
  firstName: string,
  code: string
) {
  const safeFirstName = escapeHtml(firstName);
  const safeCode = escapeHtml(code);

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  const logoUrl = appUrl
    ? `${appUrl}/branding/NAXODEX-logo.png`
    : "";

  const logoMarkup = logoUrl
    ? `
      <img
        src="${escapeHtml(logoUrl)}"
        alt="NAXODEX"
        width="190"
        style="
          display:block;
          width:190px;
          max-width:100%;
          height:auto;
          margin:0 auto;
          border:0;
          outline:none;
          text-decoration:none;
        "
      />
    `
    : `
      <div
        style="
          font-family:Georgia,'Times New Roman',serif;
          font-size:30px;
          line-height:1;
          letter-spacing:7px;
          font-weight:700;
          color:#d4af37;
        "
      >
        NAXODEX
      </div>
    `;

  return {
    subject: "Your NAXODEX password reset code",

    text: `Hello ${firstName},

Your NAXODEX password reset code is:

${code}

This code expires in 10 minutes.

For your security, never share this code with anyone. NAXODEX will never ask you to provide your verification code by phone, email, or message.

If you did not request a password reset, you can safely ignore this email. Your password will not be changed unless the reset process is completed.

NAXODEX

Wealth • Legacy • Security`,

    html: `
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
  <title>NAXODEX Password Reset</title>
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
                  color:#777777;
                  text-transform:uppercase;
                "
              >
                Wealth &nbsp;•&nbsp; Legacy &nbsp;•&nbsp; Security
              </div>
            </td>
          </tr>

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

          <tr>
            <td
              align="center"
              style="
                padding:52px 42px 20px;
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
                Account Security
              </p>

              <h1
                style="
                  margin:0 0 22px;
                  font-family:Georgia,'Times New Roman',serif;
                  font-size:34px;
                  line-height:1.25;
                  font-weight:400;
                  color:#ffffff;
                "
              >
                Reset Your Password
              </h1>

              <p
                style="
                  margin:0 0 18px;
                  font-size:16px;
                  line-height:1.7;
                  color:#d0d0d0;
                "
              >
                Hello ${safeFirstName},
              </p>

              <p
                style="
                  margin:0 auto;
                  max-width:470px;
                  font-size:15px;
                  line-height:1.8;
                  color:#999999;
                "
              >
                Use the password reset code below to
                securely create a new password for your
                NAXODEX account.
              </p>
            </td>
          </tr>

          <tr>
            <td
              align="center"
              style="
                padding:28px 42px 36px;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                role="presentation"
                style="
                  max-width:460px;
                  background:#111111;
                  border:1px solid #3a321d;
                "
              >
                <tr>
                  <td
                    align="center"
                    style="
                      padding:30px 20px 28px;
                    "
                  >
                    <p
                      style="
                        margin:0 0 14px;
                        font-size:10px;
                        line-height:1.5;
                        letter-spacing:3px;
                        font-weight:700;
                        color:#777777;
                        text-transform:uppercase;
                      "
                    >
                      Password Reset Code
                    </p>

                    <div
                      style="
                        margin:0;
                        padding:16px 12px;
                        font-family:Arial,Helvetica,sans-serif;
                        font-size:40px;
                        line-height:1.2;
                        font-weight:700;
                        letter-spacing:10px;
                        color:#ffffff;
                      "
                    >
                      ${safeCode}
                    </div>

                    <div
                      style="
                        width:80px;
                        height:2px;
                        margin:16px auto 18px;
                        background:#d4af37;
                      "
                    ></div>

                    <p
                      style="
                        margin:0;
                        font-size:12px;
                        line-height:1.6;
                        color:#777777;
                      "
                    >
                      Expires in 10 minutes
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:0 42px 38px;
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
                  background:#0d0d0d;
                  border-left:2px solid #d4af37;
                "
              >
                <tr>
                  <td
                    style="
                      padding:18px 20px;
                    "
                  >
                    <p
                      style="
                        margin:0 0 7px;
                        font-size:11px;
                        line-height:1.5;
                        font-weight:700;
                        letter-spacing:1.5px;
                        color:#d4af37;
                        text-transform:uppercase;
                      "
                    >
                      Time Sensitive
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:13px;
                        line-height:1.7;
                        color:#888888;
                      "
                    >
                      This password reset code is valid for
                      10 minutes. Once it expires, you will
                      need to request a new code.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td
              style="
                padding:0 30px 42px;
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
                      If you did not request a password reset,
                      you can safely ignore this email. Your
                      password will not be changed unless the
                      reset process is completed.
                    </p>

                    <p
                      style="
                        margin:12px 0 0;
                        font-size:12px;
                        line-height:1.75;
                        color:#777777;
                      "
                    >
                      Never share this verification code with
                      anyone. NAXODEX will never ask you to
                      provide your verification code by phone,
                      email, or message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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
                  margin:14px 0 7px;
                  font-size:11px;
                  line-height:1.6;
                  color:#666666;
                "
              >
                Wealth &nbsp;•&nbsp; Legacy &nbsp;•&nbsp; Security
              </p>

              <p
                style="
                  margin:0;
                  font-size:10px;
                  line-height:1.6;
                  color:#444444;
                "
              >
                This is an automated security message from
                NAXODEX. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>

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
`,
  };
}