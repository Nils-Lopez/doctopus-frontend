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
          delete person._id

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
        } else       selectRole([])

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



  return <>
    {personForm ? 
            <div className="modal-card mt-5">
              
                <div className="modal-card-body has-background-white">
                  <div className="is-flex is-justify-content-space-between">
                    <p className="modal-card-title title has-text-left is-4 pt-1">{t('create-person')}</p>
                    <button onClick={() => setPersonForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                    </div>
                    <PersonForm client={client} setAlert={setAlert} setCreated={setCreated} draftPerson={personForm}/>
                </div>
       
            </div>
         : null}
      {(template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location={!location || !location.includes("template") ? "org-parent-doc" : "template-parent"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
      
      {selectedRoles && selectedRoles[0] ? 
          <SearchForm selectedItems={selectedPeople} handleAddItem={handleAddPerson} searchItems={searchPeople} responseSearchItems={responseSearchPeople} mainField={"name"} setFormModal={setPersonForm}  draftValue={personValue}/>

      : null}
      <div className="columns is-multiline">
      {selectedPeople && selectedPeople[0] ? selectedPeople.map((person) => {
        if (person.person && person.person.name) {
          const widthProp = location && location.includes("template") ? "full": ""

          return <Fragment key={person.person.name + "selected"}>
                                     <ParentSearchItem item={person} handleDelete={handleDeletePerson} width={widthProp}/>

          </Fragment>
        }
      }) : null}
      </div>
  
  </>
}

export default PersonParentForm