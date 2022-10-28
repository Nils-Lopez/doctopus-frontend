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

const useEntityTemplates = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindEntityTemplateById: null,
        responseUpdateEntityTemplate: null,
        responseFindEntityTemplateBySlug: null,
        responseCreateEntityTemplate: null,
        responseDeleteEntityTemplate: null
    })

    return {
        responseFindEntityTemplateById: state.responseFindById,
        responseUpdateEntityTemplate: state.responseUpdate,
        responseDeleteEntityTemplate: state.responseDelete,
        responseFindEntityTemplateBySlug: state.responseFindBySlug,
        reponseCreateEntityTemplate: state.responseCreate,
        findEntityTemplateById : async function (id) {
            const entityTemplate = await apiFetch('/templates/entity/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: entityTemplate})
        },
        findEntityTemplateBySlug: async function (slug) {
            const entityTemplate = await apiFetch('/templates/entity/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: entityTemplate})
        },
        createEntityTemplate: async function (data) {
            const entityTemplate = await apiFetch('/templates/entity/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:entityTemplate})
        },
        updateEntityTemplate: async function (data, id) {
            const entityTemplate = await apiFetch('/templates/entity/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: entityTemplate})
        }, 
        deleteEntityTemplate: async function (id) {
            const entityTemplate = await apiFetch('/templates/entity/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: entityTemplate})
        }
    }
}

export {useEntityTemplates}