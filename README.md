# @varnxy/time-scheduler

Time task scheduler for node

## How to use
* Add Schedule

```js
const TimeScheduler = require('@varnxy/time-scheduler')

let scheduler = new TimeScheduler()
  , dateStart = new Date()
  , dateEnd = new Date(+dateStart + (1000 * 60 * 60 * 24))

try {
  scheduler.addSchedule({
    name: 'Campaign Product Foo',
    start: dateStart,
    end: dateEnd,
    ready: true, // this indicate you don't need
                // setup before schedule ready
    task: function(any) {
      console.log(any)
    }
  })

  scheduler.addSchedule({
    name: 'Campaign Product Bar',
    start: dateStart,
    end: dateEnd,
    ready: false, // this indicate you need
                // setup before schedule ready
    task: function(any) {
      console.log(any)
    }
  })
} catch(e) {
  // Do something with error
}

```

* Setup event
```js
// As we explain before we have `ready` option
// on `addSchedule`, if that set into false
// schedule will trigger event for setup the schedule.
scheduler.on('Campaign Product Bar', done => {
  // Do some setup and call done
  done()
})
```

* Calling schedule task
```js
try {
  scheduler.callTask('Campaign Product Foo', [anyparams])
  scheduler.callTask('Campaign Product Bar')
} catch(e) {
  // Do something with error
}
```

* More utility
```js
scheduler.removeSchedule('Campaign Product Bar')
console.log(scheduler.exists('Campaign Product Bar'))
// retrieve schedule where not running
console.log(scheduler.getRemaining())
```
