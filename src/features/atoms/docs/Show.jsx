import React, {Fragment, useState, useEffect} from "react";
import {useTranslation} from "react-i18next"
import BoxItemParent from "../parents/SearchItem.jsx"

import {useUsers} from "../../../utils/hooks/Users.js"

import DocForm from "../../molecules/Create/DocForm"

const Show = ({doc, handleSearchTag, client, setClient, setAlert, handleSearchParent, handleSearchDoc}) => {
    const {
        title,
        description,
        languages,
        types,
        supports,
        parents,
    tags,
      } = doc
    
      const [addingWatchlist, setAddingWatchlist] = useState(false)
	const {updateUser, responseUpdateUser} = useUsers()

    const [dataUpdate, setDataUpdate] = useState(false)
    
    useEffect(() => {
      if (dataUpdate && dataUpdate.success) {
        handleSearchDoc(dataUpdate._id)
        setDataUpdate(false)
      }
    }, [dataUpdate])
    

	const handleUpdateUser = () => {
		if (client && client.user) {
            const watchlist = [...client.user.watchList, doc]
            updateUser({watchList: watchlist}, client.user._id)
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

    const { t, i18n } = useTranslation() 
    return dataUpdate && !dataUpdate.success ? <>
     <DocForm client={client} setAlert={setAlert} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate}/>
    </> : <>
             <div className="is-flex is-justify-content-end">
        {types && types[0] ? <>
            {types.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-primary mr-1 ml-1 mb-0">
                        {getContent(type.title,i18n.language)}
                    </span>
                </Fragment>
            })}
        </> : null}
        {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? 
              <button className="button tag is-info ml-3 is-medium" onClick={() => setDataUpdate(doc)}>
                  {t('update')}
              </button>
 : null }  
        </div>
        <h1 className="mt-2">{title}</h1>
        {description && description[0] ? <p>{getContent(description, i18n.language)}</p> : null}
        {languages && languages[0] ? <p>{getContent(languages[0].labels, i18n.language)}</p> : null}
        
        <div className="container mt-3">
        {doc.pages && doc.pages !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{!(doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2) ? "Pages : " : null} {doc.pages} {doc.pages.charAt(0) * 2 && doc.pages.charAt(doc.pages.length -1) * 2 ? "pages" : null}</span>
                                </> : doc.volume && doc.volume !== "" ? <> 
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{t('volume')} {doc.volume}</span>
                                </> : doc.number && doc.number !== "" ? <> 
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{t('number')} {doc.number}</span>
                                </> : null}
                                {doc.date && doc.date !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{doc.date} </span>
                                </> : null}
                                {doc.publishedAt && doc.publishedAt !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{doc.publishedAt} </span>
                                </> : null}

                               {doc.issn && doc.issn !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">ISSN: {doc.issn} </span>
                                </> : null}
                                {doc.eanIsbn && doc.eanIsbn !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">EAN/ISBN: {doc.eanIsbn} </span>
                                </> : null}
                                {doc.duration && doc.duration !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{doc.duration} </span>
                                </> : null}
                                {doc.additionalCopyrights && doc.additionalCopyrights !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{t('credits')}: {doc.additionalCopyrights} </span>
                                </> : null}
                                 {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") && doc.views && doc.views !== "" && doc.views !== null ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{doc.views} {t("views")}</span>
                                </> : null}
                                {client && client.user ? !addingWatchlist ?		<button className="button tag is-medium is-primary ml-1" onClick={(e) => {
				e.preventDefault()
				handleUpdateUser()
                setAddingWatchlist(true)
			}}>{t('Add to watchlist')}</button> : 		<button className="button tag is-medium is-primary ml-1 disabled is-disabled" disabled>{t('Loading...')}</button>
		 : null}
        </div>                    
        {supports && supports[0] ? <div className="container mt-3">
            {supports.map((supp) => {
                return <Fragment key={JSON.stringify(supp)}>
                    {supp.url && supp.url !== "" ? <>
                        <span className="tag is-light is-medium  mb-2  ml-1 mr-1">URL: <a href={supp.url}>{supp.url}</a></span>
                    </> : null}
                    {supp.pdf && supp.pdf !== "" ? <>
                        <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{supp.pdf} {t("PDF")}</span>
                    </> : null}
                    {supp.format && supp.format !== "" ? <>
                        <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{supp.format}</span>
                    </> : null}
                    {supp.accessibility && supp.accessibility !== "" ? <>
                        <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{supp.accessibility}</span>
                    </> : null}
                    {supp.exemplaries && supp.exemplaries[0] ? supp.exemplaries.map((ex) => {
                        return <Fragment key={JSON.stringify(ex)}>
                          
                            {ex.position && ex.position !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2 ml-1 mr-1">{ex.position} </span>
                                </> : null}
                                {ex.location && ex.location !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{ex.location} </span>
                                </> : null}
                                {ex.quality && ex.quality !== "" ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1"> {ex.quality} </span>
                                </> : null}
                                {ex.cote && ex.cote !== "" && ex.cote !== null ? <>
                                    <span className="tag is-light is-medium  mb-2  ml-1 mr-1">{ex.cote}</span>
                                </> : null}
                        </Fragment>
                    }) : null}
                </Fragment>
            })}
        </div> : null }

        <div className="columns is-multiline is-flex is-justify-content-center">
        {parents && parents ? <>
                        
                        {parents.map((parent) => {
                            return <Fragment key={JSON.stringify(parent)}>                                   
                                <BoxItemParent item={parent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
                            </Fragment>
                        })}
                    </> : null}
        </div>
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