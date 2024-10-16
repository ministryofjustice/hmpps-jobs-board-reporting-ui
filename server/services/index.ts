import { dataAccess } from '../data'
import AuditService from './auditService'
import ComponentService from './componentService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const componentService = new ComponentService()

  return {
    applicationInfo,
    auditService,
    componentService,
  }
}

export type Services = ReturnType<typeof services>
