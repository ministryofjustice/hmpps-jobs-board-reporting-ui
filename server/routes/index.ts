import { Router } from 'express'

import type { Services } from '../services'
import gsrwReportingRoutes from './gsrwReporting'
import mjmaReportingRoutes from './mjmaReporting'

export default function routes(services: Services): Router {
  const router = Router()

  // Get Someone ready for work reporting
  gsrwReportingRoutes(router, services)

  // Match jobs and Manage applications reporting
  mjmaReportingRoutes(router, services)

  return router
}
