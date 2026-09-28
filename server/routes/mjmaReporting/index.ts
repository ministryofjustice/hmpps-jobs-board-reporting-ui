import { Router } from 'express'
import MjmaReportingController from './mjmaReportingController'
import type { Services } from '../../services'
import getMjmaDashboardResolver from '../../middleware/resolvers/getMjmaDashboardResolver'
import auditPageView from '../../middleware/auditPageView'
import { Page } from '../../services/auditService'

export default (router: Router, services: Services) => {
  const controller = new MjmaReportingController()
  router.get(
    '/',
    [auditPageView(services.auditService, Page.MJMA_REPORTING_PAGE), getMjmaDashboardResolver(services.jobService)],
    controller.get,
  )

  router.post('/', controller.post)
}
