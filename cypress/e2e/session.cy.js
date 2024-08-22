describe('Tests para la vista sesiones', () => {
  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes("Identifier 'camposDiv' has already been declared")) {
        return false
      }
      if (err.message.includes("Identifier 'executed1' has already been declared")) {
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

  it.skip('Nueva sesión', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get('#nuevaSesion').click()
    cy.get('#session_name').type('Prueba')
    cy.get('#session_service').type('Cypress')
    cy.get('#session_date').type('2024-08-25T14:30:00')
    cy.get('#session_priceSession').type('2950')
    cy.get('#session_descriptionSession').type('Prueba Cypress')
    cy.get('#session_users_14').click()
    cy.get('#session_users_15').click()
    cy.get('#session_extras_2').click()
    cy.get('.submitSession').click()
    cy.contains('Éxito')
    cy.get('td').should('contain', 'Cypress')
  })

  it.skip('Nueva servicio', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get('#nuevoServicio').click()
    cy.get('#services_name').type('Prueba Cypress')
    cy.get('#services_priceService').type('120')
    cy.get('.submitServicio').click()
    cy.contains('Éxito')
  })

  it.skip('Nueva extra', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get('#nuevoExtra').click()
    cy.get('#extras_name').type('Prueba Cypress')
    cy.get('#extras_priceExtra').type('180')
    cy.get('.submitExtras').click()
    cy.contains('Éxito')
  })

  it.skip('Generar PDF', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get(':nth-child(8) > .bloque > div > .btn').click()
    cy.get('#descargarVerTicket').click()
    cy.get('#session_name').clear()
    cy.get('#session_name').type('Pruebaaaaa')
    // cy.get('#extras_priceExtra').type('180')
    // cy.get('.submitExtras').click()
    // cy.contains('Éxito')
  })

  it.skip('Modificar sesión', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get(':nth-child(8) > .text-center > .btn-info').click()
    cy.get('#sessionUpdate_name').clear()
    cy.get('#sessionUpdate_name').type('Pruebaaaaa')
    cy.get('#guardarEditarSesion').click()
    cy.contains('Éxito')
    cy.get('td').should('contain', 'Pruebaaaaa')
  })

  it.skip('Eliminar sesión', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/session')
    cy.get(':nth-child(8) > .text-center > .btn-danger').click()
    cy.wait(3000)
    cy.get('.swal2-confirm').click()
    cy.contains('Eliminado')
  })
})