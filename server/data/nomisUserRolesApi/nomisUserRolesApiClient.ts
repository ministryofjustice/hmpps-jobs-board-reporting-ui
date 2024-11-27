/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import RestClient from '../restClient'
import { UserActiveCaseLoadResponse } from './interfaces/userActiveCaseLoadResponse'

export default class NomisUserRolesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Nomis User Roles API', config.apis.nomisUserRolesApi, token)
  }

  async getUserActiveCaseLoad() {
    return this.restClient.get<UserActiveCaseLoadResponse>({ path: `/me/caseloads` })
  }
}
