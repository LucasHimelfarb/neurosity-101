export async function checkDeviceStatus (neurosity = {}, eventsAmount = 50) {
  return new Promise((resolve, reject) => {
    let eventsCounter = 0

    const subscriber = neurosity.status().subscribe(({
      state = '',
      battery = 0,
      sleepMode = false
    }) => {
      const isActive = !sleepMode
      const isBatteryOk = battery > 25
      const isOnline = state === 'online'

      const isDeviceStatusOk = [isActive, isBatteryOk, isOnline]
        .every(deviceValue => deviceValue)
      if (isDeviceStatusOk) {
        subscriber.unsubscribe()
        resolve(true)
      } else {
        eventsCounter++

        if (eventsCounter >= eventsAmount) {
          const error = `
            checkDeviceStatus() Error:\n
            is device online: ${isOnline}\n
            is battery ok: ${isBatteryOk}\n
            is device active: ${isActive}\n
          `
          reject(new Error(error))
        }
      }
    })
  })
}
