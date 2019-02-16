const TimeScheduler = require('..')
    , chai = require('chai')
    , EventEmitter = require('events').EventEmitter
    , expect = chai.expect

let scheduler = null

describe('Test @varnxy/time-scheduler', () => {

  afterEach(() => {
    scheduler = null
  })

  it('Module exported and become instance of EventEmitter', function() {
    expect(typeof TimeScheduler == 'function').to.be.true
    expect(new TimeScheduler()).to.instanceOf(EventEmitter)
  })

  it('Throw an error if schedule name exists', function(done) {
    let dt1 = new Date()
      , dt2 = new Date(+dt1 + 1000)

    scheduler = new TimeScheduler()

    expect(function() {
      scheduler.addSchedule({
        name: 'Campaign 1',
        start: dt1,
        end: dt2,
        ready: true
      })
    }).to.not.throw()

    expect(function() {
      scheduler.addSchedule({
        name: 'Campaign 1',
        start: dt1,
        end: dt2,
        ready: true
      })
    }).to.throw()

    setTimeout(done, 1500)
  })

  it('Throw an error if option is a wrong date', () => {
    let dt1 = new Date(2019, 1, 1)
      , dt2 = new Date(2018, 11, 30)
      , scheduler = new TimeScheduler()

    expect(function() {
      scheduler.addSchedule({
        name: 'Campaign 1',
        start: null,
        end: null,
        ready: true
      })
    }).to.throw()

    expect(function() {
      scheduler.addSchedule({
        name: 'Campaign 1',
        start: dt1,
        end: null,
        ready: true
      })
    }).to.throw()

    expect(function() {
      scheduler.addSchedule({
        name: 'Campaign 1',
        start: dt1,
        end: dt2,
        ready: true
      })
    }).to.throw()
  })

  it('Call the setup task schedule after 2000ms and call task when ready', function(done) {
    let scheduler = new TimeScheduler()
      , dt1 = new Date()
      , dt2 = new Date(+dt1 + 4000) // 2 second after
      , called = 0
      , callTaskInterval = null

    this.timeout(5000)

    expect(function() {
      scheduler.callTask('Campaign 1')
    }).to.throw

    scheduler.on('Campaign 1', resolve => {
      expect(scheduler.getRemaining()).to.equal(0)
      // Should throw an error because schedule is not ready until resolve
      expect(function() {
        scheduler.callTask('Campaign 1')
      }).to.throw

      resolve()
    })

    scheduler.addSchedule({
      name: 'Campaign 1',
      start: dt1,
      end: dt2,
      task: function() {
        expect(arguments.length).to.equal(0)
        called++
      }
    })

    setTimeout(function() {
      callTaskInterval = setInterval(function() {
        scheduler.callTask('Campaign 1')
      }, 100)
    }, 1500)

    setTimeout(function() {
      expect(called).to.greaterThan(1)
      clearInterval(callTaskInterval)
      done()
    }, 3000)
  })

  it('Call task with arguments', function(done) {
    let scheduler = new TimeScheduler()
      , dt1 = new Date(+new Date() + 1000)
      , dt2 = new Date(+dt1 + 4500)

    this.timeout(5000)

    scheduler.addSchedule({
      name: 'Campaign 1',
      start: dt1,
      end: dt2,
      ready: true,
      task: function(a, b, c) {
        expect(a).to.equal('Foo')
        expect(b).to.equal('Bar')
        expect(c).to.equal('Baz')
      }
    })

    setTimeout(function() {
      expect(function() {
        scheduler.callTask('Campaign 1', ['Foo', 'Bar', 'Baz'])
      }).to.throw()
    }, 500)

    setTimeout(function() {
      scheduler.callTask('Campaign 1', ['Foo', 'Bar', 'Baz'])
    }, 1200)

    setTimeout(function() {
      expect(scheduler.getRemaining()).to.equal(0)
      done()
    }, 4600)
  })

  it('Throw an error if call task unregistered schedule', function() {
    let scheduler = new TimeScheduler()
    expect(function() {
      scheduler.callTask('Campaign 2')
    }).to.throw()
  })

  it('Throw an error if call task registered schedule without task', function(done) {
    let scheduler = new TimeScheduler()
      , dt1 = new Date(+new Date() + 1000)
      , dt2 = new Date(+dt1 + 3000)

    this.timeout(5000)

    scheduler.addSchedule({
      name: 'Campaign 1',
      start: dt1,
      end: dt2,
      ready: true
    })

    setTimeout(function() {
      expect(function() {
        scheduler.callTask('Campaign 1', ['Foo', 'Bar', 'Baz'])
      }).to.throw()
    }, 1200)

    setTimeout(function() {
      expect(scheduler.getRemaining()).to.equal(0)
      done()
    }, 3200)
  })
})
