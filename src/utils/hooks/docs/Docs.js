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
            return {...state, responseDelete: action.payload}
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
        responseDeleteDoc: null
    })

    return {
        responseFindDocById: state.responseFindById,
        responseUpdateDoc: state.responseUpdate,
        responseDeleteDoc: state.responseDelete,
        responseFindDocBySlug: state.responseFindBySlug,
        reponseCreateDoc: state.responseCreate,
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