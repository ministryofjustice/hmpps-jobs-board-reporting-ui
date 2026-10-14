import { Router } from 'express'
import Controller from './gsrwReportingController'
import getGsrwDashboardResolver from '../../middleware/resolvers/getGsrwDashboardResolver'
import auditEvent from '../../middleware/auditEvent'
import { EventName } from '../../services/auditService'
import { Services } from '../../services'
import routes from './index'

jest.mock('./gsrwReportingController')
jest.mock('../../middleware/resolvers/getGsrwDashboardResolver')
jest.mock('../../middleware/auditEvent')

describe('GSRW Reporting routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      auditService: {},
      prisonerSearchService: {},
      workProfileService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getGsrwDashboardResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(auditEvent as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route', () => {
    routes(router, services)

    expect(auditEvent).toHaveBeenCalledWith(services.auditService, EventName.VIEW_GSRW_REPORTING_PAGE)
    expect(router.get).toHaveBeenCalledWith(
      '/gsrw',
      [
        expect.any(Function), // auditEvent
        expect.any(Function), // getGsrwDashboardResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/gsrw',
      [expect.any(Function)], // auditEvent
      expect.any(Function), // controller.post
    )
  })
})
