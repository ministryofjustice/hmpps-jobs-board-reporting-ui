import MjmaPage, { ReportingTableSelector } from '../pages/mjma'
import Page from '../pages/page'
import DateError from '../errors'

context('Manage jobs and applications', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('getUserActiveCaseLoad')
    cy.task('getJobSummary')
    cy.task('getTotalApplicationsByStage')
    cy.task('getLatestApplicationsByStage')

    cy.signIn()
  })

  it('Reports - filters - validation messages', () => {
    const reportsPage = Page.verifyOnPage(MjmaPage)

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
    const reportsPage = Page.verifyOnPage(MjmaPage)

    // Check summary
    reportsPage.numberOfApplicants().contains('16')
    reportsPage.numberOfJobs().contains('12')

    // Check total applications
    reportsPage.totalApplicationsHeader().contains('Total applications by application stage')
    reportsPage
      .totalApplicationsContent()
      .contains('Shows total number of open applications recorded at each stage of the application process.')

    reportsPage.totalApplicationsTableTab().click()
    reportsPage.tableData(ReportingTableSelector.TOTAL_APPLICATIONS_TABLE).then(entry => {
      expect(entry[0].label).to.contain('Application made')
      expect(entry[0].value).to.contain('26')

      expect(entry[1].label).to.contain('Application unsuccessful')
      expect(entry[1].value).to.contain('16')

      expect(entry[2].label).to.contain('Selected for interview')
      expect(entry[2].value).to.contain('10')

      expect(entry[3].label).to.contain('Interview booked')
      expect(entry[3].value).to.contain('6')

      expect(entry[4].label).to.contain('Unsuccessful at interview')
      expect(entry[4].value).to.contain('0')

      expect(entry[5].label).to.contain('Job offer')
      expect(entry[5].value).to.contain('4')
    })

    reportsPage.totalApplicationsChartTab().click()
    reportsPage.chartData(ReportingTableSelector.TOTAL_APPLICATIONS_CHART).then(entry => {
      expect(entry[0].label).to.contain('Application made')
      expect(entry[0].value).to.contain('26')

      expect(entry[1].label).to.contain('Application unsuccessful')
      expect(entry[1].value).to.contain('16')

      expect(entry[2].label).to.contain('Selected for interview')
      expect(entry[2].value).to.contain('10')

      expect(entry[3].label).to.contain('Interview booked')
      expect(entry[3].value).to.contain('6')

      expect(entry[4].label).to.contain('Unsuccessful at interview')
      expect(entry[4].value).to.contain('0')

      expect(entry[5].label).to.contain('Job offer')
      expect(entry[5].value).to.contain('4')
    })

    // Check latest applications
    reportsPage.latestApplicationsHeader().contains('Latest recorded application status')
    reportsPage
      .latestApplicationsContent()
      .contains('Shows latest recorded status for each open application in the reporting period.')

    reportsPage.latestApplicationsTableTab().click()
    reportsPage.tableData(ReportingTableSelector.LATEST_APPLICATIONS_TABLE).then(entry => {
      expect(entry[0].label).to.contain('Application made')
      expect(entry[0].value).to.contain('29')

      expect(entry[1].label).to.contain('Application unsuccessful')
      expect(entry[1].value).to.contain('10')

      expect(entry[2].label).to.contain('Selected for interview')
      expect(entry[2].value).to.contain('0')

      expect(entry[3].label).to.contain('Interview booked')
      expect(entry[3].value).to.contain('6')

      expect(entry[4].label).to.contain('Unsuccessful at interview')
      expect(entry[4].value).to.contain('0')

      expect(entry[5].label).to.contain('Job offer')
      expect(entry[5].value).to.contain('14')
    })

    reportsPage.latestApplicationsChartTab().click()
    reportsPage.chartData(ReportingTableSelector.LATEST_APPLICATIONS_CHART).then(entry => {
      expect(entry[0].label).to.contain('Application made')
      expect(entry[0].value).to.contain('29')

      expect(entry[1].label).to.contain('Application unsuccessful')
      expect(entry[1].value).to.contain('10')

      expect(entry[2].label).to.contain('Selected for interview')
      expect(entry[2].value).to.contain('0')

      expect(entry[3].label).to.contain('Interview booked')
      expect(entry[3].value).to.contain('6')

      expect(entry[4].label).to.contain('Unsuccessful at interview')
      expect(entry[4].value).to.contain('0')

      expect(entry[5].label).to.contain('Job offer')
      expect(entry[5].value).to.contain('14')
    })
  })
})
