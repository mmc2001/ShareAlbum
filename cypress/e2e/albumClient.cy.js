describe('Test para la vista de un álbum desde cliente', () => {
  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes("Identifier 'camposDiv' has already been declared")) {
        return false
      }
      if (err.message.includes("Identifier 'executed1' has already been declared")) {
        return false
      }
      if (err.message.includes("Identifier 'executed' has already been declared")) {
        return false
      }
      if (err.message.includes("Cannot read properties of null (reading 'addEventListener')")) {
        return false
      }
      if (err.message.includes('Cannot read properties of undefined (reading \'config\')')) {
        return false
      }
      if (err.message.includes('cross-origin')) {
        return false
      }

      return true
    })
  })

  it.skip('Carga de imágenes', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('antonioprueba@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/home')

    cy.get('#sesiones > a').click();
    cy.contains('Fotos sin seleccionar')
  })
})