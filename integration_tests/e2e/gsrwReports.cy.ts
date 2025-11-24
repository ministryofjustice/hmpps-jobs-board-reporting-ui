import GsrwPage from '../pages/gsrw'
import MjmaPage from '../pages/mjma'
import Page from '../pages/page'
import DateError from '../errors'

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

    cy.title().should('eq', 'Hmpps Jobs Board Reporting Ui')

    reportsPage.dateFrom().type('1/09/2025')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_REQUIRED)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_REQUIRED)
    cy.title().should('eq', 'Error: Hmpps Jobs Board Reporting Ui')

    reportsPage.dateFrom().clear()
    reportsPage.dateTo().type('1/09/2025')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_REQUIRED)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_REQUIRED)

    reportsPage.dateFrom().clear().type('asdasdsad')
    reportsPage.dateTo().clear().type('3/09/2025')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_FORMAT)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_FORMAT)

    reportsPage.dateFrom().clear().type('2/09/2025')
    reportsPage.dateTo().clear().type('asdasdsad')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_FORMAT)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_FORMAT)

    reportsPage.dateFrom().clear().type('30/08/2025')
    reportsPage.dateTo().clear().type('1/08/2025')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_ORDER)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_ORDER)

    reportsPage.dateFrom().clear().type('1/09/2025')
    reportsPage.dateTo().clear().type('31/12/2099')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_FUTURE)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_FUTURE)

    reportsPage.dateFrom().clear().type('31/07/2025')
    reportsPage.dateTo().clear().type('31/08/2025')

    reportsPage.submitButton().click()
    reportsPage.datesPageErrorMessage().contains(DateError.DATE_PAST)
    reportsPage.datesComponentErrorMessage().contains(DateError.DATE_PAST)

    reportsPage.dateFrom().clear().type('1/08/2025')
    reportsPage.dateTo().clear().type('30/08/2025')

    reportsPage.submitButton().click()

    cy.title().should('eq', 'Hmpps Jobs Board Reporting Ui')
    reportsPage.dateDisplay().contains('Report period: 1 August 2025 to 30 August 2025')
  })

  it('Reports - Check content', () => {
    const reportsPage = Page.verifyOnPage(GsrwPage)

    // Check summary
    reportsPage.numberOfPrisonersWithin12Weeks().contains('89')
    // reportsPage.numberOfPrisonersAll().contains('89')
    reportsPage.summaryNumberOfPrisonersWithin12Weeks().contains('34')
    reportsPage.summaryNumberOfPrisonersOver12Weeks().contains('6')
    reportsPage.summaryNumberOfSupportDeclined().contains('16')
    reportsPage.summaryNumberOfNoRightToWork().contains('21')

    // Check support needed documents
    reportsPage.supportNeededDocumentsWithin12Weeks('BANK_ACCOUNT').contains('0')
    reportsPage.supportNeededDocumentsWithin12Weeks('CV_AND_COVERING_LETTER').contains('22')
    reportsPage.supportNeededDocumentsWithin12Weeks('DISCLOSURE_LETTER').contains('12')
    reportsPage.supportNeededDocumentsWithin12Weeks('EMAIL').contains('8')
    reportsPage.supportNeededDocumentsWithin12Weeks('HOUSING').contains('21')
    reportsPage.supportNeededDocumentsWithin12Weeks('ID').contains('18')
    reportsPage.supportNeededDocumentsWithin12Weeks('PHONE').contains('8')

    reportsPage.supportNeededDocumentsOver12Weeks('BANK_ACCOUNT').contains('0')
    reportsPage.supportNeededDocumentsOver12Weeks('CV_AND_COVERING_LETTER').contains('3')
    reportsPage.supportNeededDocumentsOver12Weeks('DISCLOSURE_LETTER').contains('0')
    reportsPage.supportNeededDocumentsOver12Weeks('EMAIL').contains('0')
    reportsPage.supportNeededDocumentsOver12Weeks('HOUSING').contains('1')
    reportsPage.supportNeededDocumentsOver12Weeks('ID').contains('3')
    reportsPage.supportNeededDocumentsOver12Weeks('PHONE').contains('1')

    // Check support to work declined reasons
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('ALREADY_HAS_WORK').contains('4')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('LIMIT_THEIR_ABILITY').contains('12')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('FULL_TIME_CARER').contains('4')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('HOUSING_NOT_IN_PLACE').contains('11')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('LACKS_CONFIDENCE_OR_MOTIVATION').contains('3')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('HEALTH').contains('4')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('NO_REASON').contains('2')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('RETIRED').contains('7')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('RETURNING_TO_JOB').contains('0')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('SELF_EMPLOYED').contains('13')
    reportsPage.supportToWorkDeclinedReasonsWithin12Weeks('OTHER').contains('0')

    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('ALREADY_HAS_WORK').contains('0')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('LIMIT_THEIR_ABILITY').contains('1')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('FULL_TIME_CARER').contains('0')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('HOUSING_NOT_IN_PLACE').contains('2')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('LACKS_CONFIDENCE_OR_MOTIVATION').contains('1')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('HEALTH').contains('1')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('NO_REASON').contains('0')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('RETIRED').contains('0')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('RETURNING_TO_JOB').contains('0')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('SELF_EMPLOYED').contains('2')
    reportsPage.supportToWorkDeclinedReasonsOver12Weeks('OTHER').contains('0')

    // Check work status progress
    reportsPage.workStatusProgressWithin12Weeks('NO_RIGHT_TO_WORK').contains('21')
    reportsPage.workStatusProgressWithin12Weeks('SUPPORT_DECLINED').contains('16')
    reportsPage.workStatusProgressWithin12Weeks('SUPPORT_NEEDED').contains('0')
    reportsPage.workStatusProgressWithin12Weeks('READY_TO_WORK').contains('12')

    reportsPage.workStatusProgressOver12Weeks('NO_RIGHT_TO_WORK').contains('6')
    reportsPage.workStatusProgressOver12Weeks('SUPPORT_DECLINED').contains('0')
    reportsPage.workStatusProgressOver12Weeks('SUPPORT_NEEDED').contains('0')
    reportsPage.workStatusProgressOver12Weeks('READY_TO_WORK').contains('1')
  })
})
