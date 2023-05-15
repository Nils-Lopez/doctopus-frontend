import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import ParentSearchItem from "../../parents/SearchItem"

import {useDocs} from "../../../../utils/hooks/docs/Docs"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import {useTranslation} from "react-i18next"

const DocParentForm = ({selectedDoc, selectDoc, location, template, lang, hideRoles, setAlert}) => {
  const [docValue, setDocValue] = useState("")
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  const { t, i18n } = useTranslation() 
  const [docs, setDocs] = useState([])
  const [docsLoading, setDocsLoading] = useState(false)    
  const [pending, setPending] = useState("")
  
    const {
        searchDocs, 
        responseSearchDocs
    } = useDocs()

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

  const isNotIncluded = (query, array) => {
    let included = false
    array.map((a) => {
      if (a.title.toLowerCase() === query.toLowerCase()) {
        included = true
      } 
    })
    return !included
  }

  useEffect(() => {
    if (docValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([... selectedRoles, role])
        }
      })
    }
  }, [template, docValue])
  
  const handleDocChange = (e) => {
    e.preventDefault()
    setDocValue(e.target.value)
  }
  
  const isDocExisting = (docName) =>  {
    let retrievedDoc = undefined
    docs.map((doc) => {
      if (doc.title=== currentDoc) {
        retrievedDoc = doc
      } 
    })
    if (retrievedDoc) {
      return retrievedDoc
    } else return false
  }
  
  const handleDocBtn = (e) => {
    e.preventDefault()
    const docDoc = isDocExisting(docValue)
    let unique = true
    selectedDoc.map((doc) => {
      if (doc.title === docValue) {
        unique = false
      }
    })
    
    if (unique) {
      if (docDoc) {
      selectDoc([...selectedDoc, {doc: docDoc, roles: selectedRoles}])
      selectRole([])
      setDocValue("")
    }
   }
  }
    
  const handleDeleteDoc = (e, doc) => {
    e.preventDefault()
    const filtered = selectedDoc.filter((r) => {
      return r !== doc
    })
    selectDoc(filtered)
    setDocs([])
  }

const searchDocValue = (e) => {
    e.preventDefault()
    if (docValue !== "") {
      setDocsLoading(true)
      searchDocs(docValue)
    }
  }

  useEffect(() => {
    if (responseSearchDocs && responseSearchDocs.success && responseSearchDocs.data[0] && docsLoading) {
      setDocsLoading(false)
      setDocs(responseSearchDocs.data)
      setCurrentDoc(responseSearchDocs.data[0].title)
    } else if (responseSearchDocs && docsLoading) {
      setDocsLoading(false)
      setAlert({type: "error", message: { en: t('cannot-find-doc'), fr:  t('cannot-find-doc')}})
    }
  }, [responseSearchDocs])


  useEffect(() => {
    docs.map((doc) => {
        if (doc.title === docValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(docValue)
      } else {
        setPending("")
      }
  }, [docs])

    const changeCurrentDoc = (e) => {
    e.preventDefault()
    setCurrentDoc(e.target.value)
    setDocValue(e.target.value)
  }


  const [currentDoc, setCurrentDoc] = useState({})
  return <>
    <div className="field">
      {location !== "templates-parents" ? <label className="label title is-5">{t('document')}</label> : null}
      <div className="columns">
        <div className="column is-three-fifth">
          {(!docs || !docs[0]) ? <>
          <input type="text" className="input" placeholder={location === "templates-parents" ?  t('default-doc') : ""} value={docValue} onChange={handleDocChange}/>
          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentDoc} onChange={changeCurrentDoc} name={"peopless"} id={"peoplesss"}>
            {pending !== "" && isNotIncluded(pending, docs) ? <>
                  <option value={pending}>{pending} ({t('draft')})</option>
                </> : null}
                {docs.map((t) => {
                  return <Fragment key={t.title}>
                    <option value={t.slug}>{t.title}</option>
                  </Fragment>
                })}
                
            </select>
          </div>}
        </div>
        <div className="column is-one-fifth">
          {!docs || !docs[0] ? <>
            {docValue !== "" && !docsLoading ? <button className="button is-primary" onClick={searchDocValue}>{t('search')}</button> : <button className="button is-primary is-disabled" disabled>{t('search')}</button>}
          </> : <>
            {(docValue !== "" && selectedRoles[0]) || (docValue !== "" && !isDocExisting(docValue)) || (docValue !== "" && hideRoles) ? <button className="button is-primary " onClick={handleDocBtn}>
            {isDocExisting(docValue) ? t('add') : t('create')}
          </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}
            <span className="tag is-danger is-medium ml-2 mt-1 button" onClick={() => {
                setDocs([]);
              }}><FontAwesomeIcon icon={faTrash}/></span>
          </>}
          
        </div>
      </div>
      {docValue !== "" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location="doc-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      <datalist id="doc">
        {docs && docs[0] ? docs.map((doc, i) => {
          if (i < 7) {
            return <Fragment key={doc._id + "display"}>
              <option>{doc.title ? doc.title : doc.slug}</option>
            </Fragment>
          }
        }) : null}
      </datalist>
      {selectedDoc && selectedDoc[0] ? selectedDoc.map((doc) => {
        if (doc.doc && (doc.doc.title || doc.doc.slug)) {
          return <Fragment key={doc.doc._id + "selected"}>
            
                         <ParentSearchItem item={doc} handleDelete={handleDeleteDoc}/>

          </Fragment>
        }
      }) : null}
    </div>
  </>
}

export default DocParentForm