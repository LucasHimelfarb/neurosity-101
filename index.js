const { Neurosity } = require('@neurosity/sdk')
require('dotenv').config()

const deviceId = process.env.DEVICE_ID || ''
const email = process.env.EMAIL || ''
const password = process.env.PASSWORD || ''

const verifyEnvs = (email, password, deviceId) => {
  const invalidEnv = (env) => env === '' || env === 0

  if (invalidEnv(email) || invalidEnv(password) || invalidEnv(deviceId)) {
    console.error(
      'Please verify deviceId, email and password are in .env file, quitting...'
    )

    process.exit(0)
  }
}

verifyEnvs(email, password, deviceId)
console.log(`${email} attempting to authenticate to ${deviceId}`)

const neurosity = new Neurosity({ deviceId })

const main = async () => {
  await neurosity.login({ email, password })
    .catch((error) => {
      console.log(error)
    })

  console.log('Logged in')

  // neurosity.calm().subscribe((calm) => {
  //   if (calm.probability > 0.3) {
  //     console.log('probability > 0.3!')
  //   }
  // })

  neurosity.kinesis('leftArm').subscribe((intent) => {
    console.log('leftArm!', JSON.stringify(intent))
  })
}

main()
