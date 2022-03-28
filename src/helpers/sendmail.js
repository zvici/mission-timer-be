const nodemailer = require("nodemailer");

module.exports = function (mailto, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "nhatranthanh115@gmail.com",
      pass: "matkhaucc",
    },
  });

  const mainOptions = {
    from: "Hệ thống quản lý công tác khác",
    to: mailto,
    subject,
    text,
  };

  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};
