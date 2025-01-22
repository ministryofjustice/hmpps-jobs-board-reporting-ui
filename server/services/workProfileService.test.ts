/* eslint-disable @typescript-eslint/no-explicit-any */
import WorkProfileService from './workProfileService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import WorkProfileApiClient from '../data/workProfileApi/workProfileApiClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/workProfileApi/workProfileApiClient')

describe('WorkProfileService', () => {
  let service: WorkProfileService
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let workProfileApiClientMock: jest.Mocked<WorkProfileApiClient>

  const mockUsername = 'mock_user'
  const mockToken = 'mock_token'
  const mockParams = {
    prisonId: 'MDI',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
  }

  beforeEach(() => {
    hmppsAuthClientMock = new HmppsAuthClient({} as any) as jest.Mocked<HmppsAuthClient>
    hmppsAuthClientMock.getSystemClientToken.mockResolvedValue(mockToken)

    service = new WorkProfileService(hmppsAuthClientMock)

    workProfileApiClientMock = new WorkProfileApiClient(mockToken) as jest.Mocked<WorkProfileApiClient>
    ;(WorkProfileApiClient as jest.Mock).mockImplementation(() => workProfileApiClientMock)
  })

  it('should fetch work profile summary', async () => {
    const mockResponse = { totalJobs: 15 }
    workProfileApiClientMock.getWorkProfileSummary.mockResolvedValue(mockResponse as any)

    const result = await service.getSummary(mockUsername, mockParams)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(WorkProfileApiClient).toHaveBeenCalledWith(mockToken)
    expect(workProfileApiClientMock.getWorkProfileSummary).toHaveBeenCalledWith(mockParams)
    expect(result).toEqual(mockResponse)
  })

  it('should fetch work status progress', async () => {
    const mockResponse = { workInProgress: 12 }
    workProfileApiClientMock.getWorkStatusProgress.mockResolvedValue(mockResponse as any)

    const result = await service.getWorkStatusProgress(mockUsername, mockParams)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(WorkProfileApiClient).toHaveBeenCalledWith(mockToken)
    expect(workProfileApiClientMock.getWorkStatusProgress).toHaveBeenCalledWith(mockParams)
    expect(result).toEqual(mockResponse)
  })

  it('should fetch support needed documents', async () => {
    const mockResponse = [{ documentType: 'BANK_ACCOUNT', numberOfPrisoners: 6 }]
    workProfileApiClientMock.getSupportNeededDocuments.mockResolvedValue(mockResponse as any)

    const result = await service.getSupportNeededDocuments(mockUsername, mockParams)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(WorkProfileApiClient).toHaveBeenCalledWith(mockToken)
    expect(workProfileApiClientMock.getSupportNeededDocuments).toHaveBeenCalledWith(mockParams)
    expect(result).toEqual(mockResponse)
  })

  it('should fetch support to work declined reasons', async () => {
    const mockResponse = [{ reason: 'NO_INTEREST', numberOfPrisoners: 5 }]
    workProfileApiClientMock.getSupportToWorkDeclinedReasons.mockResolvedValue(mockResponse as any)

    const result = await service.getSupportToWorkDeclinedReasons(mockUsername, mockParams)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(WorkProfileApiClient).toHaveBeenCalledWith(mockToken)
    expect(workProfileApiClientMock.getSupportToWorkDeclinedReasons).toHaveBeenCalledWith(mockParams)
    expect(result).toEqual(mockResponse)
  })
})
