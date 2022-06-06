const sumQuota = (id, listParticipants) => {
  let sumOfficeHours = 0
  let countDone = 0
  let notAnswered = 0
  let sumTask = 0
  let countAccepted = 0
  let countRefuse = 0
  let countIncomplete = 0
  listParticipants.map((item) => {
    if (item.user._id.toString() === id.toString()) {
      sumTask += 1
      if (item.status === 'notAnswered') {
        notAnswered += 1
      }
      if (item.status === 'accept') {
        countAccepted += 1
      }
      if (item.status === 'refuse') {
        countRefuse += 1
      }
      if (item.task.activity.type !== 'STAFF' && item.confirmBy) {
        if (item.status === 'done') {
          sumOfficeHours += item.task.officeHours
          countDone += 1
        }
        if (item.status === 'incomplete') {
          countIncomplete += 1
        }
      }
      if (item.task.activity.type === 'STAFF' && item.image) {
        if (item.status === 'incomplete') {
          countIncomplete += 1
        }
        if (item.status === 'done') {
          sumOfficeHours += item.task.officeHours
          countDone += 1
        }
      }
    }
  })
  return {
    sumTask,
    sumOfficeHours,
    countDone,
    notAnswered,
    countAccepted,
    countRefuse,
    countIncomplete,
  }
}

export { sumQuota }
