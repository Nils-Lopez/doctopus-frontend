import React, {Fragment, useEffect, useState} from "react"

import SearchItem from "../docs/SearchItem"
import {useTranslation} from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import DocTagsForm from "../forms/docs/DocTagsForm"

const Show = ({client, docs, tag, setDisplayDoc, handleSearchTag, handleBack, setAlert}) => {

    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
  const [updateTag, setUpdateTag] = useState(null)
    const [mergeTag, setMergeTag] = useState(null)

    const handleDisplay = (doc) => {
        handleSearchTag(false)
        setDisplayDoc(doc)
    }
    const { t, i18n } = useTranslation()
    const [idLang, setIdLang] = useState("fr")

    useEffect(() => {
        if (page === 1) {
            setDataList(docs.slice(0, 20))
        } else {
            setDataList(docs.slice((page*10), ((page*10)+20)))
        }
    }, [page])

    const handleUpdate = (e) => {
      e.preventDefault()

      setUpdateTag(tag)

    }


    return <>
    <div className="is-flex is-justify-content-space-between">
            <button className="button is-light is-medium tag" id="backBtn" onClick={handleBack}>
                <FontAwesomeIcon icon={faRotateLeft} size="lg"/>
                <strong>&nbsp;{t('back')}</strong>
            </button>
            {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ?
              <div>
                {!updateTag ? <button className="button is-primary is-medium tag" onClick={handleUpdate}>
                    <strong>{t('update')}</strong>&nbsp;
                </button>: <>
               {!mergeTag ?  <button className="button is-primary is-medium tag mr-2" onClick={() => {setMergeTag(true)}}>
                      <strong>{t('merge')}</strong>&nbsp;
                  </button> : null}
                  <button className="button is-info is-medium tag" onClick={() => {
                    if (mergeTag) setMergeTag(false)
                    else setUpdateTag(false)
                  }}>
                      <strong>{t('cancel')}</strong>&nbsp;
                  </button>
                  
                </>}
                
              </div> 
            : null}
            </div>
        {!updateTag ? <>
              
        <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1"><small>{t('tag')}:</small></h3>
        <h3 className="subtitle is-2 has-text-grey mt-0 pt-0 mb-6"><strong className="has-text-primary">{getContent(tag.title, i18n.language)}</strong></h3>
        <div className="columns is-multiline">
            {dataList.map((doc, i) => {
                return <Fragment key={JSON.stringify(doc)}>
                    <SearchItem item={{doc: doc}} setDisplay={handleDisplay}/>
                </Fragment>
            })}
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
        </> : client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ?
<>
        {updateTag === "loading" ? <div className="loader">
    <div className="inner one"></div>
    <div className="inner two"></div>
    <div className="inner three"></div>
  </div> : <div className="is-flex is-justify-content-center columns">
         {!mergeTag ? <div className="column is-half container">
         <div className="tabs">
        <ul>
          <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
          <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
        </ul>
      </div>
          <DocTagsForm tag={updateTag} handleSearchTag={handleSearchTag} setUpdateTag={setUpdateTag} setAlert={setAlert} lang={idLang}/>
      </div> : <div className="column is-half container">
      <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1"><small>{t('merge')}:</small></h3>
        <h3 className="subtitle is-2 has-text-grey mt-0 pt-0 mb-6"><strong className="has-text-primary">{getContent(tag.title, i18n.language)}</strong></h3>
        <DocTagsForm merge={updateTag} handleSearchTag={handleSearchTag} setUpdateTag={setUpdateTag} setMergeTag={setMergeTag} setAlert={setAlert} lang={idLang}/>
      
      </div>}
        </div>}
        </> : null}
    </>
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Show