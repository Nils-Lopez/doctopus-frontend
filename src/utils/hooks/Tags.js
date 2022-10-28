import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}  
        case 'Update':
            return { ...state, responseUpdate: action.payload }
        case 'Create':
            return { ...state, responseCreate: action.payload }
        case 'FindBySlug':
            return { ...state, responseFindBySlug: action.payload }
        case 'FindAllTags':
            return { ...state, responseFindAllTags: action.payload }
        case 'Delete':
            return {...state, responseDelete: action.payload}
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useTags = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindTagById: null,
        responseUpdateTag: null,
        responseFindTagBySlug: null,
        responseCreateTag: null,
        responseDeleteTag: null,
        responseFindAllTags: null
    })

    return {
        responseFindTagById: state.responseFindById,
        responseUpdateTag: state.responseUpdate,
        responseDeleteTag: state.responseDelete,
        responseFindTagBySlug: state.responseFindBySlug,
        reponseCreateTag: state.responseCreate,
        responseFindAllTags: state.responseFindAllTags,
        findAllTags: async function () {
            const tags = await apiFetch("/tags", {
                method: "GET"
            })
            dispatch({type: "FindAllTags", payload: tags})
        },
        findTagById : async function (id) {
            const tag = await apiFetch('/tags/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: tag})
        },
        findTagBySlug: async function (slug) {
            const tag = await apiFetch('/tags/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: tag})
        },
        createTag: async function (data) {
            const tag = await apiFetch('/tags/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:tag})
        },
        updateTag: async function (data, id) {
            const tag = await apiFetch('/tags/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: tag})
        }, 
        deleteTag: async function (id) {
            const tag = await apiFetch('/tags/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: tag})
        }
    }
}

export {useTags}