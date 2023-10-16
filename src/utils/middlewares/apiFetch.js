/**
* Fetch data from dOctopus API. This is a wrapper around the fetch function that handles HTTP 204 responses
* 
* @param endpoint - The endpoint to fetch from
* @param options - Options to pass to fetch
* 
* @return { Promise } The response from the API or null if no response is returned. 
*/

export async function apiFetch (endpoint, options = {} ) {

    options = {
        method: 'GET',
        headers: {
        Accept: 'application/json'
        },
        credentials: "include",
        mode: "cors",
        // headers: new Headers({
        //     "ngrok-skip-browser-warning": "69420",
        //   }),
        ...options
    }
    
    const apiUrl = "https://api.doctopus.app/api"
    // const apiUrl = "http://localhost:5000/api"
    //const apiUrl = "https://e4f2-2a02-1811-4c89-da00-4c43-38c8-e074-db21.ngrok-free.app/api"
    
    // Set the body of the options object to JSON.
    if (options.body !== null && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
        options.headers['Content-Type'] = 'application/json'
    }
    const response = await fetch(apiUrl + endpoint, {...options, credentials: "include"}) //add creds
    // Returns null if the response status code is 204.
    if (response.status === 204) {
        return null;
    }
    // Returns the response body as JSON
    if (response.ok) {
        const responseData = await response.json()
        return responseData
    } else {
        return response.statusText
    }
}
