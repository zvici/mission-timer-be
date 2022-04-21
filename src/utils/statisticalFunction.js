const sumQuota = (id, listParticipants) => {
  let sum = 0
  listParticipants.map((item) => {
    if (
      item.user._id.toString() === id.toString() &&
      item.isApprove &&
      item.status === 'done'
    ) {
      sum += item.task.officeHours
    }
  }) 
  return sum
}

const countStatusActivity = (id, listParticipants, status) => {
  let count = 0
  listParticipants.map((item) => {
    if (
      item.assignee._id.toString() === id.toString() &&
      item.status === status
    ) {
      count += 1
    }
  })
  return count
}

export { sumQuota, countStatusActivity }
