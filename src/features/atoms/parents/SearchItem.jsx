import React, {Fragment} from "react"

import {useTranslation} from "react-i18next"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import DocSearchItem from "../docs/SearchItem.jsx"

const BoxItem = ({item, handleSearchParent, handleSearchDoc, relTypes, handleDelete, parent, i, handleSearchScapinParent, width}) => {
    const index = i - ((i/4).toString()[0] * 4)
    let colClasses = i || index === 0 ? " smooth-appear" : ""
    colClasses += i && index === 0 ? "" : index === 4 ? " sm5" : index === 3 ? " sm4" : index === 2 ? " sm3" : index === 1 ? " sm2" : ""
    
    console.log('item: ', item)

    const { t, i18n } = useTranslation() 
    if (parent !== "production" && item.scapin) {
        return <div className="column is-one-quarter-desktop is-half-tablet">
            <div className={"box results-col "+colClasses} onClick={() => handleSearchScapinParent(item, "parent")}>
            <div className="is-flex is-justify-content-end mt-0 mb-0">
            {item.person ? <>
                        <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {t('person')}
                    </span>
                    </> :<span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {t('organization')}
                    </span>}
                    
                </div>
                {item.entity ? <>
                    <h3 className="subtitle is-5 mb-1 mt-1">{item.entity.name}</h3>
                <span className='has-text-grey'><small>{item.entity.country ? item.entity.country + ", " : null}{item.entity.city}</small></span>
                <p>{item.entity.description && item.entity.description[0] ? getContent(item.entity.description, i18n.language).substring(0,20) + "..." : null}</p>
                
                </>: <>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.person.name}</h3>
                <span className='has-text-grey'><small>{item.person.country ? item.person.country + ", " : null}{item.person.city}</small></span>
                <p>{item.person.description && item.person.description[0] ? getContent(item.person.description, i18n.language).substring(0,20) + "..." : null}</p>
                
                </>}
                {item.roles && item.roles[0] ? <>
                    <hr />
         
                    <div className="is-flex is-justify-content-space-around">
                        <div>
                        {item.roles.map((tag, i) => {
                            let title = getContent(tag.title, i18n.language)
                            if (i < 2 && title !== "Error" && title !== "") {
                                return <Fragment key={JSON.stringify(tag)}>
                                <span className="tag is-info is-small mb-2 " >{title}</span>
                               
                            </Fragment>
                            } else if (i < 2) {
                                let title = getContent(item.doc.tags[i + 1].title, i18n.language)

                                return <Fragment key={JSON.stringify(tag)}>
                                <span className="tag is-info is-small mb-2 " >{title}</span>
                               
                            </Fragment>
                            }
                        })}
                        </div>
                    </div>
                </> : null}
            </div>
        </div>
    } else if (item.project && parent !== "project") {
        return <div className={width !== "full" ? "column is-one-quarter-desktop is-half-tablet" : "column"} >
            <div className={"box results-col "+ colClasses} onClick={() => {
                if (!handleDelete) handleSearchParent(item.project)
            }}>
            <div className="is-flex is-justify-content-end mb-0 mt-0">
                    {!relTypes ? <>
                        {item.roles && item.roles[0] ? <>
                        <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> :<span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {t('project')} 
                    </span>}
                    </> : <span className="tag has-text-info">
                        {getContent(relTypes.title, i18n.language)}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                    </div>
                    <h3 className="subtitle is-5 mb-1 mt-1">{item.project.title}</h3>
                <p>{item.project.description && item.project.description[0] && getContent(item.project.description, i18n.language) ? getContent(item.project.description, i18n.language).substring(0,25) + "..." : null}</p>
                {item.project.childs.length > 0 ? <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.project.childs.length} {t('documents')}</span> : null}

            </div>
        </div>
    } else if (item.person && parent !== "person") {
        return <div className={width !== "full" ? "column is-one-quarter-desktop is-half-tablet" : "column"}>
            <div className={"box results-col " +colClasses} onClick={() => {
                if (!handleDelete) handleSearchParent(item.person)
            }}>
            <div className="is-flex is-justify-content-end mt-0 mb-0 tag-bottom">
            {!relTypes ? <>
                {item.roles && item.roles[0] ? <>
                        <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> :<span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {t('person')} 
                    </span>}
            </> : <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
            {getContent(relTypes.title, i18n.language)}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.person.name !== "" ? item.person.name : item.person.firstName + " " + item.person.lastName}</h3>
                <span className='has-text-grey'><small>{item.person.country && item.person.country[0] ? getContent(item.person.country[0].labels, i18n.language) + (item.person.city ? ", " : "") : null}{item.person.city}</small></span>
           
                <div className="is-flex is-justify-content-start mb-0">
                        <div className="mt-3 mb-0">
                    
                        {item.person.childs.length > 0 ? <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.person.childs.length} {t('documents')}</span> : null}
                        </div>
                    </div>
            </div>
        </div>
    } else if (item.entity && parent !== "entity") {
        return <div className="column is-one-quarter-desktop is-half-tablet">
            <div className={"box results-col "+colClasses} onClick={() => {
                if (!handleDelete) handleSearchParent(item.entity)
            }}>
            <div className="is-flex is-justify-content-end mt-0 mb-0">
            {item.roles && item.roles[0] ? <>
                        <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {getContent(item.roles[0].title, i18n.language)}
                    </span>
                    </> :<span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                        {t('organization')}
                    </span>}
                    {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                handleDelete(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.entity.name}</h3>
                <span className='has-text-grey'><small>{item.entity.country ? item.entity.country + ", " : null}{item.entity.city}</small></span>
                <p>{item.entity.description && item.entity.description[0] ? getContent(item.entity.description, i18n.language).substring(0,20) + "..." : null}</p>
                {item.entity.childs.length > 0 ? <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.entity.childs.length} {t('documents')}</span> : null}

            </div>
        </div>
    } else if (parent === "production") {
            return <div className={"column is-one-quarter-desktop is-half-tablet"} onClick={() => handleSearchScapinParent(item)}>
                    <div className={"box results-col " +colClasses} onClick={() => {
                           
                    }}>
                    <div className="is-flex is-justify-content-end mt-0 mb-0">
                            <span className="tag is-white is-medium pb-5 pr-0 has-text-info">
                                {item.prod && item.prod.roles && item.prod.roles[0] && getContent(item.prod.roles[0].title, i18n.language) !== "Error" ? getContent(item.doc.roles[0].title, i18n.language) : t('production')}
                            </span>
                        </div> 
                        {handleDelete ? <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                        handleDelete(e, item)
                      }}><FontAwesomeIcon icon={faCircleXmark} /></i> : null}
                                  {item.doc && item.doc.thumb && item.doc.thumb !== "" ? <img src={item.doc.thumb} alt="file" className="thumb-img"/> : null}
        
                    <h3 className="subtitle is-6 mb-1 mt-1">{item.prod && item.prod.title}</h3>
                    <h3 className="subtitle is-6 mb-1 mt-1 has-text-grey mt-3"><small>{item.prod && item.prod.date}</small></h3>
                </div>
            </div>
             
    }else if (item.parent_doc && parent !== "parent_doc") {
        return <DocSearchItem item={{...item, doc: item.parent_doc}} handleSearchDoc={handleSearchDoc} handleDelete={handleDelete}i={i} relTypes={relTypes}/>
    } else if (item.doc && parent !== "doc") {
        return <DocSearchItem item={item} handleSearchDoc={handleSearchDoc} handleDelete={handleDelete} i={i} relTypes={relTypes}/>
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