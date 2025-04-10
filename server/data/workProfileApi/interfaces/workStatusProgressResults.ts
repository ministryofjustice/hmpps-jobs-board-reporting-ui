export default interface WorkStatusProgressResults {
  numberOfPrisonersStatusChange: number
  statusCounts: Array<{
    profileStatus: string
    numberOfPrisonersWithin12Weeks: number
    numberOfPrisonersOver12Weeks: number
  }>
}
