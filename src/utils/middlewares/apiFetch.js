/**
 * Fetch data from dOctopus API. This is a wrapper around the fetch function that handles HTTP 204 responses
 *
 * @param endpoint - The endpoint to fetch from
 * @param options - Options to pass to fetch
 *
 * @return { Promise } The response from the API or null if no response is returned.
 */

export const API_BASE_URL = "https://doctopus-api.azurewebsites.net/api";
// export const API_BASE_URL = "http://localhost:5000/api";
export function buildDefaultHeaders() {
  const host = typeof window !== "undefined" ? window.location.host : "";
  let clientDatabase = "contredanse";
  if (host === "localhost:3000") {
    clientDatabase = "panorama";
  } else if (host && host.split(".")[0] !== "doctopus-app") {
    clientDatabase = host.split(".")[0];
  }

  return {
    Accept: "application/json",
    ClientDatabase: clientDatabase,
  };
}

export async function apiFetch(endpoint, options = {}) {
  const defaultHeaders = buildDefaultHeaders();
  options = {
    method: "GET",
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: "include",
    mode: "cors",
    ...options,
  };

  console.log("apiUrl: ", API_BASE_URL);
  if (options.body !== null && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
    options.headers["Content-Type"] = "application/json";
  }
  const response = await fetch(API_BASE_URL + endpoint, {
    ...options,
    credentials: "include",
  });
  if (response.status === 204) {
    return null;
  }
  if (response.ok) {
    const responseData = await response.json();
    return responseData;
  } else {
    return response.statusText;
  }
}
