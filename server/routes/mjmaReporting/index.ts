import { Router } from 'express'
import MjmaReportingController from './mjmaReportingController'
import type { Services } from '../../services'
import getMjmaDashboardResolver from '../../middleware/resolvers/getMjmaDashboardResolver'

export default (router: Router, services: Services) => {
  const controller = new MjmaReportingController()
  router.get('/', [getMjmaDashboardResolver(services.jobService)], controller.get)

  router.post('/', controller.post)
}
