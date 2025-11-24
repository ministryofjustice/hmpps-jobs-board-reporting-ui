enum DateError {
  DATE_REQUIRED = 'Date to and date from must both have a date',
  DATE_FORMAT = 'Enter the date in the correct format, for example, 17/8/2025',
  DATE_PAST = 'Dates must be on or after 1 August 2025',
  DATE_FUTURE = 'Dates must not be in the future',
  DATE_ORDER = 'Date to must be after date from',
}

export default DateError
