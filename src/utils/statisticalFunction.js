const sumQuota = (id, listActivity) => {
  let sum = 0
  listActivity.map((item) => {
    if (item.assignee._id.toString() === id.toString()) {
      sum += item.quota
    }
  })
  return sum
}

const countStatusActivity = (id, listActivity, status) => {
  let count = 0
  listActivity.map((item) => {
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
