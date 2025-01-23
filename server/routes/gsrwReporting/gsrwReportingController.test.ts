/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import GsrwReportingController from './gsrwReportingController'
import sortByArray from '../../utils/sortByArray'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import { setSessionData, getSessionData, validateFormSchema } from '../../utils'

jest.mock('../../utils', () => ({
  setSessionData: jest.fn(),
  getSessionData: jest.fn(),
  validateFormSchema: jest.fn(),
}))

jest.mock('../../utils/getLastFullMonthStartDate', () => jest.fn())
jest.mock('../../utils/getLastFullMonthEndDate', () => jest.fn())
jest.mock('../../utils/sortByArray', () => jest.fn())

describe('GsrwReportingController', () => {
  const { req, res, next } = expressMocks()

  req.context = {}

  const controller = new GsrwReportingController()

  describe('#get', () => {
    beforeEach(() => {
      res.render.mockReset()
      next.mockReset()
      ;(sortByArray as jest.Mock).mockImplementation(({ source }) => source)
      ;(getLastFullMonthStartDate as jest.Mock).mockReturnValue(new Date('2023-01-01'))
      ;(getLastFullMonthEndDate as jest.Mock).mockReturnValue(new Date('2023-01-31'))
    })

    it('renders the reporting page with correctly formatted data', async () => {
      req.query = { dateFrom: '01/01/2023', dateTo: '31/01/2023' }

      await controller.get(req, res, next)

      expect(setSessionData).toHaveBeenCalledWith(req, ['gsrwReporting', 'data'], expect.any(Object))
      expect(res.render).toHaveBeenCalledWith(
        'pages/gsrwReporting/index',
        expect.objectContaining({
          dateFrom: '01/01/2023',
          dateTo: '31/01/2023',
          dateFromDisplay: '1 January 2023',
          dateToDisplay: '31 January 2023',
        }),
      )
    })

    it('uses default dates if no dates are provided', async () => {
      req.query = {}

      await controller.get(req, res, next)

      expect(getLastFullMonthStartDate).toHaveBeenCalled()
      expect(getLastFullMonthEndDate).toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith(
        'pages/gsrwReporting/index',
        expect.objectContaining({
          dateFromDisplay: '1 January 2023',
          dateToDisplay: '31 January 2023',
        }),
      )
    })

    it('calls next with error if rendering fails', async () => {
      res.render.mockImplementation(() => {
        throw new Error('mock_error')
      })

      await controller.get(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('mock_error'))
    })
  })

  describe('#post', () => {
    beforeEach(() => {
      res.render.mockReset()
      res.redirect.mockReset()
      next.mockReset()
    })

    it('redirects to the correct URL when form validation passes', async () => {
      req.body = { dateFrom: '01/01/2023', dateTo: '31/01/2023' }
      ;(validateFormSchema as jest.Mock).mockReturnValue(null)

      await controller.post(req, res, next)

      expect(res.redirect).toHaveBeenCalledWith('/gsrw?dateTo=31/01/2023&dateFrom=01/01/2023')
    })

    it('renders the form with errors if validation fails', async () => {
      req.body = { dateFrom: 'invalid-date', dateTo: '31/01/2023' }
      ;(validateFormSchema as jest.Mock).mockReturnValue({ dateFrom: 'Invalid date' })
      ;(getSessionData as jest.Mock).mockReturnValue({ some: 'session data' })

      await controller.post(req, res, next)

      expect(res.render).toHaveBeenCalledWith('pages/gsrwReporting/index', {
        some: 'session data',
        errors: { dateFrom: 'Invalid date' },
        dateFrom: 'invalid-date',
        dateTo: '31/01/2023',
      })
    })

    it('calls next with error if posting fails', async () => {
      req.body = { dateFrom: '01/01/2023', dateTo: '31/01/2023' }
      ;(validateFormSchema as jest.Mock).mockImplementation(() => {
        throw new Error('mock_error')
      })

      await controller.post(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('mock_error'))
    })
  })
})
