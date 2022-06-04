import nodemailer from 'nodemailer'

const sendMail = (mailto, subject, text, html) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'nhatranthanh117@gmail.com',
        pass: 'bywqkfpscrepupzd',
      },
    })

    const mainOptions = {
      from: 'Hệ thống quản lý công tác khác',
      to: mailto,
      subject,
      text,
      html,
    }

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        reject(err)
      } else {
        resolve(info)
      }
    })
  })
}

export default sendMail
