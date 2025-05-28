/* eslint-disable no-undef */
import { expect, jest } from '@jest/globals';
import {createElement,removeElement} from '../test-utils.js';

// Tests for the LogInForm component

import { CardMatch } from '../components/CardMatch/CardMatch.js';

// jest.useFakeTimers()

describe.only('CardMatch', () => {
  // Test component creation
  it('should create a new instance of CardMatch', () => {
    const CardMatchLit = new CardMatch();
    expect(CardMatchLit).toBeInstanceOf(CardMatch);
  });

  // Test component DOM insertion
  it('should insert div on document', async () => {
    const CardMatchLit = createElement('card-match');
    // Importante: ESPERAR al updateComplete para acceder al shadowRoot
    await CardMatchLit.updateComplete;
    const boton = document.body.querySelector('card-match').renderRoot.querySelector('button[type="submit"]');
    // Comprobamos que el botón existe en el DOM virtual
    expect(boton).toBeTruthy();
    expect(boton).toBeInstanceOf(HTMLButtonElement);
    expect(boton.textContent).toBe('Publicar convocatoria');
    removeElement(CardMatchLit);
  });

  // Test click on button
  it('should call _handleSubmit when button is clicked', async () => {
    const CardMatchLit = createElement('card-match');
    CardMatchLit._handleSubmit = jest.fn();
    // Importante: ESPERAR al updateComplete para acceder al shadowRoot
    await CardMatchLit.updateComplete;
    const boton = document.body.querySelector('card-match').renderRoot.querySelector('button[type="submit"]');
    // Comprobamos que el botón ejecuta la función al ser clickado
    boton.click();
    expect(CardMatchLit._handleSubmit).toHaveBeenCalled();
    removeElement(CardMatchLit);
  })
});
