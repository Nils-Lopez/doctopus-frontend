import React, {useState, Fragment} from "react"

const RoleForm = ({roles, scope, location, selectedRoles, selectRole}) => {
 const [roleValue, setRoleValue] = useState("")
  const [roleForm, setRoleForm] = useState(false)
  const [roleDesc, setRoleDesc] = useState("")
  
  const handleRoleChange = (e) => {
    e.preventDefault()
    setRoleValue(e.target.value)
  }
  
  const isRoleExisting = (r) =>  {
    let retrievedRole = undefined
    roles.map((role) => {
      if (role.title.toLowerCase() === r.toLowerCase()) {
        retrievedRole = role
      } 
    })
    if (retrievedRole) {
      return retrievedRole
    } else return false
  }
  
  const handleRoleBtn = (e) => {
    e.preventDefault()
    const roleDoc = isRoleExisting(roleValue)
    let unique = true
    selectedRoles.map((role) => {
      if (role.title === roleValue) {
        unique = false
      }
    })
    if (unique) {
      if (roleDoc) {
      selectRole([...selectedRoles, roleDoc])
      setRoleValue("")
    } else {
      setRoleForm(true)
    }
    }
  }
  
  const handleCreateRole = (e) => {
    e.preventDefault()
    const newRole = {slug: "new-tag", title: roleValue, description: roleDesc}
    selectRole([...selectedRoles, newRole])
    setRoleValue("")
    setRoleForm(false)
  }
  
  const handleRoleDescChange = (e) => {
    e.preventDefault()
    setRoleDesc(e.target.value)
  }
  
  
  return <>
    <div className="field">
      <label className="label title is-5">Roles</label>
      <div className="columns">
        <div className="column is-four-fifth">
          <input type="text" list="tags" className="input" value={roleValue} onChange={handleRoleChange}/>
        </div>
        <div className="column is-one-fifth">
          {!roleForm ? <>{roleValue !== "" ? <button className="button is-primary " onClick={handleRoleBtn}>
            {isRoleExisting(roleValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateRole}>Confirm</button>}
        </div>
      </div>
      {roleForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">Role description</label>
        <textarea className="textarea" onChange={handleRoleDescChange} value={roleDesc}/>
      </div> : null}
      <datalist id="tags">
        {roles.map((t) => {
          return <Fragment key={t.slug}>
            <option>{t.title}</option>
          </Fragment>
        })}
      </datalist>
      {selectedRoles.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-success is-medium mr-3" onClick={() => console.log(role)}>{role.title}</span>
        </Fragment>
      })}
    </div>
  </>
}

export default RoleForm