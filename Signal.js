export async function checkSignalQuality (neurosity = {}) {
  const signalQualitySamples = await getSignalQualitySamples(neurosity)

  const [
    goodSignalsPerElectrode,
    badSignalsPerElectrode
  ] = classifySignalSamples(signalQualitySamples)

  console.log(`
    Good signals samples: ${goodSignalsPerElectrode}\n
    Bad signals samples: ${badSignalsPerElectrode}
  `)
}

function getSignalQualitySamples (neurosity = {}, samplesAmount = 100) {
  console.log('Getting signal quality samples...')
  const tenPercent = samplesAmount / 10

  return new Promise(resolve => {
    const qualitySignalSamples = []
    const subscriber = neurosity.signalQuality().subscribe((signalQuality) => {
      if (qualitySignalSamples.length % tenPercent === 0) {
        console.log(`${qualitySignalSamples.length}% signal samples obtained...\n`)
      }

      if (qualitySignalSamples.length < samplesAmount) {
        qualitySignalSamples.push(signalQuality)
      } else {
        subscriber.unsubscribe()
        console.log('Getting signal quality samples...')
        resolve(qualitySignalSamples)
      }
    })
  })
}

function classifySignalSamples (signalQualitySamples = []) {
  console.log('Classifying signal samples...')
  const badSignals = Array(8).fill(0)
  const goodSignals = Array(8).fill(0)
  const greatSignalStatuses = ['great', 'good']

  for (const signalQualitySample of signalQualitySamples) {
    signalQualitySample.forEach((electrodeSignal, electrodeIndex) => {
      if (greatSignalStatuses.includes(electrodeSignal.status)) {
        goodSignals[electrodeIndex]++
      } else {
        badSignals[electrodeIndex]++
      }
    })
  }

  console.log('Quality signals samples classified...')
  return [goodSignals, badSignals]
}
