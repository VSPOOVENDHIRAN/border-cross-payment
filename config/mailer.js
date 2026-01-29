const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "a102d6001@smtp-brevo.com",
    pass: "CHp9xN6QOGJb21SM",
  },
});

async function sendPasswordSetupEmail(to, link) {
  await transporter.sendMail({
    from: '"Demo App" <cadetprabanjan24@gmail.com>',
    to,
    subject: "Set your password",
    html: `
      <h3>Welcome</h3>
      <p>Click the link below to set your password:</p>
      <p>this is a test link</p>
      <a href="${link}">Set Password</a>
    `,
  });
}

module.exports = { sendPasswordSetupEmail };
