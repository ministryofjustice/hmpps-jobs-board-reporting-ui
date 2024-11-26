import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'

export default class MjmaReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { fromDate, toDate } = req.query

    try {
      const data = {
        fromDate,
        toDate,
        fromDateDisplay: fromDate
          ? format(parse(fromDate.toString(), 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthStartDate(new Date()), 'd MMMM yyyy'),
        toDateDisplay: toDate
          ? format(parse(toDate.toString(), 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthEndDate(new Date()), 'd MMMM yyyy'),
      }

      setSessionData(req, ['mjmaReporting', 'data'], data)

      res.render('pages/mjmaReporting/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { fromDate, toDate } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['mjmaReporting', 'data']) as object
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/mjmaReporting/index', {
          ...data,
          errors,
          fromDate,
          toDate,
        })
        return
      }

      const uri = [toDate && `toDate=${toDate}`, fromDate && `fromDate=${fromDate}`].filter(val => !!val)

      res.redirect(uri.length ? `/?${uri.join('&')}` : '/')
    } catch (err) {
      logger.error('Error posting form - MJMA Reporting')
      next(err)
    }
  }
}
