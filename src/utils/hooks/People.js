import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

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
        case 'FindAllPeople':
            return { ...state, responseFindAllPeople: action.payload }
        case 'Search':
            return { ...state, responseSearch: action.payload }  
        case 'FindByScapin':
            return { ...state, responseFindById: action.payload }      
        case 'Merge':
            return { ...state, responseMerge: action.payload }      
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const usePeople = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindPersonById: null,
        responseUpdatePerson: null,
        responseFindPersonBySlug: null,
        responseCreatePerson: null,
        responseDeletePerson: null,
        responseFindAllPeople: null,
        responseSearchPeople: null,
        responseMerge: null,
        responseFindPersonChildsDataById: null,
        responseFindPersonChildsPageById: null,
        responseSearchPersonChildsById: null
    })

    return {
        responseFindPersonById: state.responseFindById,
        responseUpdatePerson: state.responseUpdate,
        responseDeletePerson: state.responseDelete,
        responseFindPersonBySlug: state.responseFindBySlug,
        responseCreatePerson: state.responseCreate,
        responseFindAllPeople: state.responseFindAllPeople,
        responseSearchPeople: state.responseSearch,
        responseMergePeople: state.responseMerge,
        responseFindPersonChildsDataById: state.responseFindChildsDataById,
        responseFindPersonChildsPageById: state.responseFindChildsPageById,
        responseSearchPersonChildsById: state.responseSearchChildsById,
        mergePeople: async function (data) {
            const people = await apiFetch('/people/merge', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Merge', payload: people})
        },
        searchPeople: async function (query) {
            const people = await apiFetch('/people/search', {
                method: 'POST',
                body: {
                    query: query
                }
            })
            dispatch ({type: 'Search', payload: people})
        },
        findPersonChildsDataById : async function (id) {
            const project = await apiFetch('/people/childs/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindChildsDataById', payload: project})
        },
        findPersonChildsPageById : async function (id, page) {
            const project = await apiFetch('/people/childs/id/' + id, {
                method: 'POST',
                body: page
            })
            dispatch({type: 'FindChildsPageById', payload: project})
        },
        searchPersonChildsById : async function (id, filters) {
            const project = await apiFetch('/people/childs/search/' + id, {
                method: 'POST',
                body: filters
            })
            dispatch({type: 'SearchChildsById', payload: project})
        },
        findAllPeople: async function () {
            const people = await apiFetch("/people", {
                method: "GET"
            })
            dispatch({type: "FindAllPeople", payload: people})
        },
        findPersonById : async function (id) {
            const person = await apiFetch('/people/id/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: person})
        },
        findPersonByScapin : async function (id) {
            const person = await apiFetch('/people/scapin/' + id, {
                method: 'GET'
            })
            dispatch({type: 'FindById', payload: person})
        },
        findPersonBySlug: async function (slug) {
            const person = await apiFetch('/people/slug/' + slug, {
                method: 'GET'
            })
            dispatch({type: 'FindBySlug', payload: person})
        },
        createPerson: async function (data) {
            const person = await apiFetch('/people/', {
                method: 'POST',
                body: data
            })
            dispatch({type: 'Create', payload:person})
        },
        updatePerson: async function (data, id) {
            const person = await apiFetch('/people/' + id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'Update', payload: person})
        }, 
        deletePerson: async function (id) {
            const person = await apiFetch('/people/' + id, {
                method: 'DELETE'
            })
            dispatch({type: 'Delete', payload: person})
        }
    }
}

export {usePeople}