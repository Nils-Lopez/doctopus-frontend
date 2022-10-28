import React, {useState, Fragment} from "react"

import RoleForm from "../RoleForm"

const OrganisationParentForm = ({selectedOrg, selectOrg, location, roles, orgs, template}) => {
  const [organisationValue, setOrganisationValue] = useState("")
  const [orgForm, setOrgForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  
  if (organisationValue === "" && template && template.parent_entity_defaults[0] && template.parent_entity_defaults) {
    template.parent_entity_defaults.map((org) => {
      selectOrg([... selectedOrg, org])
    })
  }

  if (organisationValue === "" && template && template.parent_role_defaults[0]) {
    template.parent_role_defaults.map((role) => {
      selectRole([... selectedRoles, role])
    })
  }

  const handleOrgChange = (e) => {
    e.preventDefault()
    setOrganisationValue(e.target.value)
  }
  
  const isOrgExisting = (organisation) =>  {
    let retrievedOrg = undefined
    orgs.map((org) => {
      if (org.name.toLowerCase() === organisation.toLowerCase()) {
        retrievedOrg = org
      } 
    })
    if (retrievedOrg) {
      return retrievedOrg
    } else return false
  }
  
  const handleOrgBtn = (e) => {
    e.preventDefault()
    const orgDoc = isOrgExisting(organisationValue)
    let unique = true
    selectedOrg.map((org) => {
      if (org.name === organisationValue) {
        unique = false
      }
    })
    if (unique) {
      if (orgDoc) {
      orgDoc.roles = selectedRoles
      selectOrg([...selectedOrg, orgDoc])
      selectRole([])
      setOrganisationValue("")
    } else {
      setOrgForm(true)
      setIsActive(true)
    }
   }  
  }

  
  
  return <>
    <div className="field">
      {location !== "templates-parents" ? <label className="label title is-5">Organisations</label> : null}
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="orgs" placeholder={location === "templates-parents" ? "Default orgs" : ""} className="input" value={organisationValue} onChange={handleOrgChange}/>
        </div>
        <div className="column is-one-fifth">
          {(organisationValue !== "" && selectedRoles[0]) || (organisationValue !== "" && !isOrgExisting(organisationValue)) ? <button className="button is-primary " onClick={handleOrgBtn}>
            {isOrgExisting(organisationValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {organisationValue !== "" && location !== "activity-form" ? <RoleForm roles={roles} scope="orgs" location="org-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole}/> : null}
      <datalist id="orgs">
        {orgs.map((org) => {
          return <Fragment key={org.slug}>
            <option>{org.name}</option>
          </Fragment>
        })}
      </datalist>
      {selectedOrg.map((org) => {
        return <Fragment key={org.slug}>
          <span className="tag is-primary is-large mr-3">{org.name} ({org.roles.map((role, i) => {
            const roleStr = i > 0 ? ", " + role.title[0].content : role.title[0].content
            return roleStr
          })})</span>
        </Fragment>
      })}
    </div>
    {orgForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
      <div className="modal-background"></div>
        <div className="modal-card">
          <div className="modal-card-head has-background-white-ter">
            <p className="modal-card-title is-size-3 ml-6">Create Organisation</p>
              <button onClick={() => setOrgForm(false)} className="delete is-large ml-4" aria-label="close"></button>
              </div>
              <div className="modal-card-body has-background-white-ter">
                C ici qu'on va gerer les bails tqt
              </div>
       
            </div>
            
        </div> : null}
  </>
}

export default OrganisationParentForm