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
            return { ...state, responseDelete: action.payload }
        case 'Search':
            return { ...state, responseSearch: action.payload }  
        case 'FindDoc':
            return { ...state, responseFindDoc: action.payload }
        case 'FindDocSlug':
            return { ...state, responseFindDocSlug: action.payload }
        case 'Merge':
            return { ...state, responseMerge: action.payload }
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
        responseFindAllTags: null,
        responseSearchTags: null,
        responseFindDocByTag: null,
        responseFindDocByTagSlug: null,
        responseMergeTags: null
    })

    return {
        responseFindTagById: state.responseFindById,
        responseUpdateTag: state.responseUpdate,
        responseDeleteTag: state.responseDelete,
        responseFindTagBySlug: state.responseFindBySlug,
        reponseCreateTag: state.responseCreate,
        responseFindAllTags: state.responseFindAllTags,
        responseSearchTags: state.responseSearch,
        responseFindDocByTag: state.responseFindDoc,
        responseMergeTags: state.responseMerge,
        mergeTags: async function (data) {
            const tags = await apiFetch('/tags/merge', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Merge', payload: tags})
        },  
        findDocByTag: async function (id) {
            const docs = await apiFetch('/tags/docs/id/' + id , {
                method: 'GET'
            })
            dispatch({type: 'FindDoc', payload: docs})
        },
        responseFindDocByTagSlug: state.responseFindDocSlug,
        findDocByTagSlug: async function (slug) {
            const docs = await apiFetch('/tags/docs/slug/' + slug , {
                method: 'GET'
            })
            dispatch({type: 'FindDocSlug', payload: docs})
        },
        searchTags: async function (query) {
            const tags = await apiFetch('/tags/search', {
                method: 'POST',
                body: {
                    query: query
                }
            })
            dispatch ({type: 'Search', payload: tags})
        },
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