import { Router } from 'express'
import GsrwReportingController from './gsrwReportingController'
import type { Services } from '../../services'
import getGsrwDashboardResolver from '../../middleware/resolvers/getGsrwDashboardResolver'
import auditEvent from '../../middleware/auditEvent'
import { EventName } from '../../services/auditService'

export default (router: Router, services: Services) => {
  const controller = new GsrwReportingController()
  router.get(
    '/gsrw',
    [
      auditEvent(services.auditService, EventName.VIEW_GSRW_REPORTING_PAGE),
      getGsrwDashboardResolver(services.prisonerSearchService, services.workProfileService),
    ],
    controller.get,
  )

  router.post('/gsrw', [auditEvent(services.auditService, EventName.SEARCH_GSRW_DATE_FILTER)], controller.post)
}
