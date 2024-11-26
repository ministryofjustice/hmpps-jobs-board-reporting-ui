import { Router } from 'express'
import MjmaReportingController from './mjmaReportingController'
import type { Services } from '../../services'

export default (router: Router, _: Services) => {
  const controller = new MjmaReportingController()
  router.get('/', controller.get)

  router.post('/', controller.post)
}
