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
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useProjects = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindProjectById: null,
        responseUpdateProject: null,
        responseFindProjectBySlug: null,
        responseCreateProject: null,
        responseDeleteProject: null,
        responseFindAllProjects: null
    })

    return {
        responseFindProjectById: state.responseFindById,
        responseUpdateProject: state.responseUpdate,
        responseDeleteProject: state.responseDelete,
        responseFindProjectBySlug: state.responseFindBySlug,
        responseCreateProject: state.responseCreate,
        responseFindAllProjects: state.responseFindAll,
        findAllProjects: async function () {
            const projects = await apiFetch('/projects', { method: "GET" })
            dispatch({type: "FindAll", payload: projects})
        },
        findProjectById : async function (id) {
            const project = await apiFetch('/projects/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: project})
        },
        findProjectBySlug: async function (slug) {
            const project = await apiFetch('/projects/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: project})
        },
        createProject: async function (data) {
            const project = await apiFetch('/projects/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:project})
        },
        updateProject: async function (data, id) {
            const project = await apiFetch('/projects/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: project})
        }, 
        deleteProject: async function (id) {
            const project = await apiFetch('/projects/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: project})
        }
    }
}

export {useProjects}