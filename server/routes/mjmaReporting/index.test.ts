import { Router } from 'express'
import Controller from './mjmaReportingController'
import getMjmaDashboardResolver from '../../middleware/resolvers/getMjmaDashboardResolver'
import auditEvent from '../../middleware/auditEvent'
import { EventName } from '../../services/auditService'
import { Services } from '../../services'
import routes from './index'

jest.mock('./mjmaReportingController')
jest.mock('../../middleware/resolvers/getMjmaDashboardResolver')
jest.mock('../../middleware/auditEvent')

describe('MJMA Reporting routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      auditService: {},
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getMjmaDashboardResolver as jest.Mock).mockImplementation(() => jest.fn())
    ;(auditEvent as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route', () => {
    routes(router, services)

    expect(auditEvent).toHaveBeenCalledWith(services.auditService, EventName.VIEW_MJMA_REPORTING_PAGE)
    expect(router.get).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // auditEvent
        expect.any(Function), // getMjmaDashboardResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/',
      [expect.any(Function)], // auditEvent
      expect.any(Function), // controller.post
    )
  })
})
