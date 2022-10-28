import React, {useState} from "react"

import RoleForm from "../../atoms/forms/RoleForm"

import {useEntities} from "../../../utils/hooks/Entities"

import ActorForm from "../../atoms/forms/orgs/ActorForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"

const OrganisationForm = ({client, setAlert, template, roles, tags, people}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descValue, setDescValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [locValue, setLocValue] = useState("")
    
  const [selectedRoles, selectRole] = useState([])
  const [selectedActors, selectActor] = useState([])
  const [selectedProj, selectProj] = useState([])
  
  const {
    findEntityById, 
    responseFindEntityById, 
    createEntity, 
    responseCreateEntity,
    updateEntity, 
    responseUpdateEntity,
    deleteEntity, 
    responseDeleteEntity,
    findEntityBySlug, 
    responseFindEntityBySlug
  } = useEntities()


  const handleNameChange = (e) => {
    e.preventDefault()
    setNameValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    setDescValue(e.target.value)
  }
  
  const handleUrlChange = (e) => {
    e.preventDefault()
    setUrlValue(e.target.value)
  }
  
  const handleLocChange = (e) => {
    e.preventDefault()
    setLocValue(e.target.value)
  }


  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const reqData = {
      entity: {
        name: nameValue,
        description: [{ lang: "en", content: descValue }],
        type: "entity",
        url: urlValue,
      },
      roles: selectedRoles,
      actors: selectedActors,
      projects: selectedProj
    } 
    await createEntity(reqData)
  }
  
  return <form onSubmit={handleFormSubmit}>
    <div className="field">
      <label className="label">
        Name
      </label>
      <input type="text" value={nameValue} onChange={handleNameChange} className="input"/>
    </div>
    <div className="field">
      <label className="label">
        Description
      </label>
      <textarea value={descValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
    <div className="columns">
      <div className="column field">
        <label className="label">
          Website
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
      <div className="column field">
        <label className="label">
          Location
        </label>
        <input type="text" value={locValue} onChange={handleLocChange} className="input"/>
      </div>
    </div>
    <RoleForm roles={roles} scope="org" location="org-form" selectedRoles={selectedRoles} selectRole={selectRole}/>
    <ActorForm selectedPeople={selectedActors} selectPerson={selectActor} people={people} />
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} />
     <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-center">
      <button className="button is-primary is-medium" type="submit">
        Create
      </button>
    </footer>
  </form>
}

export default OrganisationForm