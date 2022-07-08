class StateEvent {
  constructor(path, data) {
    this.path = path
    this.data = data
  }

  unshift(parent) {
    return new StateEvent(`${parent}.${this.path}`, this.data)
  }
}

export default StateEvent
