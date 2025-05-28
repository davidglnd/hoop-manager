import { HttpError } from 'classes/HttpError'

/**
 * Makes a fetch call and returns the json response. If the response status is not 2xx,
 * it throws an HttpError. If the response is an html file, it returns the text response
 * instead of json.
 * @param {string} url - The url to fetch.
 * @param {RequestInit} [options] - The options to use for the fetch call.
 * @returns {Promise<any>} The response json or text.
 * @throws {HttpError} If the response status is not 2xx.
 */
export async function simpleFetch (url, options) {
  console.log('simpleFetch', url);
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpError(result);
  }
  let isJsonResponse = result.headers.get('Content-Type')?.includes('application/json');

  if (isJsonResponse) {
    return (await result.json());
  }
  return (await result.text());
}