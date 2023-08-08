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
            const options = {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    "Accept": "application/xml"
                  },
            }
            console.log('isbn: ', id)
            let endpoint = "https://catalogue.bnf.fr/api/SRU?version=1.2&operation=searchRetrieve&query=bib.isbn%20all%20%229782930146423%22&recordSchema=unimarcXchange&maximumRecords=1&startRecord=1"
            const res = await fetch(endpoint.replaceAll("9782930146423", id), options)
            console.log("res: ", res)
            
            dispatch({type: 'FindById', payload: res})
        },
      
    }
}

export {useIsbns}