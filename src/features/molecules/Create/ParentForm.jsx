import React, {useState} from "react"

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"

const ParentForm = ({selectedOrg, selectOrg, selectedPeople, selectPerson, selectedProj, selectProj}) => {
  
  const [create, setCreate] = useState("organisation")
  
  const handleOrganisationBtn = (e) => {
    e.preventDefault()
    setCreate("organisation")
  }
  
  const handlePersonBtn = (e) => {
    e.preventDefault()
    setCreate("person")
  }
  
  const handleProjectBtn = (e) => {
    e.preventDefault()
    setCreate("project")
  }
  
  return <>
    <div className="columns">
      <div className="column">
        <button className="button is-light" onClick={handleOrganisationBtn}>Organisation</button>
      </div>
      <div className="column">
        <button className="button is-light" onClick={handlePersonBtn}>Person</button>
      </div>
      <div className="column">
        <button className="button is-light" onClick={handleProjectBtn}>Project</button>
      </div>
    </div>
    {create === "organisation" ? <>
      <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg}/>
    </> : create === "person" ? <>
      <PersonParentForm selectedPeople={selectedPeople} selectPerson={selectPerson}/>
    </> : <>
      <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj}/>
    </>}
  </>
}

export default ParentForm