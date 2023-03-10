import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import ProjectForm from "../orgs/ProjectForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import {useProjects} from "../../../../utils/hooks/Projects"

const ProjectParentForm = ({location, selectedProj, selectProj, template, lang, hideRoles, client,setAlert}) => {
  const [projectValue, setProjectValue] = useState("")
  const [projForm, setProjForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  
  const [created, setCreated] = useState(false)

  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [pending, setPending] = useState("")


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
      if (proj.title === currentProj) {
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
      setProjects([...projects, created])
      setProjectValue(created.title)
      setProjForm(false)
    }
  }, [created])

  const {
    searchProjects, 
    responseSearchProjects
  } = useProjects()

  const searchProjectValue = (e) => {
    e.preventDefault()
    if (projectValue !== "") {
      setProjectsLoading(true)
      searchProjects(projectValue)
    }
  }

  useEffect(() => {
    if (responseSearchProjects && responseSearchProjects.success && responseSearchProjects.data[0] && projectsLoading) {
      setProjectsLoading(false)
      setProjects(responseSearchProjects.data)
     
    } else if (responseSearchProjects && projectsLoading) {
      setProjectsLoading(false)
      setProjForm(true)
    }
  }, [responseSearchProjects])
  
  useEffect(() => {
     projects.map((project) => {
        if (project.title === projectValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(projectValue)
      } else {
        setPending("")
      }
  }, [projects])

  const changeCurrentProj = (e) => {
    e.preventDefault()
    setCurrentProj(e.target.value)
    setProjectValue(e.target.value)
  }

  const [currentProj, setCurrentProj] = useState({})

  const isNotIncluded = (query, array) => {
    let included = false
    array.map((a) => {
      if (a.title.toLowerCase() === query.toLowerCase()) {
        included = true
      } 
    })
    return !included
  }

  return <>
    <div className="field">
      {!location || location !== "templates-parents" ? <label className="label title is-5">Projects</label> : null}
      <div className="columns">
        <div className="column is-three-fifth">
          {(!projects || !projects[0]) ? <>
            <input type="text" list="projects" className="input" value={projectValue} placeholder={location === "templates-parents" ? "Default projects" : ""} onChange={handleProjChange}/>
          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentProj} onChange={changeCurrentProj} name={"projects" + location} id={"roles" + location}>
                {pending !== "" && isNotIncluded(pending, projects) ? <>
                  <option value={pending}>{pending} (draft)</option>
                </> : null}
                {projects.map((t, i) => {
                  if (i < 7) {
                    return <Fragment key={t.slug}>
                    <option value={t.slug}>{t.title}</option>
                  </Fragment>
                  }
                })}
                
            </select>
          </div>}
        </div>
        <div className="column is-one-fifth">
          {(!projects || !projects[0]) && !projForm ? <>
            {projectValue !== "" && !projectsLoading ? <button className="button is-primary" onClick={searchProjectValue}>Search</button> : <button className="button is-primary is-disabled" disabled>Search</button>}
          </> : <>
            {(projectValue !== "" && selectedRoles[0]) || (projectValue !== "" && !isProjExisting(projectValue)) || (projectValue !== "" && isProjExisting(projectValue)) || (projectValue !== "" && hideRoles) ? <button className="button is-primary " onClick={handleProjBtn}>
              {isProjExisting(projectValue) ? "Add" : "Create"}
            </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
            <span className="tag is-danger is-medium ml-2 mt-1 button" onClick={() => {
                setProjects([]);
              }}><FontAwesomeIcon icon={faTrash}/></span>
          </>}
        </div>
      </div>
      {projectValue !== "" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location="proj-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      
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
                  <ProjectForm client={client} setAlert={setAlert} />
                </div>
       
            </div>
            
        </div> : null}
  </>
}

export default ProjectParentForm