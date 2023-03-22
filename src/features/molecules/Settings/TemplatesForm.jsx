import React, {useState, useEffect, Fragment} from 'react';

import {useRoles} from "../../../utils/hooks/Roles"
import {useTags} from "../../../utils/hooks/Tags"
import {usePeople} from "../../../utils/hooks/People"
import { useEntities } from "../../../utils/hooks/Entities"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"
import {useUsers} from '../../../utils/hooks/Users'
import {useProjects} from '../../../utils/hooks/entities/Projects'

import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"
import RoleForm from "../../atoms/forms/RoleForm"
import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const TemplatesForm = ({client, setClient, setAlert}) => {
    
    const [editTemplate, setEditTemplate] = useState(false)

    const [nameValue, setNameValue] = useState("")
    const [descValue, setDescValue] = useState(true)
    const [langValue, setLangValue] = useState(true)
    const [langEnDefaultValue, setLangEnDefaultValue] = useState("")
    const [langFrDefaultValue, setLangFrDefaultValue] = useState("")
    const [selectedLangs, selectLang] = useState([])
    const [typeValue, setTypeValue] = useState(true)
  const [publiDateValue, setPubliDateValue] = useState(true)
  const [dateValue, setDateValue] = useState(true)
    const [copyrightsValue, setCopyrightsValue] = useState(true)
    const [urlValue, setUrlValue] = useState(true)
    const [pdfValue, setPdfValue] = useState(true)
    const [eanValue, setEanValue] = useState(true)
    const [pagesValue, setPagesValue] = useState(true)
    const [durationValue, setDurationValue] = useState(true)
  const [thumbValue, setThumbValue] = useState(true)
  const [volumeValue, setVolumeValue] = useState(true)
    const [numberValue, setNumberValue] = useState(true)
    const [parentRolesValue, setParentRolesValue] = useState(true)
    const [orgValue, setOrgValue] = useState(true)
    const [peopleValue, setPeopleValue] = useState(true)
    const [projValue, setProjValue] = useState(true)
    const [supportDescValue, setSupportDescValue] = useState(true)
    const [tagValue, setTagValue] = useState(true)
    const [copiesValue, setCopiesValue] = useState(true)
    const [copiesLocation, setCopiesLocation] = useState(true)
    const [copiesPosition, setCopiesPosition] = useState(true)
  const [copiesRank, setCopiesRank] = useState(true)
    const [copiesQuality, setCopiesQuality] = useState(true)
    const [idLang, setIdLang] = useState("fr")
    const [formatValue, setFormatValue] = useState(true)
    const [accessValue, setAccessValue] = useState(true)
    const [issnValue, setIssnValue] = useState(true)
    const [issnDefault, setIssnDefault] = useState("")
  
    const handleEditTemplate = (template) => {
      setNameValue(template.schema_name)
      setDescValue(template.description)
      setLangValue(template.languages.exist)
      setLangEnDefaultValue("")
      setLangFrDefaultValue("")
      selectLang(template.languages.defaults)
      setTypeValue(template.support_role)
      selectType(template.support_role_defaults)
      setSupportDescValue(template.support_desc)
      setPubliDateValue(template.support_publishedAt)
      setUrlValue(template.support_url)
      setPdfValue(template.support_pdf)
      setEanValue(template.support_eanIsbn)
      setPagesValue(template.support_pages)
      setDurationValue(template.support_duration)
      setThumbValue(template.support_thumb)
      setParentRolesValue(template.parent_role)
      selectRole(template.parent_role_defaults)
      setOrgValue(template.parent_entity)
      selectOrg(template.parent_entity_defaults)
      setPeopleValue(template.parent_person)
      selectPerson(template.parent_person_defaults)
      setProjValue(template.parent_project)
      selectProj(template.parent_project_defaults)
      setTagValue(template.tag)
      selectTag(template.tag_defaults)
      setEditTemplate(template._id)
      setCopiesValue(template.copies)
      setCopiesLocation(template.copies_location)
      setCopiesRank(template.copies_rank)
      setCopiesPosition(template.copies_position)
      setFormatValue(template.support_format)
      setAccessValue(template.support_accessibility)
      setIssnValue(template.support_issn)
      setIssnDefault(template.support_issn_default)
      setVolumeValue(template.support_volume)
      setNumberValue(template.support_number)
      setCopiesQuality(template.copies_quality)
      setCopyrightsValue(template.copyrights)
      setDateValue(template.support_date)
    }
  
    const handleNewTemplate = () => {
      setNameValue("")
      setDescValue(true)
      setLangValue(true)
      setLangEnDefaultValue("")
      setLangFrDefaultValue("")
      setTypeValue(true)
      selectType([])
      setSupportDescValue(true)
      setPubliDateValue(true)
      setUrlValue(true)
      setPdfValue(true)
      setEanValue(true)
      setPagesValue(true)
      setDurationValue(true)
      setThumbValue(true)
      setParentRolesValue(true)
      selectRole([])
      setOrgValue(true)
      selectOrg([])
      setPeopleValue(true)
      selectPerson([])
      setProjValue(true)
      selectProj([])
      setTagValue(true)
      selectTag([])
      setEditTemplate(false)
      setCopiesValue(true)
      setCopiesLocation(true)
      setCopiesRank(true)
      setCopiesPosition(true)
      setFormatValue(true)
      setAccessValue(true)
      setIssnValue(true)
      setIssnDefault("")
      setVolumeValue(true)
      setNumberValue(true)
      setCopiesQuality(true)
      setCopyrightsValue(true)
      setDateValue(true)
    }
  
    const addLang = (e) => {
      e.preventDefault()
      const newLang = {
        labels: [
          { lang: "en", content: langEnDefaultValue },
          {lang: "fr", content: langFrDefaultValue}
        ],
        code: langEnDefaultValue !== "" ? langEnDefaultValue.slice(0, 2).toLowerCase() : langFrDefaultValue.slice(0, 2).toLowerCase()
      }
      selectLang([...selectedLangs, newLang])
      setLangEnDefaultValue("")
      setLangFrDefaultValue("")
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
  
    const [selectedTypes, selectType] = useState([])
    const [selectedRoles, selectRole] = useState([])
    const [selectedOrg, selectOrg] = useState([])
    const [selectedPeople, selectPerson] = useState([])
    const [selectedProj, selectProj] = useState([])
    const [selectedTags, selectTag] = useState([])
    const [selectedDocTypes, selectDocType] = useState([])
    const [docTypeValue, setDocTypeValue] = useState(true) 

    const [roles, setRoles] = useState([])
    const [tags, setTags] = useState([])
    const [organisations, setOrganisations] = useState([])
    const [people, setPeople] = useState([])
    const [docTemplates, setDocTemplates] = useState([])
    const [projects, setProjects] = useState([])
    
    const [projectsLoading, setProjectsLoading] = useState(false)
    const [rolesLoading, setRolesLoading] = useState(false)
    const [tagsLoading, setTagsLoading] = useState(false)
    const [organisationsLoading, setOrganisationsLoading] = useState(false)
    const [peopleLoading, setPeopleLoading] = useState(false)
    const [docTemplatesLoading, setDocTemplatesLoading] = useState(false)
    const [loadingCreateDocTemplate, setLoadingCreateDocTemplate] = useState(false)
    const [loadingUpdateDocTemplate, setLoadingUpdateDocTemplate] = useState(false)

    // const {
    //   responseFindAllRoles,
    //   findAllRoles
    // } = useRoles()

    // if (!roles[0] && !rolesLoading) {
    //   findAllRoles()
    //   setRolesLoading(true)
    // }
  
    // useEffect(() => {
    //   if (responseFindAllRoles && responseFindAllRoles.success) {
    //     setRoles(responseFindAllRoles.data)
    //   }
    // }, [responseFindAllRoles])
  
    // const {
    //   responseFindAllTags,
    //   findAllTags
    // } = useTags()
  
    // if (!tags[0] && !tagsLoading) {
    //   findAllTags()
    //   setTagsLoading(true)
    // }
  
    // useEffect(() => {
    //   if (responseFindAllTags && responseFindAllTags.success) {
    //     setTags(responseFindAllTags.data)
    //   }
    // }, [responseFindAllTags])
  
    // const {
    //   responseFindAllPeople,
    //   findAllPeople
    // } = usePeople()
  
    // if (!people[0] && !peopleLoading) {
    //   findAllPeople()
    //   setPeopleLoading(true)
    // }
  
    // useEffect(() => {
    //   if (responseFindAllPeople && responseFindAllPeople.success) {
    //     setPeople(responseFindAllPeople.data)
    //   }
    // }, [responseFindAllPeople])
  
    // const {
    //   responseFindAllEntities,
    //   findAllEntities
    // } = useEntities()
  
    // if (!organisations[0] && !organisationsLoading) {
    //   findAllEntities()
    //   setOrganisationsLoading(true)
    // }
  
    // useEffect(() => {
    //   if (responseFindAllEntities && responseFindAllEntities.success) {
    //     setOrganisations(responseFindAllEntities.data)
    //   }
    // }, [responseFindAllEntities])
    
    // const {
    //   responseFindAllProjects, 
    //   findAllProjects
    // } = useProjects()
    
    // if (!projects[0] && !projectsLoading) {
    //   findAllProjects()
    //   setProjectsLoading(true)
    // }
  
    // useEffect(() => {
    //   if (responseFindAllProjects && responseFindAllProjects.success) {
    //     setProjects(responseFindAllProjects.data)
    //   }
    // }, [responseFindAllProjects])
  
    const {
      responseFindAllDocTemplates,
      findAllDocTemplates,
      createDocTemplate,
      responseCreateDocTemplate,
      updateDocTemplate,
      responseUpdateDocTemplate,
      deleteDocTemplate,
      responseDeleteDocTemplate
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
  
    const handleNameChange = (e) => {
      e.preventDefault()
      setNameValue(e.target.value)
    }
  
    const handleLangDefaultChange = (e) => {
      e.preventDefault()
      if (idLang === "en") {
        setLangEnDefaultValue(e.target.value)
      } else {
        setLangFrDefaultValue(e.target.value)
      }
    }

    const handleTemplateSubmit = (e) => {
      e.preventDefault()
      const reqData = {
        template: {
          schema_name: nameValue,
          schema_slug: nameValue.toLowerCase(),
          description: descValue,
          languages: {exist: langValue, defaults: selectedLangs},
          //Relations
          support_role: typeValue, //Kind of doc support (media, book, ebook, article, movie etc)
          support_desc: supportDescValue,
          support_publishedAt: publiDateValue, //Publication date of support
          support_url: urlValue, //Url of media
          support_pdf: pdfValue, //Url of pdf
          support_eanIsbn: eanValue, //EAN OR ISBN key
          support_pages: pagesValue, //Number of pages
          support_duration: durationValue, //Duration of video/movie
          support_thumb: thumbValue, //Url of thumbnail
          support_format: formatValue, //
          support_accessibility: accessValue,
          suport_issn: issnValue, 
          support_issn_default: issnDefault,
          parent_role: parentRolesValue,
          parent_entity: orgValue, 
          parent_project: projValue,
          parent_person: peopleValue, 
          tag: tagValue,
          type: docTypeValue,
          copies: copiesValue,
          copies_position: copiesPosition,
          copies_location: copiesLocation,
          copies_rank: copiesRank,
          copies_quality: copiesQuality,
          support_volume: volumeValue,
          support_number: numberValue,
          support_date: dateValue,
          copyrights: copyrightsValue,
          schema_parent: parentTemplate
        },
        support_role_defaults: selectedTypes,
        type_defaults: selectedDocTypes,
        parent_role_defaults: selectedRoles,
        parent_entity_defaults: selectedOrg,
        parent_person_defaults: selectedPeople,
        parent_project_defaults: selectedProj, 
        tag_defaults: selectedTags
      }
      if (editTemplate) {
        console.log("data: ", reqData.template)
        updateDocTemplate(reqData, editTemplate)
        setLoadingUpdateDocTemplate(true)
      } else {
        
        createDocTemplate(reqData)
        setLoadingCreateDocTemplate(true)
      }
    }
  
    useEffect(() => {
      if (responseCreateDocTemplate && responseCreateDocTemplate.success && loadingCreateDocTemplate) {
        setAlert({ type: "success", message: { en: "Template has been successfully created.", fr: "Le template a été créé avec succès !" } })
        setDocTemplates([...docTemplates, responseCreateDocTemplate.data])
        handleNewTemplate()
        setLoadingCreateDocTemplate(false)
      } else if (responseCreateDocTemplate) {
        setAlert({ type: "error", message: { en: "An error occured while creating template.", fr: "Une erreure est survenue lors de la création du template !" } })
        console.log('responseCreateDoc : ', responseCreateDocTemplate)
        setLoadingCreateDocTemplate(false)
      }
    }, [responseCreateDocTemplate])
    
    useEffect(() => {
      if (responseUpdateDocTemplate && responseUpdateDocTemplate.success && loadingUpdateDocTemplate) {
        setAlert({ type: "success", message: { en: "Template has been successfully updated.", fr: "Le template a été modifié avec succès !" } })
        handleNewTemplate()
        setLoadingUpdateDocTemplate(false)
      } else if (responseUpdateDocTemplate && loadingUpdateDocTemplate) {
        setAlert({ type: "error", message: { en: "An error occured while creating template.", fr: "Une erreure est survenue lors de la création du template !"}})
      }
    }, [responseUpdateDocTemplate])
  
    const {
      updateUser, 
      responseUpdateUser
    } = useUsers()
  
  
    const setDefaultTemplate = (id) => {
      updateUser({ defaultTemplate: id }, client.user._id)
      const user = { ...client.user }
      user.defaultTemplate = id
      setClient({...client, user: user})
    }
  
    useEffect(() => {
      if (responseUpdateUser && responseUpdateUser.success) {

        setAlert({ type: "success", message: { en: "Template has been sucessfully set as default", fr: "Le template a été configuré par défaut avec succès !" } })
        
      } else if (responseUpdateUser && !responseUpdateUser.success) {
        setAlert({ type: "error", message: { en: "An error occured while adding default template.", fr: "Une erreure est survenue lors de l'ajout du template par défaut"}})
      }
    }, [responseUpdateUser])
  
  
    useEffect(() => {
      if (responseDeleteDocTemplate && responseDeleteDocTemplate.success) {
        setAlert({ type: "success", message: { en: "Template has been sucessfully deleted", fr: "Le template a été supprimé avec succès !"}})
      } else if (responseUpdateUser && !responseUpdateUser.success) {
        setAlert({ type: "error", message: { en: "An error occured while deleting template.", fr: "Une erreure est survenue lors de la suppression du template !"}})

      }
    }, [responseDeleteDocTemplate])
  
    const handleCopiesChange = () => {
      if (!copiesValue === false) {
        setCopiesLocation(false)
        setCopiesPosition(false)
        setCopiesRank(false)
        setCopiesQuality(false)
      }
      setCopiesValue(!copiesValue)
    }
      
    const handleIssnDefaultChange = (e) => {
      e.preventDefault()
      setIssnDefault(e.target.value)
    }

    //Handle double form sub-templates/models

    const [parentTemplate, setParentTemplate] = useState(null)
    const [displayChilds, setDisplayChilds] = useState(null)

    useEffect(() => {
      if (parentTemplate) {
        selectType([...selectedTypes, ...parentTemplate.support_role_defaults])
        selectDocType([...selectedDocTypes, ...parentTemplate.type_defaults])
        selectTag([...selectedTags, ...parentTemplate.tag_defaults])
      }
    }, [parentTemplate])

    
    return <>
      <div className="panel mb-6 template-form-panel">
        <div className="panel-heading is-flex is-justify-content-space-between heading-template">
          <p>{!parentTemplate ? "All" : "New template"}</p>
        </div>
        {docTemplates.map((template) => {

          if ((!parentTemplate || parentTemplate._id === template._id) && !template.schema_parent) {
            console.log(template.schema_childs)
            return <Fragment key={template.schema_slug}>
              <div className="panel-block columns panel-hover" onClick={() => {
                setDisplayChilds(displayChilds === template ? null : template)
              }}>
              <div className="column is-four-fifth">
                <span className="panel-block">
                  {template.schema_name}   
                </span>
              </div>
              <div className="column is-one-quarter is-flex is-justify-content-end">
                {client && client.user && client.user.defaultTemplate && (client.user.defaultTemplate._id === template._id || client.user.defaultTemplate === template._id) ? <>
                  <span className="tag is-primary is-medium z-100">
                    Default
                  </span>
                </> : <>
                  <button className="button is-outline-primary is-small z-100" onClick={() => setDefaultTemplate(template._id)}>
                    Set as default
                  </button>
                </>}
                {(client && client.user && client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <>
                  {!editTemplate || editTemplate !== template._id ? <button className="button is-info is-small ml-3 z-100" onClick={() => {handleEditTemplate(template); setParentTemplate(null)}}>
                  Edit
                  </button> : <button className="button is-danger is-small ml-3 z-100" onClick={() => {
                    deleteDocTemplate(template._id)
                    setDocTemplates(docTemplates.filter(doc => doc._id !== template._id))
                  }}>
                    Delete
                  </button>}
                </> : null}
                {parentTemplate ? <button className="button is-danger is-small ml-3 z-100" onClick={() => {
                    setParentTemplate(null)
                    handleNewTemplate()
                  }}>
                    Cancel
                  </button> : <button className="button is-info is-small ml-3 z-100" onClick={() => setParentTemplate(template)}>
                  New template
                  </button>}
              </div>
            </div>
            {displayChilds && displayChilds.schema_childs && displayChilds.schema_childs[0] && displayChilds === template && displayChilds.schema_childs.map((child) => {
              return <Fragment key={JSON.stringify(child)}>
                <div className="panel-block columns panel-hover pt-0 pb-0 ">
              <div className="column is-four-fifth">
                <span className="panel-block">
                  <small className="has-text-grey"><i>Template: </i></small> &nbsp;{child.schema_name}   
                </span>
              </div>
              <div className="column is-one-quarter is-flex is-justify-content-end">
             
              
                  {!editTemplate || editTemplate !== child._id ? <button className="button is-info is-small ml-3 z-100" onClick={() => {
                    setParentTemplate(template)
                    handleEditTemplate(child)
                  }}>
                  Edit
                  </button> : <>
                    {(client && client.user && client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <>
                      <button className="button is-danger is-small ml-3 z-100" onClick={() => {
                    deleteDocTemplate(child._id)
                    setDocTemplates(docTemplates.filter(doc => doc._id !== child._id))
                  }}>
                    Delete
                  </button>
                    </> : null}
                  </>}
                
              </div>
            </div>
              </Fragment>
            })}
          </Fragment>
          }
        })}
       {editTemplate ?  <div className="panel-block">
           <button className="button is-primary" onClick={handleNewTemplate}>New template</button>
        </div> : null}
      </div>
      <hr />
      {parentTemplate || (client && client.user && client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ?  <form onSubmit={handleTemplateSubmit}>
     
  
     <div className="tabs">
     <ul>
       <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
       <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
     </ul>
   </div>
       <div className="field">
         <label className="label ">Template Name</label>
         <input type="text" className="input" value={nameValue} onChange={handleNameChange} />
       </div>
       {!parentTemplate ? <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
        <div className="field">
       <input id="switchDesc" type="checkbox" name="switchDesc" className="switch is-rtl" checked={descValue ? "checked" : ""} onChange={() => setDescValue(!descValue)} />
<label htmlFor="switchDesc" className="label">Description</label>
</div>
       </div>
       <div className="column is-flex is-justify-content-start">
        <div className="field">
       <input id="switchCopyr" type="checkbox" name="switchCopyr" className="switch is-rtl" checked={copyrightsValue ? "checked" : ""} onChange={() => setCopyrightsValue(!copyrightsValue)} />
<label htmlFor="switchCopyr" className="label">Copyrights</label>
</div>
       </div>
     </div> : null}
     {(parentTemplate  && parentTemplate.languages.exist) || !parentTemplate ?
     <div className="columns ml-6 mr-6  mt-3">
       <div className="column is-flex is-justify-content-start">
         
       <div className="field">
      {!parentTemplate ?  <input id="switchLang" type="checkbox" name="switchLang" className="switch is-rtl" checked={langValue ? "checked" : ""} onChange={() => setLangValue(!langValue)} /> : null}
<label htmlFor="switchLang" className="label">Language</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {langValue ? <div className="columns">
             <input type="text" placeholder="Default language" className="input" value={idLang === "en" ? langEnDefaultValue : langFrDefaultValue} onChange={handleLangDefaultChange} />
             <button onClick={addLang} className="button is-primary mt-1 ml-2 pt-2 column">Add</button>
             
           </div> : <>
           <input type="text" className="input" disabled/>
           </>}
           {selectedLangs.map((lang) => {
     return <Fragment key={lang.code}>
       <span className="tag is-success is-medium mr-1 mt-2">{getContent(lang.labels, idLang)}</span>
       <span className="tag is-danger is-medium mr-2 button mt-2" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faTrash}/></span>
     </Fragment>
   })}
       </div>
       </div>
       
     </div> : null}
     {(parentTemplate  && parentTemplate.tag) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column">
              <div className="field is-flex is-flex is-justify-content-start">
   {!parentTemplate ? <input id="switchTags" type="checkbox" name="switchTags" className="switch is-rtl" checked={tagValue ? "checked" : ""} onChange={() => setTagValue(!tagValue)} />
: null}
<label htmlFor="switchTags" className="label">Tags</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {tagValue ? <>
             <DocTagsForm tags={tags} location={"templates-tags"} selectedTags={selectedTags} selectTag={selectTag} lang={idLang} />
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null}
     {(parentTemplate  && parentTemplate.type) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column">
              <div className="field is-flex is-flex is-justify-content-start">
{!parentTemplate ?           <input id="switchDocTypes" type="checkbox" name="switchDocTypes" className="switch is-rtl" checked={docTypeValue ? "checked" : ""} onChange={() => setDocTypeValue(!docTypeValue)} />
: null}
<label htmlFor="switchDocTypes" className="label">Types</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {docTypeValue ? <>
             <RoleForm roles={roles} location={"templates"} scope="docs" selectedRoles={selectedDocTypes} selectRole={selectDocType} lang={idLang}/>
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null}
     <hr />
     <h3 className="title is-4 ">Supports</h3>
     {(parentTemplate  && parentTemplate.support_role) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column">
              <div className="field is-flex is-flex is-justify-content-start">
             {!parentTemplate ?           <input id="switchExample" type="checkbox" name="switchExample" className="switch is-rtl" checked={typeValue ? "checked" : ""} onChange={() => setTypeValue(!typeValue)} />
: null}
<label htmlFor="switchExample" className="label">Types</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {typeValue ? <>
             <RoleForm roles={roles} location={"templates"} scope="docs" selectedRoles={selectedTypes} selectRole={selectType} lang={idLang}/>
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null }
     {(parentTemplate  && parentTemplate.support_issn) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
         <div className="field is-flex is-flex is-justify-content-start">
{!parentTemplate ?               <input id="switchIssn" type="checkbox" name="switchIssn" className="switch is-rtl" checked={issnValue ? "checked" : ""} onChange={() => setIssnValue(!issnValue)} />
:null}
           <label htmlFor="switchIssn" className="label">ISSN</label>
         </div>
       </div>
       <div className="column is-flex is-justify-content-space-between">
         <div className="field">
           {issnValue ? <>
           <input type="text" placeholder="Default ISSN" className="input" value={issnDefault} onChange={handleIssnDefaultChange} />
           </> : <>
           <input type="text" className="input" value={issnDefault} onChange={handleIssnDefaultChange} disabled/>
           </>}
       </div>
       </div>
     </div> : null}
    {!parentTemplate ? <>
     <div className="columns ml-6 mr-6">
       <div className="column is-half">
         <div className="field is-flex is-flex is-justify-content-space-between">
           <input id="switchDescSupp" type="checkbox" name="switchDescSupp" className="switch is-rtl" checked={supportDescValue ? "checked" : ""} onChange={() => setSupportDescValue(!supportDescValue)} />
           <label htmlFor="switchDescSupp" className="label">Description</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchDate" type="checkbox" name="switchDate" className="switch is-rtl" checked={publiDateValue ? "checked" : ""} onChange={() => setPubliDateValue(!publiDateValue)} />
           <label htmlFor="switchDate" className="label">Publication date</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchDateTxt" type="checkbox" name="switchDateTxt" className="switch is-rtl" checked={dateValue ? "checked" : ""} onChange={() => setDateValue(!dateValue)} />
           <label htmlFor="switchDateTxt" className="label">Date (text)</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchPdf" type="checkbox" name="switchPdf" className="switch is-rtl" checked={pdfValue ? "checked" : ""} onChange={() => setPdfValue(!pdfValue)} />
           <label htmlFor="switchPdf" className="label">Pdf</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchEan" type="checkbox" name="switchEan" className="switch is-rtl" checked={eanValue ? "checked" : ""} onChange={() => setEanValue(!eanValue)} />
           <label htmlFor="switchEan" className="label">EAN/ISBN</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchVolume" type="checkbox" name="switchVolume" className="switch is-rtl" checked={volumeValue ? "checked" : ""} onChange={() => setVolumeValue(!volumeValue)} />
           <label htmlFor="switchVolume" className="label">Volume</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchFormat" type="checkbox" name="switchFormat" className="switch is-rtl" checked={formatValue ? "checked" : ""} onChange={() => setFormatValue(!formatValue)} />
           <label htmlFor="switchFormat" className="label">Format</label>
         </div>

       </div>
       <div className="column is-half">
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchPages" type="checkbox" name="switchPages" className="switch is-rtl" checked={pagesValue ? "checked" : ""} onChange={() => setPagesValue(!pagesValue)} />
           <label htmlFor="switchPages" className="label">Pages</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchDuration" type="checkbox" name="switchDuration" className="switch is-rtl" checked={durationValue ? "checked" : ""} onChange={() => setDurationValue(!durationValue)} />
           <label htmlFor="switchDuration" className="label">Duration</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchThumb" type="checkbox" name="switchThumb" className="switch is-rtl" checked={thumbValue ? "checked" : ""} onChange={() => setThumbValue(!thumbValue)} />
           <label htmlFor="switchThumb" className="label">Thumbnail Image</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchUrl" type="checkbox" name="switchUrl" className="switch is-rtl" checked={urlValue ? "checked" : ""} onChange={() => setUrlValue(!urlValue)} />
           <label htmlFor="switchUrl" className="label">Url</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchAccess" type="checkbox" name="switchAccess" className="switch is-rtl" checked={accessValue ? "checked" : ""} onChange={() => setAccessValue(!accessValue)} />
           <label htmlFor="switchAccess" className="label">Accessibility</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-start">
           <input id="switchNumber" type="checkbox" name="switchNumber" className="switch is-rtl" checked={numberValue ? "checked" : ""} onChange={() => setNumberValue(!numberValue)} />
           <label htmlFor="switchNumber" className="label">Number</label>
         </div>
       </div>
       
     </div>
     <hr />
     <div className="columns mr-6 ml-6">
         <div className="column is-half">
           <div className="field is-flex is-flex is-justify-content-space-between">
             <input id="switchCopies" type="checkbox" name="switchCopies" className="switch is-rtl" checked={copiesValue ? "checked" : ""} onChange={() => handleCopiesChange()} />
             <label htmlFor="switchCopies" className="label">Copies</label>
           </div>
           <div className="field is-flex is-flex is-justify-content-space-between">
             <input id="switchRank" type="checkbox" name="switchRank" className="switch is-rtl" checked={copiesRank ? "checked" : ""} onChange={() => setCopiesRank(!copiesRank)} />
             <label htmlFor="switchRank" className="label">Rank</label>
         </div>
         <div className="field is-flex is-flex is-justify-content-space-between">
             <input id="switchQUal" type="checkbox" name="switchQUal" className="switch is-rtl" checked={copiesQuality ? "checked" : ""} onChange={() => setCopiesQuality(!copiesQuality)} />
             <label htmlFor="switchQUal" className="label">Quality</label>
           </div>
         </div>
         <div className="column is-half">
           <div className="field is-flex is-flex is-justify-content-start">
             <input id="switchPosition" type="checkbox" name="switchPosition" className="switch is-rtl" checked={copiesPosition ? "checked" : ""} onChange={() => setCopiesPosition(!copiesPosition)} />
             <label htmlFor="switchPosition" className="label">Position</label>
           </div>
           <div className="field is-flex is-flex is-justify-content-start">
             <input id="switchLoc" type="checkbox" name="switchLoc" className="switch is-rtl" checked={copiesLocation ? "checked" : ""} onChange={() => setCopiesLocation(!copiesLocation)} />
             <label htmlFor="switchLoc" className="label">Location</label>
           </div>
         </div>
       </div>
     <hr />
    </> : null}
    <hr />

     <h3 className="title is-4">Parents</h3>
     {(parentTemplate  && parentTemplate.parent_role) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
              <div className="field">
{!parentTemplate ?           <input id="switchParentROles" type="checkbox" name="switchParentROles" className="switch is-rtl" checked={parentRolesValue ? "checked" : ""} onChange={() => setParentRolesValue(!parentRolesValue)} />
: null}
<label htmlFor="switchParentROles" className="label">Roles</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {parentRolesValue ? <>
             <RoleForm roles={roles} scope="parents" location={"templates-parents"} selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null }
     {(parentTemplate  && parentTemplate.parent_entity) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
              <div className="field">
             {!parentTemplate ?           <input id="switchParentOrg" type="checkbox" name="switchParentOrg" className="switch is-rtl" checked={orgValue ? "checked" : ""} onChange={() => setOrgValue(!orgValue)} />
: null}
<label htmlFor="switchParentOrg" className="label">Organisations</label>
</div>
       </div>
       <div className="column">
         <div className="field">
           {orgValue ? <>
             <OrganisationParentForm location={"templates-parents"} selectedOrg={selectedOrg} selectOrg={selectOrg} roles={roles} orgs={organisations} lang={idLang} hideRoles={!parentRolesValue} client={client} setAlert={setAlert} tags={tags} people={people} projects={projects}/>
           </> : <>
             <input type="text" className="input" disabled/>
           </>}
         </div>
       </div>
     </div> : null}
     {(parentTemplate  && parentTemplate.parent_project) || !parentTemplate ?
     <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
              <div className="field">
{!parentTemplate ?           <input id="switchParentProj" type="checkbox" name="switchParentProj" className="switch is-rtl" checked={projValue ? "checked" : ""} onChange={() => setProjValue(!projValue)} />
: null}
<label htmlFor="switchParentProj" className="label">Projects</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {projValue ? <>
             <ProjectParentForm location={"templates-parents"} selectedProj={selectedProj} selectProj={selectProj} projects={projects} roles={roles} lang={idLang} hideRoles={!parentRolesValue} client={client} setAlert={setAlert} tags={tags} orgs={organisations} people={people}/>
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null }
     {(parentTemplate  && parentTemplate.parent_person) || !parentTemplate ? <div className="columns ml-6 mr-6">
       <div className="column is-flex is-justify-content-start">
              <div className="field">
{!parentTemplate ?           <input id="switchParentPeople" type="checkbox" name="switchParentPeople" className="switch is-rtl" checked={peopleValue ? "checked" : ""} onChange={() => setPeopleValue(!peopleValue)} />
: null}
<label htmlFor="switchParentPeople" className="label">People</label>
</div>
       </div>
       <div className="column">
<div className="field">
           {peopleValue ? <>
             <PersonParentForm location={"templates-parents"} selectedPeople={selectedPeople} selectPerson={selectPerson} roles={roles} people={people} lang={idLang} hideRoles={!parentRolesValue} client={client} setAlert={setAlert} projects={projects}/>
           </> : <>
           <input type="text" className="input" disabled/>
           </>}
         </div>
         </div>
     </div> : null }
     <button type="submit" className="button is-primary">{editTemplate ? "Update" : "Create"} template</button>
     </form> : null}
    </>
}

export default TemplatesForm