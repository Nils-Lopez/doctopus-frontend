import React, {useState, Fragment} from "react"

import RoleForm from "../RoleForm"

const ProjectParentForm = ({selectedProj, selectProj, roles, template}) => {
  const [projectValue, setProjectValue] = useState("")
  const [projForm, setProjForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  
  const projects = [
    {slug: "titlmodee", name:"Mode"},
    {slug: "titldecoe", name:"Deco"},
    {slug: "titlcorpse", name:"Le corps"},
    {slug: "titlesprite", name:"L'esprit'"}
  ]
  
  if (projectValue === "" && template && template.parent_role_defaults[0]) {
    template.parent_role_defaults.map((role) => {
      selectRole([... selectedRoles, role])
    })
  }

  
  const handleProjChange = (e) => {
    e.preventDefault()
    setProjectValue(e.target.value)
  }
  
  const isProjExisting = (project) =>  {
    let retrievedProj = undefined
    projects.map((proj) => {
      if (proj.name.toLowerCase() === project.toLowerCase()) {
        retrievedProj = proj
      } 
    })
    if (retrievedProj) {
      return retrievedProj
    } else return false
  }
  
  const handleProjBtn = (e) => {
    e.preventDefault()
    const projDoc = isProjExisting(projectValue)
    let unique = true
    selectedProj.map((proj) => {
      if (proj.name === projectValue) {
        unique = false
      }
    })
    
    if (unique) {
      if (projDoc) {
      projDoc.roles = selectedRoles
      selectProj([...selectedProj, projDoc])
      selectRole([])
      setProjectValue("")
    } else {
      setProjForm(true)
      setIsActive(true)
    }
   }
  }

  
  
  return <>
    <div className="field">
      <label className="label title is-5">Projects</label>
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="projects" className="input" value={projectValue} onChange={handleProjChange}/>
        </div>
        <div className="column is-one-fifth">
          {(projectValue !== "" && selectedRoles[0]) || (projectValue !== "" && !isProjExisting(projectValue)) ? <button className="button is-primary " onClick={handleProjBtn}>
            {isProjExisting(projectValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {projectValue !== "" ? <RoleForm roles={roles} scope="projects" location="proj-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole}/> : null}
      <datalist id="projects">
        {projects.map((proj) => {
          return <Fragment key={proj.slug}>
            <option>{proj.name}</option>
          </Fragment>
        })}
      </datalist>
      {selectedProj.map((proj) => {
        return <Fragment key={proj.slug}>
          <span className="tag is-primary is-large mr-3">{proj.name} ({proj.roles.map((role, i) => {
            const roleStr = i > 0 ? ", " + role.title : role.title
            return roleStr
          })})</span>
        </Fragment>
      })}
    </div>
    {projForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">Create Project</p>
                    <button onClick={() => setProjForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                  C ici qu'on va gerer les bails tqt
                </div>
       
            </div>
            
        </div> : null}
  </>
}

export default ProjectParentForm