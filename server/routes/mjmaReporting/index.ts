import { Router } from 'express'
import MjmaReportingController from './mjmaReportingController'
import type { Services } from '../../services'
import getJobDetailsResolver from '../../middleware/resolvers/getMjmaSummaryResolver'

export default (router: Router, services: Services) => {
  const controller = new MjmaReportingController()
  router.get('/', [getJobDetailsResolver(services.jobService)], controller.get)

  router.post('/', controller.post)
}
