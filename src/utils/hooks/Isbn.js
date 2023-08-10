import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}   
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useIsbns = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindBookByIsbn: null,
    })

    return {
        responseFindBookByIsbn: state.responseFindById,       
        findBookByIsbn : async function (id) {
            const res = await apiFetch('/docs/isbn', {
                method: 'POST',
                body: {id: id}
            })
            dispatch({type: 'FindById', payload: res})
        },
      
    }
}

export {useIsbns}