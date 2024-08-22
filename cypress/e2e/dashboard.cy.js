describe('Tests para la vista dashboard', () => {

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

      return true
    })
  })

  it('Crear una tarea', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.get('#abrirModalTarea').click()
    cy.get('#event_name').type('Prueba de Cypress')
    cy.get('#event_date').type('2022-08-25T14:30:00')
    cy.get('#event_user').select('Moisés Moyano Cejudo')
    cy.get('#event_services').select('Reportaje de Boda')
    cy.get('#event_session').select('Prueba de Rendimiento')
    cy.get('#event_comment').type('Prueba de Cypress')
    cy.get('.submitTarea').click()
    cy.get('label').should('contain', 'Prueba de Cypress')
  })

  it('Eliminar una tarea', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.scrollTo(0, 510)
    cy.get('label').should('contain', 'Prueba de Cypress')
    cy.get(':nth-child(3) > .deleteButton').click({ force: true })
    // cy.contains('Vas a eliminar un evento de tu agenda')
    // cy.get('.swal2-confirm').click({ force: true })
    // cy.contains('Eliminado')
  })

  it('Enviar una correo electrónico', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.scrollTo(0, 1020)
    cy.get('h2').should('contain', 'Mensajes')
    cy.get('#recipient').select('Alejandro Ríos Pérez')
    cy.get('#subject').type('Prueba de Cypress')
    cy.get('#fileUrl').attachFile('imagenPrueba.jpg', { force: true })
    cy.get('#textMessage').type('Prueba de Cypress')
    cy.get('#send').click()
    cy.get('h1').should('contain', 'Confirmar Envío')
    cy.get('#sendModal').click()
  })
})