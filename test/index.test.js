let createNanoEvents = require('../')

it('is empty from the beggining', () => {
  let ee = createNanoEvents()
  expect(ee.events).toEqual({ })
})

it('adds listeners', () => {
  let ee = createNanoEvents()

  ee.on('one', () => true)
  ee.on('two', () => true)
  ee.on('two', () => true)

  expect(Object.keys(ee.events)).toEqual(['one', 'two'])
  expect(ee.events.one).toHaveLength(1)
  expect(ee.events.two).toHaveLength(2)
})

it('calls listener', () => {
  let ee = createNanoEvents()
  let calls = []
  ee.on('event', (...args) => {
    calls.push(args)
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 21, 22)
  ee.emit('event', 31, 32, 33)
  ee.emit('event', 41, 42, 43, 44)

  expect(calls).toEqual([[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
})

it('unbinds listener', () => {
  let ee = createNanoEvents()

  let calls1 = []
  let unbind = ee.on('event', a => {
    calls1.push(a)
  })

  let calls2 = []
  ee.on('event', a => {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  expect(calls1).toEqual([1])
  expect(calls2).toEqual([1, 2])
})

it('removes event on no listeners', () => {
  let ee = createNanoEvents()
  let unbind1 = ee.on('one', () => {})
  let unbind2 = ee.on('one', () => {})

  unbind1()
  expect(ee.events.one).toHaveLength(1)

  unbind1()
  expect(ee.events.one).toHaveLength(1)

  unbind2()
  expect(ee.events.one).toHaveLength(0)

  unbind2()
  expect(ee.events.one).toHaveLength(0)
})

it('removes listener during event', () => {
  let ee = createNanoEvents()

  let calls = []
  let remove1 = ee.on('event', () => {
    remove1()
    calls.push(1)
  })
  ee.on('event', () => {
    calls.push(2)
  })

  ee.emit('event')
  expect(calls).toEqual([1, 2])
})

it('allows to use arrow function to bind a context', () => {
  let ee = createNanoEvents()
  let app = {
    value: 'test',
    getListener () {
      return () => {
        this.check = this.value.split('')
      }
    }
  }

  let unbind = ee.on('event', app.getListener())

  expect(() => {
    ee.emit('event')
  }).not.toThrow()

  expect(app.check).toEqual(['t', 'e', 's', 't'])

  unbind()
})

it('allows to predefine listeners', () => {
  const cb = jest.fn()
  const ee = createNanoEvents({ test: [cb] })

  ee.emit('test', 0)

  expect(cb).toHaveBeenCalledWith(0)
})
