import React, {useState, Fragment} from "react"

import RoleForm from "../RoleForm"

const PersonParentForm = ({selectedPeople, selectPerson}) => {
  const [personValue, setPersonValue] = useState("")
  const [personForm, setPersonForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  
  const people = [
    {slug: "titlmodee", name:"Mode"},
    {slug: "titldecoe", name:"Deco"},
    {slug: "titlcorpse", name:"Le corps"},
    {slug: "titlesprite", name:"L'esprit'"}
  ]
  
  const roles = [
    {slug: "titlmodee", title:"Mode"},
    {slug: "titldecoe", title:"Deco"},
    {slug: "titlcorpse", title:"Le corps"},
    {slug: "titlesprite", title:"L'esprit'"}
]
  
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

  
  
  return <>
    <div className="field">
      <label className="label title is-5">People</label>
      <div className="columns">
        <div className="column is-three-fifth">
          <input type="text" list="people" className="input" value={personValue} onChange={handlePersonChange}/>
        </div>
        <div className="column is-one-fifth">
          {personValue !== "" && selectedRoles[0] || personValue !== "" && !isPersonExisting(personValue) ? <button className="button is-primary " onClick={handlePersonBtn}>
            {isPersonExisting(personValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}
        </div>
      </div>
      {personValue !== "" ? <RoleForm roles={roles} scope="people" location="people-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole}/> : null}
      <datalist id="people">
        {people.map((person) => {
          return <Fragment key={person.slug}>
            <option>{person.name}</option>
          </Fragment>
        })}
      </datalist>
      {selectedPeople.map((person) => {
        return <Fragment key={person.slug}>
          <span className="tag is-primary is-large mr-3">{person.name} ({person.parentRoles.map((role, i) => {
            const roleStr = i > 0 ? ", " + role.title : role.title
            return roleStr
          })})</span>
        </Fragment>
      })}
    </div>
    {personForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">Create Person</p>
                    <button onClick={() => setPersonForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                  C ici qu'on va gerer les bails tqt
                </div>
       
            </div>
            
        </div> : null}
  </>
}

export default PersonParentForm