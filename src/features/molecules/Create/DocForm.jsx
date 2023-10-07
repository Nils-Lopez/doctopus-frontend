import React, {useState, Fragment, useEffect} from 'react';
  
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"
import SupportForm from "./SupportForm"  
import ParentForm from "./ParentForm"  
import RoleForm from "../../atoms/forms/RoleForm"
import FileForm from "../../atoms/forms/FileForm"
import SearchTagsForm from "../../atoms/forms/docs/SearchTagsForm"

import {useDocs} from "../../../utils/hooks/docs/Docs"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faMagnifyingGlass, faCirclePlus} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"
import { useIsbns } from '../../../utils/hooks/Isbn';
import { useUsers } from "../../../utils/hooks/Users.js"
import SelectForm from '../../atoms/forms/SelectForm';


const DocForm = ({client, setAlert, setClient, applicationSettings, selectedType, handleSelectType, dataUpdate, setDataUpdate}) => {
  const { t, i18n } = useTranslation();

  let navigate = useNavigate()

  const [titleValue, setTitleValue] = useState("")
  const [defaultSlug, setDefaultSlug] = useState("")
  const [slugValue, setSlugValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [langEnValue, setLangEnValue] = useState("")
  const [langFrValue, setLangFrValue] = useState("")
  const [selectedLangs, selectLang] = useState([])
  const [showIdentityForm, setShowIdentityForm] = useState(true)
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [showParentForm, setShowParentForm] = useState(false)
  const [copyrightsValue, setCopyrightsValue] = useState("")
  const [isbnValue, setIsbnValue] = useState("")
  const [pagesValue, setPagesValue] = useState("")
  const [publiDateValue, setPubliDateValue] = useState("")
  const [durationValue, setDurationValue] = useState("")
  const [thumbValue, setThumbValue] = useState("")
  const [issnValue, setIssnValue] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [volumeValue, setVolumeValue] = useState("")
  const [numberValue, setNumberValue] = useState("")
  const [selectedTags, selectTag] = useState([])
  const [selectedOrg, selectOrg] = useState([])
  const [selectedPeople, selectPerson] = useState([])
  const [selectedProjects, selectProject] = useState([])
  const [selectedTypes, selectType] = useState([])
  const [selectedBrotherHood, selectBrotherHood] = useState("")
  const [selectedDoc, selectDoc] = useState([])
  const [selectedProds, selectProd] = useState([])
  const [pendingSupports, setPendingSupports] = useState([])
  const [selectedRoles, selectRole] = useState([])
  const [pendingExemplaries, setPendingExemplaries] = useState([])
  const [selectedTemplate, selectTemplate] = useState('')
  const [subTemplate, setSubTemplate] = useState(null)
  const [selectedSubTemplate, selectSubTemplate] = useState("")
  const [templateModel, setTemplateModel] = useState({})
  const [docTemplates, setDocTemplates] = useState([])
  const [template, setFullTemplate] = useState(false)
  const [docTemplatesLoading, setDocTemplatesLoading] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const handlePubliDateChange = (e) => {
    e.preventDefault()
    setPubliDateValue(e.target.value)
  }
 
  const handleIsbnChange = (e) => {
    e.preventDefault()
    setIsbnValue(e.target.value)
  }
  
  const handleIssnChange = (e) => {
    e.preventDefault()
    setIssnValue(e.target.value)
  }

  const handlePagesChange = (e) => {
    e.preventDefault()
    setPagesValue(e.target.value)
  }
  
  const handleDurationChange = (e) => {
    e.preventDefault()
    setDurationValue(e.target.value)
  }

  const handleDateChange = (e) => {
    e.preventDefault()
    setDateValue(e.target.value)
  }
  
  const handleVolumeChange = (e) => {
    e.preventDefault()
    setVolumeValue(e.target.value)
  }
  const handleNumberChange = (e) => {
    e.preventDefault()
    setNumberValue(e.target.value)
  }

  const handleLangChange = (e) => {
    e.preventDefault()
      if (i18n.language === "en") {
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



  const handleCopyrightsChange = (e) => {
    e.preventDefault()
    setCopyrightsValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    if (i18n.language === "fr") {
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
	const {updateUser} = useUsers()


  const handleDocSubmit = async (e, isDraft) => {
    e.preventDefault()
    setLoading(true)
    const reqData = {
      doc: {
        slug: slugValue,
        title: titleValue,
        description: template && template.description ? [{ lang: "en", content: descEnValue }, { lang: "fr", content: descFrValue }] : null,
        languages: selectedLangs,
        additionalCopyrights: copyrightsValue,
        publishedAt:  publiDateValue,
        date: dateValue,
        eanIsbn: isbnValue,
        issn: issnValue,
        pages: pagesValue,
        duration: durationValue,
        thumb: thumbValue,
        volume: volumeValue,
        restrictedContent: restrictedContent,
        number: numberValue,
        template: templateModel,
      },
      types: selectedTypes,
      tags: selectedTags,
      supports: pendingSupports,
      parents: [...selectedProds, ...selectedOrg, ...selectedPeople, ...selectedProjects, ...selectedDoc],
      brotherhood: selectedBrotherHood
    }
    if (draft || isDraft) reqData.doc.draft = true
    else reqData.doc.draft = false
    if (!dataUpdate) {
     await createDoc(reqData)
    } else {
      if (dataUpdate.draft && !draft) {
        
                      const newList = []
                      client.user.drafts.map((watch) => {
                          if (watch._id !== dataUpdate._id) {
                              newList.push({_id: watch._id})
          }
        })
        updateUser({drafts: newList}, client.user._id)
      }
     await updateDoc(reqData, dataUpdate._id)
    }

  }
  
  useEffect(() => {
    if (responseCreateDoc && responseCreateDoc.success) {
      setAlert({ type: "success", message: { en: "Document has been successfully created.", fr: "Le document a été créé avec succès"}})
      if (draft && setClient) {
        setClient({...client, user: {...client.user, drafts: [...client.user.drafts, responseCreateDoc.data]}})
      }
      setLoading(false)
      navigate('/document/' + responseCreateDoc.data._id)
    } else if (responseCreateDoc && !responseCreateDoc.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating document.", fr: "Une erreure est survenue lors de la création du document"}})
            setLoading(false)
    }
  }, [responseCreateDoc])
  
    useEffect(() => {
    if (responseUpdateDoc && responseUpdateDoc.success) {
      setAlert({ type: "success", message: { en: "Document has been successfully updated.", fr: "Le document a été mis à jour avec succès"}})
            setLoading(false)
      setDataUpdate({...responseUpdateDoc.data, success: true})
    } else if (responseUpdateDoc && !responseUpdateDoc.success) {
      setAlert({ type: "error", message: { en: "An error occured while updating document.", fr: "Une erreure est survenue lors de la mise à jour du document"}})
            setLoading(false)
            console.log("res: ",responseUpdateDoc)
            setDataUpdate(false)
    }
  }, [responseUpdateDoc])
  
   useEffect(() => {
    if (!dataUpdate) {
      if (template && (template.tag_defaults !== selectedTags || template.type_defaults !== selectedTypes || (template.languages && template.languages.defaults !== selectedLangs))) {
        selectTag(template.tag_defaults)
        selectLang(template.languages ? template.languages.defaults : [])
        selectType(template.type_defaults)
      }
      if (template && template.support_issn_default && template.support_issn_default !== "" && issnValue === "") {
        setIssnValue(template.support_issn_default)
      }
    }
   }, [template])



  const handleSelectTemplate = (e) => {
    selectTemplate(e)

    docTemplates.map((template) => {
      if (template.schema_name === e.value) {
        setTemplateModel(template)
      }
    })
    selectPerson([])
    selectOrg([])
    selectProject([])
    selectDoc([])
    selectType([])
    selectTag([])
    selectLang([])

  }
  
  const handleSelectSubTemplate = (e) => {
    selectSubTemplate(e)
    templateModel.schema_childs.map((template) => {
      if (template.schema_name === e.value) {
        setSubTemplate(template)
      }
    })
    if (e.value === "None") {
      setSubTemplate(false)
    }
    selectPerson([])
    selectOrg([])
    selectProject([])
    selectDoc([])
    selectTag([])
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
      if (client.user.defaultTemplate && client.user.defaultTemplate === template._id && selectedTemplate === "" && !dataUpdate) {
        selectTemplate({value: template.schema_name, label: template.schema_name})
        setTemplateModel(template)
      }
    })
  }, [docTemplates])

  useEffect(() => {
    if (!subTemplate || !templateModel.schema_childs.includes(subTemplate)) {
      setFullTemplate(templateModel)
    } else {
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
    }
  }, [subTemplate, templateModel])

  useEffect(() => {
   if (dataUpdate) {
      setSlugValue(dataUpdate.slug)
      setTitleValue(dataUpdate.title)
      setTemplateModel(dataUpdate.template)
      selectTemplate({value: dataUpdate.template.schema_name, label: dataUpdate.template.schema_name})
      if (dataUpdate.description && dataUpdate.description[0]) {
       setDescFrValue(getContent(dataUpdate.description, "fr"))
       setDescEnValue(getContent(dataUpdate.description, "en"))
      }
      selectLang(dataUpdate.languages)
      setCopyrightsValue(dataUpdate.additionalCopyrights)
      setDateValue(dataUpdate.date)
      setPubliDateValue(dataUpdate.publishedAt ? dataUpdate.publishedAt.split('T')[0] : "")
      setIsbnValue(dataUpdate.eanIsbn)
      setIssnValue(dataUpdate.issn)
      setPagesValue(dataUpdate.pages)
      setDurationValue(dataUpdate.duration)
      setThumbValue(dataUpdate.thumb)
      setRestrictedContent(dataUpdate.restrictedContent)
      setVolumeValue(dataUpdate.volume)
      setNumberValue(dataUpdate.number)
      selectProd()
      selectType(dataUpdate.types)
      selectTag(dataUpdate.tags)
      const orgs = []
      const people = []
      const projects = []
      const pDocs = []
      const prods = []
      dataUpdate.parents.map((p) => {
       if (p.project) {
        projects.push(p)
       } else if (p.person) {
        people.push(p)        
       } else if (p.entity) {
        orgs.push(p)
       } else if (p.parent_doc) {
        pDocs.push(p)
       } else {
        prods.push(p)
       }
      })
      selectProject(projects)
      selectDoc(pDocs)
      selectPerson(people)
      selectOrg(orgs)
      selectProd(prods)
      if (dataUpdate.template) {
       setFullTemplate(dataUpdate.template)
      }
      
   }
  }, [dataUpdate])

  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDeleteDoc = (e) => {
    e.preventDefault()
    if (confirmDelete) {
      deleteDoc(dataUpdate._id)
      setConfirmDelete(false)
      setAlert({ type: "success", message: { en: "Document has been successfully deleted.", fr: "Le document a été supprimé avec succès"}})
      navigate('/')

    } else {
      setConfirmDelete(true)
    }

  }

  const {findBookByIsbn, responseFindBookByIsbn} =  useIsbns()
  const [autoCompletion, setAutoCompletion] = useState(false)
  const [isbnLoading, setIsbnLoading] = useState(false)

  const handleSearchIsbn = (e) => {
    e.preventDefault()
    setIsbnLoading(true)
    findBookByIsbn(isbnValue.replaceAll(' ', '').replaceAll('-', '').replaceAll('.', ''))
  }

  useEffect(() => {
    if (responseFindBookByIsbn && responseFindBookByIsbn.success) {
      setAlert({ type: "success", message: { en: "A book was found in our data.", fr: "Un livre a été trouvé dans nos données"}})
      setAutoCompletion(responseFindBookByIsbn.data)
    } else if (responseFindBookByIsbn) {
      setAlert({ type: "error", message: { en: "No book was found in our data.", fr: "Ce livre n'a pas été trouvé dans nos données"}})
    }
    setIsbnLoading(false)
    
  }, [responseFindBookByIsbn])

  useEffect(() => {
    if (autoCompletion) {
      if (autoCompletion.title) setTitleValue(autoCompletion.title)
      if (autoCompletion.description && autoCompletion.description.length > 0)  {
        if (autoCompletion.description[0].lang === "fr") {
          setDescFrValue(autoCompletion.description[0].content)
          setDescEnValue(autoCompletion.description[1].content)
        }
        else {
          setDescEnValue(autoCompletion.description[0].content)
          setDescFrValue(autoCompletion.description[1].content)
        }
      }
      if (autoCompletion.date) {
        if (autoCompletion.date.includes('-')) {
          setPubliDateValue(autoCompletion.date)
          setDateValue(autoCompletion.date.split('-')[2] + " " +  new Date(autoCompletion.date).toString().split(' ')[1] + " " + autoCompletion.date.split('-')[0])
        } else {
          setDateValue(autoCompletion.date)
        }
      }
      if (autoCompletion.publishedAt) setPubliDateValue(autoCompletion.publishedAt)
      if (autoCompletion.thumb) setThumbValue(autoCompletion.thumb)
      
    }
  }, [autoCompletion])

  const [scanner, setScanner] = useState(false)
  const [draft, setDraft] = useState(false)
  const [restrictedContent, setRestrictedContent] = useState("all")

  const handleRestrictedContent = (e) => {
    e.preventDefault()
    setRestrictedContent(e.target.value)
  }

  

  return loading || isbnLoading ? <>
   <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> 
  </> : <div>
 
    <div className="columns">
            {!dataUpdate ? <div className="column is-one-third">
              <div className="field">
            <label className="label">{t('type')}</label>
            <SelectForm applicationSettings={applicationSettings} select={handleSelectType} selected={selectedType} options={[{value: "document", label: t('document')}, {value: 'organisation', label: t('organization')}, {value: 'person', label: t('person')}]} />
            
          </div>
            </div> : null}
            <div className="column is-one-third">
              <div className="field">
            <label className="label">{t('model')}</label>
            {docTemplates ?   <SelectForm applicationSettings={applicationSettings} select={handleSelectTemplate} selected={selectedTemplate} options={docTemplates.map((schema) => {
                 if (!schema.schema_parent)  return {
                  value: schema.schema_name,
                  label: schema.schema_name
                }
                }).filter((a) =>{
                  if (a) return a
                })} /> : null}
           
          </div>
              </div>
               

          {template && template.schema_childs && template.schema_childs[0] && !dataUpdate ? <>
          <div className="column is-one-third">
              <div className="field">
                <label className="label">{t('template')}</label>
                <SelectForm applicationSettings={applicationSettings} select={handleSelectSubTemplate} selected={selectedSubTemplate} options={templateModel.schema_childs.map((schema) => {
                  return {
                    value: schema.schema_name,
                    label: schema.schema_name
                  }
                })} />
           
          </div>
              </div>
             </> : null}
            
          </div>
    
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleIdentityShowing}>
        <h3 className="title is-4">{t('identity')}</h3>
      </button>
    </div>
    <div className="is-flex is-justify-content-end">{dataUpdate ?
      <button className="button is-danger is-small mt-3" onClick={handleDeleteDoc}>
        {confirmDelete ? t('confirm') : t('delete')}
      </button>
   : null}</div>
    {showIdentityForm ? <>
     
      {scanner ? <>
        <span onClick={() => {setScanner(false)}} className="indextag  has-text-info ml-3 pt-2 pb-0 subtitle is-4"><FontAwesomeIcon icon={faCircleXmark} /></span>
      
      </> : <>
        {template && template.support_eanIsbn ?  
          <div className="field">
            <label className="label has-text-left">
              {t('ean-isbn')}
            </label>
            <div className="is-flex">
                <input type="text" className="input" value={isbnValue} onChange={handleIsbnChange}/>

          {!dataUpdate && isbnValue && isbnValue.length > 7 && (client && client.user) ? <span onClick={handleSearchIsbn} className="indextag  has-text-info ml-3 pt-2 pb-0 subtitle is-4"><FontAwesomeIcon icon={faMagnifyingGlass} /></span> : null}   
            </div>
        </div> : null}
      </>}
      {template && template.languages && template.languages.exist ? <div className="columns">
      <div className="column">
        <div className="field">
          <label className="label has-text-left">
          {t('title')}
          </label>
          <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>
      </div>
      <div className="column">
      
        <div className="field" id="docLang">
          <label className="label has-text-left">
          {t('language')}
          </label>
      
              <div className="is-flex">
                <input type="text" placeholder="Default language" className="input" value={i18n.language === "en" ? langEnValue : langFrValue} onChange={handleLangChange} />
                <i className="has-text-info subtitle is-5 ml-2 mt-2  pointer" onClick={addLang}><FontAwesomeIcon icon={faCirclePlus} /></i>    
              </div>
        {selectedLangs.map((lang) => {
        return <Fragment key={lang.code}>
          <span className="tag is-light is-medium mr-1 mt-2">{lang.code.toUpperCase()} <i className="has-text-danger ml-3 pointer" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faCircleXmark} /></i></span>
        </Fragment>
      })}
      </div> 
      </div>
    </div>:  <div className="field">
          <label className="label has-text-left">
          {t('title')}
          </label>
          <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>}
    {template && template.description ? <div className="field mt--1" id="docDesc">
      <label className="label has-text-left">
      {t('description')}
      </label>
      <textarea className="textarea" value={i18n.language === "fr" ? descFrValue : descEnValue} onChange={handleDescChange}></textarea>
      </div> : null}
     
      <label className="label has-text-left mb--1">
      {t('types')}
      </label>
      <RoleForm location="support-form-doc" scope="docs" lang={i18n.language} selectedRoles={selectedTypes} selectRole={selectType}/>
      {/* {template && template.tag ? <DocTagsForm selectedTags={selectedTags} selectTag={selectTag} scope="docs" lang={i18n.language} /> : null} */}
      {template && template.tag ? <SearchTagsForm selectedTags={selectedTags} selectTag={selectTag} /> : null}
      {template && template.copyrights ? <div className="field mt-2">
        <label className="label has-text-left">
        {t('copyrights')}
        </label>
        <input type="text" className="input" value={copyrightsValue} onChange={handleCopyrightsChange}/>
      </div> : null}
      {template && template.support_publishedAt ? <>
       <div className="columns">
       <div className="column">
       <div className="field">
      <label className="label has-text-left">
        {t('sort-date')}
      </label>
      
      <input type="date" className="input" value={publiDateValue} onChange={handlePubliDateChange}/>
    </div>
       </div>
    <div className="column"><div className="field">
      <label className="label has-text-left">
        {t('text-date')}
      </label>
      
      <input type="text" className="input" value={dateValue} onChange={handleDateChange}/>
    </div> </div>
       </div>
     </> : null}
    
     {template && template.support_pages ? <div className="field">
      <label className="label has-text-left">
        {t('pages')}
      </label>
      
      <input type="text" className="input" value={pagesValue} onChange={handlePagesChange}/>
    </div> : null}
    {template && template.support_duration ?  <div className="field">
      <label className="label has-text-left">
        {t('duration')}
      </label>
      
      <input type="text" className="input" step="1" value={durationValue} onChange={handleDurationChange}/>
    </div> : null}
    {template && template.support_thumb ? <div className="field">
       <label className="label has-text-left">
        {t('thumbnail')}
      </label>
     <FileForm setFile={setThumbValue} pdf={thumbValue}/>
    </div> : null}
    {template && template.support_number ? <>
      <div className="field">
        <label className="label has-text-left">{t('number')}</label>
        <input type="text" className="input" value={numberValue} onChange={handleNumberChange} />
      </div>
    </> : null}
    {template && template.support_volume ? <>
      <div className="field">
        <label className="label has-text-left">{t('volume')}</label>
        <input type="text" className="input" value={volumeValue} onChange={handleVolumeChange} />
      </div>
    </> : null}
    {template && template.support_issn ? <>
      <div className="field">
        <label className="label has-text-left">{t('issn')}</label>
        <input type="text" className="input" value={issnValue} onChange={handleIssnChange}/>
      </div>
    </> : null}
    </> : null}
    
    <hr/>

   
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleSupportShowing}>
        <h3 className="title is-4">{t('supports')}</h3>
      </button>
    </div>
   {showSupportForm &&  <div className="field">
            <label className="label has-text-left">{t('restricted-access')}</label>
            <div className="select is-flex is-justify-content-start is-fullwidth">
             <select value={restrictedContent} onChange={handleRestrictedContent}>  
                <option value="all">{t('all')}</option>
                <option value="onsite">{t('onsite')}</option>
              </select>
            </div>
          </div>}
    {showSupportForm ? <SupportForm pendingSupports={pendingSupports} setPendingSupports={setPendingSupports} selectedRoles={selectedRoles} selectRole={selectRole} pendingExemplaries={pendingExemplaries} setPendingExemplaries={setPendingExemplaries} template={template} dataUpdate={dataUpdate}/> : null}
    <hr/>
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleParentsShowing}>
        <h3 className="title is-4">{t('relations')}</h3>
      </button>
    </div>
    {showParentForm ? <ParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} selectedProds={selectedProds} selectProd={selectProd} selectedPeople={selectedPeople} selectedDoc={selectedDoc} selectDoc={selectDoc} selectPerson={selectPerson} selectedProj={selectedProjects} selectProj={selectProject} template={template} client={client} setAlert={setAlert} autoCompletion={autoCompletion} setAutoCompletion={setAutoCompletion}/> : null}
   <div className="container mt-5">
   
    <footer className=" is-flex is-justify-content-end">
    
      <div className="is-fullwidth is-flex is-justify-content-end">
      <button className="button is-white-ter is-radiusless mr-3"  onClick={(e) => {
        setDraft(true)
       handleDocSubmit(e, true)
      }}>
        
        {t('Save as draft')}
        </button>
      <button className="button is-primary is-radiusless " onClick={handleDocSubmit}>

      {dataUpdate ? t('update')  : t('Publish')}
      </button>
   
      </div>
      
    </footer>
   </div>
 
  </div>
}

export default DocForm