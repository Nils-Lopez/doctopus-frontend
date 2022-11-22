import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import ProjectForm from "../orgs/ProjectForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const ProjectParentForm = ({location, selectedProj, selectProj, roles, template, projects, lang, hideRoles, client, tags, setAlert, orgs, people}) => {
  const [projectValue, setProjectValue] = useState("")
  const [projForm, setProjForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  
  const [created, setCreated] = useState(false)

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

  useEffect(() => {
    if (projectValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([...selectedRoles, role])
        }
      })
    }

    if (template && template.parent_project_defaults[0]) {
      template.parent_project_defaults.map((project) => {
        if (!selectedProj.includes(project)) {
          selectProj([...selectedProj, project])
        }
      })
    }
  }, [template, projectValue])

  
  const handleProjChange = (e) => {
    e.preventDefault()
    setProjectValue(e.target.value)
  }
  
  const isProjExisting = (project) =>  {
    let retrievedProj = undefined
    projects.map((proj) => {
      if (proj.title && proj.title.toLowerCase() === project.toLowerCase()) {
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
      if (proj.title === projectValue) {
        unique = false
      }
    })
    
    if (unique) {
      if (projDoc) {
      selectProj([...selectedProj, {project: projDoc, roles: selectedRoles}])
      selectRole([])
      setProjectValue("")
    } else {
      setProjForm(true)
      setIsActive(true)
    }
   }
  }

  const handleDeleteProj = (e, proj) => {
    e.preventDefault()
    const filtered = selectedProj.filter((r) => {
      return r !== proj
    })
    selectProj(filtered)
  }

  useEffect(() => {
    if (created && !projects.includes(created)) {
      projects.push(created)
      setProjectValue(created.title)
      setProjForm(false)
    }
  }, [created])
  
  return <>
    <div className="field">
      {!location || location !== "templates-parents" ? <label className="label title is-5">Projects</label> : null}
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="projects" className="input" value={projectValue} placeholder={location === "templates-parents" ? "Default projects" : ""} onChange={handleProjChange}/>
        </div>
        <div className="column is-one-fifth">
          {(projectValue !== "" && selectedRoles[0]) || (projectValue !== "" && !isProjExisting(projectValue)) || (projectValue !== "" && hideRoles) ? <button className="button is-primary " onClick={handleProjBtn}>
            {isProjExisting(projectValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {projectValue !== "" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm roles={roles} scope="parents" location="proj-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      <datalist id="projects">
        {projects && projects[0] ? projects.map((proj) => {
          return <Fragment key={proj.slug}>
            <option>{proj.title}</option>
          </Fragment>
        }) : null}
      </datalist>
      {selectedProj.map((proj) => {
        if (proj.project && proj.project.title) {
          return <Fragment key={proj.project.slug}>
          <span className="tag is-primary is-large mr-3">
            <>
              {proj.project.title}
            </>
            &nbsp;
            {!hideRoles && (!template || template && template.parent_role) && proj.roles[0] ? <>
              ({proj.roles.map((role, i) => {
                const roleStr = i > 0 ? ", " + getContent(role.title, lang) : getContent(role.title, lang)
                return roleStr
              })})
            </> : null}
            </span>
            <span className="tag is-danger is-large mr-2 button" onClick={(e) => handleDeleteProj(e, proj)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
        }
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
                  <ProjectForm client={client} roles={roles} setAlert={setAlert} projects={projects} tags={tags} orgs={orgs} people={people} />
                </div>
       
            </div>
            
        </div> : null}
  </>
}

export default ProjectParentForm