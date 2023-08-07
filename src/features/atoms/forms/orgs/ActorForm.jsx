import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import PersonForm from "../../../molecules/Create/PersonForm"

import {usePeople} from "../../../../utils/hooks/People"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"

const ActorForm = ({selectedPeople, selectPerson, lang, client, setAlert}) => {
  
  const [personValue, setPersonValue] = useState("")
  const [personForm, setPersonForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [people, setPeople] = useState([])
  const [peopleLoading, setPeopleLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const [created, setCreated] = useState(false)
  const { t, i18n } = useTranslation() 

  const handlePersonChange = (e) => {
    e.preventDefault()
    setPersonValue(e.target.value)
  }
  
  const isPersonExisting = (personName) =>  {
    let retrievedPerson = undefined
    people.map((person) => {
      if (person.slug === currentPerson) {
        retrievedPerson = person
      } 
    })
    if (retrievedPerson) {
      return retrievedPerson
    } else return false
  }
  
  const handlePersonBtn = (e) => {
    e.preventDefault()
    const personDoc = isPersonExisting(personValue)
    let unique = true
    selectedPeople.map((person) => {
      if (person.name === personValue) {
        unique = false
      }
    })
    
    if (unique) {
      if (personDoc) {
      personDoc.parentRoles = selectedRoles
      selectPerson([...selectedPeople, personDoc])
      selectRole([])
      setPersonValue("")
    } else {
      setPersonForm(true)
      setIsActive(true)
    }
   }
  }

  const getContent = (value, lang) => {
    return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
  }

  const {
    searchPeople, 
    responseSearchPeople
  } = usePeople()

  const searchPersonValue = (e) => {
    e.preventDefault()
    if (personValue !== "") {
      setPeopleLoading(true)
      searchPeople(personValue)
    }
  }

  useEffect(() => {
    if (responseSearchPeople && responseSearchPeople.success && responseSearchPeople.data[0] && peopleLoading) {
      setPeopleLoading(false)
      setPeople(responseSearchPeople.data)
      
    } else if (responseSearchPeople && peopleLoading) {
      setPeopleLoading(false)
      setPersonForm(true)
    }
  }, [responseSearchPeople])
  
  const handleDeletePerson = (e, person) => {
    e.preventDefault()
    const filtered = selectedPeople.filter((r) => {
      return r !== person
    })
    selectPerson(filtered)
    setPeople([])
  }

  useEffect(() => {
    if (created && !people.includes(created)) {
      setPeople([...people, created])
      setPersonValue(created.name)
      setPersonForm(false)
    }
  }, [created])

   useEffect(() => {
  people.map((person) => {
        if (person.name === personValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(personValue)
      } else {
        setPending("")
      }
  }, [people])
  
  const changeCurrentPerson = (e) => {
    e.preventDefault()
    setCurrentPerson(e.target.value)
    setPersonValue(e.target.value)
  }

  const [currentPerson, setCurrentPerson] = useState({})

  return <>
    
    <div className="field">
      <label className="label has-text-left mb-3 mt-5">{t('actors')}</label>
      <div className="columns">
        <div className="column is-three-fifth">
          {(!people || !people[0]) ? <>
            <input type="text" className="input" value={personValue} onChange={handlePersonChange}/>
          </> : <>
            <select className="select is-fullwidth" value={currentPerson} onChange={changeCurrentPerson} name={"peopless"} id={"peoplesss"}>
                {people.map((t) => {
                  return <Fragment key={t.slug}>
                    <option value={t.slug}>{t.name}</option>
                  </Fragment>
                })}
                {pending !== "" ? <>
                  <option value={pending}>{pending}</option>
                </> : null}
            </select>
          </>}
        </div>
        <div className="column is-one-fifth">
          {(!people || !people[0]) && !personForm ? <>
            {personValue !== "" && !peopleLoading ? <button className="button is-primary" onClick={searchPersonValue}>{t('search')}</button> : <button className="button is-primary is-disabled" disabled>{t('search')}</button>}
          </> : <>
            {(personValue !== "" && selectedRoles[0]) || (personValue !== "" && !isPersonExisting(personValue)) ? <button className="button is-primary " onClick={handlePersonBtn}>
            {isPersonExisting(personValue) ? t('add') : t('create')}
          </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}
          </>}
        </div>
      </div>
      {personValue !== "" ? <RoleForm scope="parents" location="people-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang} /> : null}
      {selectedPeople.map((person) => {
        return <Fragment key={person.slug}>
          <span className="tag is-primary is-large mr-3">{person.name} ({person.parentRoles.map((role, i) => {
            const roleStr = i > 0 ? ", " + getContent(role.title, lang) : getContent(role.title, lang)
            return roleStr
          })})</span>
        <span className="tag is-danger is-large mr-2 button" onClick={(e) => handleDeletePerson(e, person)}><FontAwesomeIcon icon={faTrash}/></span>

        </Fragment>
      })}
    </div>
    {personForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">{t('create-person')}</p>
                    <button onClick={() => setPersonForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                 <PersonForm client={client} setAlert={setAlert} setCreated={setCreated}/>
                </div>
       
            </div>
            
        </div> : null}
  </>
}

export default ActorForm