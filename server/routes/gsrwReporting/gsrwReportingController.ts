import { RequestHandler } from 'express'
import { format, parse } from 'date-fns'
import { deleteSessionData, getSessionData, setSessionData, validateFormSchema } from '../../utils'
import validationSchema from './validationSchema'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
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
      supportNeededDocuments = [],
      supportToWorkDeclinedReasons = [],
    } = req.context

    const workStatusProgressSorted = workStatusProgressOrder.map(
      status =>
        workStatusProgress?.statusCounts.find((item: { profileStatus: string }) => item.profileStatus === status) ?? {
          profileStatus: status,
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
    )

    const supportNeededDocumentsSorted = supportNeededDocumentsOrder.map(
      action =>
        supportNeededDocuments.find((item: { actionTodo: string }) => item.actionTodo === action) ?? {
          actionTodo: action,
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
    )

    const supportToWorkDeclinedReasonsSorted = supportToWorkDeclinedReasonsOrder.map(
      reason =>
        supportToWorkDeclinedReasons.find(
          (item: { supportToWorkDeclinedReason: string }) => item.supportToWorkDeclinedReason === reason,
        ) ?? {
          supportToWorkDeclinedReason: reason,
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
    )

    try {
      // Persist date range from the mjma tab if necessary
      const sessionData = getSessionData(req, ['mjmaReporting', 'data']) as {
        dateFrom?: string
        dateTo?: string
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
        numberOfPrisonersAll,
        numberOfPrisonersWithin12Weeks,
        numberOfPrisonersOver12Weeks,
        summary,
        numberOfPrisonersStatusChange: workStatusProgress?.numberOfPrisonersStatusChange,
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

      // New query, refresh previous (if any) mjma cache
      if (req.session.data.mjmaReporting_data) {
        deleteSessionData(req, ['mjmaReporting', 'data'])
      }
      const uri = [dateTo && `dateTo=${dateTo}`, dateFrom && `dateFrom=${dateFrom}`].filter(val => !!val)

      res.redirect(uri.length ? `/gsrw?${uri.join('&')}` : '/gsrw')
    } catch (err) {
      logger.error('Error posting form - gsrw Reporting')
      next(err)
    }
  }
}
