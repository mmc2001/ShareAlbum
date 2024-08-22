describe('Tests para la vista clientes', () => {
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

  it.skip('Nuevo cliente', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/client')
    cy.get('#nuevoCliente').click()
    cy.get('#registration_form_name').type('Prueba')
    cy.get('#registration_form_surnames').type('Cypress')
    cy.get('#registration_form_dni').type('67543210X')
    cy.get('#registration_form_telephone').type('794281950')
    cy.get('#registration_form_email').type('pruebacypress@sharealbum.es')
    cy.get('#registration_form_plainPassword').type('123456')
    cy.get('#registration_form_roles').select('User')
    cy.get('.submitCliente').click()
    cy.contains('Éxito')
    cy.get('td').should('contain', 'Cypress')
  })

  it.skip('Modificar datos de un usuario', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/client')
    cy.get(':nth-child(7) > :nth-child(7) > .btn-primary').click()
    cy.get('h1').should('contain', 'Editar cliente')
    cy.get('#userUpdate_name').clear()
    cy.get('#userUpdate_name').type('Pruebaaaaa')
    cy.get('#guardarEditarUsuario').click()
    cy.get('td').should('contain', 'Pruebaaaaa')
  })

  it.skip('Cambiar la contraseña de un usuario', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/client')
    cy.get(':nth-child(7) > :nth-child(7) > .btn-primary').click()
    cy.get('h1').should('contain', 'Editar cliente')
    cy.get('#showPasswordFields').click()
    cy.get('#userUpdate_password1').type('123456')
    cy.get('#userUpdate_password2').type('123456')
    cy.get('#guardarEditarUsuario').click()
  })

  it.skip('Eliminar usuario', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.visit('https://127.0.0.1:8000/client')
    cy.get(':nth-child(7) > :nth-child(7) > .btn-danger').click({ force: true })
    cy.get('.swal2-confirm').click()

    cy.contains('Cypress').should('not.exist')
  })
})