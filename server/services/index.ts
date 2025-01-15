import { dataAccess } from '../data'
import AuditService from './auditService'
import ComponentService from './componentService'
import JobService from './jobService'
import PrisonerSearchService from './prisonerSearchService'
import UserService from './userService'
import WorkProfileService from './workProfileService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const jobService = new JobService(hmppsAuthClient)
  const workProfileService = new WorkProfileService(hmppsAuthClient)
  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)
  const userService = new UserService(hmppsAuthClient)
  const componentService = new ComponentService()

  return {
    applicationInfo,
    auditService,
    componentService,
    jobService,
    workProfileService,
    prisonerSearchService,
    userService,
  }
}

export type Services = ReturnType<typeof services>
