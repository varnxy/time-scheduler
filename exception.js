let IntermediateInheritor = function () {}
IntermediateInheritor.prototype = Error.prototype

function CustomError() {
  let err = Error.apply(this, arguments)
  err.name = this.name = 'CustomError'

  this.message = err.message

  Object.defineProperty(this, 'stack', {
      get: function () {
          return err.stack
      }
  })

  return this
}

function ScheduleNotFoundError() {
  CustomError.apply(this, arguments)
  this.name = 'ScheduleNotFoundError'
  return this
}

function ScheduleNotReadyError() {
  CustomError.apply(this, arguments)
  this.name = 'ScheduleNotReadyError'
  return this
}

function InvalidDateRangeError() {
  CustomError.apply(this, arguments)
  this.name = 'InvalidDateRangeError'
  return this
}

function TaskUndefinedError() {
  CustomError.apply(this, arguments)
  this.name = 'TaskUndefinedError'
  return this
}

function DuplicatedError() {
  CustomError.apply(this, arguments)
  this.name = 'DuplicatedError'
  return this
}

DuplicatedError.prototype = new IntermediateInheritor()
InvalidDateRangeError.prototype = new IntermediateInheritor()
ScheduleNotFoundError.prototype = new IntermediateInheritor()
ScheduleNotReadyError.prototype = new IntermediateInheritor()
TaskUndefinedError.prototype = new IntermediateInheritor()

exports.ScheduleNotFoundError = ScheduleNotFoundError
exports.InvalidDateRangeError = InvalidDateRangeError
exports.DuplicatedError = DuplicatedError
exports.ScheduleNotReadyError = ScheduleNotReadyError
exports.TaskUndefinedError = TaskUndefinedError
