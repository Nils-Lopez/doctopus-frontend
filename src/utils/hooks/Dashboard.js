import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'DocsStat':
            return {...state, responseDocsStat: action.payload}
        case 'DocsChart':
                return {...state, responseDocsChart: action.payload}
        case 'DocsHistory':
            return {...state, responseDocsHistory: action.payload}   
        case 'VisitorsStat':
                return {...state, responseVisitorsStat: action.payload}
        case 'VisitorsChart':
            return {...state, responseVisitorsChart: action.payload}     
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useDashboard = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseDocsHistory: null,
        responseDocsStat: null,
        responseDocsChart: null
    })

    return {
        responseDocsHistory: state.responseDocsHistory,
        responseDocsStat: state.responseDocsStat,
        responseDocsChart: state.responseDocsChart,
        responseVisitorsChart: state.responseVisitorsChart,
        responseVisitorsStat: state.responseVisitorsStat,
        getVisitorsStat : async function () {
            const stats = await apiFetch('/dashboard/visitors/stat')
            dispatch({ type: "VisitorsStat", payload: stats})
        },
        getVisitorsChart : async function (data) {
            const chart = await apiFetch('/dashboard/visitors/chart', {
                method: 'POST',
                body: data
            })
            dispatch({ type: "VisitorsChart", payload: chart})
        },
        getDocsStat : async function () {
            const stats = await apiFetch('/dashboard/docs/stat')
            dispatch({ type: "DocsStat", payload: stats})
        },
        getDocsChart : async function (data) {
            const chart = await apiFetch('/dashboard/docs/chart', {
                method: 'POST',
                body: data
            })
            dispatch({ type: "DocsChart", payload: chart})
        },
        getDocsHistory: async function (range) {
            const history = await apiFetch('/dashboard/docs/history/' + range)
            dispatch({ type: "DocsHistory", payload: history})
        }
    }
}

export {useDashboard}