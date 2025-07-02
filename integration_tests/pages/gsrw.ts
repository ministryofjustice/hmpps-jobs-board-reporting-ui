import Page, { PageElement } from './page'

export default class GsrwPage extends Page {
  constructor() {
    super('Work after release reporting')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  // Filters

  dateFrom = (): PageElement => cy.get('#dateFrom')

  dateFromPageErrorMessage = (): PageElement => cy.get('[href="#dateFrom"]')

  dateTo = (): PageElement => cy.get('#dateTo')

  dateToPageErrorMessage = (): PageElement => cy.get('[href="#dateTo"]')

  dateDisplay = (): PageElement => cy.get('[data-qa=date-display]')

  submitButton = (): PageElement => cy.get('[data-qa=submit-filters]')

  // Content
  numberOfPrisonersWithin12Weeks = (): PageElement => cy.get('[data-qa=numberOfPrisonersWithin12Weeks]')

  // numberOfPrisonersAll = (): PageElement => cy.get('[data-qa=numberOfPrisonersAll]')

  summaryNumberOfPrisonersWithin12Weeks = (): PageElement => cy.get('[data-qa=summary_numberOfPrisonersWithin12Weeks]')

  summaryNumberOfPrisonersOver12Weeks = (): PageElement => cy.get('[data-qa=summary_numberOfPrisonersOver12Weeks]')

  summaryNumberOfSupportDeclined = (): PageElement => cy.get('[data-qa=summary_numberOfSupportDeclined]')

  summaryNumberOfNoRightToWork = (): PageElement => cy.get('[data-qa=summary_numberOfNoRightToWork]')

  supportNeededDocumentsWithin12Weeks = (actionTodo: string): PageElement =>
    cy.get(`[data-qa=supportNeededDocuments_${actionTodo}_numberOfPrisonersWithin12Weeks]`)

  supportToWorkDeclinedReasonsWithin12Weeks = (supportToWorkDeclinedReason: string): PageElement =>
    cy.get(`[data-qa=supportToWorkDeclinedReasons_${supportToWorkDeclinedReason}_numberOfPrisonersWithin12Weeks]`)

  workStatusProgressWithin12Weeks = (profileStatus: string): PageElement =>
    cy.get(`[data-qa=workStatusProgress_${profileStatus}_numberOfPrisonersWithin12Weeks]`)

  supportNeededDocumentsOver12Weeks = (actionTodo: string): PageElement =>
    cy.get(`[data-qa=supportNeededDocuments_${actionTodo}_numberOfPrisonersOver12Weeks]`)

  supportToWorkDeclinedReasonsOver12Weeks = (supportToWorkDeclinedReason: string): PageElement =>
    cy.get(`[data-qa=supportToWorkDeclinedReasons_${supportToWorkDeclinedReason}_numberOfPrisonersOver12Weeks]`)

  workStatusProgressOver12Weeks = (profileStatus: string): PageElement =>
    cy.get(`[data-qa=workStatusProgress_${profileStatus}_numberOfPrisonersOver12Weeks]`)
}
