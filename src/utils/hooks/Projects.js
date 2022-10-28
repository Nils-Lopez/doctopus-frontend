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
        case "FindAllProjects":
            return { ...state, responseFindAllProjects: action.payload }
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
        reponseCreateProject: state.responseCreate,
          responseFindAllProjects: state.responseFindAllProjects,
        findAllProjects: async function () {
            const proj = await apiFetch("/projects", {
                method: "GET"
            })
            dispatch({type: "FindAllProjects", payload: proj})
        },
        findProjectById : async function (id) {
            const Project = await apiFetch('/projects/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: Project})
        },
        findProjectBySlug: async function (slug) {
            const Project = await apiFetch('/projects/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: Project})
        },
        createProject: async function (data) {
            const Project = await apiFetch('/projects/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:Project})
        },
        updateProject: async function (data, id) {
            const Project = await apiFetch('/projects/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: Project})
        }, 
        deleteProject: async function (id) {
            const Project = await apiFetch('/projects/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: Project})
        }
    }
}

export {useProjects}