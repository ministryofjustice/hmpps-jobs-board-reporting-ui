export default function getLastFullMonthStartDate(referenceDate: Date): Date {
  // Create a new date object based on the input date
  const inputDate = new Date(referenceDate)

  // Set the date to the first day of the current month
  inputDate.setDate(1)

  // Subtract one month
  inputDate.setMonth(inputDate.getMonth() - 1)

  // Return the result as the first day of the last full month
  return inputDate
}
