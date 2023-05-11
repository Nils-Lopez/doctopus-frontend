import React, {Fragment, useState, useEffect} from "react";
import {useTranslation} from "react-i18next"

import SearchItemParent from "./SearchItem"
import SearchItemDoc from "../docs/SearchItem"

import PersonForm from "../../molecules/Create/PersonForm"
import OrganisationForm from "../../molecules/Create/OrganisationForm"
import ProjectForm from "../forms/orgs/ProjectForm"

const Show = ({parent, client, setAlert, handleSearchParent, handleSearchDoc}) => {
    
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
        createdDocs
    } = parent

    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
    const [docs, setDocs] = useState([])
    
    useEffect(() => {
     if (dataUpdate && dataUpdate.success) {
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

    console.log('datalist: ', docs)

    return dataUpdate && !dataUpdate.success ? <>
     {dataUpdate.projects ? 
      <OrganisationForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     : dataUpdate.entities ? <>
       <ProjectForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     </> : <>
      <PersonForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
     </>}
    </> : <>
     {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <div className="is-flex is-justify-content-end">
              <button className="button is-primary" onClick={() => setDataUpdate(parent)}>
                  {t('update')}
              </button>
          </div>
 : null }
        <div className="is-flex is-justify-content-end">
        {roles && roles[0] ? <>
            {roles.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-primary mr-1 ml-1 mb-0">
                        {getContent(type.title, i18n.language)}
                    </span>
                </Fragment>
            })}
        </> : null}
        </div>
        <h1 className="mt-2">{title && title !== "" ? title : name && name !== "" ? name : firstName + " " + lastName}</h1>
        {description && description[0] ? <p>{getContent(description, i18n.language)}</p> : null}
        {languages && languages[0] ? <p>{getContent(languages[0].labels, i18n.language)}</p> : null}
        
        <div className="container mt-3">
        {country && country !== "" ? <>
                                {typeof country === "string" ?<span className="tag is-light is-small mb-2 ml-1 mr-1">{country}</span> : country.map((c) => {
                                   if (c.labels[0]) {
                                    return <Fragment key={JSON.stringify(c)}><span className="tag is-light is-small mb-2 ml-1 mr-1">{getContent(c.labels, i18n.language)}</span></Fragment>
                                   }
                            })}
                                </> : null} 
                                { city && city !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{city}</span>
                                </> :null} 
                                { website && website !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1"><a href={website}>{website}</a></span>
                                </> : null}
                                { url && url !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1"><a href={url}>{url}</a></span>
                                </> : null}
                                {birthDate && birthDate !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{birthDate} {deathDate && deathDate !== "" ? " - " + deathDate : null}</span>
                                </> : null}
                                {startedAt && startedAt !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{startedAt} {endedAt && endedAt !== "" ? " - " + endedAt : null}</span>
                                </> : null}

                               {issn && issn !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">ISSN: {issn} </span>
                                </> : null}
                                {date && date !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{date} </span>
                                </> : null}
                               
                                <hr />
        </div>   
        <div className="columns is-multiline is-flex is-justify-content-center">
            {actors && actors[0] ? actors.map((actor) => {
                return <Fragment key={JSON.stringify(actor)}>
                    <SearchItemParent parent={actor} handleSearchParent={handleSearchParent} relTypes={actor.role}/>
                </Fragment>   
            }) : null}
         </div>     
         <div className="columns is-multiline is-flex is-justify-content-center">
            {projects && projects[0] ? projects.map((project) => {
                return <Fragment key={JSON.stringify(project)}>
                    <SearchItemParent parent={{project: project}} handleSearchParent={handleSearchParent}/>
                </Fragment>   
            }) : null}
         </div>                

         <div className="columns is-multiline is-flex is-justify-content-center">
            {dataList && dataList[0] ? dataList.map((doc) => {
             
                    return <Fragment key={JSON.stringify(doc)}>
                        <SearchItemDoc item={{doc: doc}} handleSearchDoc={handleSearchDoc} relTypes={doc.relTypes}/>
                    </Fragment>   
                
            }) : null}
         </div>
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