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
        case 'FindAllDocTemplates':
            return {...state, responseFindAllDocTemplates: action.payload}
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useDocTemplates = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindDocTemplateById: null,
        responseUpdateDocTemplate: null,
        responseFindDocTemplateBySlug: null,
        responseCreateDocTemplate: null,
        responseDeleteDocTemplate: null,
        responseFindAllDocTemplates: null
    })

    return {
        responseFindDocTemplateById: state.responseFindById,
        responseUpdateDocTemplate: state.responseUpdate,
        responseDeleteDocTemplate: state.responseDelete,
        responseFindDocTemplateBySlug: state.responseFindBySlug,
        reponseCreateDocTemplate: state.responseCreate,
          responseFindAllDocTemplates: state.responseFindAllDocTemplates,
        findAllDocTemplates: async function () {
            const docTemplates = await apiFetch("/templates/docs", {
                method: "GET"
            })
            dispatch({type: "FindAllDocTemplates", payload: docTemplates})
        },
        findDocTemplateById : async function (id) {
            const docTemplate = await apiFetch('/templates/docs/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: docTemplate})
        },
        findDocTemplateBySlug: async function (slug) {
            const docTemplate = await apiFetch('/templates/docs/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: docTemplate})
        },
        createDocTemplate: async function (data) {
            const docTemplate = await apiFetch('/templates/docs/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:docTemplate})
        },
        updateDocTemplate: async function (data, id) {
            const docTemplate = await apiFetch('/templates/docs/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: docTemplate})
        }, 
        deleteDocTemplate: async function (id) {
            const docTemplate = await apiFetch('/templates/docs/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: docTemplate})
        }
    }
}

export {useDocTemplates}