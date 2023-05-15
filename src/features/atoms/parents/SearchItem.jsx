import React, {Fragment} from "react"

import {useTranslation} from "react-i18next"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import DocSearchItem from "../docs/SearchItem.jsx"

const BoxItem = ({item, handleSearchParent, handleSearchDoc, relTypes, handleDelete}) => {
    //console.log("item : ", item)
    const { t, i18n } = useTranslation() 
    if (item.project) {
        return <div className="column is-one-quarter" >
            <div className="box results-col " onClick={() => handleSearchParent(item.project)}>
            <div className="is-flex is-justify-content-end mb-0 mt-0">
                    {!relTypes ? <>
                        {item.roles && item.roles[0] ? <>
                        <span className="tag is-primary">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> : <span className="tag is-primary">
                            {t('project')}
                        </span>}
                    </> : <span className="tag is-primary">
                        {getContent(relTypes.title, i18n.language)}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                    </div>
                    <h3 className="subtitle is-5 mb-1 mt-1">{item.project.title}</h3>
                <p>{item.project.description && item.project.description[0] && getContent(item.project.description, i18n.language) ? getContent(item.project.description, i18n.language).substring(0,25) + "..." : null}</p>
                
            </div>
        </div>
    } else if (item.person) {
        if (item.person.productions)
        return <div className="column is-one-quarter">
            <div className="box results-col " onClick={() => handleSearchParent(item.person)}>
            <div className="is-flex is-justify-content-end mt-0 mb-0 tag-bottom">
            {item.roles && item.roles[0] ? <>
                        <span className="tag is-primary">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> :<span className="tag is-primary">
                        {t('person')}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.person.name !== "" ? item.person.name : item.person.firstName + " " + item.person.lastName}</h3>
                <span className='has-text-grey'><small>{item.person.country && item.person.country[0] ? getContent(item.person.country[0].labels, i18n.language) + (item.person.city ? ", " : "") : null}{item.person.city}</small></span>
                <p>{item.person.description && item.person.description[0] ? getContent(item.person.description, i18n.language).substring(0,20) + "..." : null}</p>
                {item.person.productions && item.person.productions[0] ? <>
                    <hr />
                    <div className="is-flex is-justify-content-start mb-2">
                        <span className="subtitle is-7 has-text-left mb-0"><strong>{t('documents')}: </strong></span>
                    </div>
                    <div className="is-flex is-justify-content-start ">
                        <div className="mt-0">
                        {item.person.productions.map((prod, i) => {
                            if (i < 2) {
                                return prod.docs.map((doc) => {
                                    return <Fragment key={JSON.stringify(doc)}>
                                        <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{doc.title.slice(0,20) + "..."}</span>
                                    </Fragment>
                                })
                            }
                        })}
                        {item.person.productions.length > 2 ? <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.person.productions.length -2} {t('more')}</span> : null}
                        </div>
                    </div>
                </> : null}
                
            </div>
        </div>
    } else if (item.entity) {
        return <div className="column is-one-quarter">
            <div className="box results-col " onClick={() => handleSearchParent(item.entity)}>
            <div className="is-flex is-justify-content-end mt-0 mb-0">
            {item.roles && item.roles[0] ? <>
                        <span className="tag is-primary">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> :<span className="tag is-primary">
                        {t('organization')}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.entity.name}</h3>
                <span className='has-text-grey'><small>{item.entity.country ? item.entity.country + ", " : null}{item.entity.city}</small></span>
                <p>{item.entity.description && item.entity.description[0] ? getContent(item.entity.description, i18n.language).substring(0,20) + "..." : null}</p>
                
            </div>
        </div>
    } else if (item.doc) {
        return <DocSearchItem item={item} handleSearchDoc={handleSearchDoc} handleDelete={handleDelete}/>
    }
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default BoxItem