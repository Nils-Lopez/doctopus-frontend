import React, {useState} from "react"

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import DocParentForm from "../../atoms/forms/docs/DocParentForm"
import { useTranslation } from "react-i18next";

const ParentForm = ({selectedOrg, selectOrg, selectedPeople, selectPerson, selectedProj, selectProj, selectedDoc, selectDoc, template, client, setAlert}) => {
  
  const [create, setCreate] = useState("organisation")
  const { t, i18n } = useTranslation();
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
        <button className="button is-light" onClick={handleOrganisationBtn}>{t('organization')}</button>
      </div> : null}
      {template && template.parent_person ? <div className="column">
        <button className="button is-light" onClick={handlePersonBtn}>{t('person')}</button>
      </div> : null}
      {template && template.parent_project ? <div className="column">
        <button className="button is-light" onClick={handleProjectBtn}>{t('project')}</button>
      </div> : null}
      <div className="column">
        <button className="button is-light" onClick={handleDocBtn}>{t('document')}</button>
      </div>
    </div>
    {create === "organisation" ? <>
      <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg}  template={template} client={client} setAlert={setAlert} />
    </> : create === "person" ? <>  
      <PersonParentForm selectedPeople={selectedPeople} selectPerson={selectPerson}  template={template} client={client} setAlert={setAlert} />
    </> : create === "project" ? <>
      <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj}  template={template}  client={client} setAlert={setAlert} />
    </> : <>
      <DocParentForm selectedDoc={selectedDoc} selectDoc={selectDoc} template={template} client={client} setAlert={setAlert} />
    </>}
  </>
}

export default ParentForm