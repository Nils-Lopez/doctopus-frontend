import React, {useState, Fragment, useEffect} from "react"

import RoleForm from "../../atoms/forms/RoleForm"

import {useEntities} from "../../../utils/hooks/Entities"

import ActorForm from "../../atoms/forms/orgs/ActorForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const OrganisationForm = ({client, setAlert, template, roles, tags, people, projects, setCreated}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [cityValue, setCityValue] = useState("")
  const [countryValue, setCountryValue] = useState("")
  const [idLang, setIdLang] = useState("fr")
  const [langEnValue, setLangEnValue] = useState("")
  const [langFrValue, setLangFrValue] = useState("")
  const [selectedLangs, selectLang] = useState([])
  
  const [selectedRoles, selectRole] = useState([])
  const [selectedActors, selectActor] = useState([])
  const [selectedProj, selectProj] = useState([])

  const {
    findEntityById, 
    responseFindEntityById, 
    createEntity, 
    responseCreateEntity,
    updateEntity, 
    responseUpdateEntity,
    deleteEntity, 
    responseDeleteEntity,
    findEntityBySlug, 
    responseFindEntityBySlug
  } = useEntities()


  const handleNameChange = (e) => {
    e.preventDefault()
    setNameValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    if (idLang === "en") {
      setDescEnValue(e.target.value)
    } else {
      setDescFrValue(e.target.value)
    }
  }
  
  const handleUrlChange = (e) => {
    e.preventDefault()
    setUrlValue(e.target.value)
  }
  
  const handleCityChange = (e) => {
    e.preventDefault()
    setCityValue(e.target.value)
  }

  const handleCountryChange = (e) => {
    e.preventDefault()
    setCountryValue(e.target.value)
  }

  const handleLangChange = (e) => {
    e.preventDefault()
      if (idLang === "en") {
        setLangEnValue(e.target.value)
      } else {
        setLangFrValue(e.target.value)
      }
  }

   const addLang = (e) => {
      e.preventDefault()
      const newLang = {
        labels: [
          { lang: "en", content: langEnValue },
          {lang: "fr", content: langFrValue}
        ],
        code: langEnValue !== "" ? langEnValue.slice(0, 2).toLowerCase() : langFrValue.slice(0, 2).toLowerCase()
      }
      selectLang([...selectedLangs, newLang])
      setLangEnValue("")
      setLangFrValue("")
    }
      
    const handleDeleteLang = (e, lang) => {
      e.preventDefault()
      const filtered = selectedLangs.filter((l) => {
        return l.code !== lang.code
      })
      selectLang(filtered)
    }
  
    const getContent = (value, lang) => {
      if (value) {
        return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
      } else {
        return "Error"
      }
    }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const reqData = {
      entity: {
        name: nameValue,
        description: [{ lang: "en", content: descEnValue }, {lang: "fr", content: descFrValue}],
        type: "entity",
        url: urlValue,
        slug: nameValue.replaceAll(" ", "-").toLowerCase(),
        city: cityValue, 
        countryValue: countryValue,
        languages: selectedLangs
      },
      roles: selectedRoles,
      actors: selectedActors,
      projects: selectedProj
    } 
    await createEntity(reqData)
  }

  useEffect(() => {
    if (responseCreateEntity && responseCreateEntity.success) {
      setAlert({ type: "success", message: { en: "Organisation has been successfully created.", fr: "L'organisation a été créé avec succès" } })
      if (setCreated) {
        
        setCreated(responseCreateEntity.data)
      }
    } else if (responseCreateEntity && !responseCreateEntity.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating organisation.", fr: "Une erreure est survenue lors de la création de l'organisation"}})
    }
  }, [responseCreateEntity])
  
  return <div>
    <div className="tabs">
        <ul>
          <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
          <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
        </ul>
      </div>
    <div className="field">
      <label className="label">
        Name
      </label>
      <input type="text" value={nameValue} onChange={handleNameChange} className="input"/>
    </div>
    <div className="field">
      <label className="label">
        Description
      </label>
      <textarea value={idLang === "en" ? descEnValue : descFrValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
    <div className="field" id="docLang">
      <label className="label title is-5">
        Language
      </label>
      
      <div className="is-flex">
                <input type="text" placeholder="Default language" className="input" value={idLang === "en" ? langEnValue : langFrValue} onChange={handleLangChange} />
                <button onClick={addLang} className="button is-small is-primary mt-1 ml-2">Add</button>
                
        </div>
        {selectedLangs.map((lang) => {
        return <Fragment key={lang.code}>
          <span className="tag is-success is-medium mr-1 mt-2">{getContent(lang.labels, idLang)}</span>
          <span className="tag is-danger is-medium mr-2 button mt-2" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
        })}
      </div>
      <div className="field">
        <label className="label">
          Website
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
    <div className="columns">
      <div className="column field">
        <label className="label">
          City
        </label>
        <input type="text" value={cityValue} onChange={handleCityChange} className="input"/>
      </div>
      <div className="column field">
        <label className="label">
          Country
        </label>
        <input type="text" value={countryValue} onChange={handleCountryChange} className="input"/>
      </div>
      </div>
    <RoleForm roles={roles} scope="parents" location="org-form" selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />
    <ActorForm selectedPeople={selectedActors} selectPerson={selectActor} people={people} roles={roles} lang={idLang} />
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} projects={projects} roles={roles} lang={idLang}/>
     <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-center">
      <button className="button is-primary is-medium" onClick={handleFormSubmit}>
        Create
      </button>
    </footer>
  </div>
}

export default OrganisationForm