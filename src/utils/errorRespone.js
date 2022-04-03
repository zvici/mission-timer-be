export default function (res, status, code, msg, message) {
  return res.status(status).json({
    code,
    msg,
    message,
  })
}
