/*********************************************************************
 * Fake fetch function built off of fetch.js from CS326 example
 *********************************************************************/
import { MockLocations } from "../lib/data/MockLocations.js";

/**
 * Simulates a network request to the specified URL and returns a Promise
 * that resolves to a mock response object.
 *
 * @function fetch
 * @param {string} url The URL to request
 * @param {object} [options] An options object
 * @param {number} [options.delay=1000] The delay (in milliseconds) before
 * resolving the Promise
 * @returns {Promise} A Promise that resolves to a mock response object
 */
export function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    // Define a delay to simulate network latency (e.g., 1 second)
    const delay = 250;

    setTimeout(() => {
      // Define a mock response object
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: "okay",
        url: "http://localhost:3000/lib/data/MockLocations.json",
        json: async () => JSON.stringify(MockLocations), // temp solution to json fetching
        text: async () => "This is a mock response",
      };

      // Use the URL to simulate failure or success
      if (url.includes("error")) {
        reject(new Error("Network error"));
      } else {
        resolve(mockResponse);
      }
    }, delay);
  });
}
