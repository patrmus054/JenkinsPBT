describe('TODO App - UI', () => {
  beforeEach(() => {
    // Clean up via API
    cy.request('/api/todos').then((res) => {
      res.body.forEach((todo) => {
        cy.request('DELETE', `/api/todos/${todo.id}`)
      })
    })
    cy.visit('/')
  })

  it('displays the TODO app heading', () => {
    cy.contains('h1', 'TODO List').should('be.visible')
  })

  it('adds a new todo', () => {
    cy.get('[data-cy=todo-input]').type('Moje nowe zadanie')
    cy.get('[data-cy=add-btn]').click()
    cy.get('[data-cy=todo-item]').should('have.length', 1)
    cy.get('[data-cy=todo-title]').should('contain', 'Moje nowe zadanie')
  })

  it('adds a todo with Enter key', () => {
    cy.get('[data-cy=todo-input]').type('Zadanie Enter{enter}')
    cy.get('[data-cy=todo-item]').should('have.length', 1)
  })

  it('marks a todo as completed', () => {
    cy.get('[data-cy=todo-input]').type('Do zrobienia{enter}')
    cy.get('[data-cy=todo-checkbox]').click()
    cy.get('[data-cy=todo-item]').should('have.class', 'completed')
  })

  it('deletes a todo', () => {
    cy.get('[data-cy=todo-input]').type('Do usunięcia{enter}')
    cy.get('[data-cy=todo-item]').should('have.length', 1)
    cy.get('[data-cy=delete-btn]').click()
    cy.get('[data-cy=todo-item]').should('have.length', 0)
  })

  it('adds multiple todos', () => {
    cy.get('[data-cy=todo-input]').type('Zadanie 1{enter}')
    cy.get('[data-cy=todo-input]').type('Zadanie 2{enter}')
    cy.get('[data-cy=todo-input]').type('Zadanie 3{enter}')
    cy.get('[data-cy=todo-item]').should('have.length', 3)
  })
})
