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
            return {...state, responseFindBySlug: action.payload}
        case 'Delete':
            return { ...state, responseDelete: action.payload }
        case 'FindAllEntities':
            return { ...state, responseFindAllEntities: action.payload }
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
        responseFindAllEntities: null
    })

    return {
        responseFindEntityById: state.responseFindById,
        responseUpdateEntity: state.responseUpdate,
        responseDeleteEntity: state.responseDelete,
        responseFindEntityBySlug: state.responseFindBySlug,
        reponseCreateEntity: state.responseCreate,
          responseFindAllEntities: state.responseFindAllEntities,
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