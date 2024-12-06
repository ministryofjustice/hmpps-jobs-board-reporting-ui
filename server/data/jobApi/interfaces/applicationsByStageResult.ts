import ApplicationStatusValue from '../../../enums/applicationStatusValue'

export default interface ApplicationsByStageResult {
  applicationStatus: ApplicationStatusValue
  numberOfApplications: number
}
