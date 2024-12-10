// cypress/e2e/auth/auth.cy.js

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
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

    it('should successfully sign in with valid student credentials', () => {
      cy.visit('/student/signin')
      
      // Wait for page to load
      cy.contains('Welcome back!').should('be.visible')
      
      // Fill in credentials
      cy.get('input[type="email"]').type(validStudentCredentials.email)
      cy.get('input[type="password"]').type(validStudentCredentials.password)
      
      // Click the button (case-insensitive)
      cy.get('button').contains(/^sign in$/i).click()
      
      // Check success message
      cy.get('.MuiAlert-message', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Login successful')
      
      // Verify navigation
      cy.url().should('include', '/student/dashboard')
    })

    it('should show error with invalid student credentials', () => {
      cy.visit('/student/signin')
      
      cy.get('input[type="email"]').type(invalidStudentCredentials.email)
      cy.get('input[type="password"]').type(invalidStudentCredentials.password)
      cy.get('button').contains(/^sign in$/i).click()
      
      // Check error message
      cy.get('.MuiAlert-message', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Invalid email or password')
    })

    it('should validate PFW email during student signup', () => {
      cy.visit('/student/signup')
      
      // Test with non-PFW email
      cy.get('input').first().type('testuser')
      cy.get('input[type="email"]').type('test@gmail.com')
      cy.get('input[type="password"]').first().type('Test@123')
      cy.get('input[type="password"]').last().type('Test@123')
      cy.get('button').contains(/^sign up$/i).click()
      
      // Check error message for invalid email
      cy.get('.MuiAlert-message', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Please use your PFW email')

      // Test with valid PFW email
      cy.get('input[type="email"]').clear().type('test@pfw.edu')
      cy.get('button').contains(/^sign up$/i).click()
      
      // Verify navigation to OTP page
      cy.url().should('include', '/verify-otp')
      
      // Verify OTP page elements
      cy.contains('Verify Email').should('be.visible')
      cy.contains('Enter the verification code sent to').should('be.visible')
      cy.contains('test@pfw.edu').should('be.visible')
      cy.get('button').contains(/verify email/i).should('be.visible')
    })

    it('should validate PFW email and navigate to OTP page during student signup', () => {
      cy.visit('/student/signup')
      
      // Test with non-PFW email
      cy.get('input').first().type('testuser')
      cy.get('input[type="email"]').type('test@gmail.com')
      cy.get('input[type="password"]').first().type('Test@123')
      cy.get('input[type="password"]').last().type('Test@123')
      cy.get('button').contains(/^sign up$/i).click()
      
      // Check error message for invalid email
      cy.get('.MuiAlert-message', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Please use your PFW email')
  
      // Test with valid PFW email
      cy.get('input[type="email"]').clear().type('test@pfw.edu')
      cy.get('button').contains(/^sign up$/i).click()
      
      // Only verify navigation to OTP page
      cy.url().should('include', '/verify-otp')
    })
  })

  describe('Form Validation', () => {
    it('should validate password match in signup forms', () => {
      cy.visit('/student/signup')
      
      cy.get('input').first().type('testuser')
      cy.get('input[type="email"]').type('test@pfw.edu')
      cy.get('input[type="password"]').first().type('Test@123')
      cy.get('input[type="password"]').last().type('Test@456')
      cy.get('button').contains(/^sign up$/i).click()
      
      cy.get('.MuiAlert-message', { timeout: 10000 }).should('be.visible')
        .and('contain', "Passwords don't match")
    })

    it('should handle network errors', () => {
      cy.visit('/student/signin')
      
      // Intercept network request
      cy.intercept('POST', '**/login', {
        forceNetworkError: true
      }).as('loginRequest')
      
      cy.get('input[type="email"]').type('test@pfw.edu')
      cy.get('input[type="password"]').type('Test@123')
      cy.get('button').contains(/^sign in$/i).click()
      
      cy.get('.MuiAlert-message', { timeout: 10000 }).should('be.visible')
        .and('contain', 'Network error')
    })
  })
})