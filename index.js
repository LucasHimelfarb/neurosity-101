import 'dotenv/config'
import { Neurosity } from '@neurosity/sdk'

let neurosity = null

const isEnvOk = (values = []) => {
  if (!Array.isArray(values)) {
    console.log('the parameter "values" should be an Array')

    return false
  }

  return values.every((value) => value)
}

const classifySignalSamples = (signalQualitySamples=[]) => {
  const badSignals = Array(8).fill(0)
  const goodSignals = Array(8).fill(0)

  for (let signalQualitySample of signalQualitySamples) {
    signalQualitySample.forEach((electrodeSignal, electrodeIndex) => {
      if (['great', 'good'].includes(electrodeSignal.status)) {
        goodSignals[electrodeIndex]++
      } else {
        badSignals[electrodeIndex]++
      }
    })
  }

  return [goodSignals, badSignals]
}

const getSignalQualitySamples = (samplesAmount=100) => {
  const tenPercent = samplesAmount / 10

  return new Promise(resolve => {
    const qualitySignalSamples = []
    const subscriber = neurosity.signalQuality().subscribe((signalQuality) => {
      console.log(signalQuality);
      if (qualitySignalSamples.length % tenPercent === 0) {
        console.log(`${qualitySignalSamples.length}% signal samples obtained...\n`)
      }

      if (qualitySignalSamples.length < samplesAmount) {
        qualitySignalSamples.push(signalQuality)
      } else {
        subscriber.unsubscribe();
        resolve(qualitySignalSamples)
      }
    })
  })
}

async function main () {
  try {
    const _isEnvOk = isEnvOk([
      process.env.EMAIL,
      process.env.PASSWORD,
      process.env.DEVICE_ID
    ])

    if (!_isEnvOk) throw new Error('isEnvOk(): false')

    neurosity = new Neurosity({
      timesync: true,
      deviceId: process.env.DEVICE_ID
    })

    console.log('login into Neurosity Developer Console...\n')
    await neurosity.login({
      email: process.env.EMAIL,
      password: process.env.PASSWORD
    })
    console.log('login success...\n')

    console.log('Getting signal quality samples...')
    const signalQualitySamples = await getSignalQualitySamples()
    console.log('Signal quality samples obtained...')

    console.log('Classifying signal samples...')
    const [
      goodSignalsPerElectrode,
      badSignalsPerElectrode
    ] = classifySignalSamples(signalQualitySamples)
    console.log('Quality signals samples classified...')

    console.log(`
      Good signals samples: ${goodSignalsPerElectrode}\n
      Bad signals samples: ${badSignalsPerElectrode} 
    `)

  } catch (error) {
    console.log(error)
  }
}

main()
