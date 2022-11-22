import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import PersonForm from "../../../molecules/Create/PersonForm"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const PersonParentForm = ({selectedPeople, selectPerson, location, roles, people, template, lang, hideRoles, client, setAlert, projects }) => {
  const [personValue, setPersonValue] = useState("")
  const [personForm, setPersonForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")

  const [created, setCreated] = useState(false)

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

  useEffect(() => {
    if (template && template.parent_person_defaults[0]) {
      template.parent_person_defaults.map((person) => {
        if (!selectedPeople.includes(person)) {
          selectPerson([... selectedPeople, person])
        }
      })
    }

    if (personValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([... selectedRoles, role])
        }
      })
    }
  }, [template, personValue])
  
  const handlePersonChange = (e) => {
    e.preventDefault()
    setPersonValue(e.target.value)
  }
  
  const isPersonExisting = (personName) =>  {
    let retrievedPerson = undefined
    people.map((person) => {
      if (person.name.toLowerCase() === personName.toLowerCase()) {
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
      selectPerson([...selectedPeople, {person: personDoc, roles: selectedRoles}])
      selectRole([])
      setPersonValue("")
    } else {
      setPersonForm(true)
      setIsActive(true)
    }
   }
  }
    
  const handleDeletePerson = (e, person) => {
    e.preventDefault()
    const filtered = selectedPeople.filter((r) => {
      return r !== person
    })
    selectPerson(filtered)
  }

  useEffect(() => {
    if (created && !people.includes(created)) {
      people.push(created)
      setPersonValue(created.name)
      setPersonForm(false)
    }
  }, [created])
  
  return <>
    <div className="field">
      {location !== "templates-parents" ? <label className="label title is-5">People</label> : null}
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="people" className="input" placeholder={location === "templates-parents" ? "Default people" : ""} value={personValue} onChange={handlePersonChange}/>
        </div>
        <div className="column is-one-fifth">
          {personValue !== "" && selectedRoles[0] || personValue !== "" && !isPersonExisting(personValue) || (personValue !== "" && hideRoles) ? <button className="button is-primary " onClick={handlePersonBtn}>
            {isPersonExisting(personValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {personValue !== "" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm roles={roles} scope="parents" location="people-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      <datalist id="people">
        {people && people[0] ? people.map((person) => {
          return <Fragment key={person.name + "display"}>
            <option>{person.name}</option>
          </Fragment>
        }) : null}
      </datalist>
      {selectedPeople && selectedPeople[0] ? selectedPeople.map((person) => {
        if (person.person && person.person.name) {
          return <Fragment key={person.person.name + "selected"}>
            <span className="tag is-primary is-large mr-3">{person.person.name} {!hideRoles && (!template || template && template.parent_role) && person.roles[0] ? <>({
              person.roles.map((role, i) => {
                const roleStr = i > 0 ? ", " + getContent(role.title, lang) : getContent(role.title, lang)
                return roleStr
              })
            })</> : null}</span>
            <span className="tag is-danger is-large mr-2 button" onClick={(e) => handleDeletePerson(e, person)}><FontAwesomeIcon icon={faTrash}/></span>
          </Fragment>
        }
      }) : null}
    </div>
    {personForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">Create Person</p>
                    <button onClick={() => setPersonForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                  <PersonForm client={client} setAlert={setAlert} projects={projects} roles={roles} people={people} setCreated={setCreated}/>
                </div> 
            </div>
            
        </div> : null}
  </>
}

export default PersonParentForm