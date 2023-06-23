export async function apiFetch (endpoint, options = {} ) {

    options = {
        method: 'GET',
        headers: {
        Accept: 'application/json'
        },
        credentials: "include",
        mode: "cors",
        ...options
    }
    
    const apiUrl = "https://doctopus-cd-backend.herokuapp.com/api"
    // const apiUrl = "http://localhost:5000/api"
    //const apiUrl = "https://u1hjug-5000.csb.app/api"
    
    if (options.body !== null && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
        options.headers['Content-Type'] = 'application/json'
    }
    const response = await fetch(apiUrl + endpoint, {...options, credentials: "include"})
    if (response.status === 204) {
        return null;
    }
    if (response.ok) {
        const responseData = await response.json()
        return responseData
    } else {
        return response.statusText
    }
}
