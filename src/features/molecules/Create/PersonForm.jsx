import React, {useState} from 'react';
  
const PersonForm = ({client, setAlert}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descValue, setDescValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [locValue, setLocValue] = useState("")
    
  const [selectedRoles, selectRole] = useState([])
  const [selectedActors, selectActor] = useState([])
  const [selectedProj, selectProj] = useState([])
  
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
    <ActorForm selectedPeople={selectedActors} selectPerson={selectActor} />
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} />
    
  </>
}

export default PersonForm