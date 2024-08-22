describe('Tests del Login/Logout', () => {
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
    // cy.visit('/')
  })
  it('Login de un fotógrafo', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')

    cy.get('#login').click()

    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.get('h2').should('contain', 'Tareas diarias')
  })

  it('Login de un cliente', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('antonioprueba@gmail.com')
    cy.get('#password').type('123456')

    cy.get('#login').click()

    cy.url().should('eq', 'https://127.0.0.1:8000/home')

    cy.get('h2').should('contain', 'Sesiones disponibles')
  })

  it('Contactar sin hacer login', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#signUp').click()

    cy.get('[type="text"]').type('Nombre')
    cy.get('.sign-up-container > form > [type="email"]').type('pruebacypres@sharealbum.es')
    cy.get('[type="tel"]').type('345293049')
    cy.get('#servicios').select('Boda')

    // cy.get('.sign-up-container > form > .margen').click()

  })

  it('Logout de un fotógrafo', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('moisesmoyanoc@gmail.com')
    cy.get('#password').type('123456')

    cy.get('#login').click()

    cy.url().should('eq', 'https://127.0.0.1:8000/dashboard')

    cy.get('h2').should('contain', 'Tareas diarias')

    cy.get('.dropdown button[type="button"]')
        .trigger('mouseover')
    cy.get('.dropdown-content a[href="#"]').click({ force: true })
  })

  it('Logout de un cliente', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('antonioprueba@gmail.com')
    cy.get('#password').type('123456')

    cy.get('#login').click()

    cy.url().should('eq', 'https://127.0.0.1:8000/home')

    cy.get('h2').should('contain', 'Sesiones disponibles')

    cy.get('.dropdown button[type="button"]')
        .trigger('mouseover')
    cy.get('.dropdown-content a[href="#"]').click({ force: true })
  })

  it('Modificar datos de un usuario', () => {
    cy.visit('https://127.0.0.1:8000/login')
    cy.get('#username').type('antonioprueba@gmail.com')
    cy.get('#password').type('123456')
    cy.get('#login').click()
    cy.url().should('eq', 'https://127.0.0.1:8000/home')

    cy.get('.dropdown button[type="button"]')
        .trigger('mouseover')
    cy.get('.dropdown-content a[href="#modalPerfil"]').click({ force: true })
    cy.get('#user_data_name').clear()
    cy.get('#user_data_name').type('Antonioooo')
    cy.get('.botonesPerfil > .submitPerfil').click()
    cy.get('h2').should('contain', 'Antonioooo')

    cy.get('.dropdown button[type="button"]')
        .trigger('mouseover')
    cy.get('.dropdown-content a[href="#modalPerfil"]').click({ force: true })
    cy.get('#user_data_name').clear()
    cy.get('#user_data_name').type('Antonio')
    cy.get('.botonesPerfil > .submitPerfil').click()
  })
})