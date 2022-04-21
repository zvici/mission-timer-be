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
      if (item.isApprove && item.status === 'done') {
        sumOfficeHours += item.task.officeHours
        countDone += 1
      }
      if (item.status === 'notAnswered' && !item.isApprove) {
        notAnswered += 1
      }
      if (item.status === 'accept' && !item.isApprove) {
        countAccepted += 1
      }
      if (item.status === 'refuse') {
        countRefuse += 1
      }
      if (item.status === 'incomplete' && !item.isApprove) {
        countIncomplete += 1
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
