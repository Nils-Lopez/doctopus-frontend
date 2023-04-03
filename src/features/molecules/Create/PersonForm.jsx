import React, {useEffect, Fragment, useState} from 'react';
  
import {usePeople} from "../../../utils/hooks/People"

import RoleForm from "../../atoms/forms/RoleForm"
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm"
import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const PersonForm = ({client, setAlert, template, setCreated}) => {
  
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
  
  const {
    findPersonById, 
    responseFindPersonById, 
    createPerson, 
    responseCreatePerson,
    updatePerson, 
    responseUpdatePerson,
    deletePerson, 
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
     if (nameValue !== firstNameValue + " " + lastNameValue) {
       setNameValue(firstNameValue + " " + lastNameValue)
     }
  }
  
  const handleLastNameChange = (e) => {
    e.preventDefault()
    setLastNameValue(e.target.value)
    if (nameValue !== firstNameValue + " " + lastNameValue) {
       setNameValue(firstNameValue + " " + lastNameValue)
     }
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

  const handlePersonSubmit = (e) => {
    e.preventDefault()    
    const reqData = {
      person: {
        name: nameValue,
        description: [{ lang: "en", content: descEnValue }, {lang: "fr", content: descFrValue}],
        birthDate: birthDateValue,
        deathDate: deathDateValue,
        city: cityValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        website: urlValue,
        languages: selectedLangs
      },
      activities: [...selectedOrg, ...selectedProj],
      projects: selectedProj,
      roles: selectedRoles
    }
    createPerson(reqData)
  }

  useEffect(() => {
    if (responseCreatePerson && responseCreatePerson.success) {
      setAlert({ type: "success", message: { en: "Person has been successfully created.", fr: "La personne a été créé avec succès" } })
      if (setCreated) {
        setCreated(responseCreatePerson.data)
      }
    } else if (responseCreatePerson && !responseCreatePerson.success) {
      setAlert({ type: "error", message: { en: "An error occured while creating a new person.", fr: "Un problème est survenu lors de la création d'une nouvelle personne"}})

    }
  }, [responseCreatePerson])
  
  return <>
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
      <div className="columns">
      <div className="column field">
      <label className="label">
        First Name
      </label>
      <input type="text" value={firstNameValue} onChange={handleFirstNameChange} className="input"/>
    </div>
    <div className="column field">
      <label className="label">
        Last Name
      </label>
      <input type="text" value={lastNameValue} onChange={handleLastNameChange} className="input"/>
    </div>
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
    <div className="columns">
      <div className="column field">
      <label className="label">
        Birthdate
      </label>
      <input type="date" value={birthDateValue} onChange={handleBirthDateChange} className="input"/>
    </div>
    <div className="column field">
      <label className="label">
        Deathdate
      </label>
      <input type="date" value={deathDateValue} onChange={handleDeathDateChange} className="input"/>
    </div>
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
    <div className="field">
      <label className="label">
        Description
      </label>
      <textarea value={idLang === "en" ? descEnValue : descFrValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
      <div className="field">
        <label className="label">
          Website
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
      
    <RoleForm scope="parents" location="org-form" selectedRoles={selectedRoles} selectRole={selectRole} lang={idLang} />
    <ProjectParentForm selectedProj={selectedProj} selectProj={selectProj} lang={idLang} client={client} setAlert={setAlert}/>
    <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} lang={idLang} client={client} setAlert={setAlert}/>
    <button className="button is-large is-primary" onClick={handlePersonSubmit}>
      Create
    </button>
  </> 
}

export default PersonForm