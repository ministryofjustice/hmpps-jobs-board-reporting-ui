import { parse } from 'date-fns'
import joi from 'joi'
import type { ObjectSchema } from 'joi'
import DateError from '../../utils/errors'

export default function validationSchema(): ObjectSchema {
  return joi
    .object({})
    .custom((obj, helper) => {
      const { dateFrom, dateTo } = obj

      // No dates provided, skip validation
      if (!dateFrom && !dateTo) {
        return true
      }

      // Check that both dates are provided
      if (dateFrom && !dateTo) {
        return helper.error('date.required', {
          key: 'dates',
          label: 'dates',
        })
      }

      if (!dateFrom && dateTo) {
        return helper.error('date.required', {
          key: 'dates',
          label: 'dates',
        })
      }

      // Check if both dates are valid
      const dateFromObj = parse(dateFrom.toString(), 'dd/MM/yyyy', new Date())
      const dateToObj = parse(dateTo.toString(), 'dd/MM/yyyy', new Date())
      const now = new Date()

      if (Number.isNaN(dateFromObj.getTime())) {
        return helper.error('date.base', {
          key: 'dates',
          label: 'dates',
        })
      }

      if (Number.isNaN(dateToObj.getTime())) {
        return helper.error('date.base', {
          key: 'dates',
          label: 'dates',
        })
      }

      // Check dates are on or after 1 August 2025
      if (dateFromObj <= new Date('2025-07-31')) {
        return helper.error('date.past', {
          key: 'dates',
          label: 'dates',
        })
      }

      if (dateToObj <= new Date('2025-07-31')) {
        return helper.error('date.past', {
          key: 'dates',
          label: 'dates',
        })
      }

      // Check that no future dates are allowed
      if (dateFromObj > now) {
        return helper.error('date.future', {
          key: 'dates',
          label: 'dates',
        })
      }

      if (dateToObj > now) {
        return helper.error('date.future', {
          key: 'dates',
          label: 'dates',
        })
      }

      // Check if dateTo is after dateFrom
      if (dateToObj < dateFromObj) {
        return helper.error('date.order', {
          key: 'dates',
          label: 'dates',
        })
      }

      return true
    })
    .messages({
      'date.required': DateError.DATE_REQUIRED,
      'date.base': DateError.DATE_FORMAT,
      'date.past': DateError.DATE_PAST,
      'date.future': DateError.DATE_FUTURE,
      'date.order': DateError.DATE_ORDER,
    })
}
