export default interface WorkStatusProgressResults {
  numberOfPrisonersStatusChange: number
  statusCounts: Array<{ profileStatus: string; numberOfPrisoners: number }>
}
