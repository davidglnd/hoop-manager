import { simpleFetch } from "./simpleFetch.js";

/**
 * Importa un template HTML en el body del documento.
 *
 * @param {string} templateUrl URL del template a importar.
 *
 * @returns {Promise<void>} Promise que se resuelve cuando el template se ha importado.
 */
export async function importTemplate(templateUrl) {
  const templateContent = await simpleFetch(templateUrl);

  document.body.insertAdjacentHTML('beforeend', templateContent);
}