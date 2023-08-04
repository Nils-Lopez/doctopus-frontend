import React, {useState, useEffect, Fragment} from "react"

import RoleForm from "../RoleForm"
import OrganisationForm from "../../../molecules/Create/OrganisationForm"

import ParentSearchItem from "../../parents/SearchItem"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowRotateLeft, faMagnifyingGlass, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

import { useEntities } from "../../../../utils/hooks/Entities"
import {useTranslation} from "react-i18next"
const OrganisationParentForm = ({selectedOrg, selectOrg, location, template, lang, hideRoles, client, setAlert}) => {
  const [organisationValue, setOrganisationValue] = useState("")
  const [orgForm, setOrgForm] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [idLang, setIdLang] = useState("fr")
  const [created, setCreated] = useState({})

  const [orgs, setOrgs] = useState([])
  const [orgsLoading, setOrgsLoading] = useState(false)
  const [pending, setPending] = useState("")
  const { t, i18n } = useTranslation()

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

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

  const handleOrgChange = (e) => {
    e.preventDefault()
    setOrganisationValue(e.target.value)
  }
  const isOrgExisting = (organisation) =>  {
    let retrievedOrg = undefined
    orgs.map((org) => {
      if (org.name === organisationValue) {
        retrievedOrg = org
      } 
    })
    if (retrievedOrg) {
      return retrievedOrg
    } else return false
  }
  
  const handleOrgBtn = (e) => {
    e.preventDefault()
    const orgDoc = isOrgExisting(organisationValue)
    let unique = true

    selectedOrg.map((org) => {
      if (org.entity.name === organisationValue) {
        unique = false
      }
    })
    if (unique) {
      if (orgDoc) {
      selectOrg([...selectedOrg, {entity: orgDoc, roles: selectedRoles}])
      selectRole([])
      setOrganisationValue("")
    } else {
      console.log('orgDoc :')
      setOrgForm(true)
      setIsActive(true)
    }
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

  useEffect(() => {
    if (created && created.name && !orgs.includes(created)) {
      setOrgs([...orgs, created])
      setOrganisationValue(created.name)
      setOrgForm(false)
    }
  }, [created])

  const {
    searchEntities, 
    responseSearchEntities
  } = useEntities()

  const searchOrgValue = (e) => {
    e.preventDefault()
    if (organisationValue !== "") {
      setOrgsLoading(true)
      searchEntities(organisationValue)
    }
  }

  useEffect(() => {
    if (responseSearchEntities && responseSearchEntities.success && responseSearchEntities.data[0] && orgsLoading) {
      setOrgsLoading(false)
      setOrgs(responseSearchEntities.data)
    } else if (responseSearchEntities && orgsLoading) {
      setOrgsLoading(false)
      setOrgForm(true)
    }
  }, [responseSearchEntities])
  
  useEffect(() => {
    orgs.map((org) => {
        if (org.name === organisationValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(organisationValue)
      } else {
        setPending("")
      }
  }, [orgs])

  const changeCurrentOrg = (e) => {
    e.preventDefault()
    setCurrentOrg(e.target.value)
    setOrganisationValue(e.target.value)
  }

  const [currentOrg, setCurrentOrg] = useState({})

  const isNotIncluded = (query, array) => {
    let included = false
    array.map((a) => {
      if (a.name.toLowerCase() === query.toLowerCase()) {
        included = true
      } 
    })
    return !included
  }

  return <>

        { location !== "activity-form" && (template && template.parent_role || !template) && !hideRoles ? <RoleForm scope="parents" location="org-parent-doc" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang ? lang : idLang} setLang={lang ? null : setIdLang} /> : null}

    {selectedRoles.length !== 0 || (template && !template.parent_role || !template) ? <>
      <div className="field">
      <div className="columns">
        <div className="column is-three-fifth">
          {(!orgs || !orgs[0]) ? <>
          <input type="text" placeholder={location === "templates-parents" ? t('default-organizations') : t('organization')} className="input" value={organisationValue} onChange={handleOrgChange}/>
          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentOrg} onChange={changeCurrentOrg} name={"entiieis"} id={"entiiies"}>
                {pending !== "" && isNotIncluded(pending, orgs) ? <>
                  <option value={pending}>{pending} {t('draft')}</option>
                </> : null}
                {orgs.map((t, i) => {
                  if (i < 7) {
                    return <Fragment key={t.slug}>
                      <option value={t.slug}>{t.name}</option>
                    </Fragment>
                  }
                })}
            </select>
          </div>}
        </div>
        <div className="column is-one-fifth">
          {(!orgs || !orgs[0]) && !orgForm ? <>
                        {organisationValue !== "" && !orgsLoading ? <button className="button is-primary" onClick={searchOrgValue}>{t('search')}</button> : <button className="button is-primary is-disabled" disabled>{t('search')}</button>}

          </> : <>
            {(organisationValue !== "" && selectedRoles[0]) || (organisationValue !== "" && isOrgExisting(organisationValue)) || (organisationValue !== "" && !isOrgExisting(organisationValue)) || (organisationValue !== "" && hideRoles) ? <button className="button is-primary " onClick={handleOrgBtn}>
            {isOrgExisting() ? t('add') : t('create')}
          </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}
            <span className="tag is-danger is-medium ml-2 mt-1 button" onClick={() => {
                setOrgs([]);
              }}><FontAwesomeIcon icon={faTrash}/></span>
          </>}
        </div>
      </div>
      <div className="columns is-multiline">
      {selectedOrg.map((org) => {
        if (org.entity) {
          return <Fragment key={org.entity.slug}>
           
             <ParentSearchItem item={org} handleDelete={handleDeleteOrg}/>
        </Fragment>
        }
      })}
      </div>
    </div>
    </> : null}
    {orgForm ? <div className={"modal " + (isActive ? "is-active" : "")}>
      <div className="modal-background"></div>
        <div className="modal-card">
          <div className="modal-card-head has-background-white-ter">
            <p className="modal-card-title is-size-3 ml-6">{t('create-organization')}</p>
              <button onClick={() => setOrgForm(false)} className="delete is-large ml-4" aria-label="close"></button>
              </div>
              <div className="modal-card-body has-background-white-ter"> 
                <OrganisationForm client={client} setAlert={setAlert} setCreated={setCreated}/>
              </div>
       
            </div>
            
        </div> : null}
  </>
}

export default OrganisationParentForm