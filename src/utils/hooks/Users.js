import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}  
        case 'Update':
            return {...state, responseUpdate: action.payload}
        case 'Delete':
            return {...state, responseDelete: action.payload}
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useUsers = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindUserById: null,
        responseUpdateUser: null,
        responseDeleteUser: null
    })

    return {
        responseFindUserById: state.responseFindById,
        responseUpdateUser: state.responseUpdate,
        responseDeleteUser: state.responseDelete,
        findUserById : async function (id) {
            const user = await apiFetch('/users/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: user})
        },
        updateUser : async function (data, id) {
            const user = await apiFetch('/users/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: user})
        }, 
        deleteUser : async function (id) {
            const user = await apiFetch('/users/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: user})
        }
    }
}

export {useUsers}