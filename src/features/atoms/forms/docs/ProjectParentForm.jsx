import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import ProjectForm from "../orgs/ProjectForm"
import ParentSearchItem from "../../parents/SearchItem"
import SearchForm from "../SearchForm"

import {useProjects} from "../../../../utils/hooks/Projects"
import {useTranslation} from "react-i18next"

const ProjectParentForm = ({location, selectedProj, selectProj, template, lang, hideRoles, client,setAlert}) => {
  const [projectValue, setProjectValue] = useState("")
  const [projForm, setProjForm] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  
  const [created, setCreated] = useState(false)
  const { t, i18n } = useTranslation()

  const [projects, setProjects] = useState([])




  useEffect(() => {
    if (projectValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([...selectedRoles, role])
        }
      })
    }

   
    if (template && template.parent_project_defaults[0] && selectedProj.length === 0) {
      const newParents = []
      console.log("parents project: ", template.parent_project_defaults)
      template.parent_project_defaults.map((person) => {
        if (!selectedProj.includes(person)) {
          newParents.push(person)
        }
      })
      selectProj(newParents)
    }
  }, [template, projectValue])

  const handleAddProj = (proj) => {
    selectProj([...selectedProj, {project: proj, roles: selectedRoles}])
      selectRole([])

    setProjectValue("")
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
      setProjects([])
      setProjectValue("")
      selectProj([...selectedProj, {project: created, roles: selectedRoles}])
      setProjForm(false)
      selectRole([])
    }
  }, [created])

  const {
    searchProjects, 
    responseSearchProjects
  } = useProjects()


  return <div className={!location || !location.includes('template') ? "mt--1" : ""}>

      {(template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location={!location || !location.includes("template") ? "proj-parent-doc" : "template-parent-proj"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      {(selectedRoles && selectedRoles[0]) || (template && !template.parent_role) ? 
        <SearchForm selectedItems={selectedProj} handleAddItem={handleAddProj} searchItems={searchProjects} responseSearchItems={responseSearchProjects} mainField={"title"} setFormModal={setProjForm}/>
      : null}
     <div className="columns is-multiline">
     {selectedProj?.map((proj) => {
        if (proj && proj.project && proj.project.title) {
          const widthProp = location && location.includes("template") ? "full": ""

          return <Fragment key={proj.project.slug}>
                                  <ParentSearchItem item={proj} handleDelete={handleDeleteProj} width={widthProp}/>

             </Fragment>
        }
      })}
     </div>
    {projForm ? <div className={"modal " + "is-active" }>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">{t('create-project')}</p>
                    <button onClick={() => setProjForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                  <ProjectForm client={client} setAlert={setAlert} setCreated={setCreated}/>
                </div>
       
            </div>
            
        </div> : null}
  </div>
}

export default ProjectParentForm