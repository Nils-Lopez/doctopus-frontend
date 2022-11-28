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
        case 'Search':
            return { ...state, responseSearch: action.payload }
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useBrotherhoods = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindBrotherhoodById: null,
        responseUpdateBrotherhood: null,
        responseFindBrotherhoodBySlug: null,
        responseCreateBrotherhood: null,
        responseDeleteBrotherhood: null,
        responseFindAllBrotherhoods: null,
        responseSearchBrotherhoods: null
    })

    return {
        responseFindBrotherhoodById: state.responseFindById,
        responseUpdateBrotherhood: state.responseUpdate,
        responseDeleteBrotherhood: state.responseDelete,
        responseFindBrotherhoodBySlug: state.responseFindBySlug,
        responseCreateBrotherhood: state.responseCreate,
        responseFindAllBrotherhoods: state.responseFindAll,
        responseSearchBrotherhoods: state.responseSearch,
        searchBrotherhoods: async function (query) {
            const brotherhoods = await apiFetch('/families/brothers/search', {
                method: 'POST',
                body: {
                    query: query
                }
            })
            dispatch ({type: 'Search', payload: brotherhoods})
        },
        findAllBrotherhoods: async function () {
            const brotherhoods = await apiFetch('/families/brothers', { method: "GET" })
            dispatch({type: "FindAll", payload: brotherhoods})
        },
        findBrotherhoodById : async function (id) {
            const brotherhood = await apiFetch('/families/brothers/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: brotherhood})
        },
        findBrotherhoodBySlug: async function (slug) {
            const brotherhood = await apiFetch('/families/brothers/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: brotherhood})
        },
        createBrotherhood: async function (data) {
            const brotherhood = await apiFetch('/families/brothers/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:brotherhood})
        },
        updateBrotherhood: async function (data, id) {
            const brotherhood = await apiFetch('/families/brothers/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: brotherhood})
        }, 
        deleteBrotherhood: async function (id) {
            const brotherhood = await apiFetch('/families/brothers/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: brotherhood})
        }
    }
}

export {useBrotherhoods}