import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { deleteSessionData, getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import ApplicationsByStageResult from '../../data/jobApi/interfaces/applicationsByStageResult'
import contentLookup from '../../constants/contentLookup'
import applicationOrder from '../../constants/applicationOrder'

export default class MjmaReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const { summary, totalApplicationsByStage, latestApplicationsByStage } = req.context

    try {
      const totalApplicationsByStageSorted: ApplicationsByStageResult[] = applicationOrder.map(
        status =>
          totalApplicationsByStage.find((item: ApplicationsByStageResult) => item.applicationStatus === status) ?? {
            applicationStatus: status,
            numberOfApplications: 0,
          },
      )

      const latestApplicationsByStageSorted: ApplicationsByStageResult[] = applicationOrder.map(
        status =>
          latestApplicationsByStage.find((item: ApplicationsByStageResult) => item.applicationStatus === status) ?? {
            applicationStatus: status,
            numberOfApplications: 0,
          },
      )

      // Persist date range from the gsrw tab if necessary
      const sessionData = getSessionData(req, ['gsrwReporting', 'data']) as {
        dateFrom?: string
        dateTo: string
      }

      // Use query values if provided, otherwise fall back to session stored in the previous tab
      const filterDateFrom = typeof dateFrom === 'string' && dateFrom.trim() !== '' ? dateFrom : sessionData?.dateFrom

      const filterDateTo = typeof dateTo === 'string' && dateTo.trim() !== '' ? dateTo : sessionData?.dateTo

      const data = {
        dateFrom: filterDateFrom,
        dateTo: filterDateTo,
        dateFromDisplay: filterDateFrom
          ? format(parse(filterDateFrom, 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthStartDate(new Date()), 'd MMMM yyyy'),
        dateToDisplay: filterDateTo
          ? format(parse(filterDateTo, 'dd/MM/yyyy', new Date()), 'd MMMM yyyy')
          : format(getLastFullMonthEndDate(new Date()), 'd MMMM yyyy'),
        summary,
        totalApplicationsByStage: totalApplicationsByStageSorted.map((entry: ApplicationsByStageResult) => ({
          applicationStatus: contentLookup.applicationStatus[entry.applicationStatus],
          numberOfApplications: entry.numberOfApplications,
        })),
        latestApplicationsByStage: latestApplicationsByStageSorted.map((entry: ApplicationsByStageResult) => ({
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

      // New query, refresh previous (if any) gswr cache
      if (req.session.data.gsrwReporting_data) {
        deleteSessionData(req, ['gsrwReporting', 'data'])
      }

      const uri = [dateTo && `dateTo=${dateTo}`, dateFrom && `dateFrom=${dateFrom}`].filter(val => !!val)

      res.redirect(uri.length ? `/?${uri.join('&')}` : '/')
    } catch (err) {
      logger.error('Error posting form - MJMA Reporting')
      next(err)
    }
  }
}
