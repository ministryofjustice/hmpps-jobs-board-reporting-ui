import { parse } from 'date-fns'
import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi
    .object({})
    .custom((obj, helper) => {
      const { fromDate, toDate } = obj

      if (!fromDate && !toDate) {
        return true
      }

      if (fromDate && !toDate) {
        return helper.error('any.toDateRequired', {
          key: 'toDate',
          label: 'toDate',
        })
      }

      if (!fromDate && toDate) {
        return helper.error('any.fromDateRequired', {
          key: 'fromDate',
          label: 'fromDate',
        })
      }

      // Check if both dates are valid
      const fromDateObj = parse(fromDate.toString(), 'dd/MM/yyyy', new Date())
      const toDateObj = parse(toDate.toString(), 'dd/MM/yyyy', new Date())

      if (Number.isNaN(fromDateObj.getTime())) {
        return helper.error('date.base', {
          key: 'fromDate',
          label: 'fromDate',
        })
      }

      if (Number.isNaN(toDateObj.getTime())) {
        return helper.error('date.base', {
          key: 'toDate',
          label: 'toDate',
        })
      }

      // Check if toDate is after fromDate
      if (toDateObj <= fromDateObj) {
        return helper.error('date.order', {
          key: 'toDate',
          label: 'toDate',
        })
      }

      return true
    })
    .messages({
      'any.toDateRequired': 'Enter or select a `latest` date',
      'any.fromDateRequired': 'Enter or select a `earliest` date',
      'date.base': 'Enter the date in the correct format',
      'date.order': "The `latest` date must be after the 'earliest' date",
    })
}
