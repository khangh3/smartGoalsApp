export function getYearFromDateId(dateId) {
  const year = dateId.slice(0, 4);
  const month = dateId.slice(4, 6);
  const day = dateId.slice(6);
  return year.concat("-", month, "-", day);
}
