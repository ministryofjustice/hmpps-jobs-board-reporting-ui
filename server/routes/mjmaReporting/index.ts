import { Router } from 'express'
import MjmaReportingController from './mjmaReportingController'
import type { Services } from '../../services'
import getMjmaDashboardResolver from '../../middleware/resolvers/getMjmaDashboardResolver'
import auditEvent from '../../middleware/auditEvent'
import { EventName } from '../../services/auditService'

export default (router: Router, services: Services) => {
  const controller = new MjmaReportingController()
  router.get(
    '/',
    [
      auditEvent(services.auditService, EventName.VIEW_MJMA_REPORTING_PAGE),
      getMjmaDashboardResolver(services.jobService),
    ],
    controller.get,
  )

  router.post('/', [auditEvent(services.auditService, EventName.SEARCH_MJMA_DATE_FILTER)], controller.post)
}
