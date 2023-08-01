import React, {useState, Fragment} from "react"

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import DocParentForm from "../../atoms/forms/docs/DocParentForm"
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaste, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

const ParentForm = ({selectedOrg, selectOrg, selectedPeople, selectPerson, selectedProj, selectProj, selectedDoc, selectDoc, selectedProds, selectProd, template, client, setAlert}) => {
  
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

  const handleProdBtn = (e) => {
    e.preventDefault()
    setCreate("prod")
  }
  
  // if (template && !template.parent_entity) {
  //   setCreate("person")
  // }

  const [prodValue, setProdValue] = useState("")
  const handleNewProd = (e) => {
    e.preventDefault()
    if (prodValue && prodValue !== "") {
      selectProd([...selectedProds, {productionId: prodValue}])
      setProdValue("")
    }
  }

  const handleDeleteProd = (e, item) => {
    e.preventDefault()
    console.log(item)
    selectProd(selectedProds.filter((prod) => prod !== item))
  }


  const handleProdChange = (e) => {
    e.preventDefault()
    setProdValue(e.target.value)
  }



  return <>
    <div className="columns">
      {template && template.parent_entity ? <div className="column">
        {create === "organisation" ? <button className="button is-primary has-text-primary has-background-white" onClick={handleOrganisationBtn}>{t('organization')}</button> : <button className="button is-light" onClick={handleOrganisationBtn}>{t('organization')}</button>}
      </div> : null}
      {template && template.parent_person ? <div className="column">
        {create === "person" ? <button className="button is-primary has-text-primary has-background-white" onClick={handlePersonBtn}>{t('person')}</button> : <button className="button is-light" onClick={handlePersonBtn}>{t('person')}</button>}
      </div> : null}
      {template && template.parent_project ? <div className="column">
        {create === "project" ? <button className="button is-primary has-text-primary has-background-white" onClick={handleProjectBtn}>{t('project')}</button> : <button className="button is-light" onClick={handleProjectBtn}>{t('project')}</button>}
      </div> : null}
      <div className="column">
        {create === "doc" ? <button className="button is-primary has-text-primary has-background-white" onClick={handleDocBtn}>{t('document')}</button> : <button className="button is-light" onClick={handleDocBtn}>{t('document')}</button>}
      </div>
      {selectedProds ? <div className="column">
        {create === "prod" ? <button className="button is-primary has-text-primary has-background-white" onClick={handleProdBtn}>{t('production')}</button> : <button className="button is-light" onClick={handleProdBtn}>{t('production')}</button>}
      </div> : null}
    </div>
    {create === "organisation" ? <>
      <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg}  template={template} client={client} setAlert={setAlert} />
    </> : create === "person" ? <>  
      <PersonParentForm selectedPeople={selectedPeople} selectPerson={selectPerson}  template={template} client={client} setAlert={setAlert} />
    </> : create === "project" ? <>
      <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj}  template={template}  client={client} setAlert={setAlert} />
    </> : create === "doc" ? <>
      <DocParentForm selectedDoc={selectedDoc} selectDoc={selectDoc} template={template} client={client} setAlert={setAlert} />
    </> : <>
    {selectedProds ? <div className="field">
      <label className="label title is-5">{t('productions')}</label>
      <div className="columns">
        <div className="column is-three-fifth">
            <div className="control has-icons-right">
              
            <input type="text" className="input" value={prodValue} placeholder={"Scapin ID"} onChange={handleProdChange} onClick={async () => {
              setProdValue(await navigator.clipboard.readText())
            }}/>
            <span class="icon is-small is-right has-text-primary inputBtn">
           <FontAwesomeIcon icon={faPaste} />    </span>
</div>         
        </div>
        <div className="column is-one-fifth">
          <button className="button is-primary" onClick={handleNewProd}>{t('add')}</button>
        </div>
      </div>
      
      {selectedProds.map((prod) => {
        if (prod) {
          return <Fragment key={prod}>
              <span className="tag is-info is-medium mr-1 mb-1">{prod.productionId}         <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteProd(e, prod)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
             </Fragment>
        }
      })}
    </div> : null}
    </>}
  </>
}

export default ParentForm