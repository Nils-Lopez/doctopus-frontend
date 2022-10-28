import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return { ...state, responseFindById: action.payload }  
        case 'FindAllRoles':
            return { ...state, responseFindAllRoles: action.payload }
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

const useRoles = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindRoleById: null,
        responseUpdateRole: null,
        responseFindRoleBySlug: null,
        responseCreateRole: null,
        responseDeleteRole: null,
        responseFindAllRoles: null
    })

    return {
        responseFindRoleById: state.responseFindById,
        responseUpdateRole: state.responseUpdate,
        responseDeleteRole: state.responseDelete,
        responseFindRoleBySlug: state.responseFindBySlug,
        reponseCreateRole: state.responseCreate,
        responseFindAllRoles: state.responseFindAllRoles,
        findAllRoles: async function () {
            const roles = await apiFetch("/roles", {
                method: "GET"
            })
            dispatch({type: "FindAllRoles", payload: roles})
        },
        findRoleById : async function (id) {
            const role = await apiFetch('/roles/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: role})
        },
        findRoleBySlug: async function (slug) {
            const role = await apiFetch('/roles/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: role})
        },
        createRole: async function (data) {
            const role = await apiFetch('/roles/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:role})
        },
        updateRole: async function (data, id) {
            const role = await apiFetch('/roles/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: role})
        }, 
        deleteRole: async function (id) {
            const role = await apiFetch('/roles/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: role})
        }
    }
}

export {useRoles}