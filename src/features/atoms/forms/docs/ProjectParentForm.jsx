import React, {useState, useEffect, Fragment} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

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
  const [isReorderMode, setIsReorderMode] = useState(false)
  
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
          delete person._id
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

  const moveItem = (index, direction) => {
    const newProjects = [...selectedProj];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newProjects.length) {
      [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];
      selectProj(newProjects);
    }
  };

  const renderNormalView = () => (
    <div className="columns is-multiline">
      {selectedProj?.map((proj) => {
        if (proj && proj.project && proj.project.title) {
          const widthProp = location && location.includes("template") ? "full": ""
          return <Fragment key={proj.project.slug}>
            <ParentSearchItem item={proj} handleDelete={handleDeleteProj} width={widthProp}/>
          </Fragment>
        }
        return null;
      })}
    </div>
  )

  const renderReorderView = () => (
    <div className="menu-list">
      {selectedProj?.map((proj, index) => {
        if (proj && proj.project && proj.project.title) {
          return (
            <div 
              key={proj.project.slug + index + "reorder"}
              className="panel-block is-justify-content-space-between p-3 mb-2"
              style={{
                background: 'white',
                border: '1px solid #dbdbdb',
                borderRadius: '4px'
              }}
            >
              <div className="is-flex is-align-items-center">
                <span className="mr-2">{proj.project.title}</span>
                {proj.roles && proj.roles[0] && proj.roles[0].title && proj.roles[0].title[0] && (
                  <span className="tag is-info is-light">{proj.roles[0].title[0].content}</span>
                )}
              </div>
              <div>
                <button 
                  className="button is-small mr-1"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                >
                  <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <button 
                  className="button is-small"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === selectedProj.length - 1}
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
              </div>
            </div>
          )
        }
        return null;
      })}
    </div>
  )

  return <div className={!location || !location.includes('template') ? "mt--1" : ""}>
{projForm ?
            <div className="modal-card mt-5">
              
                <div className="modal-card-body has-background-white">
                  <div className="is-flex is-justify-content-space-between"><p className="modal-card-title title has-text-left is-4 pt-1">{t('project')}</p>
                    <button onClick={() => setProjForm(false)} className="delete is-large ml-4" aria-label="close"></button></div>
                  <ProjectForm client={client} setAlert={setAlert} setCreated={setCreated}/>
                </div>
       
            </div> :null}
            
    {!isReorderMode && (
      <>
        {(template && template.parent_role || !template) && !hideRoles ? 
          <RoleForm scope="parents" location={!location || !location.includes("template") ? "proj-parent-doc" : "template-parent-proj"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} hasMemory/> 
        : null}
        {(selectedRoles && selectedRoles[0]) || (template && !template.parent_role) ? 
          <SearchForm selectedItems={selectedProj} handleAddItem={handleAddProj} searchItems={searchProjects} responseSearchItems={responseSearchProjects} mainField={"title"} setFormModal={setProjForm}/>
        : null}
      </>
    )}

    {selectedProj && selectedProj.length > 1 && (
      <div className="field mb-4 is-flex is-justify-content-end">
        <input 
          id="reorderSwitch" 
          type="checkbox" 
          className="switch is-rounded"
          checked={isReorderMode}
          onChange={() => setIsReorderMode(!isReorderMode)}
        />
        <label htmlFor="reorderSwitch">Organiser</label>
      </div>
    )}

    {isReorderMode ? renderReorderView() : renderNormalView()}
  </div>
}

export default ProjectParentForm