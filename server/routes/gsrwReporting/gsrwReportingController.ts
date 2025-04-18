import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import sortByArray from '../../utils/sortByArray'
import workStatusProgressOrder from '../../constants/workStatusProgressOrder'
import supportNeededDocumentsOrder from '../../constants/supportNeededDocumentsOrder'
import supportToWorkDeclinedReasonsOrder from '../../constants/supportToWorkDeclinedReasonOrder'

export default class GsrwReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const {
      numberOfPrisonersAll = 0,
      numberOfPrisonersWithin12Weeks = 0,
      numberOfPrisonersOver12Weeks = 0,
      summary,
      workStatusProgress,
      supportNeededDocuments,
      supportToWorkDeclinedReasons,
    } = req.context

    const workStatusProgressSorted = sortByArray({
      source: workStatusProgress?.statusCounts,
      by: workStatusProgressOrder,
      sourceTransformer: (item: { profileStatus: string }) => item.profileStatus,
    })

    const supportNeededDocumentsSorted = sortByArray({
      source: supportNeededDocuments,
      by: supportNeededDocumentsOrder,
      sourceTransformer: (item: { actionTodo: string }) => item.actionTodo,
    })

    const supportToWorkDeclinedReasonsSorted = sortByArray({
      source: supportToWorkDeclinedReasons,
      by: supportToWorkDeclinedReasonsOrder,
      sourceTransformer: (item: { supportToWorkDeclinedReason: string }) => item.supportToWorkDeclinedReason,
    })

    const statusCountWithin12Weeks = workStatusProgress?.statusCounts?.reduce(
      (sum: number, status: { numberOfPrisonersWithin12Weeks: number }) => sum + status.numberOfPrisonersWithin12Weeks,
      0,
    )

    const statusCountOver12Weeks = workStatusProgress?.statusCounts?.reduce(
      (sum: number, status: { numberOfPrisonersOver12Weeks: number }) => sum + status.numberOfPrisonersOver12Weeks,
      0,
    )

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
        numberOfPrisonersAll,
        numberOfPrisonersWithin12Weeks,
        numberOfPrisonersOver12Weeks,
        summary,
        numberOfPrisonersStatusChange: workStatusProgress?.numberOfPrisonersStatusChange,
        notStartedCountWithin12Weeks:
          numberOfPrisonersWithin12Weeks - statusCountWithin12Weeks < 0
            ? 0
            : numberOfPrisonersWithin12Weeks - statusCountWithin12Weeks,
        notStartedCountOver12Weeks:
          numberOfPrisonersOver12Weeks - statusCountOver12Weeks < 0
            ? 0
            : numberOfPrisonersOver12Weeks - statusCountOver12Weeks,
        workStatusProgress: workStatusProgressSorted,
        supportNeededDocuments: supportNeededDocumentsSorted,
        supportToWorkDeclinedReasons: supportToWorkDeclinedReasonsSorted,
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
