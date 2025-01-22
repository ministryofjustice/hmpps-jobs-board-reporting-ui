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
  numberOfPrisoners12Weeks = (): PageElement => cy.get('[data-qa=numberOfPrisoners12Weeks]')

  numberOfPrisoners = (): PageElement => cy.get('[data-qa=numberOfPrisoners]')

  numberOfSupportDeclined = (): PageElement => cy.get('[data-qa=numberOfSupportDeclined]')

  numberOfNoRightToWork = (): PageElement => cy.get('[data-qa=numberOfNoRightToWork]')

  supportNeededDocuments = (actionTodo: string): PageElement =>
    cy.get(`[data-qa=supportNeededDocuments_${actionTodo}_numberOfPrisoners]`)

  supportToWorkDeclinedReasons = (supportToWorkDeclinedReason: string): PageElement =>
    cy.get(`[data-qa=supportToWorkDeclinedReasons_${supportToWorkDeclinedReason}_numberOfPrisoners]`)

  workStatusProgress = (profileStatus: string): PageElement =>
    cy.get(`[data-qa=workStatusProgress_${profileStatus}_numberOfPrisoners]`)
}
