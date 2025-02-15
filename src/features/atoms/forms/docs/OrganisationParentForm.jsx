import React, {useState, useEffect, Fragment} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

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
  const [isReorderMode, setIsReorderMode] = useState(false)

  const [orgs, setOrgs] = useState([])

  const { t, i18n } = useTranslation()

  useEffect(() => {
   
    if (template && template.parent_entity_defaults && template.parent_entity_defaults[0] && selectedOrg.length === 0) {
      const newParents = []
      template.parent_entity_defaults.map((person) => {
        if (!selectedOrg.includes(person)) {
          delete person._id

          newParents.push(person)
        }
      })
      selectOrg(newParents)
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
        } else       selectRole([])

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
        } else       selectRole([])

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

  const moveItem = (index, direction) => {
    const newOrgs = [...selectedOrg];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newOrgs.length) {
      [newOrgs[index], newOrgs[newIndex]] = [newOrgs[newIndex], newOrgs[index]];
      selectOrg(newOrgs);
    }
  };

  const renderNormalView = () => (
    <div className="columns is-multiline">
      {selectedOrg && selectedOrg[0] ? selectedOrg.map((org) => {
        const widthProp = location && location.includes("template") ? "full": ""
        if (org.entity && org.entity.name) {
          return <Fragment key={org.entity.name + "selected"}>
            <ParentSearchItem item={org} handleDelete={handleDeleteOrg} width={widthProp}/>
          </Fragment>
        }
        return null;
      }) : null}
    </div>
  )

  const renderReorderView = () => (
    <div className="menu-list">
      {selectedOrg && selectedOrg[0] ? selectedOrg.map((org, index) => {
        if (org.entity && org.entity.name) {
          return (
            <div 
              key={org.entity.name + index + "reorder"}
              className="panel-block is-justify-content-space-between p-3 mb-2"
              style={{
                background: 'white',
                border: '1px solid #dbdbdb',
                borderRadius: '4px'
              }}
            >
              <div className="is-flex is-align-items-center">
                <span className="mr-2">{org.entity.name}</span>
                {org.roles && org.roles[0] && org.roles[0].title && org.roles[0].title[0] && (
                  <span className="tag is-info is-light">{org.roles[0].title[0].content}</span>
                )}
              </div>
              <div>
                <button 
                  className="button is-small mr-1"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                >
                  <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <button 
                  className="button is-small"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === selectedOrg.length - 1}
                >
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
              </div>
            </div>
          )
        }
        return null;
      }) : null}
    </div>
  )

  return <>
 {orgForm ? 
        <div className="modal-card has-background-transparent no-bg mb-6 mt-6">
          
            <div className="modal-card-body has-background-transparent">
                  <div className="is-flex is-justify-content-space-between">
                    <p className="modal-card-title title has-text-left is-4 pt-1">{t('organization')}</p>
                    <button onClick={() => setOrgForm(false)} className="delete is-large ml-4" aria-label="close"></button>
                    </div>
                    <OrganisationForm client={client} setAlert={setAlert} setCreated={setCreated} draftOrg={orgForm}/>
                </div>
        </div>
         : null}
        {!isReorderMode && (
      <>
        {location !== "activity-form" && (template && template.parent_role || !template) && !hideRoles ? 
          <RoleForm scope="parents" location={!location || !location.includes("template") ? "org-parent-doc" : "template-parent-org"} selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} hasMemory/> 
        : null}
        {(selectedRoles && selectedRoles[0]) || (template && !template.parent_role) ? 
          <SearchForm selectedItems={selectedOrg} handleAddItem={handleAddOrg} searchItems={searchEntities} responseSearchItems={responseSearchEntities} mainField={"name"} setFormModal={setOrgForm} draftValue={organisationValue}/>
        : null}
      </>
    )}

    {selectedOrg && selectedOrg.length > 1 && (
      <div className="field mb-4 is-flex is-justify-content-end">
        <input 
          id="reorderSwitch" 
          type="checkbox" 
          className="switch is-rounded"
          checked={isReorderMode}
          onChange={() => setIsReorderMode(!isReorderMode)}
        />
        <label htmlFor="reorderSwitch">Organiser</label>
      </div>
    )}

    {isReorderMode ? renderReorderView() : renderNormalView()}
  </>
}

export default OrganisationParentForm