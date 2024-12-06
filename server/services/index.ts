import { dataAccess } from '../data'
import AuditService from './auditService'
import ComponentService from './componentService'
import JobService from './jobService'
import UserService from './userService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const jobService = new JobService(hmppsAuthClient)
  const userService = new UserService(hmppsAuthClient)
  const componentService = new ComponentService()

  return {
    applicationInfo,
    auditService,
    componentService,
    jobService,
    userService,
  }
}

export type Services = ReturnType<typeof services>
