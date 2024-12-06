export default function getDateInputObject(dateString: string, fieldName: string) {
  if (!dateString) {
    // If the date is falsy, return an object with empty strings
    return {
      [`${fieldName}-day`]: '',
      [`${fieldName}-month`]: '',
      [`${fieldName}-year`]: '',
    }
  }

  // Create date object
  const date = new Date(dateString)

  // Extract day, month (1-based), and year from the Date object
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString() // Months are 0-based, so add 1
  const year = date.getFullYear().toString()

  return {
    [`${fieldName}-day`]: day,
    [`${fieldName}-month`]: month,
    [`${fieldName}-year`]: year,
  }
}
