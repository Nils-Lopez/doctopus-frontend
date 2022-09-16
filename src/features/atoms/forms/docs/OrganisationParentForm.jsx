import React, {useState, Fragment} from "react"

import RoleForm from "../RoleForm"

const OrganisationParentForm = ({selectedOrg, selectOrg}) => {
  const [organisationValue, setOrganisationValue] = useState("")
  const [orgForm, setOrgForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  
  const organisations = [
    {slug: "titlmodee", name:"Mode"},
    {slug: "titldecoe", name:"Deco"},
    {slug: "titlcorpse", name:"Le corps"},
    {slug: "titlesprite", name:"L'esprit'"}
  ]
  
  const roles = [
    {slug: "titlmodee", title:"Mode"},
    {slug: "titldecoe", title:"Deco"},
    {slug: "titlcorpse", title:"Le corps"},
    {slug: "titlesprite", title:"L'esprit'"}
]
  
  const handleOrgChange = (e) => {
    e.preventDefault()
    setOrganisationValue(e.target.value)
  }
  
  const isOrgExisting = (organisation) =>  {
    let retrievedOrg = undefined
    organisations.map((org) => {
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
      orgDoc.parentRoles = selectedRoles
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
      <label className="label title is-5">Organisations</label>
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="organisations" className="input" value={organisationValue} onChange={handleOrgChange}/>
        </div>
        <div className="column is-one-fifth">
          {organisationValue !== "" && selectedRoles[0] || organisationValue !== "" && !isOrgExisting(organisationValue) ? <button className="button is-primary " onClick={handleOrgBtn}>
            {isOrgExisting(organisationValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {organisationValue !== "" ? <RoleForm roles={roles} scope="organisations" location="org-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole}/> : null}
      <datalist id="organisations">
        {organisations.map((org) => {
          return <Fragment key={org.slug}>
            <option>{org.name}</option>
          </Fragment>
        })}
      </datalist>
      {selectedOrg.map((org) => {
        return <Fragment key={org.slug}>
          <span className="tag is-primary is-large mr-3">{org.name} ({org.parentRoles.map((role, i) => {
            const roleStr = i > 0 ? ", " + role.title : role.title
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