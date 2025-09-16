import { parse } from 'date-fns'
import joi from 'joi'
import type { ObjectSchema } from 'joi'

export default function validationSchema(): ObjectSchema {
  return joi
    .object({})
    .custom((obj, helper) => {
      const { dateFrom, dateTo } = obj

      if (!dateFrom && !dateTo) {
        return true
      }

      if (dateFrom && !dateTo) {
        return helper.error('any.dateToRequired', {
          key: 'dateTo',
          label: 'dateTo',
        })
      }

      if (!dateFrom && dateTo) {
        return helper.error('any.dateFromRequired', {
          key: 'dateFrom',
          label: 'dateFrom',
        })
      }

      // Check if both dates are valid
      const dateFromObj = parse(dateFrom.toString(), 'dd/MM/yyyy', new Date())
      const dateToObj = parse(dateTo.toString(), 'dd/MM/yyyy', new Date())
      const now = new Date()

      if (Number.isNaN(dateFromObj.getTime())) {
        return helper.error('date.base', {
          key: 'dateFrom',
          label: 'dateFrom',
        })
      }

      if (Number.isNaN(dateToObj.getTime())) {
        return helper.error('date.base', {
          key: 'dateTo',
          label: 'dateTo',
        })
      }

      // Check that no future dates are allowed
      if (dateFromObj > now) {
        return helper.error('date.future', {
          key: 'dateFrom',
          label: 'dateFrom',
        })
      }

      if (dateToObj > now) {
        return helper.error('date.future', {
          key: 'dateTo',
          label: 'dateTo',
        })
      }

      // Check dates are on or after 1 August 2025
      if (dateFromObj < new Date('2025-08-01')) {
        return helper.error('date.past', {
          key: 'dateFrom',
          label: 'dateFrom',
        })
      }

      if (dateToObj < new Date('2025-08-01')) {
        return helper.error('date.past', {
          key: 'dateTo',
          label: 'dateTo',
        })
      }

      // Check if dateTo is after dateFrom
      if (dateToObj < dateFromObj) {
        return helper.error('date.order', {
          key: 'dateTo',
          label: 'dateTo',
        })
      }

      return true
    })
    .messages({
      'any.dateToRequired': 'Enter or select a `latest` date',
      'any.dateFromRequired': 'Enter or select a `earliest` date',
      'date.base': 'Enter the date in the correct format',
      'date.order': "The `latest` date must be after the 'earliest' date",
      'date.future': 'Dates must not be in the future',
      'date.past': 'Dates must be on or after 1 August 2025',
    })
}
