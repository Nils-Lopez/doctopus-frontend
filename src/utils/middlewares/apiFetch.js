export async function apiFetch (endpoint, options = {} ) {

    options = {
        method: 'GET',
        headers: {
        Accept: 'application/json'
        },
        ...options
    }

    const apiUrl = "http://localhost:5000/api"

    if (options.body !== null && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body)
        options.headers['Content-Type'] = 'application/json'
    }
    const response = await fetch(apiUrl + endpoint, options)
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