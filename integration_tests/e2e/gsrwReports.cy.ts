import GsrwPage from '../pages/gsrw'
import MjmaPage from '../pages/mjma'
import Page from '../pages/page'

context('Get someone ready to work reports', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')

    // Mock homepage end points
    cy.task('getUserActiveCaseLoad')
    cy.task('getJobSummary')
    cy.task('getTotalApplicationsByStage')
    cy.task('getLatestApplicationsByStage')

    cy.signIn()

    const reportsPage = Page.verifyOnPage(MjmaPage)

    // Mock gsrw endpoints
    cy.task('getWorkProfileSummary')
    cy.task('getWorkStatusProgress')
    cy.task('getSupportNeededDocuments')
    cy.task('getSupportToWorkDeclinedReasons')

    cy.task('getPrisonersByReleaseDate')

    reportsPage.gsrwTab().click()
  })

  it('Reports - filters - validation messages', () => {
    const reportsPage = Page.verifyOnPage(GsrwPage)

    reportsPage.dateFrom().type('1/11/2024')

    reportsPage.submitButton().click()
    reportsPage.dateToPageErrorMessage().contains('Enter or select a `latest` date')

    reportsPage.dateFrom().clear()
    reportsPage.dateTo().type('1/11/2024')

    reportsPage.submitButton().click()
    reportsPage.dateFromPageErrorMessage().contains('Enter or select a `earliest` date')

    reportsPage.dateFrom().clear().type('asdasdsad')
    reportsPage.dateTo().clear().type('1/11/2024')

    reportsPage.submitButton().click()
    reportsPage.dateFromPageErrorMessage().contains('Enter the date in the correct format')

    reportsPage.dateFrom().clear().type('1/11/2024')
    reportsPage.dateTo().clear().type('asdasdsad')

    reportsPage.submitButton().click()
    reportsPage.dateToPageErrorMessage().contains('Enter the date in the correct format')

    reportsPage.dateFrom().clear().type('30/11/2024')
    reportsPage.dateTo().clear().type('1/11/2024')

    reportsPage.submitButton().click()
    reportsPage.dateToPageErrorMessage().contains("The `latest` date must be after the 'earliest' date")

    reportsPage.dateFrom().clear().type('1/11/2024')
    reportsPage.dateTo().clear().type('30/11/2024')

    reportsPage.submitButton().click()

    reportsPage.dateDisplay().contains('Report period: 1 November 2024 to 30 November 2024')
  })

  it('Reports - Check content', () => {
    const reportsPage = Page.verifyOnPage(GsrwPage)

    // Check summary
    reportsPage.numberOfPrisoners12Weeks().contains('50')
    reportsPage.numberOfPrisoners().contains('34')
    reportsPage.numberOfSupportDeclined().contains('16')
    reportsPage.numberOfNoRightToWork().contains('21')

    // Check support needed documents
    reportsPage.supportNeededDocuments('BANK_ACCOUNT').contains('2')
    reportsPage.supportNeededDocuments('CV_AND_COVERING_LETTER').contains('22')
    reportsPage.supportNeededDocuments('DISCLOSURE_LETTER').contains('12')
    reportsPage.supportNeededDocuments('EMAIL').contains('8')
    reportsPage.supportNeededDocuments('HOUSING').contains('21')
    reportsPage.supportNeededDocuments('ID').contains('18')
    reportsPage.supportNeededDocuments('PHONE').contains('8')

    // Check support to work declined reasons
    reportsPage.supportToWorkDeclinedReasons('ALREADY_HAS_WORK').contains('4')
    reportsPage.supportToWorkDeclinedReasons('LIMIT_THEIR_ABILITY').contains('12')
    reportsPage.supportToWorkDeclinedReasons('FULL_TIME_CARER').contains('4')
    reportsPage.supportToWorkDeclinedReasons('HOUSING_NOT_IN_PLACE').contains('11')
    reportsPage.supportToWorkDeclinedReasons('LACKS_CONFIDENCE_OR_MOTIVATION').contains('3')
    reportsPage.supportToWorkDeclinedReasons('HEALTH').contains('4')
    reportsPage.supportToWorkDeclinedReasons('NO_REASON').contains('2')
    reportsPage.supportToWorkDeclinedReasons('RETIRED').contains('7')
    reportsPage.supportToWorkDeclinedReasons('RETURNING_TO_JOB').contains('2')
    reportsPage.supportToWorkDeclinedReasons('SELF_EMPLOYED').contains('13')

    // Check work status progress
    reportsPage.workStatusProgress('NO_RIGHT_TO_WORK').contains('21')
    reportsPage.workStatusProgress('SUPPORT_DECLINED').contains('16')
    reportsPage.workStatusProgress('SUPPORT_NEEDED').contains('22')
    reportsPage.workStatusProgress('READY_TO_WORK').contains('12')
  })
})
