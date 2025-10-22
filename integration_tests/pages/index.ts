import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Work after leaving prison reporting')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')
}
