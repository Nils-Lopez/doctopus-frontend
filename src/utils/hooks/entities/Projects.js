import {useReducer} from 'react'
import {apiFetch} from '../../middlewares/apiFetch';

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
        responseFindAllProjects: null,
        responseFindProjectChildsDataById: null,
        responseFindProjectChildsPageById: null,
        responseSearchProjectChildsById: null
    })

    return {
        responseFindProjectById: state.responseFindById,
        responseUpdateProject: state.responseUpdate,
        responseDeleteProject: state.responseDelete,
        responseFindProjectBySlug: state.responseFindBySlug,
        responseCreateProject: state.responseCreate,
        responseFindAllProjects: state.responseFindAll,
        responseFindProjectChildsDataById: state.responseFindChildsDataById,
        responseFindProjectChildsPageById: state.responseFindChildsPageById,
        responseSearchProjectChildsById: state.responseSearchChildsById,
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
        findProjectChildsDataById : async function (id) {
            const project = await apiFetch('/projects/childs/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindChildsDataById', payload: project})
        },
        findProjectChildsPageById : async function (id, page) {
            const project = await apiFetch('/projects/childs/id/' + id, {
                method: 'POST',
                body: page
            })
            dispatch({type: 'FindChildsPageById', payload: project})
        },
        searchProjectChildsById : async function (id, filters) {
            const project = await apiFetch('/projects/childs/search/' + id, {
                method: 'POST',
                body: filters
            })
            dispatch({type: 'SearchChildsById', payload: project})
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