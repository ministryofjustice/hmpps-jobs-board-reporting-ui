import type { RequestHandler } from 'express'

// import JobService from '../../services/jobService'
import { format, parse } from 'date-fns'
import logger from '../../../logger'
import JobService from '../../services/jobService'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import getMjmaSummary from './utils/getMjmaSummary'
import getTotalApplicationsByStage from './utils/getTotalApplicationsByStage'
import getLatestApplicationsByStage from './utils/getLatestApplicationsByStage'
import { getSessionData } from '../../utils'

const getMjmaDashboardResolver =
  (jobService: JobService): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { username } = res.locals.user
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }
    const { userActiveCaseLoad } = res.locals

    try {
      // format date params
      let dateFromParam
      let dateToParam

      // Check if date range was stored in session object
      const sessionData = getSessionData(req, ['gsrwReporting', 'data']) as {
        dateFrom?: string
        dateTo?: string
      }

      // Use query values if provided, otherwise fall back to session
      dateFromParam = typeof dateFrom === 'string' && dateFrom.trim() !== '' ? dateFrom : sessionData?.dateFrom

      dateToParam = typeof dateTo === 'string' && dateTo.trim() !== '' ? dateTo : sessionData?.dateTo

      if (dateFromParam && dateToParam) {
        dateFromParam = format(parse(dateFromParam, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
        dateToParam = format(parse(dateToParam, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
      } else {
        dateFromParam = format(getLastFullMonthStartDate(new Date()), 'yyyy-MM-dd')
        dateToParam = format(getLastFullMonthEndDate(new Date()), 'yyyy-MM-dd')
      }

      // Get dashboard data
      const [summary, totalApplicationsByStage, latestApplicationsByStage] = await Promise.all([
        getMjmaSummary(jobService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }),
        getTotalApplicationsByStage(jobService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }),
        getLatestApplicationsByStage(jobService, username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }),
      ])

      req.context.summary = summary
      req.context.totalApplicationsByStage = totalApplicationsByStage
      req.context.latestApplicationsByStage = latestApplicationsByStage

      next()
    } catch (err) {
      logger.error('Error getting data - MJMA dashboard data')
      next(err)
    }
  }

export default getMjmaDashboardResolver
