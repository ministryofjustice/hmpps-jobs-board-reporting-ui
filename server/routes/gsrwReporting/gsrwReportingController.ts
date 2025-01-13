import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'

export default class GsrwReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }

    try {
      const data = {
        dateFrom,
        dateTo,
        dateFromDisplay: dateFrom
          ? format(parse(dateFrom, 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthStartDate(new Date()), 'd MMMM yyyy'),
        dateToDisplay: dateTo
          ? format(parse(dateTo, 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthEndDate(new Date()), 'd MMMM yyyy'),
      }

      setSessionData(req, ['gsrwReporting', 'data'], data)

      res.render('pages/gsrwReporting/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['gsrwReporting', 'data']) as object
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/gsrwReporting/index', {
          ...data,
          errors,
          dateFrom,
          dateTo,
        })
        return
      }

      const uri = [dateTo && `dateTo=${dateTo}`, dateFrom && `dateFrom=${dateFrom}`].filter(val => !!val)

      res.redirect(uri.length ? `/gsrw?${uri.join('&')}` : '/gsrw')
    } catch (err) {
      logger.error('Error posting form - gsrw Reporting')
      next(err)
    }
  }
}
