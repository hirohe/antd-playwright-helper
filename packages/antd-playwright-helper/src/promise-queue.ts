class PromiseQueue {
  private queue: (() => Promise<any>)[] = []

  public push(callback: () => Promise<any>) {
    this.queue.push(callback)
  }

  public run(stopOnError = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const task = this.queue.shift()
      if (task) {
        task()
          .then(() => {
            this.run().then(resolve)
          })
          .catch((error) => {
            if (stopOnError) {
              reject(error)
            } else {
              this.run().then(resolve)
            }
          })
      } else {
        resolve()
      }
    })
  }
}

export default PromiseQueue
