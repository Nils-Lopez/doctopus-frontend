import React, {useState, Fragment, useEffect} from "react"

import RoleForm from "../../atoms/forms/RoleForm"

import {useEntities} from "../../../utils/hooks/Entities"

import ActorForm from "../../atoms/forms/orgs/ActorForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom"

const OrganisationForm = ({client, setAlert, setCreated, dataUpdate, setDataUpdate, draftOrg}) => {
  
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

  const [loading, setLoading] = useState(false)

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
    
  useEffect(() => {
    if (dataUpdate) {
      setNameValue(dataUpdate.name)
            if (dataUpdate.description && dataUpdate.description[0]) {
       setDescFrValue(getContent(dataUpdate.description, "fr"))
       setDescEnValue(getContent(dataUpdate.description, "en"))
      }
      setUrlValue(dataUpdate.url)
      setCityValue(dataUpdate.city)
      setCountryValue(dataUpdate.country)
      selectLang(dataUpdate.languages)
      selectRole(dataUpdate.roles)
      selectActor(dataUpdate.actors)
      selectProj(dataUpdate.proj)
      
    }
  }, [dataUpdate])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
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
    if (dataUpdate) {
      console.log(dataUpdate)
      await updateEntity(reqData, dataUpdate._id)
    } else {
      await createEntity(reqData)
    }
  }

  useEffect(() => {
    if (responseCreateEntity && responseCreateEntity.success) {
      setLoading(false)
      if (setCreated) {
        
        setCreated(responseCreateEntity.data)
      } else {
        setAlert({ type: "success", message: { en: "Organisation has been successfully created.", fr: "L'organisation a été créé avec succès" } })

      }
    } else if (responseCreateEntity && !responseCreateEntity.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating organisation.", fr: "Une erreure est survenue lors de la création de l'organisation"}})
      setLoading(false)
    }
  }, [responseCreateEntity])
  
    useEffect(() => {
    if (responseUpdateEntity && responseUpdateEntity.success) {
      setAlert({ type: "success", message: { en: "Organisation has been successfully created.", fr: "L'organisation a été créé avec succès" } })
      setLoading(false)
       setDataUpdate({success:true})
    } else if (responseUpdateEntity && !responseUpdateEntity.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating organisation.", fr: "Une erreure est survenue lors de la création de l'organisation"}})
      setLoading(false)
    }
  }, [responseUpdateEntity])
  
  const { t, i18n } = useTranslation();

  const [confirmDelete, setConfirmDelete] = useState(false)
  let navigate = useNavigate()

  const handleDeleteOrg = (e) => {
      e.preventDefault()
      if (confirmDelete) {
        deleteEntity(dataUpdate._id)
        setConfirmDelete(false)
        setAlert({ type: "success", message: { en: "Document has been successfully deleted.", fr: "Le document a été supprimé avec succès"}})
        navigate('/')
  
      } else {
        setConfirmDelete(true)
      }
  
    }

  useEffect(() => {
    if (draftOrg && draftOrg.name) {
      setNameValue(draftOrg.name)
    }
  }, [draftOrg])

  return loading ? <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div>  : <div>
    <div className="tabs">
        <ul>
          <li onClick={() => setIdLang("fr")} className={idLang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
          <li onClick={() => setIdLang("en")} className={idLang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
        </ul>
      </div>
      <div className="is-flex is-justify-content-end">{dataUpdate ?
      <button className="button is-danger is-small mt-3" onClick={handleDeleteOrg}>
        {confirmDelete ? t('confirm') : t('delete')}
      </button>
   : null}</div>
    <div className="field">
      <label className="label has-text-left">
        {t('name')}
      </label>
      <input type="text" value={nameValue} onChange={handleNameChange} className="input"/>
    </div>
    <div className="field">
      <label className="label has-text-left">
        {t('description')}
      </label>
      <textarea value={idLang === "en" ? descEnValue : descFrValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
    <div className="field" id="docLang">
      <label className="label has-text-left">
        {t('language')}
      </label>
      
      <div className="is-flex">
                <input type="text" placeholder="Default language" className="input" value={idLang === "en" ? langEnValue : langFrValue} onChange={handleLangChange} />
                <button onClick={addLang} className="button is-small is-primary mt-1 ml-2">{t('add')}</button>
                
        </div>
        {selectedLangs.map((lang) => {
        return <Fragment key={lang.code}>
          <span className="tag is-success is-medium mr-1 mt-2">{getContent(lang.labels, idLang)}</span>
          <span className="tag is-danger is-medium mr-2 button mt-2" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
        })}
      </div>
      <div className="field">
        <label className="label has-text-left">
          {t('link-url')}
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
    <div className="columns">
      <div className="column field">
        <label className="label has-text-left">
          {t('city')}
        </label>
        <input type="text" value={cityValue} onChange={handleCityChange} className="input"/>
      </div>
      <div className="column field">
        <label className="label has-text-left">
          {t('country')}
        </label>
        <input type="text" value={countryValue} onChange={handleCountryChange} className="input"/>
      </div>
      </div>
    <RoleForm scope="parents" location="org-form" selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />
    <ActorForm selectedPeople={selectedActors} selectPerson={selectActor} lang={idLang} client={client} setAlert={setAlert}/>
    <label className="label has-text-left mb-0 pb-0 mt-5">
          {t('projects')}
        </label>
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} lang={idLang} location="org-form"/>
     <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-center">
      <button className="button is-primary is-medium" onClick={handleFormSubmit}>
        {t('create')}
      </button>
    </footer>
  </div>
}

export default OrganisationForm