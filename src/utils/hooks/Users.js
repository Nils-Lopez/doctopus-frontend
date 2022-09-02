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
        responseFindById: null,
        responseUpdate: null,
        responseDelete: null
    })

    return {
        responseFindById: state.responseFindById,
        responseUpdate: state.responseUpdate,
        responseDelete: state.responseDelete,
        findById : async function (id) {
            const user = await apiFetch('/users/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: user})
        },
        update : async function (data, id) {
            const user = await apiFetch('/users/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: user})
        }, 
        delete : async function (id) {
            const user = await apiFetch('/users/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: user})
        }
    }
}

export {useUsers}