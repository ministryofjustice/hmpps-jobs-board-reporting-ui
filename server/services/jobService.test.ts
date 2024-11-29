/* eslint-disable @typescript-eslint/no-explicit-any */
import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApiClient from '../data/jobApi/jobApiClient'
import JobService from './jobService'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/jobApi/jobApiClient')

describe('JobService', () => {
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>
  let jobService: JobService

  beforeEach(() => {
    hmppsAuthClient = new HmppsAuthClient({} as any) as jest.Mocked<HmppsAuthClient>
    ;(HmppsAuthClient as any).mockImplementation(() => hmppsAuthClient)

    jobService = new JobService(hmppsAuthClient)
  })

  describe('getSummary', () => {
    it('fetches a system token and retrieves job summary successfully', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }
      const mockSummary = { jobCount: 10, totalHoursWorked: 50 }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getJobSummary = jest.fn().mockResolvedValue(mockSummary)

      const result = await jobService.getSummary(username, params)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getJobSummary).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockSummary)
    })

    it('throws an error if API client fails to fetch the job summary', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const error = new Error('Failed to fetch job summary')
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getJobSummary = jest.fn().mockRejectedValue(error)

      await expect(jobService.getSummary(username, params)).rejects.toThrowError(error)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getJobSummary).toHaveBeenCalledWith(params)
    })
  })

  describe('getTotalApplicationsByStage', () => {
    it('fetches a system token and retrieves application totals successfully', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }
      const mockSummary = { jobCount: 10, totalHoursWorked: 50 }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getTotalApplicationsByStage = jest.fn().mockResolvedValue(mockSummary)

      const result = await jobService.getTotalApplicationsByStage(username, params)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getTotalApplicationsByStage).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockSummary)
    })

    it('throws an error if API client fails to fetch the application totals', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const error = new Error('Failed to fetch application totals')
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getTotalApplicationsByStage = jest.fn().mockRejectedValue(error)

      await expect(jobService.getTotalApplicationsByStage(username, params)).rejects.toThrowError(error)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getTotalApplicationsByStage).toHaveBeenCalledWith(params)
    })
  })

  describe('getLatestApplicationsByStage', () => {
    it('fetches a system token and retrieves application totals successfully', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }
      const mockSummary = { jobCount: 10, totalHoursWorked: 50 }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getLatestApplicationsByStage = jest.fn().mockResolvedValue(mockSummary)

      const result = await jobService.getLatestApplicationsByStage(username, params)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getLatestApplicationsByStage).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockSummary)
    })

    it('throws an error if API client fails to fetch the application totals', async () => {
      const username = 'mock_username'
      const systemToken = 'mock_system_token'
      const error = new Error('Failed to fetch application totals')
      const params = {
        prisonId: 'MDI',
        dateFrom: '2024-01-01',
        dateTo: '2024-01-31',
      }

      hmppsAuthClient.getSystemClientToken.mockResolvedValue(systemToken)
      JobApiClient.prototype.getLatestApplicationsByStage = jest.fn().mockRejectedValue(error)

      await expect(jobService.getLatestApplicationsByStage(username, params)).rejects.toThrowError(error)

      expect(hmppsAuthClient.getSystemClientToken).toHaveBeenCalledWith(username)
      expect(JobApiClient).toHaveBeenCalledWith(systemToken)
      expect(JobApiClient.prototype.getLatestApplicationsByStage).toHaveBeenCalledWith(params)
    })
  })
})
