/**
 * Fetch data from dOctopus API. This is a wrapper around the fetch function that handles HTTP 204 responses
 *
 * @param endpoint - The endpoint to fetch from
 * @param options - Options to pass to fetch
 *
 * @return { Promise } The response from the API or null if no response is returned.
 */

export async function apiFetch(endpoint, options = {}) {
  options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      ClientDatabase:
        window.location.host === "localhost:3000"
          ? "panorama"
          : window.location.host.split(".")[0],
    },
    credentials: "include",
    mode: "cors",
    ...options,
  };

  const apiUrl = "https://api.doctopus.app/api";
  // const apiUrl = "http://localhost:5000/api"
  console.log('apiUrl: ', apiUrl)
  // Set the body of the options object to JSON.
  if (options.body !== null && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
    options.headers["Content-Type"] = "application/json";
  }
  const response = await fetch(apiUrl + endpoint, {
    ...options,
    credentials: "include",
  }); //add creds
  // Returns null if the response status code is 204.
  if (response.status === 204) {
    return null;
  }
  // Returns the response body as JSON
  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else {
    return response.statusText;
  }
}
