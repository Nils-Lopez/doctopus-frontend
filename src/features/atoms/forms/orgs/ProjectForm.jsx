import React, { useState, useEffect } from "react"

import {useProjects} from "../../../../utils/hooks/entities/Projects"

import RoleForm from "../RoleForm"
import OrganisationParentForm from "../docs/OrganisationParentForm"
import ActorForm from "./ActorForm"

import {useTranslation} from "react-i18next"

const ProjectForm = ({client, setAlert, setCreated}) => {
    
    const [idLang, setIdLang] = useState("fr")
    const [titleValue, setTitleValue] = useState("")
    const [descEnValue, setDescEnValue] = useState("")
    const [descFrValue, setDescFrValue] = useState("")
    const [slugValue, setSlugValue] = useState("")
    const [dateValue, setDateValue] = useState("")

    const [selectedActors, selectActor] = useState([])
    const [selectedOrgs, selectOrg] = useState([])
    const [selectedRoles, selectRole] = useState([])

    const { t, i18n } = useTranslation() 

    const {
        createProject, 
        responseCreateProject
    } = useProjects()
 
    const handleSubmit = (e) => {
        e.preventDefault()
        const reqData = {
            project: {
                entities: selectedOrgs,
                actors: selectedActors,
                description: [{ lang: "en", content: descEnValue }, { lang: "fr", content: descFrValue }],
                title: titleValue,
                slug: slugValue,
                date: dateValue
            },
            roles: selectedRoles
        }
        console.log('data: ', reqData)
        createProject(reqData)
    }
    
    useEffect(() => {
        if (responseCreateProject && responseCreateProject.success) {
        setAlert({ type: "success", message: { en: t('project-created'), fr: t('project-created') } })
        if (setCreated) {
            setCreated(responseCreateProject.data)
        }
        } else if (responseCreateProject && !responseCreateProject.success) {
        setAlert({ type: "error", message: { en: t('error-project-creation'), fr: t('error-project-creation')}})

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

    return <>
        <div className="tabs">
            <ul>
                <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
                <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
            </ul>
        </div>
        <div className="field">
            <label className="label">
                {t('title')}
            </label>
            <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>
        <div className="field" id="docDesc">
            <label className="label title is-5">
            {t('description')}
            </label>
            <textarea className="textarea" value={idLang === "fr" ? descFrValue : descEnValue} onChange={handleDescChange}></textarea>
        </div>
        <div className="field">
            <label className="label">
            {t('birthdate')}
            </label>
            <input type="date" className="input" value={dateValue} onChange={handleDateChange} />
        </div>
        <RoleForm scope="parents" location="project-form" selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />
        <ActorForm selectedPeople={selectedActors} selectPerson={selectActor} lang={idLang} />
        <OrganisationParentForm selectedOrg={selectedOrgs} selectOrg={selectOrg} location="project-form" lang={idLang} client={client} setAlert={setAlert} />
        <button className="button is-primary is-large" onClick={handleSubmit}>{t('create')}</button>
    </>
}

export default ProjectForm