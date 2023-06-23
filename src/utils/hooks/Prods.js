import {useReducer} from 'react'
import {apiFetch} from '../middlewares/apiFetch';

function reducer (state, action) {
    switch(action.type) {
        case 'FindById':
            return {...state, responseFindById: action.payload}   
        case 'FindByIds':
            return { ...state, responseFindByIds: action.payload }
        default:
            throw new Error ('Action inconnue' + action.type)
    }
}

const useProds = () => {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        responseFindProdById: null,
       responseFindProdByIds: null
    })

    return {
        responseFindProdById: state.responseFindById,
       
        responseFindProdByIds: state.responseFindByIds,
       
        findProdById : async function (id) {
            const production = await apiFetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/get/" + id)

            const team = await apiFetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getequipe/" + id)

            const productor = await apiFetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getproduction/" + id)

            const prod = {
                item: production,
                parents: [...team, productor]
            }
            dispatch({type: 'FindById', payload: prod})
        },
        findProdByIds : async function (ids) {
            const prods = []
            await Promise.all(ids.map(async (id) => {
                const production = await fetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/get/" + id, {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    appName: "CDOctopus"
                    },
                    mode: "cors"
                }).then(function(response) {
                    return response.json();
                  })
                

                const team = await fetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getequipe/" + id, {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    appName: "CDOctopus"
                    },
                    mode: "cors"
                }).then(function(response) {
                    return response.json();
                  })

                const productor = await fetch("https://api.aml-cfwb.be/scapin/spectacle.svc/anon/getproduction/" + id, {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    appName: "CDOctopus"
                    },
                    mode: "cors"
                }).then(function(response) {
                    return response.json();
                  })
                if (production && production[0]) {
                    const prodSchema = {
                        prod: {
                            _id: production[0].ID,
                        title: production[0].Titre,
                        description: production[0].CommentairesResume,
                        duration: production[0].Duree,
                        date: production[0].Saison,
                        publishedAt: production[0].DatePremiere,
                        location: production[0].LieuPremiere,

                        }
                    }
                    const parents = []
                    productor.map((p) => {
                        const parentSchema = {
                            _id: p.ID,
                            roles: [{
                                title: [{lang: "fr", content: "Producteur"}]
                            }],
                            scapin: true,
                            entity: {
                                name: p.DenominationOrganisme
                            }
                        }
                        console.log('p: ', p)
                        parents.push(parentSchema)
                    })
                    team.map((t) => {
                        const parentSchema = {
                            _id: t.ID, 
                            roles: [{
                                title: [{lang: "fr", content: t.Fonction}],
                                _id: t.FonctionID
                            }],
                            scapin: true,
                            person: {
                                name: t.Prenom + " " + t.Nom,
                                isni: t.ISNI,
                                birthDate: t.AnneeNaissance,
                                deathDate: t.AnneeDeces,
                            }
                        }
                        let duplicate = false
                        parents.map((p, i) => {
                            if (p.person && p.person.name === parentSchema.person.name) {
                                duplicate = true
                                if (p.roles[0].title[0].content !== parentSchema.roles[0].title[0].content) {
                                    p.roles.push(parentSchema.roles[0])
                                    parents[i] = p
                                }
                            }
                        })
                        if (!duplicate) {
                            parents.push(parentSchema)
                        }
                    })
                    
                    prodSchema.parents = parents

                    const prod = {
                        item: prodSchema,
                        scapin: true
                    }
                    let alreadyIn = false
                    prods.map((p) => {
                        if (p.item.prod._id === prod.item.prod._id) {
                            alreadyIn = true
                        }
                    })
                    if (!alreadyIn) prods.push(prod)

                }
            }))
            console.log('prods: prods', prods)
            dispatch({type: 'FindByIds', payload: prods})
        },
    }
}

export {useProds}