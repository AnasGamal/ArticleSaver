const { _ } = Cypress // importing lodash

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', {
      name: 'Root',
      username: 'root',
      password: 'sekret'
    })
    cy.request('POST', 'http://localhost:3003/api/users/', {
      name: 'Alaa',
      username: 'alaa',
      password: 'alaa'
    })
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('blogs')
  })

  it('Login form is shown', function() {
    // check if login form has 2 inputs for username and password
    cy.get('.login-form').find('input').should('have.length', 2)
  })

  it('login form can be opened', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('alaa')
      cy.get('#password').type('alaa')
      cy.get('#login-button').click()
      cy.get('.success').should('contain', 'logged in')
      // make sure it prints in green color
      // cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('heisenberg')
      cy.get('#password').type('heisenberg')
      cy.get('#login-button').click()
      cy.get('.error').should('contain', 'wrong')
      // make sure it prints in red color
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  describe('Post interaction',function() {
    beforeEach(function() {
      cy.get('#username').type('root')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()
      cy.get('#new-blog-title').type('wonderful blog')
      cy.get('#new-blog-author').type('wonderful')
      cy.get('#new-blog-url').type('wonderful-url')
      cy.get('#submit-new-blog').click()
      cy.contains('wonderful blog').should('exist')
      cy.get('#logout-button').click()
      // user is assumed to be alaa for rest of the tests
      cy.get('#username').type('alaa')
      cy.get('#password').type('alaa')
      cy.get('#login-button').click()
      cy.get('#new-blog-title').type('awesome blog')
      cy.get('#new-blog-author').type('awesome')
      cy.get('#new-blog-url').type('awesome-url')
      cy.get('#submit-new-blog').click()
      cy.contains('awesome blog').should('exist')
    })

    it('can like button', function() {
      cy.get('#blog-toggle-button').click()
      cy.get('.blogLikes').should('contain', '0')
      cy.get('#like-button').click()
      cy.get('.blogLikes').should('contain', '1')
    })

    it('User can remove created post', function() {
      cy.contains('div.blog', 'awesome blog').within(() => {
        // Click on the 'view' button
        cy.get('button.blogToggle').click()
        // Click on remove button
        cy.get('button.remove-button').click() // Replace 'remove-button' with the actual ID or class of the remove button.
      })
      // make sure it prints green success remove message
      cy.get('.success').should('contain', 'removed')
    })

    it('User can not remove created posts by other users', function() {
      cy.contains('div.blog', 'wonderful blog').within(() => {
        // Click on the 'view' button
        cy.get('button.blogToggle').click()
        // remove button shouldn't appear for a user who didn't create the blog
        cy.get('button.remove-button').should('not.exist')
      })
    })

    it('blogs are ordered according to likes with the blog with the most likes being first', function() {
      cy.contains('div.blog', 'awesome blog').within(() => {
        // Click on the 'view' button
        cy.get('button.blogToggle').click()
        // Click like button twice
        cy.get('#like-button').click()
        cy.get('.blogLikes').should('contain', '1')
        cy.get('#like-button').click()
        cy.get('.blogLikes').should('contain', '2')
      })

      cy.contains('div.blog', 'wonderful blog').within(() => {
        // Click on the 'view' button
        cy.get('button.blogToggle').click()
        // Click like button once
        cy.get('#like-button').click()
        cy.get('.blogLikes').should('contain', '1')
      })

      cy.get('.blog').eq(0).should('contain', 'awesome blog')
      cy.get('.blog').eq(1).should('contain', 'wonderful blog')
    })
  })

})
