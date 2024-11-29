import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import ApplicationsByStageResult from '../../data/jobApi/interfaces/applicationsByStageResult'
import contentLookup from '../../constants/contentLookup'

export default class MjmaReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const { summary, totalApplicationsByStage, latestApplicationsByStage } = req.context

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
        summary,
        totalApplicationsByStage: totalApplicationsByStage.map((entry: ApplicationsByStageResult) => ({
          applicationStatus: contentLookup.applicationStatus[entry.applicationStatus],
          numberOfApplications: entry.numberOfApplications,
        })),
        latestApplicationsByStage: latestApplicationsByStage.map((entry: ApplicationsByStageResult) => ({
          applicationStatus: contentLookup.applicationStatus[entry.applicationStatus],
          numberOfApplications: entry.numberOfApplications,
        })),
      }

      setSessionData(req, ['mjmaReporting', 'data'], data)

      res.render('pages/mjmaReporting/index', { ...data })
    } catch (err) {
      next(err)
    }
  }

  public post: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.body

    try {
      // If validation errors render errors
      const data = getSessionData(req, ['mjmaReporting', 'data']) as object
      const errors = validateFormSchema(req, validationSchema())

      if (errors) {
        res.render('pages/mjmaReporting/index', {
          ...data,
          errors,
          dateFrom,
          dateTo,
        })
        return
      }

      const uri = [dateTo && `dateTo=${dateTo}`, dateFrom && `dateFrom=${dateFrom}`].filter(val => !!val)

      res.redirect(uri.length ? `/?${uri.join('&')}` : '/')
    } catch (err) {
      logger.error('Error posting form - MJMA Reporting')
      next(err)
    }
  }
}
