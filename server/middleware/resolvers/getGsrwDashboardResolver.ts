import type { RequestHandler } from 'express'

import { addWeeks, format, parse } from 'date-fns'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import PrisonerSearchService from '../../services/prisonerSearchService'
import WorkProfileService from '../../services/workProfileService'
import getGsrwSummary from './utils/getGsrwSummary'
import getWorkStatusProgress from './utils/getWorkStatusProgress'
import getSupportNeededDocuments from './utils/getSupportNeededDocuments'
import getSupportToWorkDeclinedReasons from './utils/getSupportToWorkDeclinedReasons'
import { getSessionData } from '../../utils'

const getGsrwDashboardResolver =
  (prisonerSearchService: PrisonerSearchService, workProfileService: WorkProfileService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const { userActiveCaseLoad } = res.locals

    try {
      // Check if date range was stored in session object
      const sessionData = getSessionData(req, ['mjmaReporting', 'data']) as {
        dateFrom?: string
        dateTo?: string
      }

      // Use query values if provided, otherwise fall back to session
      const dateFromParam = typeof dateFrom === 'string' && dateFrom.trim() !== '' ? dateFrom : sessionData?.dateFrom
      const dateToParam = typeof dateTo === 'string' && dateTo.trim() !== '' ? dateTo : sessionData?.dateTo

      // parse date params
      const dateFromDt =
        dateFromParam && dateToParam
          ? parse(dateFromParam, 'dd/MM/yyyy', new Date())
          : getLastFullMonthStartDate(new Date())
      const dateToDt =
        dateFromParam && dateToParam
          ? parse(dateToParam, 'dd/MM/yyyy', new Date())
          : getLastFullMonthEndDate(new Date())

      // Calculate and format date params
      const latestReleaseDate = format(addWeeks(dateToDt, 12), 'yyyy-MM-dd')
      const latestReleaseDateAll = format(addWeeks(dateToDt, 5200), 'yyyy-MM-dd')
      const dateFromFormatted = format(dateFromDt, 'yyyy-MM-dd')
      const dateToFormatted = format(dateToDt, 'yyyy-MM-dd')

      // Get dashboard data
      const [
        numberOfPrisonersWithin12Weeks = 0,
        numberOfPrisonersAll = 0,
        summary,
        workStatusProgress,
        supportNeededDocuments,
        supportToWorkDeclinedReasons,
      ] = await Promise.all([
        prisonerSearchService.getPrisonersByReleaseDateCount(username, {
          prisonIds: [userActiveCaseLoad.caseLoadId],
          earliestReleaseDate: dateFromFormatted,
          latestReleaseDate,
        }),
        prisonerSearchService.getPrisonersByReleaseDateCount(username, {
          prisonIds: [userActiveCaseLoad.caseLoadId],
          earliestReleaseDate: dateFromFormatted,
          latestReleaseDate: latestReleaseDateAll,
        }),
        getGsrwSummary(workProfileService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromFormatted,
          dateTo: dateToFormatted,
        }),
        getWorkStatusProgress(workProfileService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromFormatted,
          dateTo: dateToFormatted,
        }),
        getSupportNeededDocuments(workProfileService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromFormatted,
          dateTo: dateToFormatted,
        }),
        getSupportToWorkDeclinedReasons(workProfileService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromFormatted,
          dateTo: dateToFormatted,
        }),
      ])

      req.context.numberOfPrisonersWithin12Weeks = numberOfPrisonersWithin12Weeks
      req.context.numberOfPrisonersOver12Weeks = numberOfPrisonersAll - numberOfPrisonersWithin12Weeks
      req.context.numberOfPrisonersAll = numberOfPrisonersAll
      req.context.summary = summary
      req.context.workStatusProgress = workStatusProgress
      req.context.supportNeededDocuments = supportNeededDocuments
      req.context.supportToWorkDeclinedReasons = supportToWorkDeclinedReasons

      next()
    } catch (err) {
      logger.error('Error getting data - GSRW dashboard data')
      next(err)
    }
  }

export default getGsrwDashboardResolver
