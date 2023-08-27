import React, {useEffect, Fragment, useState} from 'react';
  
import {usePeople} from "../../../utils/hooks/People"

import RoleForm from "../../atoms/forms/RoleForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"
import MergeForm from "../../atoms/forms/MergeForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import {useNavigate} from "react-router-dom"

const PersonForm = ({client, setAlert, setCreated, dataUpdate, setDataUpdate, draftPerson}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [idLang, setIdLang] = useState("fr")
  const [firstNameValue, setFirstNameValue] = useState("")
  const [lastNameValue, setLastNameValue] = useState("")
  const [birthDateValue, setBirthDateValue] = useState("")
  const [deathDateValue, setDeathDateValue] = useState("")
  const [cityValue, setCityValue] = useState("")
  const [countryValue, setCountryValue] = useState("")
  const [langEnValue, setLangEnValue] = useState("")
  const [langFrValue, setLangFrValue] = useState("")
  const [selectedLangs, selectLang] = useState([])

  const [selectedRoles, selectRole] = useState([])
  const [selectedOrg, selectOrg] = useState([])
  const [selectedProj, selectProj] = useState([])
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false)

  const {
    findPersonById, 
    responseFindPersonById, 
    createPerson, 
    responseCreatePerson,
    updatePerson, 
    responseUpdatePerson,
    deletePerson, 
    searchPeople,
    responseSearchPeople,
    mergePeople,
    responseMergePeople,
    responseDeletePerson,
    findPersonBySlug, 
    responseFindPersonBySlug
  } = usePeople()

     const getContent = (value, lang) => {
      if (value) {
        return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
      } else {
        return "Error"
      }
    }

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
  
   const handleFirstNameChange = (e) => {
    e.preventDefault()
     setFirstNameValue(e.target.value)
     
  }
  
  const handleLastNameChange = (e) => {
    e.preventDefault()
    setLastNameValue(e.target.value)
    
  }

  const handleBirthDateChange = (e) => {
    e.preventDefault()
    setBirthDateValue(e.target.value)
  }

  const handleDeathDateChange = (e) => {
    e.preventDefault()
    setDeathDateValue(e.target.value)
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

  useEffect(() => {
   if (dataUpdate) {
      setNameValue(dataUpdate.name)
      setFirstNameValue(dataUpdate.firstName)
      setLastNameValue(dataUpdate.lastName)
      setUrlValue(dataUpdate.website)
      selectLang(dataUpdate.languages)
           if (dataUpdate.description && dataUpdate.description[0]) {
       setDescFrValue(getContent(dataUpdate.description, "fr"))
       setDescEnValue(getContent(dataUpdate.description, "en"))
      }
      setCountryValue(dataUpdate.country)
      dataUpdate.country.map((c) => {
        c.labels.map((label) => {
          setCountryValue(label.content)
        })
      })
      console.log('country : ', dataUpdate.country)
      setCityValue(dataUpdate.city)
      dataUpdate.activities.map((a) => {
        if (a.projects && a.projects[0]) {
          selectProj([...selectedProj, a])
        } else if (a.entities && a.entities[0]) {
          selectOrg([...selectedOrg, a])
        }
      })
      selectProj([...selectedProj, dataUpdate.projects])
      selectRole(dataUpdate.roles)   
   }
  }, [dataUpdate])

  const handlePersonSubmit = (e) => {
    e.preventDefault()    
     setLoading(true)
    const reqData = {
      person: {
        name: nameValue,
        description: [{ lang: "en", content: descEnValue }, {lang: "fr", content: descFrValue}],
        birthDate: birthDateValue,
        deathDate: deathDateValue,
        city: cityValue,
        country: (dataUpdate && dataUpdate.country&& dataUpdate.country.labels && dataUpdate.country.labels[0] && countryValue !== dataUpdate.country.labels[0].content) || (!dataUpdate || dataUpdate && !dataUpdate.country || dataUpdate.country && !dataUpdate.country.labels || dataUpdate.country && dataUpdate.country.labels && !dataUpdate.country.labels[0]) ? {labels: [{ lang: "en", content: countryValue }], code: countryValue} : dataUpdate.country,
        firstName: firstNameValue,
        lastName: lastNameValue,
        website: urlValue,
        languages: selectedLangs
      },
      activities: [...selectedOrg, ...selectedProj],
      projects: selectedProj,
      roles: selectedRoles
    }
    console.log(reqData)
    if (!dataUpdate) {
      createPerson(reqData)
     
    } else {
      console.log('data: ', reqData, dataUpdate._id)
      updatePerson(reqData, dataUpdate._id)
    }
  }

  useEffect(() => {
    if (responseCreatePerson && responseCreatePerson.success) {
      setLoading(false)      
      if (setCreated) {
        setCreated(responseCreatePerson.data)
      } else {
              setAlert({ type: "success", message: { en: "Person has been successfully created.", fr: "La personne a été créé avec succès" } })

      }
    } else if (responseCreatePerson && !responseCreatePerson.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating a new person.", fr: "Un problème est survenu lors de la création d'une nouvelle personne"}})
      setLoading(false)
    }
  }, [responseCreatePerson])
  
  useEffect(() => {
    if (responseUpdatePerson && responseUpdatePerson.success){
      setAlert({ type: "success", message: { en: "Person has been successfully updated.", fr: "La personne a été mise à jour avec succès" } })
      setLoading(false)
      setDataUpdate({...responseUpdatePerson.data, success: true})
    } else if (responseUpdatePerson && !responseCreatePerson.success) {
      setAlert({ type: "error", message: { en: "An error occured while updating person.", fr: "Un problème est survenu lors de la mise à jour d'une personne"}})
      setLoading(false)
    }
  }, [responseUpdatePerson])

  useEffect(() => {
    console.log(responseMergePeople)
    if (responseMergePeople && responseMergePeople.success){
      setAlert({ type: "success", message: { en: "Person has been successfully merge.", fr: "La personne a été fusionné avec succès" } })
      setLoading(false)
      setDataUpdate({...responseMergePeople.data, success: true})
    } else if (responseMergePeople && !responseMergePeople.success) {
      setAlert({ type: "error", message: { en: "An error occured while merging person.", fr: "Un problème est survenu lors de la fusion d'une personne"}})
      setLoading(false)
    }
  }, [responseMergePeople])
  
  const [confirmDelete, setConfirmDelete] = useState(false)
  let navigate = useNavigate()

  const handleDeletePerson = (e) => {
      e.preventDefault()
      if (confirmDelete) {
        deletePerson(dataUpdate._id)
        setConfirmDelete(false)
        setAlert({ type: "success", message: { en: "Document has been successfully deleted.", fr: "Le document a été supprimé avec succès"}})
        navigate('/')
  
      } else {
        setConfirmDelete(true)
      }
  
    }

    useEffect(() => {
      if (draftPerson && draftPerson.name) {
        setNameValue(draftPerson.name)
        setFirstNameValue(draftPerson.name.split(' ')[0])
        setLastNameValue(draftPerson.name.split(' ')[1])
      }
    }, [draftPerson])

    const [merge, setMerge] = useState(false)

    const handleMergePerson = (e) => {
      e.preventDefault()
      setMerge(!merge)
    }

  return loading ? <>
  <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> 
    
  </> : <>
  
     <div className="is-flex is-justify-content-end">
      {dataUpdate ?
      <>
        <button className="button is-primary is-small mt-3 ml-3" onClick={handleMergePerson}>
          {!merge ? t('merge') : t('cancel')}
        </button>
        {!merge ?  <button className="button is-danger is-small mt-3 ml-3" onClick={handleDeletePerson}>
          {confirmDelete ? t('confirm') : t('delete')}
        </button> : null}
      </>
   : null}</div>
   {merge ? <>
      <MergeForm originItem={dataUpdate} searchItem={searchPeople} responseSearchItem={responseSearchPeople} mergeItem={mergePeople}/>
   </> : <>
   <div className="field">
      <label className="label has-text-left">
        {t('name')}
      </label>
      <input type="text" value={nameValue} onChange={handleNameChange} className="input"/>
    </div>
      <div className="columns">
      <div className="column field">
      <label className="label has-text-left">
      {t('first-name')}
      </label>
      <input type="text" value={firstNameValue} onChange={handleFirstNameChange} className="input"/>
    </div>
    <div className="column field">
      <label className="label has-text-left">
      {t('last-name')}
      </label>
      <input type="text" value={lastNameValue} onChange={handleLastNameChange} className="input"/>
    </div>
    </div>
    <div className="field" id="docLang">
      <label className="label has-text-left">
      {t('language')}
      </label>
      
      <div className="is-flex">
                <input type="text" placeholder="Default language" className="input" value={i18n.language === "en" ? langEnValue : langFrValue} onChange={handleLangChange} />
                <button onClick={addLang} className="button is-small is-primary mt-1 ml-2">{t('add')}</button>
                
        </div>
        {selectedLangs.map((lang) => {
        return <Fragment key={lang.code}>
          <span className="tag is-success is-medium mr-1 mt-2">{getContent(lang.labels, i18n.language)}</span>
          <span className="tag is-danger is-medium mr-2 button mt-2" onClick={(e) => handleDeleteLang(e, lang)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
        })}
      </div>
    <div className="columns">
      <div className="column field">
      <label className="label has-text-left">
      {t('birthdate')}
      </label>
      <input type="date" value={birthDateValue} onChange={handleBirthDateChange} className="input"/>
    </div>
    <div className="column field">
      <label className="label has-text-left">
        {t('deathdate')}
      </label>
      <input type="date" value={deathDateValue} onChange={handleDeathDateChange} className="input"/>
    </div>
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
    <div className="field">
      <label className="label has-text-left">
        {t('description')}
      </label>
      <textarea value={i18n.language === "en" ? descEnValue : descFrValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
      <div className="field">
        <label className="label has-text-left">
          {t('link-url')}
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
      
    <label className="label has-text-left">
        {t('projects')}
      </label>
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} lang={i18n.language} client={client} setAlert={setAlert}/>
    <label className="label has-text-left mt-5 mb-0 pb-0">
        {t('organization')}
      </label>
    <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} lang={i18n.language} client={client} setAlert={setAlert}/>
    <button className="button is-large is-primary" onClick={handlePersonSubmit}>
      {t('create')}
    </button>
   </>}
  </> 
}

export default PersonForm