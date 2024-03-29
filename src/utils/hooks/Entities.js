import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}  
        case 'FindChildsDataById':
            return {...state, responseFindChildsDataById: action.payload}  
        case 'FindChildsPageById':
            return {...state, responseFindChildsPageById: action.payload}  
        case 'SearchChildsById':
            return {...state, responseSearchChildsById: action.payload}  
        case 'Update':
            return { ...state, responseUpdate: action.payload }
        case 'Create':
            return { ...state, responseCreate: action.payload }
        case 'FindBySlug':
            return {...state, responseFindBySlug: action.payload}
        case 'Delete':
            return { ...state, responseDelete: action.payload }
        case 'FindAllEntities':
            return { ...state, responseFindAllEntities: action.payload }
        case 'Search':
            return { ...state, responseSearch: action.payload }  
        case 'Merge':
            return { ...state, responseMerge: action.payload }
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useEntities = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindEntityById: null,
        responseUpdateEntity: null,
        responseFindEntityBySlug: null,
        responseCreateEntity: null,
        responseDeleteEntity: null,
        responseFindAllEntities: null,
        responseSearchEntities: null,
        responseMergeEntities: null,
        responseFindEntityChildsDataById: null,
        responseFindEntityChildsPageById: null,
        responseSearchEntityChildsById: null
    })

    return {
        responseFindEntityById: state.responseFindById,
        responseUpdateEntity: state.responseUpdate,
        responseDeleteEntity: state.responseDelete,
        responseFindEntityBySlug: state.responseFindBySlug,
        responseCreateEntity: state.responseCreate,
        responseFindAllEntities: state.responseFindAllEntities,
        responseSearchEntities: state.responseSearch,
        responseMergeEntities: state.responseMerge,
        responseFindEntityChildsDataById: state.responseFindChildsDataById,
        responseFindEntityChildsPageById: state.responseFindChildsPageById,
        responseSearchEntityChildsById: state.responseSearchChildsById,
        mergeEntities: async function (data) {
            const entities = await apiFetch('/entities/merge', {
                method: 'POST',
                body: data
            })
            console.log(entities)
            dispatch({type: 'Merge', payload: entities})
        },
        searchEntities: async function (query) {
            const orgs = await apiFetch('/entities/search', {
                method: 'POST',
                body: {
                    query: query
                }
            })
            dispatch ({type: 'Search', payload: orgs})
        },
        findAllEntities: async function () {
            const entities = await apiFetch("/entities", {
                method: "GET"
            })
            dispatch({type: "FindAllEntities", payload: entities})
        },
        findEntityById : async function (id) {
            const entity = await apiFetch('/entities/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: entity})
        },
        findEntityChildsDataById : async function (id) {
            const entity = await apiFetch('/entities/childs/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindChildsDataById', payload: entity})
        },
        findEntityChildsPageById : async function (id, page) {
            const entity = await apiFetch('/entities/childs/id/' + id, {
                method: 'POST',
                body: page
            })
            dispatch({type: 'FindChildsPageById', payload: entity})
        },
        searchEntityChildsById : async function (id, filters) {
            const entity = await apiFetch('/entities/childs/search/' + id, {
                method: 'POST',
                body: filters
            })
            dispatch({type: 'SearchChildsById', payload: entity})
        },
        findEntityByScapin : async function (id) {
            const entity = await apiFetch('/entities/scapin/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: entity})
        },
        findEntityBySlug: async function (slug) {
            const entity = await apiFetch('/entities/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: entity})
        },
        createEntity: async function (data) {
            const entity = await apiFetch('/entities/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:entity})
        },
        updateEntity: async function (data, id) {
            const entity = await apiFetch('/entities/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: entity})
        }, 
        deleteEntity: async function (id) {
            const entity = await apiFetch('/entities/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: entity})
        }
    }
}

export {useEntities}