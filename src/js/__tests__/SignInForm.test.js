/* eslint-disable no-undef */
import { expect, jest } from '@jest/globals';
import {createElement,removeElement} from '../test-utils.js';

// Tests for the LogInForm component

import { LogInLit } from '../components/LogInLit/LogInLit.js';

// jest.useFakeTimers()

describe.only('LogInForm', () => {
  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // // Give time to any async operation to complete after each test
  // afterEach(async () => {
  //   await sleep(2000);
  // });

  // Test component creation
  it('should create a new instance of LogInForm', () => {
    const LogInForm = new LogInLit();
    expect(LogInForm).toBeInstanceOf(LogInLit);
  });

  // Test component DOM insertion
  it('should insert form on document', async () => {
    const LogInForm = createElement('login-form');
    // Importante: ESPERAR al updateComplete para acceder al shadowRoot
    await LogInForm.updateComplete;
    const boton = document.body.querySelector('login-form').renderRoot.querySelector('button[type="submit"]');
    // Comprobamos que el botón existe en el DOM virtual
    expect(boton).toBeTruthy();
    expect(boton).toBeInstanceOf(HTMLButtonElement);
    expect(boton.textContent).toBe('Iniciar sesion');
    removeElement(LogInForm);
  });

  // Test click on button
  it('should call _submitLogIn when button is clicked', async () => {
    const LogInForm = createElement('login-form');
    LogInForm._submitLogIn = jest.fn();
    // Importante: ESPERAR al updateComplete para acceder al shadowRoot
    await LogInForm.updateComplete;
    const boton = document.body.querySelector('login-form').renderRoot.querySelector('button[type="submit"]');
    // Comprobamos que el botón ejecuta la función al ser clickado
    boton.click();
    expect(LogInForm._submitLogIn).toHaveBeenCalled();
    removeElement(LogInForm);
  })
});
