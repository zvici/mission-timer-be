module.exports = function (date) {
  const dateSplit = date.split("-");

  const day = Number(dateSplit[0]);
  const month = Number(dateSplit[1]) - 1;
  const year = Number(dateSplit[2]);

  return new Date(year, month, day);
};
