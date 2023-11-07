import 'dotenv/config'
import { Neurosity } from '@neurosity/sdk'
import { checkSignalQuality } from './Signal.js'

let neurosity = null

async function checkEnvironmentVariables () {
  return new Promise((resolve, reject) => {
    const values = [
      process.env.EMAIL,
      process.env.PASSWORD,
      process.env.DEVICE_ID
    ]

    const isEnvOk = values.every((value) => value)
    if (isEnvOk) resolve()
    else reject(new Error('isEnvOk(): check environment values'))
  })
}

function startProcessTerminationListeners () {
  ['SIGINT', 'exit'].map((eventName) =>
    process.on(eventName, () => {
      neurosity && neurosity.disconnect()
      process.exit()
    })
  )
}

async function signInNeurosity () {
  console.log('login into Neurosity Developer Console...\n')
  await neurosity.login({
    email: process.env.EMAIL,
    password: process.env.PASSWORD
  })
  console.log('login success...\n')
}

async function main () {
  try {
    await checkEnvironmentVariables()

    neurosity = new Neurosity({
      timesync: true,
      deviceId: process.env.DEVICE_ID
    })

    startProcessTerminationListeners()

    await signInNeurosity()

    await checkSignalQuality()
  } catch (error) {
    console.log(error)
  }
}

main()
