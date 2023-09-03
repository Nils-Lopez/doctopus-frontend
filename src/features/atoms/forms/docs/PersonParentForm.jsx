// Inspired by React's #import and #importAll in react - i18next. js
import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import PersonForm from "../../../molecules/Create/PersonForm"
import ParentSearchItem from "../../parents/SearchItem"


import SearchForm from "../SearchForm"

import {usePeople} from "../../../../utils/hooks/People"
import {useTranslation} from "react-i18next"

const PersonParentForm = ({selectedPeople, selectPerson, location, template, lang, hideRoles, client, setAlert, autoCompletion, setAutoCompletion}) => {
  const [personValue, setPersonValue] = useState("")
  const [personForm, setPersonForm] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")

  const [people, setPeople] = useState([])

  const [created, setCreated] = useState(false)
  const { t, i18n } = useTranslation()


  useEffect(() => {
    if (template && template.parent_person_defaults[0] && selectedPeople.length === 0) {
      const newParents = []
      template.parent_person_defaults.map((person) => {
        if (!selectedPeople.includes(person)) {
          newParents.push(person)
        }
      })
      selectPerson(newParents)
    }

    if (personValue === "" && template && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([... selectedRoles, role])
        }
      })
    }
  }, [template, personValue])
  
  const handleAddPerson = (p) => {
    const newPerson = {person: p, roles: selectedRoles}
    selectPerson([...selectedPeople, newPerson])
      console.log("test", draftPerson[0] && personValue === draftPerson[0].person.name)
      if (draftPerson[0] && personValue === draftPerson[0].person.name) {
        const filtered = []
        autoCompletion.parents.map((p) => {
          if (!(p.person && p.person.name === draftPerson[0].person.name)) {
            filtered.push(p)

          } 
        })
       
        setAutoCompletion({...autoCompletion, parents: filtered})
        if (draftPerson.length > 1) {
          selectRole([draftPerson[1].roles])

          const filteredDrafts = []
          draftPerson.map((p) => {
            if (p.person && p.person.name === draftPerson[0].person.name) {
              filteredDrafts.push(p)
            }
          })
          setDraftPerson(filteredDrafts)
          console.log('filteredDrafts', filteredDrafts)
        } else       selectRole([])

        console.log("filtered: ", filtered)
    } else {
      selectRole([])

      setPersonValue("")
    }
    
  }

    
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
      setPeople([])
      setPersonValue("")
      setPersonForm(false)
      selectPerson([...selectedPeople, {person: created, roles: selectedRoles}])
      selectRole([])
    }
  }, [created])

  const {
    searchPeople, 
    responseSearchPeople
  } = usePeople()

  const [draftPerson, setDraftPerson] = useState(false)

  useEffect(() => {
    if (autoCompletion && autoCompletion.parents && autoCompletion.parents[0]) {
      const drafts = []
      autoCompletion.parents.map((p) => {
        if (p.person) drafts.push(p)
      })
      setDraftPerson(drafts)
    }
  }, [autoCompletion])


  useEffect(() => {
    if (draftPerson && draftPerson[0]) {
      selectRole(draftPerson[0].roles)
      setPersonValue(draftPerson[0].person.name)
    }
  }, [draftPerson])


  console.log(draftPerson)

  return <>
      {(template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location={!location || !location.includes("template") ? "org-parent-doc" : "template-parent"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      
      {selectedRoles && selectedRoles[0] ? 
          <SearchForm selectedItems={selectedPeople} handleAddItem={handleAddPerson} searchItems={searchPeople} responseSearchItems={responseSearchPeople} mainField={"name"} setFormModal={setPersonForm}  draftValue={personValue}/>

      : null}
      <div className="columns is-multiline">
      {selectedPeople && selectedPeople[0] ? selectedPeople.map((person) => {
        if (person.person && person.person.name) {
          return <Fragment key={person.person.name + "selected"}>
                                     <ParentSearchItem item={person} handleDelete={handleDeletePerson}/>

          </Fragment>
        }
      }) : null}
      </div>
    {personForm ? <div className={"modal " + "is-active"}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">{t('create-person')}</p>
                    <button onClick={() => setPersonForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                  <PersonForm client={client} setAlert={setAlert} setCreated={setCreated} draftPerson={personForm}/>
                </div> 
            </div>
            
        </div> : null}
  </>
}

export default PersonParentForm