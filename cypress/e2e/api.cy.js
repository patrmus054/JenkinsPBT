describe('Spring Boot API', () => {
  it('GET /hithere returns 42', () => {
    cy.request('/hithere').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.eq('42')
    })
  })
})
