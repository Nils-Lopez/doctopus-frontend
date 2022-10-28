import React, {useEffect, useState} from 'react';
  
import {usePeople} from "../../../utils/hooks/People"

import RoleForm from "../../atoms/forms/RoleForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import ActivityForm from "../../atoms/forms/people/ActivityForm"

const PersonForm = ({client, setAlert, template}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descValue, setDescValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [locValue, setLocValue] = useState("")
    
  const [selectedRoles, selectRole] = useState([])
  const [selectedActivities, selectActivity] = useState([])
  const [selectedProj, selectProj] = useState([])
  
  const {
    findPersonById, 
    responseFindPersonById, 
    createPerson, 
    responseCreatePerson,
    updatePerson, 
    responseUpdatePerson,
    deletePerson, 
    responseDeletePerson,
    findPersonBySlug, 
    responseFindPersonBySlug
  } = usePeople()

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
  
  const roles = [
    {slug: "titlmodee", title:"Mode"},
    {slug: "titldecoe", title:"Deco"},
    {slug: "titlcorpse", title:"Le corps"},
    {slug: "titlesprite", title:"L'esprit'"}
  ]

  const handlePersonSubmit = async (e) => {
    e.preventDefault()
    const reqData = {
      person: {
        name: nameValue,
        description: [{ lang: "en", content: descValue }]
      },
      activities: selectedActivities,
      productions: selectedProj
    }
    await createPerson(reqData)
  }

  useEffect(() => {
    console.log(responseCreatePerson)
  }, [responseCreatePerson])
  
  return <>
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
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} />
    <ActivityForm selectedActivities={selectedActivities} selectActivity={selectActivity} />
  </>
}

export default PersonForm