import { Router } from 'express'
import GsrwReportingController from './gsrwReportingController'
import type { Services } from '../../services'
import getGsrwDashboardResolver from '../../middleware/resolvers/getGsrwDashboardResolver'
import auditPageView from '../../middleware/auditPageView'
import { Page } from '../../services/auditService'

export default (router: Router, services: Services) => {
  const controller = new GsrwReportingController()
  router.get(
    '/gsrw',
    [
      auditPageView(services.auditService, Page.GSRW_REPORTING_PAGE),
      getGsrwDashboardResolver(services.prisonerSearchService, services.workProfileService),
    ],
    controller.get,
  )

  router.post('/gsrw', controller.post)
}
