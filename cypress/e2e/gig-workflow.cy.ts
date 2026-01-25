describe('Gig Workflow E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the landing page', () => {
    cy.contains('Linka').should('be.visible');
    cy.contains('dashboard').should('be.visible');
  });

  it('should require auth to post a gig', () => {
    cy.contains('Post a Gig').click();
    cy.contains('Sign In to Linka').should('be.visible');
  });

  it('should display live gigs', () => {
    cy.contains('Live').click();
    cy.contains('Live Gigs').should('be.visible');
  });

  it('should navigate between tabs', () => {
    cy.contains('Manada').click();
    cy.url().should('include', 'manada');
    
    cy.contains('Opportunities').click();
    cy.url().should('include', 'opportunities');
  });

  it('should display real-time stats', () => {
    cy.contains('Online Users').should('be.visible');
    cy.contains('AI Protected').should('be.visible');
  });
});
