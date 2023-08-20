import React, {Fragment, useState, useEffect} from "react";
import {useTranslation} from "react-i18next"
import BoxItemParent from "../parents/SearchItem.jsx"

import {useUsers} from "../../../utils/hooks/Users.js"

import DocForm from "../../molecules/Create/DocForm"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck, faChevronDown, faChevronUp, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'

const Show = ({doc, handleSearchTag, client, setClient, setAlert, handleSearchParent, handleSearchDoc, handleBack}) => {
    const {
        title,
        description,
        languages,
        thumb,
        types,
        supports,
        parents,
    tags,
    childs
      } = doc


      const [addingWatchlist, setAddingWatchlist] = useState(false)
	const {updateUser, responseUpdateUser} = useUsers()
    const [displayFile, setDisplayFile] = useState(false)

    const [dataUpdate, setDataUpdate] = useState(false)
    
    useEffect(() => {
      if (dataUpdate && dataUpdate.success) {
        handleSearchDoc(dataUpdate._id)
        setDataUpdate(false)
      }
    }, [dataUpdate])

    const handleDisplayFile = (e) => {
        e.preventDefault()
        setDisplayFile(!displayFile)
      }

	const handleUpdateUser = (remove) => {
		if (client && client.user) {
            if (remove) {
                const newList = []
                client.user.watchList.map((watch) => {
                    if (watch._id !== doc._id) {
                        newList.push({_id: watch._id})
                    }
                })
                updateUser({watchList: newList}, client.user._id)
            } else {
                const watchlist = [...client.user.watchList, doc]
                updateUser({watchList: watchlist}, client.user._id)
            }
		}
	}

    useEffect(() => {
       if (responseUpdateUser && responseUpdateUser.success && responseUpdateUser.data) {
           setClient({user: responseUpdateUser.data})
           setAddingWatchlist(false)
       } else {
        setAddingWatchlist(false)
       }
    }, [responseUpdateUser])
    const includeParentType = (type, parents) => {
        let included = false
        parents.map((parent) => {
            if (parent[type]) {
                included = true
            }
        })
        return included
    }
    const convertDate = (date) => {
        const newDate = new Date(date)
        return newDate.toLocaleDateString()
    }
    const { t, i18n } = useTranslation() 

    const checkWatchlist = () => {
        let alreadyIn = false
        if (client && client.user) {
            client.user.watchList.map((watch) => {
                if (watch._id === doc._id) {
                    alreadyIn = true
                }
            })
        }
        return alreadyIn
    }

    console.log('doc: ', doc)

    return dataUpdate && !dataUpdate.success ? <>
     <DocForm client={client} setClient={setClient} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
    </> : <>
             <div className="is-flex is-justify-content-space-between mb-5">
                <div>
                <button className="button is-light is-medium tag  mb-2 mobile-only" id="backBtn" onClick={handleBack}>
                <FontAwesomeIcon icon={faRotateLeft} size="lg"/>
                <strong>&nbsp;{t('back')}</strong>
            </button>
                <div className="actions-btn">

            <button className="button is-light is-medium tag  mb-2" id="backBtn" onClick={handleBack}>
                <FontAwesomeIcon icon={faRotateLeft} size="lg"/>
                <strong>&nbsp;{t('back')}</strong>
            </button>

    {client && client.user ? !addingWatchlist ?	checkWatchlist() ? <button className="button   mb-2 is-primary ml-3 is-medium tag" onClick={(e) => {
				e.preventDefault()
				handleUpdateUser("remove")
                setAddingWatchlist(true)
			}}>{t('Remove from watchlist')}</button> : <button className="button is-primary  mb-2 ml-3 is-medium tag" onClick={(e) => {
				e.preventDefault()
				handleUpdateUser()
                setAddingWatchlist(true)
			}}>{t('Add to watchlist')}</button> : 		<button className="button is-primary  mb-2 ml-3 is-medium tag disabled is-disabled" disabled>{t('Loading...')}</button>
		 : null}
     
                {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? 
              <button className="button is-primary ml-3  is-medium tag" onClick={() => setDataUpdate(doc)}>
                  {t('update')}
              </button>
 : null }  
     {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") && doc.views && doc.views !== "" && doc.views !== null ? <>
                                    <span className="tag is-light is-medium button  ml-3">{doc.views} {t("views")}</span>
                                </> : null}
            </div>
                </div>
                <div>
                {types && types[0] ? <>
            {types.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-large is-white has-text-info mr-1 ml-1 mb-0">
                        {getContent(type.title,i18n.language)}
                    </span>
                </Fragment>
            })}
        </> : null}
                </div>
        
        </div>
        {thumb && thumb !== "" ? <>
            <div className="columns mb-0 pb-0">
                <div className="column mb-0 pb-0">
                <h1 className="mt-2 title is-1 has-text-left">{title}</h1>
                {languages && languages[0] ? <p className="has-text-left mb-1">{t('language')}: {languages[0].code.toUpperCase()}</p> : null}
                {doc.date && doc.date !== "" ? 
                                    <p className="has-text-left mt-0  mb-0 pt-0">{t('publication date')}: {doc.date} </p>
                              : null}
                {doc.eanIsbn && doc.eanIsbn !== "" ? 
                <p className="has-text-left mt-1  mb-0 pt-0">EAN/ISBN: {doc.eanIsbn} </p>
                                : null}        
                                {doc.pages && doc.pages !== "" ? <p className="has-text-left mt-1  mb-0 pt-0">{!(doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2) ? "Pages : " : null} {doc.pages} {doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2 ? "pages" : null}</p> : doc.volume && doc.volume !== "" ? 
                                <p className="has-text-left mt-1  mb-0 pt-0">{t('volume')} {doc.volume}</p>
                                : doc.number && doc.number !== "" ? 
                                <p className="has-text-left mt-1  mb-0 pt-0">{t('number')} {doc.number}</p>
                                 : null}  
                               {doc.issn && doc.issn !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">ISSN: {doc.issn} </p> : null}
                                {doc.duration && doc.duration !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">{doc.duration} </p> : null}
                                {doc.additionalCopyrights && doc.additionalCopyrights !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">{t('credits')}: {doc.additionalCopyrights} </p> : null}    
                {description && description[0] ? <p className="  mt-1 mb-0 pb-0 has-text-left">{getContent(description, i18n.language)}</p> : null}
                
                </div>
                <div className="column mb-0 pb-0">
                    <img src={thumb} alt="file" className="thumb-img"/> 
                </div>
            </div>
        </> : <>
        <h1 className="mt-2 title is-1 has-text-left">{title}</h1>
                {languages && languages[0] ? <p className="has-text-left mb-1">{t('language')}: {getContent(languages[0].labels, i18n.language)}</p> : null}
                {doc.date && doc.date !== "" ? 
                                    <p className="has-text-left mt-0  mb-0 pt-0">{t('publication date')}: {doc.date} </p>
                              : null}
                {doc.eanIsbn && doc.eanIsbn !== "" ? 
                <p className="has-text-left mt-1  mb-0 pt-0">EAN/ISBN: {doc.eanIsbn} </p>
                                : null}        
                                {doc.pages && doc.pages !== "" ? <p className="has-text-left mt-1  mb-0 pt-0">{!(doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2) ? "Pages : " : null} {doc.pages} {doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2 ? "pages" : null}</p> : doc.volume && doc.volume !== "" ? 
                                <p className="has-text-left mt-1  mb-0 pt-0">{t('volume')} {doc.volume}</p>
                                : doc.number && doc.number !== "" ? 
                                <p className="has-text-left mt-1  mb-0 pt-0">{t('number')} {doc.number}</p>
                                 : null}  
                               {doc.issn && doc.issn !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">ISSN: {doc.issn} </p> : null}
                                {doc.duration && doc.duration !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">{doc.duration} </p> : null}
                                {doc.additionalCopyrights && doc.additionalCopyrights !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">{t('credits')}: {doc.additionalCopyrights} </p> : null}    
                {description && description[0] ? <p className="  mt-1 mb-1 pb-0 has-text-left">{getContent(description, i18n.language)}</p> : null}
                
</>}
        {supports[0] && supports[0].url && supports[0].url.includes(('vimeo')) ?
                        <div className="is-flex is-justify-content-center ">
                            <iframe src={supports[0].url} width="740" height="460" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                        </div>
                    : null}


                        
        {supports && supports[0] ? <>
            {supports.map((supp) => {
                return <Fragment key={JSON.stringify(supp)}>
                    {supp.description && supp.description[0] && getContent(supp.description, i18n.language) !== ""  ?  <p className="has-text-left mt-1  mb-0 pt-0">{getContent(supp.description, i18n.language)}</p> :null}
                   
                    
                    {supp.format && supp.format !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">Format: {supp.format}</p> : null}
                    {supp.accessibility && supp.accessibility !== "" ?  <p className="has-text-left mt-1  mb-0 pt-0">{supp.accessibility}</p> : null}
                    {supp.url && supp.url !== "" && !supp.url.includes('vimeo') ?  <p className="has-text-left mt-1  mb-0 pt-0"><FontAwesomeIcon icon={faGlobe} className="has-text-primary mr-1 pt-1"/> <a href={supp.url}>{supp.url.replaceAll('//', "$4:").split('/')[0].replaceAll('$4:', "//") }</a>
                    </p> : null}
                    {supp.pdf && supp.pdf !== "" ? <div className="is-flex is-justify-content-start">
                    <div className="file has-name is-primary">
  <label className="file-label">
    <span className="file-cta">
                    <span className="file-label" onClick={handleDisplayFile}>
                    {!displayFile ? <>{t('show-file')}<FontAwesomeIcon icon={faChevronDown} className="is-primary mt-1 ml-2"/></> : <>{t('hide-file')} <FontAwesomeIcon icon={faChevronUp} className="is-primary mt-1 ml-2"/></>}
                    </span>
    </span>
    <span className="file-name">
      {supp.pdf.split("/")[supp.pdf.split('/').length - 1]}
    </span> 
    </label>
    </div>
                    </div> : null}
                    {supp.exemplaries && supp.exemplaries[0] ? <p className="has-text-left mb-0 mt-2 has-text-grey">{t('copies')}: </p>: null}
                    {supp.exemplaries && supp.exemplaries[0] ? supp.exemplaries.map((ex) => {
                        return <Fragment key={JSON.stringify(ex)}>
                            <p className="has-text-left mt-0 pt-0">{ex.position} {ex.position && ex.position !== "" ? "|" : null} {ex.location} {ex.location && ex.location!== "" ? "|" : null} {ex.quality} {ex.quality && ex.quality !== "" ? "|" : null} {ex.cote} </p>
                            
                        </Fragment>
                    }) : null}
                  
                       {displayFile && <div className="mt-3 h-100">
      {
        supp.pdf.split('.')[supp.pdf.split('.').length - 1].toLowerCase() === "pdf" ? <embed src={supp.pdf} width="100%" height="800px" /> : 
        ["png" , "jpg" , "jpeg" , "gif" , "ico" , "svg"].includes(supp.pdf.split('.')[supp.pdf.split('.').length - 1].toLowerCase()) ? <img src={supp.pdf} alt="file" className="file-img"/> :
        ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(supp.pdf.split('.')[supp.pdf.split('.').length - 1].toLowerCase()) ? <video src={supp.pdf}  className="file-video" controls/> : 
        ["wav", "mp3", "flac", "m4a"].includes(supp.pdf.split('.')[supp.pdf.split('.').length - 1].toLowerCase()) ? <audio src={supp.pdf} controls/> : null
      }
      </div>}

                </Fragment>
            })}
        </> : null }
        <div className="container mt-3">
        {tags && tags[0] ? <>
           
            {tags.map((type) => {
                let title = getContent(type.title, i18n.language)
                if (title !== "" && title !== " ") {
                    return <Fragment key={JSON.stringify(type)}>
                        <span className="tag is-medium is-info mr-1 ml-1 mt-1 indextag" onClick={() => handleSearchTag(type)}>
                            {title && title.length >= 14 ? title.slice(0, 14) + ".." : title}
                        </span>
                    </Fragment>
                }
            })}
        </> : null}
        </div>
        {includeParentType("project", parents) ? <>
        <h3 className="subtitle has-text-grey has-text-left is-5">Projects</h3>
        <div className="columns is-multiline is-flex is-justify-content-start">
        {parents && parents ? <>
                        
                        {parents.map((parent) => {
                            if (parent.project) {
                                return <Fragment key={JSON.stringify(parent)}>    
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
                            </Fragment>
                            }
                        })}
                    </> : null}
        </div>
        </> : null}
        {includeParentType("parent_doc", parents) ? <>
        <hr />
        <h3 className="subtitle has-text-grey has-text-left is-5">{t('Docs')}</h3>
        <div className="columns is-multiline is-flex is-justify-content-start">
        {parents && parents ? <>
                        
                        {parents.map((parent) => {
                            if (parent.parent_doc) {
                                return <Fragment key={JSON.stringify(parent)}>    
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
                            </Fragment>
                            }
                        })}
                    </> : null}
        </div> </> : null}
        {includeParentType("person", parents) ? <>
        <hr />
        <h3 className="subtitle has-text-grey has-text-left is-5">{t('people')}</h3>
        <div className="columns is-multiline is-flex is-justify-content-start">
        {parents && parents ? <>
                        
                        {parents.map((parent) => {
                            if (parent.person) {
                                return <Fragment key={JSON.stringify(parent)}>    
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
                            </Fragment>
                            }
                        })}
                    </> : null}
        </div></> : null}
        {includeParentType("entity", parents) ? <>
        <hr />
        <h3 className="subtitle has-text-grey has-text-left is-5">{t('Organizations')}</h3>
        <div className="columns is-multiline is-flex is-justify-content-start">
        {parents && parents ? <>
                        
                        {parents.map((parent) => {
                            if (parent.entity) {
                                return <Fragment key={JSON.stringify(parent)}>    
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
                            </Fragment>
                            }
                        })}
                    </> : null}
        </div></> : null}
        {childs && childs[0] ? <>
        <hr />
        <h3 className="subtitle has-text-grey has-text-left is-5">{types && types[0] && types[0]._id === "6404c457e377d276c2dcac8a" ? t('Articles') : t('document')}</h3>
        <div className="columns is-multiline is-flex is-justify-content-start">
                        
                        {childs.map((parent) => {
                            console.log(parent.roles[0])
                            if (parent.doc) {
                                return <Fragment key={JSON.stringify(parent)}>    
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc} parent="parent_doc" />
                            </Fragment>
                            }
                        })}
        </div></> : null}
        
        

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