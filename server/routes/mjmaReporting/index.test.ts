import { Router } from 'express'
import Controller from './mjmaReportingController'
import getMjmaSummaryResolver from '../../middleware/resolvers/getMjmaSummaryResolver'
import { Services } from '../../services'
import routes from './index'

jest.mock('./mjmaReportingController')
jest.mock('../../middleware/resolvers/getMjmaSummaryResolver')

describe('MJMA Reporting routes', () => {
  let router: Router
  let services: Services

  beforeEach(() => {
    router = { get: jest.fn(), post: jest.fn() } as unknown as Router
    services = {
      prisonerSearchService: {},
      userService: {},
    } as unknown as Services
    ;(Controller as jest.Mock).mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
    }))
    ;(getMjmaSummaryResolver as jest.Mock).mockImplementation(() => jest.fn())
  })

  it('should register GET route', () => {
    routes(router, services)

    expect(router.get).toHaveBeenCalledWith(
      '/',
      [
        expect.any(Function), // getMjmaSummaryResolver
      ],
      expect.any(Function), // controller.get
    )
  })

  it('should register POST route', () => {
    routes(router, services)

    expect(router.post).toHaveBeenCalledWith(
      '/',
      expect.any(Function), // controller.post
    )
  })
})
