// cypress/e2e/auth/auth.cy.js

describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.clearCookies()
      
      // Set up API interception for localhost:8000
      cy.intercept('http://localhost:8000/**').as('apiRequest')
    })
  
    describe('Student Authentication', () => {
      const validStudentCredentials = {
        email: 'mohaa11@pfw.edu',
        password: 'Porsche@69'
      }
  
      const invalidStudentCredentials = {
        email: 'test@test.com',
        password: 'qwert@123'
      }
  
      it('should successfully sign in with valid student credentials', { defaultCommandTimeout: 10000 }, () => {
        cy.visit('/student/signin')
        
        // Wait for page to load
        cy.contains('Welcome back!', { timeout: 10000 }).should('be.visible')
        
        // Fill in credentials
        cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type(validStudentCredentials.email)
        cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible').type(validStudentCredentials.password)
        
        // Find and click the button
        cy.get('button', { timeout: 10000 })
          .contains('SIGN IN')
          .should('be.visible')
          .click()
  
        // Wait for API response
        cy.wait('@apiRequest', { timeout: 10000 })
        
        // Check success alert
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', 'Login successful')
        
        // Verify navigation
        cy.url().should('include', '/student/dashboard')
      })
  
      it('should show error with invalid student credentials', { defaultCommandTimeout: 10000 }, () => {
        cy.visit('/student/signin')
        
        cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').type(invalidStudentCredentials.email)
        cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible').type(invalidStudentCredentials.password)
        cy.get('button').contains('SIGN IN').click()
  
        // Wait for API response
        cy.wait('@apiRequest', { timeout: 10000 })
        
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', 'Invalid email or password')
      })
  
      it('should validate PFW email during student signup', { defaultCommandTimeout: 10000 }, () => {
        cy.visit('/student/signup')
        
        // Test with non-PFW email
        cy.get('input[type="text"]', { timeout: 10000 }).first().type('testuser')
        cy.get('input[type="email"]').type('test@gmail.com')
        cy.get('input[type="password"]').first().type('Test@123')
        cy.get('input[type="password"]').last().type('Test@123')
        cy.get('button').contains('Sign Up').click()
        
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', 'Please use your PFW email')
  
        // Test with valid PFW email
        cy.get('input[type="email"]').clear().type('test@pfw.edu')
        cy.get('button').contains('Sign Up').click()
  
        // Wait for API response
        cy.wait('@apiRequest', { timeout: 10000 })
        
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', 'Registration successful')
      })
    })
  
    describe('Form Validation', () => {
      it('should validate password match in signup forms', { defaultCommandTimeout: 10000 }, () => {
        cy.visit('/student/signup')
        
        cy.get('input[type="text"]', { timeout: 10000 }).first().type('testuser')
        cy.get('input[type="email"]').type('test@pfw.edu')
        cy.get('input[type="password"]').first().type('Test@123')
        cy.get('input[type="password"]').last().type('Test@456')
        cy.get('button').contains('Sign Up').click()
        
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', "Passwords don't match")
      })
  
      it('should handle network errors', { defaultCommandTimeout: 10000 }, () => {
        cy.visit('/student/signin')
        
        // Intercept and force network error
        cy.intercept('POST', 'http://localhost:8000/login', {
          forceNetworkError: true
        }).as('loginRequest')
        
        cy.get('input[type="email"]', { timeout: 10000 }).type('test@pfw.edu')
        cy.get('input[type="password"]').type('Test@123')
        cy.get('button').contains('SIGN IN').click()
        
        cy.get('.MuiSnackbar-root', { timeout: 15000 }).should('be.visible')
        cy.get('.MuiAlert-message').should('contain', 'Network error')
      })
    })
  })