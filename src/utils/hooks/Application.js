

import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'RegisterVisitor':
            return {...state, responseRegisterVisitor: action.payload}
        case 'GetApp':
            return {...state, responseGetApplication: action.payload}
        case 'UpdateApp':
            return {...state, responseUpdateApp: action.payload}
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useApplication = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseRegisterVisitor: null,
        responseGetApplication: null,
        responseUpdateApp: null
    })

    return {
        responseRegisterVisitor: state.responseRegisterVisitor,
        registerVisitor: async function () {
            const newVisitor = await apiFetch('/application/visitor')
            dispatch({ type: "RegisterVisitor", payload: newVisitor})
        },
        getApplication: async function (slug) {
            const app = await apiFetch('/application/settings/' + slug)
            dispatch({type: 'GetApp', payload: app})
        },
        responseGetApplication: state.responseGetApplication,
        updateApp: async function (app) {
            const newApp = await apiFetch('/application/settings', {
                method: 'PUT',
                body: app
            })
            dispatch({type: 'UpdateApp', payload: newApp})
        },
        responseUpdateApp: state.responseUpdateApp,
    }
}

export {useApplication}