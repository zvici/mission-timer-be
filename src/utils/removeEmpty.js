const removeEmpty = (obj) => {
  let newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (
      newObj[key] === null ||
      newObj[key] === undefined ||
      newObj[key] === ''
    ) {
      delete newObj[key]
    }
  })
  return newObj
}
export default removeEmpty
