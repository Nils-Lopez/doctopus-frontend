

import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'SignUp':
            return {...state, responseSignUp: action.payload}
        case 'Login':
                return {...state, responseLogin: action.payload}
        case 'Logout':
            return {...state, responseLogout: action.payload}    
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useAuth = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseLogin: null,
        responseSignUp: null,
        responseLogout: null
    })

    return {
        responseLogin: state.responseLogin,
        responseSignUp: state.responseSignUp,
        responseLogout: state.responseLogout,
        signUp : async function (data) {
            const newUser = await apiFetch('/auth/register', {
                method: 'POST',
                body: data
            })
            dispatch({ type: "SignUp", payload: newUser})
        },
        login : async function (data) {
            const login = await apiFetch('/auth/login', {
                method: 'POST',
                body: data
            })
            dispatch({ type: "Login", payload: login})
        },
        logout : async function (data) { 
            const logout = await apiFetch('/auth/logout', {
                method: 'POST'
            })
            dispatch({ type: "Logout", payload: logout})
        }
    }
}

export {useAuth}