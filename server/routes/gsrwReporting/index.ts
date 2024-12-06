import { Router } from 'express'
import GsrwReportingController from './gsrwReportingController'
import type { Services } from '../../services'

export default (router: Router, _: Services) => {
  const controller = new GsrwReportingController()
  router.get('/gsrw', controller.get)
}
