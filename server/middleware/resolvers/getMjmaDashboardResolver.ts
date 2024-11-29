import type { RequestHandler } from 'express'

// import JobService from '../../services/jobService'
import { format, parse } from 'date-fns'
import logger from '../../../logger'
import JobService from '../../services/jobService'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'

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
      if (dateFrom && dateTo) {
        dateFromParam = format(parse(dateFrom, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
        dateToParam = format(parse(dateTo, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
      } else {
        dateFromParam = format(getLastFullMonthStartDate(new Date()), 'yyyy-MM-dd')
        dateToParam = format(getLastFullMonthEndDate(new Date()), 'yyyy-MM-dd')
      }

      // Get dashboard data
      const [summary, totalApplicationsByStage, latestApplicationsByStage] = await Promise.all([
        jobService.getSummary(username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }),
        jobService.getTotalApplicationsByStage(username, {
          prisonId: userActiveCaseLoad.caseLoadId,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }),
        jobService.getLatestApplicationsByStage(username, {
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
