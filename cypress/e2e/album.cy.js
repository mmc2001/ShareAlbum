describe('Test para la vista de un álbum desde fotógrafo', () => {
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
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.wait(4000)
    cy.get('#dt-length-1').select('10')
    cy.get(':nth-child(6) > .text-center > .btn-primary').click({ force: true })
    cy.contains('Fotos sin seleccionar')
  })

  it.skip('Descarga de imágenes', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.wait(4000)
    cy.get('#dt-length-1').select('10')
    cy.get(':nth-child(6) > .text-center > .btn-primary').click({ force: true })
    cy.get('#download1').click()
    // cy.wait(24000)
    // const filePath = 'cypress/downloads/MoyanoFotografia.zip';
    // cy.readFile(filePath).should('exist')
  })

  it.skip('Compartir álbum', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.wait(4000)
    cy.get('#dt-length-1').select('10')
    cy.get(':nth-child(5) > .text-center > .btn-primary').click({ force: true })
    cy.get('#generateToken').click()
    cy.contains('Éxito')
  })

  it.skip('Editar álbum', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.wait(4000)
    cy.get('#dt-length-1').select('10')
    cy.get(':nth-child(5) > .text-center > .btn-primary').click({ force: true })
    cy.get('#editar1').click()
    cy.contains('Listado de fotos')
  })
})