import React, {Fragment, useState, useEffect} from "react";
import {useTranslation} from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

import SearchItemParent from "./SearchItem"
import SearchItemDoc from "../docs/SearchItem"

import PersonForm from "../../molecules/Create/PersonForm"
import OrganisationForm from "../../molecules/Create/OrganisationForm"
import ProjectForm from "../forms/orgs/ProjectForm"

import {useProds} from "../../../utils/hooks/Prods"

const Show = ({parent, client, setAlert, handleSearchParent, handleSearchDoc, handleSearchScapinID, handleBack}) => {
    
    const [dataUpdate, setDataUpdate] = useState(false)


    const { t, i18n } = useTranslation() 
    const {
        roles, 
        languages, 
        description, 
        name, 
        firstName, 
        lastName, 
        birthDate, 
        deathDate, 
        country, 
        city, 
        startedAt, 
        endedAt, 
        url, 
        issn, 
        title, 
        date,
        website, 
        //DEPS
        productions, 
        activities, 
        actors, 
        projects, 
        productionIds, 
        prodIds, 
        createdDocs,
        childs,
        parents
    } = parent

    console.log('childs: ', parent)

    const [productionsScapin, setProductions] = useState(false)
    const [prodLoading, setProdLoading] = useState(false)

    const {findProdById, responseFindProdBydId, findProdByIds, responseFindProdByIds} = useProds()


    useEffect(() => {
        if (prodIds && prodIds[0] && !prodLoading && !productionsScapin[0]) {
            setProdLoading(true)
            findProdByIds(prodIds)
        } else if (productionIds && productionIds[0] && !prodLoading && !productionsScapin[0]) {
            setProdLoading(true)
            findProdByIds(productionIds)
        }
    }, [prodIds, productionIds])

    useEffect(() => {
        if (responseFindProdByIds && prodLoading) {
            setProductions(responseFindProdByIds)
            setProdLoading(false)
        }
    }, [responseFindProdByIds])

    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
    const [docs, setDocs] = useState([])
    
    useEffect(() => {
     if (dataUpdate && dataUpdate.success) {
        console.log("update: ", dataUpdate)
      handleSearchParent(dataUpdate)
      setDataUpdate(false)
     }
    }, [dataUpdate])

    useEffect(() => {
        if ((productions && productions[0]) || (createdDocs && createdDocs[0])) {
            if (!docs[0]) {
                console.log("prods :", productions)
                console.log('createdDocs: ', createdDocs)
                const newDocs = []
                if (productions) {
                    productions.map((prod) => {
                        if (prod.docs) {
                            prod.docs.map((doc) => {
                                if (!newDocs.includes({...doc, relTypes: prod.roles[0]}) && !newDocs.includes({...doc})) newDocs.push({...doc, relTypes: prod.roles[0]})                  
                            })
                        } else if (prod.title) {
                            if (!newDocs.includes(prod)) newDocs.push(prod)
                        }
                    })
                }
                
                if (createdDocs){
                    createdDocs.map((doc) => {
                        if (!newDocs.includes(doc)) newDocs.push(doc)
                    })
                }
                console.log('new: ', newDocs)
                const finalDocs = newDocs.filter(function(item, pos) {
                    return newDocs.indexOf(item) == pos;
                })
                if (finalDocs[0] && finalDocs !== docs) {
                    setDocs([...new Set(finalDocs)])
                }
            }
        }
    }, [docs, parent])

    useEffect(() => {
        if (page === 1) {
            setDataList(docs.slice(0, 20))
        } else {
            setDataList(docs.slice((page*10), ((page*10)+20)))
        }
 
    }, [page, docs])

    let filteredRoles = roles && roles.filter(function({id}) {return !this.has(id) && this.add(id)}, new Set);

    const [showScapinParent, setShowScapinParent] = useState(false)
    
    const handleSearchScapinParent = (item, type) => {
        if (!type){
            console.log('eh jsuis la : ', {...item.prod,scapin: true, parents: item.parents})
        if (!showScapinParent && item) setShowScapinParent({...item.prod,scapin: true, parents: item.parents})
        else setShowScapinParent(false)
        } else {
            handleSearchScapinID(item)
        }
    }

    const [productionsPage, setProductionsPage] = useState(1)
    const [parentsPage, setParentsPage] = useState(1)
    const [childsPage, setChildsPage] = useState(1)

    const handleNextPage = (list, currentPage, setNewPage, next, rowSize) => {
        if (next) {
            if (list.length > (currentPage*rowSize)) {
                setNewPage(currentPage+1)
            }
        } else {
            if (page !== 1) {
                let newPage = currentPage - 1
                setNewPage(newPage)
            }
        }
    }

    console.log("childs: ", parent)

    return showScapinParent ? <>
        <Show parent={showScapinParent} client={client} setAlert={setAlert} handleSearchParent={handleSearchScapinParent} handleSearchScapinID={handleSearchScapinID} handleSearchDoc={handleSearchDoc} handleBack={handleSearchScapinParent}/>
    </> : dataUpdate && !dataUpdate.success ? <>
     {dataUpdate.projects ? 
      <OrganisationForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     : dataUpdate.entities ? <>
       <ProjectForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     </> : <>
      <PersonForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     </>}
    </> : <>
     <div className="is-flex is-justify-content-space-between mb-5">
        <div>
        <button className="button is-light is-medium tag" id="backBtn" onClick={handleBack}>
                <FontAwesomeIcon icon={faRotateLeft} size="lg"/>
                <strong>&nbsp;{t('back')}</strong>
            </button>
        {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <>
              <button className="button is-primary ml-3 is-medium tag" onClick={() => setDataUpdate(parent)}>
                  {t('update')}
              </button>
          </>
 : null }
        </div>
        <div>
        {roles && roles[0] ? <>
            {
            filteredRoles.map((type) => {
                    return <Fragment key={JSON.stringify(type)}>
                        <span className="tag is-medium is-primary mr-1 ml-1 mb-0">
                            {getContent(type.title, i18n.language)}
                        </span>
                    </Fragment>
               
                
            })}
        </> : <span className="tag is-medium is-primary mr-1 ml-1 mb-0">
                        {parent.projects ? t('organization') : parent.entities ? t('project') : t('person')}
                    </span>}
        </div>
     </div>
        <h1 className="mt-2 has-text-left title is-1">{title && title !== "" ? title : name && name !== "" ? name : firstName + " " + lastName}</h1>
        {parent && parent.scapin ? <>
            {parent.description && parent.description !== "" ? <p className=" subtitle is-5 mt-2 has-text-left">{parent.description}</p> : null}
        </> : <>
            {description && description[0] ? <p className=" subtitle is-5 mt-2 has-text-left">{getContent(description, i18n.language)}</p> : null}
            {languages && languages[0] ? <p className="has-text-left">{getContent(languages[0].labels, i18n.language)}</p> : null}
        </>}
        <div className="container mt-3">
        {country && country !== "" ? <div className="is-flex is-justify-content-start">
                                {typeof country === "string" ?<span className="tag is-light is-small mb-2 ml-1 mr-1">{country}</span> : country.map((c) => {
                                   if (c.labels[0]) {
                                    return <Fragment key={JSON.stringify(c)}><span className="tag is-light is-small mb-2 ml-1 mr-1">{getContent(c.labels, i18n.language)}</span></Fragment>
                                   }
                            })}
                                </div> : null} 
                                { city && city !== "" ? <div className="is-flex is-justify-content-start"> 
                                    <span className="tag is-light is-small mb-2 mr-1">{city}</span>
                                </div> :null} 
                                { website && website !== "" ? <div className="is-flex is-justify-content-start"> 
                                    <span className="tag is-light is-small mb-2  mr-1"><a href={website}>{website}</a></span>
                                </div> : null}
                                { url && url !== "" ? <div className="is-flex is-justify-content-start"> 
                                    <span className="tag is-light is-small mb-2 mr-1"><a href={url}>{url}</a></span>
                                </div> : null}
                                {birthDate && birthDate !== "" ? <div className="is-flex is-justify-content-start">
                                    <span className="tag is-light is-small mb-2  mr-1">{birthDate} {deathDate && deathDate !== "" ? " - " + deathDate : null}</span>
                                </div> : null}
                                {startedAt && startedAt !== "" ? <div className="is-flex is-justify-content-start">
                                    <span className="tag is-light is-small mb-2  mr-1">{startedAt} {endedAt && endedAt !== "" ? " - " + endedAt : null}</span>
                                </div> : null}

                               {issn && issn !== "" ? <div className="is-flex is-justify-content-start">
                                    <span className="tag is-light is-small mb-2  mr-1">ISSN: {issn} </span>
                                </div> : null}
                                {date && date !== "" ? <div className="is-flex is-justify-content-start">
                                    <span className="tag is-light is-small mb-2  mr-1">{parent.scapin && t('season')} {date} </span>
                                </div> : null}
                                {parent.publishedAt && parent.publishedAt !== "" ? <div className="is-flex is-justify-content-start">
                                    
                                    <span className="tag is-light is-small mb-2  mr-1">{t('firstdate')} {parent.publishedAt} </span>
                                </div> : null}
                                {parent.duration && parent.duration !== "" ? <div className="is-flex is-justify-content-start">
                                    <span className="tag is-light is-small mb-2  mr-1">{t('duration')} {parent.duration} </span>
                                </div> : null}
                              {parent.scapin ? <div className="is-flex is-justify-content-end">
                                    <a href={"https://scapin.aml-cfwb.be/recherche/details/?pid=" + parent._id} target="_blank" className="tag button is-white has-text-primary is-medium">{t('read-more-scapin')}</a>
                                </div> : null}
        </div> 
        {productionsScapin && productionsScapin[0] ? <>
            <hr />

        <div className="is-flex is-justify-content-space-between">
        <h3 className="subtitle has-text-grey has-text-left is-5 mb-1">{t('productions')}</h3>

        <div className="mt--1">
        {productionsPage !== 1 ? <button className="button is-white" onClick={() => setProductionsPage(productionsPage - 1)}><FontAwesomeIcon icon={faAngleLeft} className=" is-size-3 has-text-grey"/></button> :null}

                {productionsScapin.length > (8*productionsPage) ? <button className="button is-white" onClick={() => handleNextPage(productionsScapin, productionsPage, setProductionsPage, true, 8)}><FontAwesomeIcon icon={faAngleRight} className=" is-size-3 has-text-grey"/></button> :null}
            </div>
        </div>
        </> : null}
        <div className="columns is-multiline mb-6">
        {productionsScapin && productionsScapin[0] ? productionsScapin.map((prodScapin, i) => {
            if ((productionsPage === 1 && i < 8) || (i > (((productionsPage - 1)*8)-1)) && (i < (((productionsPage )*8)))) {

                return <Fragment key={JSON.stringify(prodScapin)}>
                <SearchItemParent item={prodScapin.item} handleSearchScapinParent={handleSearchScapinParent} parent="production" i={i}/>
            </Fragment>
            }
        }): null}
        
        </div>
        {parents && parents[0] ? <>
            <hr />
            <div className="is-flex is-justify-content-space-between">
        <h3 className="subtitle has-text-grey has-text-left is-5 mb-1">{t('parents')}</h3>

        <div className="mt--1">
        {parentsPage !== 1 ? <button className="button is-white" onClick={() => setParentsPage(parentsPage - 1)}><FontAwesomeIcon icon={faAngleLeft} className=" is-size-3 has-text-grey"/></button> :null}

                {parents.length > (8*parentsPage) ? <button className="button is-white" onClick={() => handleNextPage(parents, parentsPage, setParentsPage, true, 8)}><FontAwesomeIcon icon={faAngleRight} className=" is-size-3 has-text-grey"/></button> :null}
            </div>
        </div>        </> : null}
        <div className="columns is-multiline mb-6">
        {parents && parents[0] ? parents.map((p, i) => {
            if ((parentsPage === 1 && i < 8) || (i > (((parentsPage - 1)*8)-1)) && (i < (((parentsPage )*8)))) {
                return <Fragment key={JSON.stringify(p)}>
                <SearchItemParent item={p} handleSearchScapinParent={handleSearchScapinParent} i={i}/>
            </Fragment>
            }
        }): null}
        </div>
        {childs && childs[0] ? <>
            <hr />
            <div className="is-flex is-justify-content-space-between">
        <h3 className="subtitle has-text-grey has-text-left is-5 mb-1">{t('documents')}</h3>

        <div className="mt--1">
        {childsPage !== 1 ? <button className="button is-white" onClick={() => setChildsPage(childsPage - 1)}><FontAwesomeIcon icon={faAngleLeft} className=" is-size-3 has-text-grey"/></button> :null}

                {childs.length > (15*childsPage) ? <button className="button is-white" onClick={() => handleNextPage(childs, childsPage, setChildsPage, true, 15)}><FontAwesomeIcon icon={faAngleRight} className=" is-size-3 has-text-grey"/></button> :null}
            </div>
        </div>     
        </> : null}
        <div className="columns is-multiline is-flex is-justify-content-start">
            {childs && childs[0] ? childs.map((child, i) => {
            if ((childsPage === 1 && i < 15) || (i > (((childsPage - 1)*15)-1)) && (i < (((childsPage)*15)))) {
                let parentType = undefined
                if (child.person  && parent._id === child.person._id) parentType = "person"
                if (child.project && parent._id === child.project._id) parentType = "project"
                if (child.entity && parent._id === child.entity._id) parentType = "entity"
                if (child.roles && child.roles[0] && child.roles[0].title && child.roles[0].title !== "") {
                    
                    return <Fragment key={JSON.stringify(child)}>
                    <SearchItemParent item={child} handleSearchParent={handleSearchParent} relTypes={child.roles[0]} handleSearchDoc={handleSearchDoc} parent={parentType} i={i}/>
                </Fragment>   
                } else {
                    return <Fragment key={JSON.stringify(child)}>
                    <SearchItemParent item={child} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc} parent={parentType} i={i}/>
                </Fragment>   
                }
                }
                
            }) : null}
         </div>     
        <div className="columns is-multiline is-flex is-justify-content-start">
            {actors && actors[0] ? actors.map((actor) => {
                return <Fragment key={JSON.stringify(actor)}>
                    <SearchItemParent item={actor} handleSearchParent={handleSearchParent} relTypes={actor.role}/>
                </Fragment>   
            }) : null}
         </div>     
         <div className="columns is-multiline is-flex is-justify-content-start">
            {projects && projects[0] ? projects.map((project) => {
                return <Fragment key={JSON.stringify(project)}>
                    <SearchItemParent item={{project: project}} handleSearchParent={handleSearchParent}/>
                </Fragment>   
            }) : null}
         </div>                

         {/* <div className="columns is-multiline is-flex is-justify-content-center">
            {dataList && dataList[0] ? dataList.map((doc) => {
             
                    return <Fragment key={JSON.stringify(doc)}>
                        <SearchItemDoc item={{doc: doc}} handleSearchDoc={handleSearchDoc} relTypes={doc.relTypes}/>
                    </Fragment>   
                
            }) : null}
         </div> */}
         {docs && docs.length > 20 ? <div className="is-flex is-justify-content-end ">
                <nav className="pagination" role="navigation" aria-label="pagination">
              
              <ul className="pagination-list">
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 1 ? "is-current" : "")} aria-label="Page 1" aria-current="page" onClick={() => setPage(1)}>1</a>
                </li>
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 2 ? "is-current" : "")} aria-label="Goto page 2" onClick={() => setPage(2)}>2</a>
                </li>
                {docs.length > 40 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 3 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(3)}>3</a>
                </li> : null}
                {docs.length > 60 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 4 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(4)}>4</a>
                </li> : null}
                {docs.length > 80 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 5 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(5)}>5</a>
                </li> : null}
              </ul>
            </nav>
          </div> : null}
{/*    
        docs: [{ type: mongoose.Schema.ObjectId, ref: "Doc" }], //Link to child document
        roles: [{ type: mongoose.Schema.ObjectId, ref: "Role" }], //E.G. author, publisher, illustrator, developer..
        entity: [{ type: mongoose.Schema.ObjectId, ref: "Entity" }], //Replace with link to entity
        organism: [{type: mongoose.Schema.ObjectId, ref: "Organism"}],
        person: {type: mongoose.Schema.ObjectId, ref: "Person"}, //Replace with link to person
                tags: [{ type: mongoose.Schema.ObjectId, ref: "Tags" }] //Functions of the person
         */}
        

    </>
}

const getContent = (value, lang = "fr") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Show;