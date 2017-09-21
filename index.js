(
  /**
   * Interface for event subscription.
   *
   * @alias NanoEvents
   * @class
   * @example
   * class Ticker {
   *   constructor() {
   *     this.emitter = new NanoEvents()
   *   }
   *   on() {
   *     return this.emitter.on.apply(this.events, arguments)
   *   }
   *   tick() {
   *     this.emitter.emit('tick')
   *   }
   * }
   */
  module.exports = function NanoEvents () {
    /**
     * Event names in keys and arrays with listeners in values.
     * @alias NanoEvents#events
     * @type {object}
     *
     * @example
     * Object.keys(ee.events)
     */
    this.events = { }
  }
).prototype = {

  /**
   * Add a listener for a given event.
   *
   * @alias NanoEvents#on
   * @method
   * @param {string} event The event name.
   * @param {function} cb The listener function.
   *
   * @return {function} Unbind listener from event.
   *
   * @example
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   */
  on: function on (event, cb) {
    if (process.env.NODE_ENV !== 'production' && typeof cb !== 'function') {
      throw new Error('Listener must be a function')
    }

    // event variable is reused and repurposed, now it's an array of handlers
    event = this.events[event] = this.events[event] || []
    event.push(cb)

    return function () {
      // a.splice(i >>> 0, 1) === if (i !== -1) a.splice(i, 1)
      // -1 >>> 0 === 0xFFFFFFFF, max possible array length
      event.splice(event.indexOf(cb) >>> 0, 1)
    }
  },

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @alias NanoEvents#emit
   * @method
   * @param {string} event The event name.
   * @param {...*} arguments The arguments for listeners.
   *
   * @returns {undefined}
   *
   * @example
   * ee.emit('tick', tickType, tickDuration)
   */
  emit: function emit (event) {
    var list = this.events[event]
    if (!list || !list[0]) return // list[0] === Array.isArray(list)

    var args = list.slice.call(arguments, 1)
    list.slice().map(function (i) {
      i.apply(this, args) // this === global or window
    })
  }
}
