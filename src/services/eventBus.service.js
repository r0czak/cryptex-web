class EventBus {
  constructor() {
    this.subscribers = {}
  }

  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = []
    }
    this.subscribers[event].push(callback)
  }

  publish(event) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => callback())
    }
  }
}

export const eventBus = new EventBus()
