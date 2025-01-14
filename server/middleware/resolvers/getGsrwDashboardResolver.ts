import type { RequestHandler } from 'express'

// import JobService from '../../services/jobService'
import { addWeeks, format, parse } from 'date-fns'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import PrisonerSearchService from '../../services/prisonerSearchService'

const getMjmaDashboardResolver =
  (prisonerSearchService: PrisonerSearchService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const { userActiveCaseLoad } = res.locals

    try {
      // parse date params
      const dateFromDt =
        dateFrom && dateTo ? parse(dateFrom, 'dd/MM/yyyy', new Date()) : getLastFullMonthStartDate(new Date())
      const dateToDt =
        dateFrom && dateTo ? parse(dateTo, 'dd/MM/yyyy', new Date()) : getLastFullMonthEndDate(new Date())

      // Calculate latest release date
      const latestReleaseDate = addWeeks(dateToDt, 12)

      // Get dashboard data
      const [numberOfPrisoners] = await Promise.all([
        prisonerSearchService.getPrisonersByReleaseDateCount(username, {
          prisonIds: [userActiveCaseLoad.caseLoadId],
          earliestReleaseDate: format(dateFromDt, 'yyyy-MM-dd'),
          latestReleaseDate: format(latestReleaseDate, 'yyyy-MM-dd'),
        }),
      ])

      req.context.numberOfPrisoners = numberOfPrisoners || 0

      next()
    } catch (err) {
      logger.error('Error getting data - MJMA dashboard data')
      next(err)
    }
  }

export default getMjmaDashboardResolver
