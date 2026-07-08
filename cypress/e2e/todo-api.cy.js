describe('TODO App - API', () => {
  beforeEach(() => {
    // Clean up any existing todos via API
    cy.request('/api/todos').then((res) => {
      res.body.forEach((todo) => {
        cy.request('DELETE', `/api/todos/${todo.id}`)
      })
    })
  })

  it('GET /api/todos returns empty list initially', () => {
    cy.request('/api/todos').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array').that.is.empty
    })
  })

  it('POST /api/todos creates a new todo', () => {
    cy.request('POST', '/api/todos', { title: 'Test task', completed: false }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.title).to.eq('Test task')
      expect(res.body.id).to.be.a('number')
    })
  })

  it('PUT /api/todos/:id updates a todo', () => {
    cy.request('POST', '/api/todos', { title: 'Update me', completed: false }).then((res) => {
      const id = res.body.id
      cy.request('PUT', `/api/todos/${id}`, { title: 'Updated', completed: true }).then((updated) => {
        expect(updated.body.title).to.eq('Updated')
        expect(updated.body.completed).to.be.true
      })
    })
  })

  it('DELETE /api/todos/:id removes a todo', () => {
    cy.request('POST', '/api/todos', { title: 'Delete me', completed: false }).then((res) => {
      const id = res.body.id
      cy.request('DELETE', `/api/todos/${id}`).then((del) => {
        expect(del.status).to.eq(200)
      })
      cy.request('/api/todos').then((list) => {
        expect(list.body).to.have.length(0)
      })
    })
  })
})
