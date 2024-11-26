export default function getLastFullMonthEndDate(referenceDate: Date): Date {
  // Create a new date object based on the input date
  const inputDate = new Date(referenceDate)

  // Move to the first day of the current month
  inputDate.setDate(1)

  // Subtract one month to get to the last full month
  inputDate.setMonth(inputDate.getMonth() - 1)

  // Move to the last day of the last full month
  const lastFullMonthEndDate = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0)

  return lastFullMonthEndDate
}
