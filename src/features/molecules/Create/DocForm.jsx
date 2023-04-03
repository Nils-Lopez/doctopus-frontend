import React, {useState, Fragment, useEffect} from 'react';
  
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"
import SupportForm from "./SupportForm"  
import ParentForm from "./ParentForm"  
import RoleForm from "../../atoms/forms/RoleForm"

import {useDocs} from "../../../utils/hooks/docs/Docs"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const DocForm = ({client, setAlert, selectedType, handleSelectType}) => {
  
  const [titleValue, setTitleValue] = useState("")
  const [defaultSlug, setDefaultSlug] = useState("")
  const [slugValue, setSlugValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [idLang, setIdLang] = useState("fr")
  const [langEnValue, setLangEnValue] = useState("")
  const [langFrValue, setLangFrValue] = useState("")
  const [selectedLangs, selectLang] = useState([])
  const [showIdentityForm, setShowIdentityForm] = useState(true)
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [showParentForm, setShowParentForm] = useState(false)
  const [copyrightsValue, setCopyrightsValue] = useState("")

  const [selectedTags, selectTag] = useState([])
  
  const [selectedOrg, selectOrg] = useState([])
  const [selectedPeople, selectPerson] = useState([])
  const [selectedProjects, selectProject] = useState([])
  const [selectedTypes, selectType] = useState([])
  const [selectedBrotherHood, selectBrotherHood] = useState("")
  const [selectedDoc, selectDoc] = useState([])

  const [pendingSupports, setPendingSupports] = useState([])
  const [selectedRoles, selectRole] = useState([])
  const [pendingExemplaries, setPendingExemplaries] = useState([])

  const [brotherhoods, setBrotherhoods] = useState([])
  const [brotherhoodsLoading, setBrotherhoodsLoading] = useState(false)

  const [selectedTemplate, selectTemplate] = useState('')
  const [subTemplate, setSubTemplate] = useState(null)
  const [selectedSubTemplate, selectSubTemplate] = useState("")
  const [templateModel, setTemplateModel] = useState({})

  const [docTemplates, setDocTemplates] = useState([])

  const [template, setFullTemplate] = useState(false)

  const [docTemplatesLoading, setDocTemplatesLoading] = useState(false)

  const {
    createDoc, 
    responseCreateDoc,
    updateDoc, 
    responseUpdateDoc,
    deleteDoc, 
    responseDeleteDoc,
  } = useDocs()

  const handleTitleChange = (e) => {
    e.preventDefault()
    setTitleValue(e.target.value)
    const newSlug = e.target.value.replaceAll(' ', '-').toLowerCase()
    if (slugValue === null || slugValue === "" || slugValue === defaultSlug) {
      setSlugValue(newSlug)
      setDefaultSlug(newSlug)
    }
  }  
  
  const handleLangChange = (e) => {
    e.preventDefault()
      if (idLang === "en") {
        setLangEnValue(e.target.value)
      } else {
        setLangFrValue(e.target.value)
      }
  }

   const addLang = (e) => {
      e.preventDefault()
      const newLang = {
        labels: [
          { lang: "en", content: langEnValue },
          {lang: "fr", content: langFrValue}
        ],
        code: langEnValue !== "" ? langEnValue.slice(0, 2).toLowerCase() : langFrValue.slice(0, 2).toLowerCase()
      }
      selectLang([...selectedLangs, newLang])
      setLangEnValue("")
      setLangFrValue("")
    }
      
    const handleDeleteLang = (e, lang) => {
      e.preventDefault()
      const filtered = selectedLangs.filter((l) => {
        return l.code !== lang.code
      })
      selectLang(filtered)
    }
  
    const getContent = (value, lang) => {
      if (value) {
        return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
      } else {
        return "Error"
      }
    }

  const handleSlugChange = (e) => {
    e.preventDefault()
    setSlugValue(e.target.value)
  }

  const handleCopyrightsChange = (e) => {
    e.preventDefault()
    setCopyrightsValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    if (idLang === "fr") {
      setDescFrValue(e.target.value)
    } else {
      setDescEnValue(e.target.value)
    }
  }
  
  const handleIdentityShowing = (e) => {
    e.preventDefault()
    if (showIdentityForm) {
      setShowIdentityForm(false)
    } else {
      setShowIdentityForm(true)
    }
  }
  
  const handleSupportShowing = (e) => {
    e.preventDefault()
    if (showSupportForm) {
      setShowSupportForm(false)
    } else {
      setShowSupportForm(true)
    }
  }
  
  const handleParentsShowing = (e) => {
    e.preventDefault()
    if (showParentForm) {
      setShowParentForm(false)
    } else {
      setShowParentForm(true)
    }
  }


  const handleDocSubmit = async (e) => {
    e.preventDefault()
    const reqData = {
      doc: {
        slug: slugValue,
        title: titleValue,
        description: template && template.description ? [{ lang: "en", content: descEnValue }, { lang: "fr", content: descFrValue }] : null,
        languages: selectedLangs,
        additionalCopyrights: copyrightsValue
      },
      types: selectedTypes,
      tags: selectedTags,
      supports: pendingSupports,
      parents: [...selectedOrg, ...selectedPeople, ...selectedProjects, selectedDoc],
      brotherhood: selectedBrotherHood
    }
    await createDoc(reqData)

  }
  
  useEffect(() => {
    if (responseCreateDoc && responseCreateDoc.success) {
      setAlert({ type: "success", message: { en: "Document has been successfully created.", fr: "Le document a été créé avec succès"}})
    } else if (responseCreateDoc && !responseCreateDoc.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating document.", fr: "Une erreure est survenue lors de la création du document"}})
    }
  }, [responseCreateDoc])
  
    if (template && (template.tag_defaults !== selectedTags || template.type_defaults !== selectedTypes || (template.languages && template.languages.defaults !== selectedLangs))) {
      selectTag(template.tag_defaults)
      selectLang(template.languages ? template.languages.defaults : [])
      selectType(template.type_defaults)
    }

  console.log(selectedTags)



  const handleSelectTemplate = (e) => {
    e.preventDefault()
    selectTemplate(e.target.value)
    docTemplates.map((template) => {
      if (template.schema_name === e.target.value) {
        setTemplateModel(template)
      }
    })

  }
  
  const handleSelectSubTemplate = (e) => {
    e.preventDefault()
    selectSubTemplate(e.target.value)
    templateModel.schema_childs.map((template) => {
      if (template.schema_name === e.target.value) {
        setSubTemplate(template)
      }
    })
    if (e.target.value === "None") {
      setSubTemplate(false)
    }
  }

  const {
    responseFindAllDocTemplates,
    findAllDocTemplates
  } = useDocTemplates()

  if (!docTemplates[0] && !docTemplatesLoading) {
    findAllDocTemplates()
    setDocTemplatesLoading(true)
  }

  useEffect(() => {
    if (responseFindAllDocTemplates && responseFindAllDocTemplates.success) {
      setDocTemplates(responseFindAllDocTemplates.data)
    }
  }, [responseFindAllDocTemplates])

  useEffect(() => {
    docTemplates.map((template) => {
      if (client.user.defaultTemplate && client.user.defaultTemplate === template._id && selectedTemplate === "") {
        selectTemplate(template.schema_name)
        setTemplateModel(template)
      }
    })
  }, [docTemplates])

  useEffect(() => {
    if (!subTemplate || !templateModel.schema_childs.includes(subTemplate)) {
      console.log("ici")
      setFullTemplate(templateModel)
    } else {
      console.log('la')
      let model = templateModel
      if (model.languages.exist) {
        model.languages.defaults = [...new Set([...model.languages.defaults, ...subTemplate.languages.defaults])]
      }
      if (model.tag) {
        model.tag_defaults = [...new Set([...model.tag_defaults, ...subTemplate.tag_defaults])]
      }
      if (model.type) {
        model.type_defaults = [...new Set([...model.type_defaults, ...subTemplate.type_defaults])]
      }
      if (model.support_role) {
        model.support_role_defaults = [...new Set([...model.support_role_defaults, ...subTemplate.support_role_defaults])]
      }
      if (model.support_issn) {
        model.support_issn_default = subTemplate.support_issn_default
      }
      if (model.parent_role) {
        model.parent_role_defaults = [...new Set([...model.parent_role_defaults, ...subTemplate.parent_role_defaults])]
      }
      if (model.parent_entity) {
        model.parent_entity_defaults =  [...new Set([...model.parent_entity_defaults, ...subTemplate.parent_entity_defaults])]
      }
      if (model.parent_person) {
        model.parent_person_defaults = [...new Set([...model.parent_person_defaults, ...subTemplate.parent_person_defaults])]
      }
      if (model.parent_project) {
        model.parent_project_defaults = [...new Set([...model.parent_project_defaults, ...subTemplate.parent_project_defaults])]
      }
      setFullTemplate(model)
      console.log("tags: ", model.tag_defaults)
    }
  }, [subTemplate, templateModel])


  return <form onSubmit={handleDocSubmit}>
    <div className="columns">
            <div className="column is-one-third">
              <div className="field">
            <label className="label">Type</label>
            <div className="select">
              <select value={selectedType} onChange={handleSelectType}>
                <option>Document</option>
                <option>Organisation</option>
                <option>Person</option>
              </select>
            </div>
          </div>
            </div>
            <div className="column is-one-third">
              <div className="field">
            <label className="label">Model</label>
            <div className="select">
             <select value={selectedTemplate} onChange={handleSelectTemplate}>
             
                {docTemplates.map((template) => {
                  
                    if (!template.schema_parent) {
                      return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                  
                    }
                })}
              </select>
            </div>
          </div>
              </div>
               

          {template && template.schema_childs && template.schema_childs[0] ? <>
          <div className="column is-one-third">
              <div className="field">
            <label className="label">Template</label>
            <div className="select">
             <select value={selectedSubTemplate} onChange={handleSelectSubTemplate}>
             <option value="None">None</option>

                {templateModel.schema_childs.map((template) => {
                  
                    return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                  
                })}
              </select>
            </div>
          </div>
              </div>
             </> : null}
            
          </div>
    
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleIdentityShowing}>
        <h3 className="title is-4">Identity </h3>
      </button>
    </div>
    
    {showIdentityForm ? <>
      <div className="tabs">
        <ul>
          <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
          <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
        </ul>
      </div>
      <div className="columns">
      <div className="column">
        <div className="field">
          <label className="label">
            Title
          </label>
          <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>
      </div>
      <div className="column">
        <div className="field">
          <label className="label">
            Slug
          </label>
          <input type="text" className="input" value={slugValue} onChange={handleSlugChange}/>
        </div>
      </div>
    </div>
    {template && template.description ? <div className="field" id="docDesc">
      <label className="label title is-5">
        Description
      </label>
      <textarea className="textarea" value={idLang === "fr" ? descFrValue : descEnValue} onChange={handleDescChange}></textarea>
      </div> : null}
      {template && template.languages && template.languages.exist ? <div className="field" id="docLang">
      <label className="label title is-5">
        Language
      </label>
      
      <div className="is-flex">
                <input type="text" placeholder="Default language" className="input" value={idLang === "en" ? langEnValue : langFrValue} onChange={handleLangChange} />
                <button onClick={addLang} className="button is-small is-primary mt-1 ml-2">Add</button>
                
        </div>
        {selectedLangs.map((lang) => {
        return <Fragment key={lang.code}>
          <span className="tag is-success is-medium mr-1 mt-2">{getContent(lang.labels, idLang)}</span>
          <span className="tag is-danger is-medium mr-2 button mt-2" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
      })}
      </div> : null}
      <RoleForm location="support-form-doc" scope="docs" lang={idLang} selectedRoles={selectedTypes} selectRole={selectType}/>
      {template && template.tag ? <DocTagsForm selectedTags={selectedTags} selectTag={selectTag} scope="docs" lang={idLang} /> : null}
      {template && template.copyright ? <div className="field mt-2">
        <label className="label">
          Copyrights
        </label>
        <input type="text" className="input" value={copyrightsValue} onChange={handleCopyrightsChange}/>
      </div> : null}
    </> : null}
    
    <hr/>

   
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleSupportShowing}>
        <h3 className="title is-4">Supports</h3>
      </button>
    </div>
    {showSupportForm ? <SupportForm pendingSupports={pendingSupports} setPendingSupports={setPendingSupports} selectedRoles={selectedRoles} selectRole={selectRole} pendingExemplaries={pendingExemplaries} setPendingExemplaries={setPendingExemplaries} template={template}/> : null}
    <hr/>
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleParentsShowing}>
        <h3 className="title is-4">Parents</h3>
      </button>
    </div>
    {showParentForm ? <ParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} selectedPeople={selectedPeople} selectedDoc={selectedDoc} selectDoc={selectDoc} selectPerson={selectPerson} selectedProj={selectedProjects} selectProj={selectProject} template={template} client={client} setAlert={setAlert}/> : null}
    <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-center">
      <button className="button is-primary is-medium" type="submit">
        Create
      </button>
    </footer>
  </form>
}

export default DocForm