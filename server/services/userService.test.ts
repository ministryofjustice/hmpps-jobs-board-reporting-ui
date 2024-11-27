/* eslint-disable @typescript-eslint/no-explicit-any */
import type HmppsAuthClient from '../data/hmppsAuthClient'
import NomisUserRolesApiClient from '../data/nomisUserRolesApi/nomisUserRolesApiClient'
import UserService, { UserActiveCaseLoad } from './userService'

jest.mock('../data/nomisUserRolesApi/nomisUserRolesApiClient')

describe('UserService', () => {
  let userService: UserService
  let hmppsAuthClient: jest.Mocked<HmppsAuthClient>

  beforeEach(() => {
    hmppsAuthClient = {} as jest.Mocked<HmppsAuthClient> // Mock the HmppsAuthClient (not directly used in this method)
    userService = new UserService(hmppsAuthClient)
  })

  describe('getUserActiveCaseLoad', () => {
    it('returns the active case load with correct structure', async () => {
      const token = 'mock_token'
      const mockActiveCaseLoadResponse = {
        activeCaseload: {
          id: 'MDI',
          name: 'Moorland',
        },
      }
      NomisUserRolesApiClient.prototype.getUserActiveCaseLoad = jest.fn().mockResolvedValue(mockActiveCaseLoadResponse)

      const result = await userService.getUserActiveCaseLoad(token)

      expect(NomisUserRolesApiClient).toHaveBeenCalledWith(token)
      expect(NomisUserRolesApiClient.prototype.getUserActiveCaseLoad).toHaveBeenCalledTimes(1)
      expect(result).toEqual<UserActiveCaseLoad>({
        caseLoadId: 'MDI',
        description: 'Moorland',
      })
    })

    it('throws an error if getUserActiveCaseLoad fails', async () => {
      const token = 'mock_token'
      const error = new Error('Failed to fetch user active case load')

      NomisUserRolesApiClient.prototype.getUserActiveCaseLoad = jest.fn().mockRejectedValue(error)

      await expect(userService.getUserActiveCaseLoad(token)).rejects.toThrowError(error)

      expect(NomisUserRolesApiClient).toHaveBeenCalledWith(token)
      expect(NomisUserRolesApiClient.prototype.getUserActiveCaseLoad).toHaveBeenCalledTimes(1)
    })
  })
})
