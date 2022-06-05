import * as OneSignal from 'onesignal-node'
import dotenv from 'dotenv'
dotenv.config()
// const app_key_provider = {
//   getToken() {
//     return process.env.APP_KEY_PROVIDER
//   },
// }
// const user_key_provider = {
//   getToken() {
//     return process.env.USER_KEY_PROVIDER
//   },
// }
// const configuration = OneSignal.createConfiguration({
//   authMethods: {
//     user_key: {
//       tokenProvider: user_key_provider,
//     },
//     app_key: {
//       tokenProvider: app_key_provider,
//     },
//   },
// })
// const client = new OneSignal.DefaultApi(configuration)

const client = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.APP_KEY_PROVIDER
)

export default client
