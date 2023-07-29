import { createTransport } from "nodemailer";
import { env } from "~/env.mjs";

// create reusable transporter object using the default SMTP transport
const transporter = createTransport(
  `smtps://${env.EMAIL_SERVER_USER}:${env.EMAIL_SERVER_PASSWORD}@${env.EMAIL_SERVER_HOST}`
);

export const sendVerificationEmail = (email: string, token: string) => {
  const url = new URL(env.NEXTAUTH_URL);
  url.pathname = "/verify";
  url.searchParams.set("token", token);
  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };
  const mailOptions = {
    from: `"soad mai?" <${email}>`, // sender address
    to: email, // list of receivers
    subject: "Soad Mai? Verification Link", // Subject line
    text: `${url.toString()}`, // plaintext body
    html: `<body style="background: ${color.background};">
        <table width="100%" border="0" cellspacing="20" cellpadding="0"
          style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center"
              style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
              Verification for <strong>soadmai.vercel.app</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url.toString()}"
                      target="_blank"
                      style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Verify</a></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center"
              style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
              If you did not request this email you can safely ignore it.
            </td>
          </tr>
        </table>
      </body>`, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });
};
