import 'dotenv/config'
import { Neurosity } from '@neurosity/sdk'

import { checkDeviceStatus } from './crown/Status.js'
import { checkSignalQuality } from './crown/Signal.js'

let neurosity = null

async function main () {
  try {
    await checkEnvironmentVariables()

    neurosity = new Neurosity({
      timesync: true,
      deviceId: process.env.DEVICE_ID
    })

    startProcessTerminationListeners()

    await signInNeurosity()
    await checkDeviceStatus(neurosity)
    await checkSignalQuality(neurosity)
  } catch (error) {
    console.log(error)
  }
}

async function signInNeurosity () {
  console.log('login into Neurosity Developer Console...\n')
  await neurosity.login({
    email: process.env.EMAIL,
    password: process.env.PASSWORD
  })
  console.log('login success...\n')
}

async function checkEnvironmentVariables () {
  return new Promise((resolve, reject) => {
    const values = [
      process.env.EMAIL,
      process.env.PASSWORD,
      process.env.DEVICE_ID
    ]

    const isEnvOk = values.every((value) => value)
    if (isEnvOk) resolve(true)
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

main()
