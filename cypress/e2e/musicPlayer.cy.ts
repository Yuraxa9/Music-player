describe('Music Player', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the music library', () => {
    cy.contains('Music Library').should('be.visible');
    cy.get('[data-testid="song-card"]').should('have.length.at.least', 1);
  });

  it('can create and manage playlists', () => {
    cy.contains('Playlists').click();
    cy.contains('New Playlist').click();
    cy.get('#playlist-name').type('My Test Playlist');
    cy.get('#playlist-description').type('A playlist for testing');
    cy.contains('Create Playlist').click();
    cy.contains('My Test Playlist', { timeout: 6000 }).should('be.visible');

    // Ждём появления кнопки редактирования
    cy.get('[data-testid="edit-playlist"]', { timeout: 6000 }).first().click();

    cy.get('#playlist-name').clear().type('Updated Playlist');
    cy.contains('Save Changes').click();
    cy.contains('Updated Playlist').should('be.visible');
  });

  it('can play and control music', () => {
    cy.get('[data-testid="song-card"]').first()
      .find('button')
      .eq(1)
      .click();

    // Ждём появления плеера
    cy.get('[data-testid="player-controls"]', { timeout: 8000 }).should('be.visible');

    // Ждём появления кнопки воспроизведения и кликаем
    cy.get('[data-testid="play-pause-button"]', { timeout: 8000 })
      .should('be.visible')
      .click();

    // Управление прогресс-баром
    cy.get('[data-testid="progress-bar"]').as('seek')
      .invoke('val', 30)
      .trigger('change');

    // Управление громкостью
    cy.get('[data-testid="volume-slider"]').as('volume')
      .invoke('val', 0.5)
      .trigger('change');
  });

  it('can search for songs', () => {
    cy.get('[placeholder="Search for songs, artists or albums"]')
      .type('Blinding Lights');
    cy.get('[data-testid="song-card"]')
      .should('have.length', 1)
      .and('contain', 'Blinding Lights');
  });
});