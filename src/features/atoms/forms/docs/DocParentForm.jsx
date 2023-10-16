import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import ParentSearchItem from "../../parents/SearchItem"

import {useDocs} from "../../../../utils/hooks/docs/Docs"

import SearchForm from "../SearchForm"
import {useTranslation} from "react-i18next"

const DocParentForm = ({selectedDoc, selectDoc, location, template, lang, hideRoles, setAlert}) => {
  const [docValue, setDocValue] = useState("")
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  const { t, i18n } = useTranslation() 
  const [docs, setDocs] = useState([])

  
  const {
    searchDocs, 
    responseSearchDocs
  } = useDocs()

  useEffect(() => {
    if (docValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([... selectedRoles, role])
        }
      })
    }
  }, [template, docValue])
  
  const handleDeleteDoc = (e, doc) => {
    e.preventDefault()
    
    const filtered = []
    selectedDoc.map((r) => {
      if (location !== "app-dash") {
        if (r.parent_doc._id !== doc.parent_doc._id) {
          filtered.push(r)
        }
      } else {
        if (r.parent_doc !== doc.parent_doc) {
          filtered.push(r)
        }
      }
    })
    selectDoc(filtered)
    setDocs([])
  }


  const handleAddDoc = (doc) => {
    if (location !== "app-dash") selectDoc([...selectedDoc, {parent_doc: doc, roles: selectedRoles}])
    else selectDoc([...selectedDoc, doc])
    selectRole([])

    setDocValue("")
  }

  const [noDocFound, setNoDocFound] = useState(false)

  return <>
    {(template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="docs" location="org-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
    {(selectedRoles && selectedRoles[0]) || (template && !template.parent_role) || (hideRoles && location === "app-dash") ? 
      <SearchForm selectedItems={selectedDoc} handleAddItem={handleAddDoc} searchItems={searchDocs} responseSearchItems={responseSearchDocs} mainField={"title"} setNoDocFound={setNoDocFound}/>
    : null}
    {noDocFound ? <p className="subtitle is-6 has-text-primary has-text-left mt-0"><small>{t('cannot-find-doc')}</small></p> : null}  
    <div className="columns is-multiline">
      {selectedDoc && selectedDoc[0] ? selectedDoc.map((doc) => {
        if (doc.parent_doc && (doc.parent_doc.title || doc.parent_doc.slug)) {
          return <Fragment key={doc.parent_doc._id + "selected"}>
            
                         <ParentSearchItem item={doc} handleDelete={handleDeleteDoc}/>

          </Fragment>
        } else if (location === "app-dash") {
          return <Fragment key={doc + "selected"}>
            
            <ParentSearchItem item={{parent_doc: doc}} handleDelete={handleDeleteDoc}/>

          </Fragment>
        }
      }) : null}
    </div>
  </>
}

export default DocParentForm