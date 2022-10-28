import React, {useState} from "react"

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"

const ParentForm = ({selectedOrg, selectOrg, selectedPeople, selectPerson, selectedProj, selectProj, roles, people, orgs, template}) => {
  
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
  
  // if (template && !template.parent_entity) {
  //   setCreate("person")
  // }

  return <>
    <div className="columns">
      {template && template.parent_entity ? <div className="column">
        <button className="button is-light" onClick={handleOrganisationBtn}>Organisation</button>
      </div> : null}
      {template && template.parent_person ? <div className="column">
        <button className="button is-light" onClick={handlePersonBtn}>Person</button>
      </div> : null}
      <div className="column">
        <button className="button is-light" onClick={handleProjectBtn}>Project</button>
      </div>
    </div>
    {create === "organisation" ? <>
      <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} roles={roles} orgs={orgs} template={template} />
    </> : create === "person" ? <>  
      <PersonParentForm selectedPeople={selectedPeople} selectPerson={selectPerson} roles={roles} people={people} template={template} />
    </> : <>
      <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} roles={roles} template={template} />
    </>}
  </>
}

export default ParentForm