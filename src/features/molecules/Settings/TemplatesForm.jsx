import React, {useState, useEffect, Fragment} from 'react';

import {useRoles} from "../../../utils/hooks/Roles"
import {useTags} from "../../../utils/hooks/Tags"
import {usePeople} from "../../../utils/hooks/People"
import { useEntities } from "../../../utils/hooks/Entities"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"


import RoleForm from "../../atoms/forms/RoleForm"
import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"


const TemplatesForm = ({}) => {
    
    const [editTemplate, setEditTemplate] = useState(false)

    const [nameValue, setNameValue] = useState("")
    const [descValue, setDescValue] = useState(true)
    const [langValue, setLangValue] = useState(true)
    const [langDefaultValue, setLangDefaultValue] = useState("")
    const [typeValue, setTypeValue] = useState(true)
    const [publiDateValue, setPubliDateValue] = useState(true)
    const [urlValue, setUrlValue] = useState(true)
    const [pdfValue, setPdfValue] = useState(true)
    const [eanValue, setEanValue] = useState(true)
    const [pagesValue, setPagesValue] = useState(true)
    const [durationValue, setDurationValue] = useState(true)
    const [thumbValue, setThumbValue] = useState(true)
    const [parentRolesValue, setParentRolesValue] = useState(true)
    const [orgValue, setOrgValue] = useState(true)
    const [peopleValue, setPeopleValue] = useState(true)


  
    const [selectedTypes, selectType] = useState([])
    const [selectedRoles, selectRole] = useState([])
    const [selectedOrg, selectOrg] = useState([])
    const [selectedPeople, selectPerson] = useState([])
  
    const [roles, setRoles] = useState([])
    const [tags, setTags] = useState([])
    const [organisations, setOrganisations] = useState([])
    const [people, setPeople] = useState([])
    const [docTemplates, setDocTemplates] = useState([])
  
    const [rolesLoading, setRolesLoading] = useState(false)
    const [tagsLoading, setTagsLoading] = useState(false)
    const [organisationsLoading, setOrganisationsLoading] = useState(false)
    const [peopleLoading, setPeopleLoading] = useState(false)
    const [docTemplatesLoading, setDocTemplatesLoading] = useState(false)

    const {
      responseFindAllRoles,
      findAllRoles
    } = useRoles()

    if (!roles[0] && !rolesLoading) {
      findAllRoles()
      setRolesLoading(true)
    }
  
    useEffect(() => {
      if (responseFindAllRoles && responseFindAllRoles.success) {
        setRoles(responseFindAllRoles.data)
      }
    }, [responseFindAllRoles])
  
    const {
      responseFindAllTags,
      findAllTags
    } = useTags()
  
    if (!tags[0] && !tagsLoading) {
      findAllTags()
      setTagsLoading(true)
    }
  
    useEffect(() => {
      if (responseFindAllTags && responseFindAllTags.success) {
        setTags(responseFindAllTags.data)
      }
    }, [responseFindAllTags])
  
    const {
      responseFindAllPeople,
      findAllPeople
    } = usePeople()
  
    if (!people[0] && !peopleLoading) {
      findAllPeople()
      setPeopleLoading(true)
    }
  
    useEffect(() => {
      if (responseFindAllPeople && responseFindAllPeople.success) {
        setPeople(responseFindAllPeople.data)
      }
    }, [responseFindAllPeople])
  
    const {
      responseFindAllEntities,
      findAllEntities
    } = useEntities()
  
    if (!organisations[0] && !organisationsLoading) {
      findAllEntities()
      setOrganisationsLoading(true)
    }
  
    useEffect(() => {
      if (responseFindAllEntities && responseFindAllEntities.success) {
        setOrganisations(responseFindAllEntities.data)
      }
    }, [responseFindAllEntities])
    
    
  
    const {
      responseFindAllDocTemplates,
      findAllDocTemplates,
      createDocTemplate,
      responseCreateDocTemplate
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
    setLangDefaultValue(e.target.value)
  }
  
    


    const handleTemplateSubmit = (e) => {
      e.preventDefault()
      const reqData = {
         schema_name: nameValue,
        schema_slug: nameValue.toLowerCase(),
        description: descValue,
        language: {exist: langValue, default: langDefaultValue},
        //Relations
        support_role: typeValue, //Kind of doc support (media, book, ebook, article, movie etc)
        support_role_defaults: selectedTypes,
        support_publishedAt: publiDateValue, //Publication date of support
        support_url: urlValue, //Url of media
        support_pdf: pdfValue, //Url of pdf
        support_eanIsbn: eanValue, //EAN OR ISBN key
        support_pages: pagesValue, //Number of pages
        support_duration: durationValue, //Duration of video/movie
        support_thumb: thumbValue, //Url of thumbnail
        parent_role: parentRolesValue,
        parent_role_defaults: selectedRoles,
        parent_entity: orgValue, 
        parent_entity_defaults: selectedOrg,
        parent_person: peopleValue, 
        parent_person_defaults: selectedPeople
      }
      createDocTemplate(reqData)
    }
  
    useEffect(() => {
      if (responseCreateDocTemplate && responseCreateDocTemplate.success) {
        console.log('TEMPLATE CREEE', responseCreateDocTemplate)
      } else {
        console.log('Probleme cration template, ', responseCreateDocTemplate)
      }
    }, [responseCreateDocTemplate])
  
    return <>
      <div className="panel ">
        <div className="panel-heading is-flex is-justify-content-space-between">
          <p>List</p>
          <button className="button is-primary">Create</button>
        </div>
        {docTemplates.map((template) => {

          return <Fragment key={template.schema_slug}>
          <a className="panel-block is-active">
          <span className="panel-icon">
            <i className="fas fa-book" aria-hidden="true"></i>
          </span>
            {template.schema_name}
            </a>
          </Fragment>
        })}
      </div>
        <form onSubmit={handleTemplateSubmit}>
          <div className="field">
            <label className="label ">Template Name</label>
            <input type="text" className="input" value={nameValue} onChange={handleNameChange} />
          </div>
          <div className="columns">
          <div className="column">
           <div className="field">
          <input id="switchDesc" type="checkbox" name="switchDesc" className="switch is-rtl" checked={descValue ? "checked" : ""} onChange={() => setDescValue(!descValue)} />
  <label htmlFor="switchDesc" className="label">Description</label>
</div>
          </div>
          <div className="column">
          <div className="field">
          <input id="switchLang" type="checkbox" name="switchLang" className="switch is-rtl" checked={langValue ? "checked" : ""} onChange={() => setLangValue(!langValue)} />
  <label htmlFor="switchLang" className="label">Language</label>
</div>
          </div>
          <div className="column">
<div className="field">
              {langValue ? <>
              <input type="text" placeholder="Default language" className="input" value={langDefaultValue} onChange={handleLangDefaultChange} />
              </> : <>
              <input type="text" className="input" value={langDefaultValue} onChange={handleLangDefaultChange} disabled/>
              </>}
          </div>
          </div>
        </div>
        <hr />
        <h3 className="title is-4 ">Supports</h3>
       
        <div className="columns">
          <div className="column">
                 <div className="field">
          <input id="switchExample" type="checkbox" name="switchExample" className="switch is-rtl" checked={typeValue ? "checked" : ""} onChange={() => setTypeValue(!typeValue)} />
  <label htmlFor="switchExample" className="label">Types</label>
</div>
          </div>
          <div className="column">
<div className="field">
              {typeValue ? <>
                <RoleForm roles={roles} location={"templates"} selectedRoles={selectedTypes} selectRole={selectType} />
              </> : <>
              <input type="text" className="input" disabled/>
              </>}
            </div>
            </div>
        </div>
        <div className="field">
          <input id="switchDate" type="checkbox" name="switchDate" className="switch is-rtl" checked={publiDateValue ? "checked" : ""} onChange={() => setPubliDateValue(!publiDateValue)} />
  <label htmlFor="switchDate" className="label">Publication date</label>
</div>
        
        <div className="field">
          <input id="switchPdf" type="checkbox" name="switchPdf" className="switch is-rtl" checked={pdfValue ? "checked" : ""} onChange={() => setPdfValue(!pdfValue)} />
  <label htmlFor="switchPdf" className="label">Pdf</label>
</div>
        <div className="field">
          <input id="switchEan" type="checkbox" name="switchEan" className="switch is-rtl" checked={eanValue ? "checked" : ""} onChange={() => setEanValue(!eanValue)} />
  <label htmlFor="switchEan" className="label">EAN/ISBN</label>
</div>
       <div className="field">
          <input id="switchPages" type="checkbox" name="switchPages" className="switch is-rtl" checked={pagesValue ? "checked" : ""} onChange={() => setPagesValue(!pagesValue)} />
  <label htmlFor="switchPages" className="label">Number of pages</label>
</div>
        <div className="field">
          <input id="switchDuration" type="checkbox" name="switchDuration" className="switch is-rtl" checked={durationValue ? "checked" : ""} onChange={() => setDurationValue(!durationValue)} />
  <label htmlFor="switchDuration" className="label">Duration</label>
</div>
       <div className="field">
          <input id="switchThumb" type="checkbox" name="switchThumb" className="switch is-rtl" checked={thumbValue ? "checked" : ""} onChange={() => setThumbValue(!thumbValue)} />
  <label htmlFor="switchThumb" className="label">Thumbnail Image</label>
        </div>
        <div className="field">
          <input id="switchUrl" type="checkbox" name="switchUrl" className="switch is-rtl" checked={urlValue ? "checked" : ""} onChange={() => setUrlValue(!urlValue)} />
  <label htmlFor="switchUrl" className="label">Url</label>
        </div>
        <hr />
        <h3 className="title is-4">Parents</h3>
        <div className="columns">
          <div className="column">
                 <div className="field">
          <input id="switchParentROles" type="checkbox" name="switchParentROles" className="switch is-rtl" checked={parentRolesValue ? "checked" : ""} onChange={() => setParentRolesValue(!parentRolesValue)} />
  <label htmlFor="switchParentROles" className="label">Roles</label>
</div>
          </div>
          <div className="column">
<div className="field">
              {parentRolesValue ? <>
                <RoleForm roles={roles} location={"templates-parents"} selectedRoles={selectedRoles} selectRole={selectRole} />
              </> : <>
              <input type="text" className="input" disabled/>
              </>}
            </div>
            </div>
        </div>
        <div className="columns">
          <div className="column">
                 <div className="field">
          <input id="switchParentOrg" type="checkbox" name="switchParentOrg" className="switch is-rtl" checked={orgValue ? "checked" : ""} onChange={() => setOrgValue(!orgValue)} />
  <label htmlFor="switchParentOrg" className="label">Organisations</label>
</div>
          </div>
          <div className="column">
            <div className="field">
              {orgValue ? <>
                <OrganisationParentForm location={"templates-parents"} selectedOrg={selectedOrg} selectOrg={selectOrg} roles={roles} orgs={organisations}/>
              </> : <>
                <input type="text" className="input" disabled/>
              </>}
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
                 <div className="field">
          <input id="switchParentPeople" type="checkbox" name="switchParentPeople" className="switch is-rtl" checked={peopleValue ? "checked" : ""} onChange={() => setPeopleValue(!peopleValue)} />
  <label htmlFor="switchParentPeople" className="label">People</label>
</div>
          </div>
          <div className="column">
<div className="field">
              {peopleValue ? <>
                <PersonParentForm location={"templates-parents"} selectedPeople={selectedPeople} selectPerson={selectPerson} roles={roles} people={people}/>
              </> : <>
              <input type="text" className="input" disabled/>
              </>}
            </div>
            </div>
        </div>
        <button type="submit" className="button is-primary">Create template</button>
        </form>
    </>
}

export default TemplatesForm