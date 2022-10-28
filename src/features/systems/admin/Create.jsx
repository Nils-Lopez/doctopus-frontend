import React, {useState, useEffect, Fragment} from 'react';
  
import DocForm from "../../molecules/Create/DocForm"
import OrganisationForm from "../../molecules/Create/OrganisationForm"
import PersonForm from "../../molecules/Create/PersonForm"

import {useRoles} from "../../../utils/hooks/Roles"
import {useTags} from "../../../utils/hooks/Tags"
import {usePeople} from "../../../utils/hooks/People"
import { useEntities } from "../../../utils/hooks/Entities"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"


const Create = ({client, setAlert}) => {
    
    const [selectedType, selectType] = useState('Document')
    const [selectedTemplate, selectTemplate] = useState('Default')
    const [selectedBrotherHood, selectBrotherHood] = useState("")
  
    const [templateModel, setTemplateModel] = useState({})
  
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

    const handleSelectType = (e) => {
      e.preventDefault()
      selectType(e.target.value)
    }
    
    const handleSelectTemplate = (e) => {
      e.preventDefault()
      selectTemplate(e.target.value)
      docTemplates.map((template) => {
        if (template.schema_name === e.target.value) {
          setTemplateModel(template)
        }
      })

    }
    
    const handleSelectBrotherHood = (e) => {
      e.preventDefault()
      selectBrotherHood(e.target.value)
    }
  
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
  
    
   
  
    return <div className="columns is-flex is-justify-content-center mt-3  ">
      <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen">
        <div className="box">
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
            
            {selectedType === "Document" ? <>
          <div className="column is-one-third">
              <div className="field">
            <label className="label">Template</label>
            <div>
             <input type="text" className="input" value={selectedTemplate} onChange={handleSelectTemplate} list="templates"/>
              <datalist id="templates">
                <option>Default</option>
                {docTemplates.map((template) => {
                  return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                })}
              </datalist>
            </div>
          </div>
              </div>
              <div className="column is-one-third">
              <div className="field">
            <label className="label">Brotherhood</label>
            <div>
              <input type="text" className="input" value={selectedBrotherHood} onChange={handleSelectBrotherHood} list="brotherhoods"/>
              <datalist id="brotherhoods">
                <option>Nouvelles De Danse</option>
                <option>Le Soir Article</option>
                <option>Le Soir Journal</option>
                <option>Le Seigneur Des Anneaux Trilogie</option>
              </datalist>
            </div>
          </div>
            </div>  
          </> : null}
          </div>
          <hr/>
          <div className="form">
            {selectedType === "Document" ? 
              <DocForm client={client} setAlert={setAlert} template={templateModel} brotherhood={selectedBrotherHood} roles={roles} tags={tags} orgs={organisations} people={people} />
            : selectedType === "Organisation" ? 
              <OrganisationForm client={client} setAlert={setAlert} template={selectedTemplate}  roles={roles} tags={tags} people={people} />
            :
              <PersonForm client={client} setAlert={setAlert} template={selectedTemplate}  roles={roles} tags={tags} orgs={organisations} people={people} />
            }
          </div>
        </div>
      </div>
    </div>
}    

export default Create;