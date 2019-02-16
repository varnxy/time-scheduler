const EventEmitter = require('events').EventEmitter
    , util = require('util')

function TimeScheduler() {
  EventEmitter.call(this)

  this._schedules = []
  this._intervalChecker = null
  this._checkScheduleWorking = false
}

util.inherits(TimeScheduler, EventEmitter)

TimeScheduler.prototype.addSchedule = function(opt) {
  if (this._exists(opt.name)) {
    throw new Error('Schedule ' + opt.name + ' is already exists')
  }

  if (!(opt.start instanceof Date)) {
    throw new Error('Start must be a date')
  }

  if (!(opt.end instanceof Date)) {
    throw new Error('End must be a date')
  }

  if (+opt.end <= +opt.start) {
    throw new Error('End date must be greater that start date')
  }

  this._schedules.push({
    name: opt.name,
    start: opt.start,
    end: opt.end,
    running: false,
    ready: opt.ready || false,
    task: opt.task
  })

  if (this._intervalChecker === null) {
    this._intervalChecker = setInterval(this._checkSchedule.bind(this), 1000)
  }
}

TimeScheduler.prototype.removeSchedule = function(name) {
  let scheduleIndex = this._schedules.findIndex(schedule => {
    return schedule.name == name
  })

  if (scheduleIndex !== -1) {
    this.removeAllListeners(this._schedules[scheduleIndex].name)
    this._schedules.splice(scheduleIndex, 1)
  }

  if (this._schedules.length == 0) {
    clearInterval(this._intervalChecker)
  }
}

TimeScheduler.prototype.getRemaining = function() {
  return this._schedules.filter(schedule => {
    return !schedule.running
  }).length
}

TimeScheduler.prototype.callTask = function(scheduleName, params) {
  let schedule = this._schedules.find(schedule => {
    return schedule.name == scheduleName
  })

  if (!schedule) {
    throw new Error('Schedule ' + scheduleName + ' is not exists')
  } else if ((schedule && !schedule.running) || (schedule && !schedule.ready)) {
    throw new Error('Schedule ' + scheduleName + ' is not ready')
  } else if (schedule && schedule.running && schedule.ready && typeof schedule.task !== 'function') {
    throw new Error('Schedule ' + scheduleName + ' is not have task')
  } else {
    schedule.task.apply(null, params || [])
  }
}

TimeScheduler.prototype._checkSchedule = function() {
  if (!this._checkScheduleWorking) {
    let currentTime = null
    this._checkScheduleWorking = true

    this._schedules.forEach(schedule => {
      currentTime = +new Date()

      if (currentTime >= schedule.start && currentTime <= schedule.end) {
        schedule.running = true
      } else if (schedule.ready && currentTime >= schedule.end) {
        this.removeSchedule(schedule.name)
        return
      }

      if (schedule.running && !schedule.ready) {
        this._setup(schedule)
      }
    })

    this._checkScheduleWorking = false
  }
}

TimeScheduler.prototype._setup = function(schedule) {
  new Promise(resolve => {
    this.emit(schedule.name, resolve)
  }).then(() => {
    schedule.ready = true
  })
}

TimeScheduler.prototype._exists = function(name) {
  return this._schedules.filter(schedule => {
    return schedule.name == name
  }).length > 0
}

module.exports = TimeScheduler
