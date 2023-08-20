import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import OrganisationForm from "../../../molecules/Create/OrganisationForm"
import SearchForm from "../SearchForm"

import ParentSearchItem from "../../parents/SearchItem"

import { useEntities } from "../../../../utils/hooks/Entities"
import {useTranslation} from "react-i18next"
const OrganisationParentForm = ({selectedOrg, selectOrg, location, template, lang, hideRoles, client, setAlert, autoCompletion, setAutoCompletion}) => {
  const [organisationValue, setOrganisationValue] = useState("")
  const [orgForm, setOrgForm] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  const [created, setCreated] = useState({})

  const [orgs, setOrgs] = useState([])

  const { t, i18n } = useTranslation()

console.log('org: ', orgForm)
  useEffect(() => {
    if (organisationValue === "" && template && template.parent_entity_defaults && template.parent_entity_defaults[0]) {
      template.parent_entity_defaults.map((org) => {
        if (!selectedOrg.includes(org)) {
          selectOrg([... selectedOrg, org])
        }
      })
    }

    if (organisationValue === "" && template && template.parent_role_defaults && template.parent_role_defaults[0]) {
      template.parent_role_defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([... selectedRoles, role])
        }
      })
    }
  }, [organisationValue, template])



  useEffect(() => {
    if (created && created.name && !orgs.includes(created)) {
      setOrgs([])
      selectOrg([...selectedOrg, {entity: created, roles: selectedRoles}])
      if (draftOrg[0] && organisationValue === draftOrg[0].entity.name) {
        const filtered = []
        autoCompletion.parents.map((p) => {
          if (!(p.entity && p.entity.name === draftOrg[0].entity.name)) {
            filtered.push(p)

          } 
        })
       
        setAutoCompletion({...autoCompletion, parents: filtered})
        if (draftOrg.length > 1) {
          selectRole([draftOrg[1].roles])

          const filteredDrafts = []
          draftOrg.map((p) => {
            if (p.entity && p.entity.name === draftOrg[0].entity.name) {
              filteredDrafts.push(p)
            }
          })
          setDraftOrg(filteredDrafts)
          console.log('filteredDrafts', filteredDrafts)
        } else       selectRole([])

        console.log("filtered: ", filtered)
    } else {
      selectRole([])

      setOrganisationValue("")
    }
      setOrgForm(false)
    }
  }, [created])

  const {
    searchEntities, 
    responseSearchEntities
  } = useEntities()


  const handleAddOrg = (org) => {
    selectOrg([...selectedOrg, {entity: org, roles: selectedRoles}])
      selectRole([])
      if (draftOrg[0] && organisationValue === draftOrg[0].entity.name) {
        const filtered = []
        autoCompletion.parents.map((p) => {
          if (!(p.entity && p.entity.name === draftOrg[0].entity.name)) {
            filtered.push(p)

          } 
        })
       
        setAutoCompletion({...autoCompletion, parents: filtered})
        if (draftOrg.length > 1) {
          selectRole([draftOrg[1].roles])

          const filteredDrafts = []
          draftOrg.map((p) => {
            if (p.entity && p.entity.name === draftOrg[0].entity.name) {
              filteredDrafts.push(p)
            }
          })
          setDraftOrg(filteredDrafts)
          console.log('filteredDrafts', filteredDrafts)
        } else       selectRole([])

        console.log("filtered: ", filtered)
    } else {
      selectRole([])

      setOrganisationValue("")
    }
    
  }

  const handleDeleteOrg = (e, org) => {
    e.preventDefault()
    const filtered = selectedOrg.filter((r) => {
      return r !== org
    })
    selectOrg(filtered)
    setOrgs([])
    
  }

  const [draftOrg, setDraftOrg] = useState(false)

  useEffect(() => {
    if (autoCompletion && autoCompletion.parents && autoCompletion.parents[0]) {
      const drafts = []
      autoCompletion.parents.map((p) => {
        if (p.entity) drafts.push(p)
      })
      setDraftOrg(drafts)
    }
  }, [autoCompletion])


  useEffect(() => {
    if (draftOrg && draftOrg[0]) {
      selectRole(draftOrg[0].roles)
      setOrganisationValue(draftOrg[0].entity.name)
    }
  }, [draftOrg])

  return <>

        { location !== "activity-form" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location={!location || !location.includes("template") ? "org-parent-doc" : "template-parent-org"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}
  {(selectedRoles && selectedRoles[0]) || (template && !template.parent_role) ? <>
    <SearchForm selectedItems={selectedOrg} handleAddItem={handleAddOrg}searchItems={searchEntities} responseSearchItems={responseSearchEntities} mainField={"name"} setFormModal={setOrgForm} draftValue={organisationValue}/>
  </> : null}
 <div className="columns is-multiline">
 {selectedOrg && selectedOrg[0] ? selectedOrg.map((org) => {
        if (org.entity && org.entity.name) {
          return <Fragment key={org.entity.name + "selected"}>
                                     <ParentSearchItem item={org} handleDelete={handleDeleteOrg}/>

          </Fragment>
        }
      }) : null}
 </div>
    {orgForm ? <div className={"modal " + "is-active" }>
      <div className="modal-background"></div>
        <div className="modal-card mb-6 mt-6">
          <div className="modal-card-head has-background-white-ter">
            <p className="modal-card-title is-size-3 ml-6">{t('organization')}</p>
              <button onClick={() => setOrgForm(false)} className="delete is-large ml-4" aria-label="close"></button>
              </div>
              <div className="modal-card-body has-background-white-ter"> 
                <OrganisationForm client={client} setAlert={setAlert} setCreated={setCreated} draftOrg={orgForm}/>
              </div>
       
            </div>
            
        </div> : null}
  </>
}

export default OrganisationParentForm