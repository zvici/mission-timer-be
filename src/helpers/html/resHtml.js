const resHtmlForgotPassword = ({ name, otp }) => {
  return ` <table align="center" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td>
        <table cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td>
                <table cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td width="250">
                        <img
                          width="250"
                          src="https://hufi.edu.vn/images/logo/logo.png"
                        />
                      </td>
                      <td width="250" valign="top" align="right">
                        <p>Xác minh đổi mật khẩu</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td>
              <p>
                      Xin chào:
                      <span style="color: #43648b; font-weight: bold"
                        >${name}</span
                      >
                    </p>
                <p>OTP có thời hạn 15 phút, vui lòng xác nhận trước thời hạn.</p>
                <p>Đây là mã OTP của bạn:</p>
                <p style="font-weight: bold; font-size: 20px">${otp}</p>
              </td>
            </tr>
            <tr>
              <td>
                <p>Lưu ý không chia sẽ OTP này cho bất kỳ ai</p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Thank you!</p>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>`
}

export { resHtmlForgotPassword }
