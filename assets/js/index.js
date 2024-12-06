import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'

govukFrontend.initAll()
mojFrontend.initAll()

document.addEventListener('DOMContentLoaded', function pageLoaded() {
  // Clear anchors from the URL on page loads
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname)
  }

  // Set width for elements with the class 'app-chart-table__percentage-cell-bar'
  const percentageCellBars = document.querySelectorAll('.app-chart-table__percentage-cell-bar')
  percentageCellBars.forEach(element => {
    const styleWidth = element.getAttribute('data-style-width')
    if (styleWidth) {
      element.style.width = styleWidth
    }
  })
})
