import React, {useState} from "react"

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import DocParentForm from "../../atoms/forms/docs/DocParentForm"

const ParentForm = ({selectedOrg, selectOrg, selectedPeople, selectPerson, selectedProj, selectProj, selectedDoc, selectDoc, roles, people, orgs, template, projects, client, tags, setAlert}) => {
  
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

  const handleDocBtn = (e) => {
    e.preventDefault()
    setCreate("doc")
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
      {template && template.parent_project ? <div className="column">
        <button className="button is-light" onClick={handleProjectBtn}>Project</button>
      </div> : null}
      <div className="column">
        <button className="button is-light" onClick={handleDocBtn}>Doc</button>
      </div>
    </div>
    {create === "organisation" ? <>
      <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} roles={roles} orgs={orgs} template={template} client={client} setAlert={setAlert} tags={tags} people={people} projects={projects}/>
    </> : create === "person" ? <>  
      <PersonParentForm selectedPeople={selectedPeople} selectPerson={selectPerson} roles={roles} people={people} template={template} client={client} setAlert={setAlert} projects={projects}/>
    </> : create === "project" ? <>
      <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} roles={roles} template={template} projects={projects} client={client} setAlert={setAlert} tags={tags} orgs={orgs} people={people}/>
    </> : <>
      <DocParentForm selectedDoc={selectedDoc} selectDoc={selectDoc} roles={roles} template={template} client={client} setAlert={setAlert} />
    </>}
  </>
}

export default ParentForm