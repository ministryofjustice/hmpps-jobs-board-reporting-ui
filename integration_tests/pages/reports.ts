import Page, { PageElement } from './page'

export default class ReportsPage extends Page {
  constructor() {
    super('Work after release reporting')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  mjmaTab = (): PageElement => cy.get('[data-qa=mjma-tab]')

  gsrwTab = (): PageElement => cy.get('[data-qa=gsrw-tab]')

  // Filters

  dateFrom = (): PageElement => cy.get('#dateFrom')

  dateFromPageErrorMessage = (): PageElement => cy.get('[href="#dateFrom"]')

  dateTo = (): PageElement => cy.get('#dateTo')

  dateToPageErrorMessage = (): PageElement => cy.get('[href="#dateTo"]')

  dateDisplay = (): PageElement => cy.get('[data-qa=date-display]')

  submitButton = (): PageElement => cy.get('[data-qa=submit-filters]')

  // applications tab

  // summary
  numberOfApplicants = (): PageElement => cy.get('[data-qa=numberOfApplicants]')

  numberOfJobs = (): PageElement => cy.get('[data-qa=numberOfJobs]')

  // Total applications section

  totalApplicationsHeader = (): PageElement => cy.get('[data-qa=totalApplicationsHeader]')

  totalApplicationsContent = (): PageElement => cy.get('[data-qa=totalApplicationsContent]')

  totalApplicationsChartTab = (): PageElement => cy.get('[data-qa=totalApplicationsChartTab]')

  totalApplicationsChart = (): PageElement => cy.get('#totalApplicationsChart')

  totalApplicationsTableTab = (): PageElement => cy.get('[data-qa=totalApplicationsTableTab]')

  totalApplicationsTable = (): PageElement => cy.get('[data-qa=totalApplicationsTable]')

  // Latest applications section

  latestApplicationsHeader = (): PageElement => cy.get('[data-qa=latestApplicationsHeader]')

  latestApplicationsContent = (): PageElement => cy.get('[data-qa=latestApplicationsContent]')

  latestApplicationsChartTab = (): PageElement => cy.get('[data-qa=latestApplicationsChartTab]')

  latestApplicationsChart = (): PageElement => cy.get('#latestApplicationsChart')

  latestApplicationsTableTab = (): PageElement => cy.get('[data-qa=latestApplicationsTableTab]')

  latestApplicationsTable = (): PageElement => cy.get('[data-qa=latestApplicationsTable]')

  // generic table date works for graphs and data tables
  tableData = (selector: ReportingTableSelector) =>
    cy
      .get(selector)
      .find('.govuk-table__body tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td.govuk-table__cell')
          return {
            label: Cypress.$(tds[0]).text(),
            value: Cypress.$(tds[1]).text(),
          }
        }),
      )

  chartData = (selector: ReportingTableSelector) =>
    cy
      .get(selector)
      .find('tr')
      .spread((...rest) =>
        rest.map(element => {
          const tds = Cypress.$(element).find('td')
          return {
            label: Cypress.$(tds[0]).text(),
            value: Cypress.$(tds[1]).text(),
          }
        }),
      )
}

export enum ReportingTableSelector {
  LATEST_APPLICATIONS_CHART = '#table-latestApplicationsChart',
  LATEST_APPLICATIONS_TABLE = '[data-qa=latestApplicationsTable]',
  TOTAL_APPLICATIONS_CHART = '#table-totalApplicationsChart',
  TOTAL_APPLICATIONS_TABLE = '[data-qa=totalApplicationsTable]',
}
