/* eslint-disable @typescript-eslint/no-explicit-any */
import PrisonerSearchService from './prisonerSearchService'
import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchApiClient from '../data/prisonerSearchApi/prisonerSearchApiClient'

jest.mock('../data/hmppsAuthClient')
jest.mock('../data/prisonerSearchApi/prisonerSearchApiClient')

describe('PrisonerSearchService', () => {
  let service: PrisonerSearchService
  let hmppsAuthClientMock: jest.Mocked<HmppsAuthClient>
  let prisonerSearchApiClientMock: jest.Mocked<PrisonerSearchApiClient>

  const mockUsername = 'mock_user'
  const mockToken = 'mock_token'
  const mockParams = {
    earliestReleaseDate: '2024-01-01',
    latestReleaseDate: '2024-01-31',
    prisonIds: ['MDI', 'LEI'],
  }
  const mockResponse = { count: 42 }

  beforeEach(() => {
    // Mock HmppsAuthClient
    hmppsAuthClientMock = new HmppsAuthClient({} as any) as jest.Mocked<HmppsAuthClient>
    hmppsAuthClientMock.getSystemClientToken.mockResolvedValue(mockToken)

    // Initialize PrisonerSearchService
    service = new PrisonerSearchService(hmppsAuthClientMock)

    // Mock PrisonerSearchApiClient
    prisonerSearchApiClientMock = new PrisonerSearchApiClient(mockToken) as jest.Mocked<PrisonerSearchApiClient>
    ;(PrisonerSearchApiClient as jest.Mock).mockImplementation(() => prisonerSearchApiClientMock)
  })

  it('should fetch prisoners by release date count', async () => {
    prisonerSearchApiClientMock.getPrisonersByReleaseDateCount.mockResolvedValue(mockResponse as any)

    const result = await service.getPrisonersByReleaseDateCount(mockUsername, mockParams)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(PrisonerSearchApiClient).toHaveBeenCalledWith(mockToken)
    expect(prisonerSearchApiClientMock.getPrisonersByReleaseDateCount).toHaveBeenCalledWith(
      mockParams.earliestReleaseDate,
      mockParams.latestReleaseDate,
      mockParams.prisonIds,
    )
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error if API call fails', async () => {
    const mockError = new Error('API call failed')
    prisonerSearchApiClientMock.getPrisonersByReleaseDateCount.mockRejectedValue(mockError)

    await expect(service.getPrisonersByReleaseDateCount(mockUsername, mockParams)).rejects.toThrow(mockError)

    expect(hmppsAuthClientMock.getSystemClientToken).toHaveBeenCalledWith(mockUsername)
    expect(PrisonerSearchApiClient).toHaveBeenCalledWith(mockToken)
    expect(prisonerSearchApiClientMock.getPrisonersByReleaseDateCount).toHaveBeenCalledWith(
      mockParams.earliestReleaseDate,
      mockParams.latestReleaseDate,
      mockParams.prisonIds,
    )
  })
})
