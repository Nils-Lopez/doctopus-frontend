import React, { useState, useEffect } from "react"

import {useProjects} from "../../../../utils/hooks/entities/Projects"

import RoleForm from "../RoleForm"
import SearchForm from "../SearchForm"


import {useTranslation} from "react-i18next"
import {useNavigate} from "react-router-dom"
import {usePeople} from "../../../../utils/hooks/People"
import {useEntities} from "../../../../utils/hooks/Entities"

const ProjectForm = ({client, setAlert, setCreated, dataUpdate, setDataUpdate}) => {
    
    const [idLang, setIdLang] = useState("fr")
    const [titleValue, setTitleValue] = useState("")
    const [descEnValue, setDescEnValue] = useState("")
    const [descFrValue, setDescFrValue] = useState("")
    const [slugValue, setSlugValue] = useState("")
    const [dateValue, setDateValue] = useState("")
    const [aliases, setAliases] = useState([]);

    const [selectedActors, selectActor] = useState([])
    const [selectedOrgs, selectOrg] = useState([])
    const [selectedRoles, selectRole] = useState([])

    const [loading, setLoading] = useState(false)

    console.log(selectedActors)

    const { t, i18n } = useTranslation() 

    const {
        createProject, 
        responseCreateProject,
        updateProject,
        responseUpdateProject,
        deleteProject,
        responseDeleteProject
    } = useProjects()
 
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const reqData = {
            project: {
                entities: selectedOrgs,
                actors: selectedActors,
                description: [{ lang: "en", content: descEnValue }, { lang: "fr", content: descFrValue }],
                title: titleValue,
                slug: slugValue,
                date: dateValue,
                aliases: aliases,
            },
            roles: selectedRoles
        }

        if (dataUpdate) {
         updateProject(reqData, dataUpdate._id)
        } else {
         createProject(reqData)
        }         
        
    }
    
        const getContent = (value, lang) => {
      if (value) {
        return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
      } else {
        return "Error"
      }
    }

    useEffect(() => {
     if (dataUpdate) {
      setTitleValue(dataUpdate.title)
      setSlugValue(dataUpdate.slug)
      setDateValue(dataUpdate.date)
      selectRole(dataUpdate.roles)
      selectOrg(dataUpdate.entities)
      selectActor(dataUpdate.actors)
      setAliases(dataUpdate.aliases || []);
      if (dataUpdate.description && dataUpdate.description[0]) {
       setDescFrValue(getContent(dataUpdate.description, "fr"))
       setDescEnValue(getContent(dataUpdate.description, "en"))
      }
     }
    }, [dataUpdate])
    
        useEffect(() => {
        if (responseUpdateProject && responseUpdateProject.success) {
        setAlert({ type: "success", message: { en: t('project-created'), fr: t('project-created') } })
        setDataUpdate({...responseUpdateProject.data, success: true})
        setLoading(false)
        } else if (responseUpdateProject && !responseUpdateProject.success) {
        setAlert({ type: "error", message: { en: t('error-project-creation'), fr: t('error-project-creation')}})
        setLoading(false)
        }
    }, [responseUpdateProject])

    
    useEffect(() => {
        if (responseCreateProject && responseCreateProject.success) {
        if (setCreated) {
            setCreated(responseCreateProject.data)
        } else {
            setAlert({ type: "success", message: { en: t('project-created'), fr: t('project-created') } })

        }
        setLoading(false)
        } else if (responseCreateProject && !responseCreateProject.success) {
        setAlert({ type: "error", message: { en: t('error-project-creation'), fr: t('error-project-creation')}})
        setLoading(false)
        }
    }, [responseCreateProject])

    const handleDescChange = (e) => {
        e.preventDefault()
        if (idLang === "fr") {
            setDescFrValue(e.target.value)
        } else {
            setDescEnValue(e.target.value)
        }
    }

    const handleTitleChange = (e) => {
        e.preventDefault()

        setTitleValue(e.target.value)
        setSlugValue(e.target.value.replaceAll(" ", "-").toLowerCase())

    }

    const handleDateChange = (e) => {
        e.preventDefault()
        setDateValue(e.target.value)
    }
    const [confirmDelete, setConfirmDelete] = useState(false)
    let navigate = useNavigate()

    const handleDeleteProj = (e) => {
        e.preventDefault()
        if (confirmDelete) {
          deleteProject(dataUpdate._id)
          setConfirmDelete(false)
          setAlert({ type: "success", message: { en: "Document has been successfully deleted.", fr: "Le document a été supprimé avec succès"}})
          navigate('/')
    
        } else {
          setConfirmDelete(true)
        }
    
      }

      const {
        searchEntities, 
        responseSearchEntities
      } = useEntities()
    
      const {
        searchPeople, 
        responseSearchPeople
      } = usePeople()

      const handleAliasAdd = (e) => {
        e.preventDefault();
        const value = e.target.parentElement.previousElementSibling.querySelector('input').value;
        if (value && value.trim()) {
            setAliases([...aliases, value.trim()]);
            e.target.parentElement.previousElementSibling.querySelector('input').value = '';
        }
    };

    const handleAliasRemove = (index) => {
        setAliases(aliases.filter((_, i) => i !== index));
    };

      console.log(dataUpdate)

    return loading ? <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> : <div>
        
        <div className="is-flex is-justify-content-end">{dataUpdate ?
      <button className="button is-danger is-small mt-3" onClick={handleDeleteProj}>
        {confirmDelete ? t('confirm') : t('delete')}
      </button>
   : null}</div>
        <div className="field">
            <label className="label has-text-left">
                {t('title')}
            </label>
            <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>
        <div className="field" id="docDesc">
            <label className="label has-text-left">
            {t('description')}
            </label>
            <textarea className="textarea" value={i18n.language === "fr" ? descFrValue : descEnValue} onChange={handleDescChange}></textarea>
        </div>
        <div className="field">
            <label className="label has-text-left">
            {t('birthdate')}
            </label>
            <input type="date" className="input is-active" value={dateValue} onChange={handleDateChange}/>
        </div>
        <div className="field">
            <label className="label has-text-left">Alias</label>
            <div className="is-flex is-flex-wrap-wrap mb-2">
                {aliases.map((alias, index) => (
                    <span key={index} className="tag is-info is-medium mr-2 mb-2">
                        {alias}
                        <button className="delete is-small" onClick={() => handleAliasRemove(index)}></button>
                    </span>
                ))}
            </div>
            <div className="field has-addons mt--1">
              <div className="control is-expanded">
                <input type="text" className="input"/>
              </div>
              <div className="control">
                <button className="button is-info" onClick={handleAliasAdd}>
                  {t("add")}
                </button>
              </div>
            </div>
          </div>
        <RoleForm scope="parents" location="project-form" selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />

        <label className="label has-text-left mb--1">
            {t('Organizations')}
            </label>
        <SearchForm selectedItems={selectedOrgs} selectItem={selectOrg} searchItems={searchEntities} responseSearchItems={responseSearchEntities} mainField={"name"}/>
        <label className="label has-text-left mb--1 mt-3">
            {t('people')}
            </label>
        <SearchForm selectedItems={selectedActors} selectItem={selectActor} searchItems={searchPeople} responseSearchItems={responseSearchPeople} mainField={"name"}/>
     
        <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-end">
      <button className="button is-primary is-radiusless" onClick={handleSubmit}>
        {t('confirm')}
      </button>
    </footer>
    </div>
}

export default ProjectForm