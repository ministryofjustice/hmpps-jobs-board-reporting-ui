import { Router } from 'express'
import GsrwReportingController from './gsrwReportingController'
import type { Services } from '../../services'
import getGsrwDashboardResolver from '../../middleware/resolvers/getGsrwDashboardResolver'

export default (router: Router, services: Services) => {
  const controller = new GsrwReportingController()
  router.get('/gsrw', [getGsrwDashboardResolver(services.prisonerSearchService)], controller.get)

  router.post('/gsrw', controller.post)
}
