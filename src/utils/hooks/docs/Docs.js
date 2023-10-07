import {useReducer} from 'react'
import {apiFetch} from '../../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}  
        case 'Update':
            return { ...state, responseUpdate: action.payload }
        case 'Create':
            return { ...state, responseCreate: action.payload }
        case 'FindBySlug':
            return {...state, responseFindBySlug: action.payload}
        case 'Delete':
            return { ...state, responseDelete: action.payload }
        case 'FindAll': 
            return { ...state, responseFindAll: action.payload }
        case 'Search':
            return { ...state, responseSearch: action.payload }
        case 'FindPopular':
            return { ...state, responseFindPopular: action.payload }
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useDocs = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindDocById: null,
        responseUpdateDoc: null,
        responseFindDocBySlug: null,
        responseCreateDoc: null,
        responseDeleteDoc: null,
        responseFindAllDocs: null,
        responseSearchDocs: null,
        responseFindPopularDocs: null
    })

    return {
        responseFindDocById: state.responseFindById,
        responseUpdateDoc: state.responseUpdate,
        responseFindPopularDocs: state.responseFindPopular,
        responseDeleteDoc: state.responseDelete,
        responseFindDocBySlug: state.responseFindBySlug,
        responseCreateDoc: state.responseCreate,
        responseFindAllDocs: state.responseFindAll,
        responseSearchDocs: state.responseSearch,
        findPopularDocs: async function (type) {
            const docs = await apiFetch('/docs/popular/' + type, { method: 'GET' })
            dispatch({type: 'FindPopular', payload: docs})
        },
        searchDocs: async function (query) {
            const docs = await apiFetch('/docs/search', {
                method: 'POST',
                body: {
                    query: query
                }
            })
            dispatch ({type: 'Search', payload: docs})
        },
        findAllDocs: async function () {
            const docs = await apiFetch('/docs', { method: 'GET' })
            dispatch({type: 'FindAll', payload: docs})
        },
        findDocById : async function (id) {
            const doc = await apiFetch('/docs/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: doc})
        },
        findDocBySlug: async function (slug) {
            const doc = await apiFetch('/docs/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: doc})
        },
        createDoc: async function (data) {
            const doc = await apiFetch('/docs/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:doc})
        },
        updateDoc: async function (data, id) {
            const doc = await apiFetch('/docs/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: doc})
        }, 
        deleteDoc: async function (id) {
            const doc = await apiFetch('/docs/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: doc})
        }
    }
}

export {useDocs}