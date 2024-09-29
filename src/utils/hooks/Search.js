import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'Search':
            return { ...state, responseSearch: action.payload }  
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useSearch = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseSearch: false
    })

    return {
        responseSearch: state.responseSearch,
        search: async function (query) {
            console.log('query', query)
            const roles = await apiFetch('/search/query', {
                method: 'POST',
                body: query
            })
            dispatch ({type: 'Search', payload: roles})
        }
    }
}

export {useSearch}