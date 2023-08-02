import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowRotateLeft, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

import {useRoles} from '../../../utils/hooks/Roles'
import {useTranslation} from "react-i18next"

const RoleForm = ({scope, location, selectedRoles, selectRole, defaults, lang, setLang}) => {
  const [roleEnValue, setRoleEnValue] = useState("")
  const [roleFrValue, setRoleFrValue] = useState("")
  const [roleForm, setRoleForm] = useState(false)
  const [roleDescEn, setRoleDescEn] = useState("")
  const [roleDescFr, setRoleDescFr] = useState("")
  const [roleSlug, setRoleSlug] = useState("")
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [pending, setPending] = useState("")
  const { t, i18n } = useTranslation() 

  const [displayRole, setDisplayRole] = useState(true)

  useEffect(() => {
    if (defaults && defaults[0]) {
      defaults.map((role) => {
        if (!selectedRoles.includes(role)) {
          selectRole([...selectedRoles, role])
        }
      })
    }
  }, [defaults])

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

  const handleRoleChange = (e) => {
    e.preventDefault()
    if (i18n.language === "en") {
      setRoleEnValue(e.target.value)
      setRoleSlug(roleEnValue.replaceAll(" ", "-").toLowerCase())
    } else {
      setRoleFrValue(e.target.value)
      setRoleSlug(roleFrValue.replaceAll(" ", "-").toLowerCase())
    }
  }
  
  const isRoleExisting = () =>  {
    let retrievedRole = undefined
    roles.map((role) => {
      if (role.slug === currentRole) {
        retrievedRole = role
      }
    })
    if (retrievedRole) {
      return retrievedRole
    } else return false
  }
  
  const handleRoleBtn = (e) => {
    e.preventDefault()
    const roleDoc = isRoleExisting()
    let unique = true
    selectedRoles.map((role) => {
       role.title.map((title) => {
         if (title.content.toLowerCase() === roleEnValue.toLowerCase() && roleEnValue !== "" || title.content.toLowerCase() === roleFrValue.toLowerCase() && roleFrValue !== "") {
          unique = false
        }
      })
    })
    if (unique) {
      if (roleDoc) {
        selectRole([...selectedRoles, roleDoc])
        setRoleEnValue("")
        setRoleFrValue("")
        setRoleDescFr("")
        setDisplayRole(false)
        setRoles([])
        setRoleDescEn("")
      } else {
        setRoleForm(true)
      }
    }
  }
  
  const handleCreateRole = (e) => {
    e.preventDefault()
    const newRole = { slug: roleSlug, title: [{ lang: "en", content: roleEnValue }, { lang: "fr", content: roleFrValue }], description: [{ lang: "fr", content: roleDescFr }, {lang: "en", content: roleDescEn}], scope: scope}
    selectRole([...selectedRoles, newRole])
    setRoleEnValue("")
    setRoleFrValue("")
    setDisplayRole(false)
    setRoleDescFr("")
    setRoles([])

    setRoleDescEn("")
    setRoleForm(false)
  }
  
  const handleRoleDescChange = (e) => {
    e.preventDefault()
    if (i18n.language === "en") {
      setRoleDescEn(e.target.value)  
    } else {
      setRoleDescFr(e.target.value)
    }
  }

  const handleDeleteRole = (e, role) => {
    e.preventDefault()
    const filtered = selectedRoles.filter((r) => {
      return r.slug !== role.slug
    })
    selectRole(filtered)
    if (filtered.length === 0) setDisplayRole(true)
    setRoles([])
  }
  

  const {
    searchRoles, 
    responseSearchRoles
  } = useRoles()

  const searchRoleValue = (e) => {
    if (e) e.preventDefault()
    if (roleEnValue !== "" && roleEnValue !== "") {
      setRolesLoading(true)
      searchRoles(roleEnValue + " " + roleFrValue)
    } else if (roleEnValue !== "") {
      setRolesLoading(true)
      searchRoles(roleEnValue)
    } else if (roleFrValue !== "") {
      setRolesLoading(true)
      searchRoles(roleFrValue)
    }
  }

  useEffect(() => {
    if (responseSearchRoles && responseSearchRoles.success && responseSearchRoles.data[0] && rolesLoading) {
      setRolesLoading(false)
      setRoles(responseSearchRoles.data)
      
    } else if (responseSearchRoles && rolesLoading) {
      setRolesLoading(false)
      setRoleForm(true)
    }
  }, [responseSearchRoles])

  useEffect(() => {
    roles.map((role) => {
        if (getContent(role.title, i18n.language) === roleEnValue || getContent(role.title, i18n.language) === roleEnValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(i18n.language === "en" ? roleEnValue : roleFrValue)
      } else {
        setPending("")
      }
  }, [roles])

  const changeCurrentRole = (e) => {
    e.preventDefault()
    setCurrentRole(e.target.value)
    setRoleEnValue(e.target.value)
    setRoleFrValue(e.target.value)
  }

  const [currentRole, setCurrentRole] = useState({})

  return <>
 
    <div className="field">
    {location !== "templates" && location !== "templates-parents" && location !== "templates-tags" && location !== "org-parent-doc" ? <label className="label has-text-left">{location === "support-form-doc" ? "Types" : "Roles"}</label> : null}

    <div className="is-flex is-justify-content-start">
    {selectedRoles ? selectedRoles.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-info mt-1 is-medium mr-1">{getContent(role.title, i18n.language)}        <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteRole(e, role)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
        </Fragment>
      }) : null}
      {!displayRole ? <i className="has-text-info subtitle is-5 ml-2 mt-2  pointer" onClick={(e) => {
               setDisplayRole(true)
              }}><FontAwesomeIcon icon={faCirclePlus} /></i>  : selectedRoles && selectedRoles[0] ? <i className="has-text-info subtitle is-5 ml-2 mt-2 pointer" onClick={(e) => {
                setDisplayRole(false)
               }}><FontAwesomeIcon icon={faArrowRotateLeft} /></i> : null}
        {displayRole &&  selectedRoles && selectedRoles[0] ? <>
          <div className="columns ml-1 pb-1">
        <div className="column is-four-fifth">
          {(!roles || !roles[0]) ? <>
          <div className="control has-icons-right">
          <input type="text" placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default roles" : "Roles"} className="input" value={i18n.language === "en" ? roleEnValue : roleFrValue} onChange={handleRoleChange}/>

          <span class="icon is-small is-right">
           <i className="has-text-info  pointer" ><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
    </span>
          </div>
          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentRole} onChange={changeCurrentRole} name={"roles" + location + scope} id={"roles" + location + scope}>
                {pending !== "" ? <>
                  <option value={pending}>{pending} ({t('draft')})</option>
                </> : null}
                {roles.map((t) => {
                  console.log(t.scope)
                  if (t.scope === scope) {
                    return <Fragment key={t.slug}>
                    <option value={t.slug}>{getContent(t.title, lang)}</option>
                  </Fragment>
                  }
                })}
                
            </select>
          </div>}
        </div>
        <div className="column is-one-fifth">
          {(!roles || !roles[0]) && !roleForm ? <>
            {(roleEnValue !== "" || roleFrValue !== "") && !rolesLoading ? <button className="button is-primary" onClick={searchRoleValue}>{t('search')}</button> : <button className="button is-primary is-disabled" onClick={searchRoleValue} disabled>{t('search')}</button>}
          </> : <>
            {!roleForm ? <>{roleEnValue !== "" || roleFrValue !== "" ? <button className="button is-primary " onClick={handleRoleBtn}>
            {isRoleExisting() ? t('add') : t('create')}
              </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}</> : <button className="button is-primary" onClick={handleCreateRole}>{t('confirm')}</button>}

              <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                setRoles([]);
                setRoleForm(false)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>
          </>}
        </div>
      </div>
      {roleForm ? <div className="field">
        <label className="label has-text-left">{location === "support-form-doc" ? "Type description" : location !== "templates-tags" ? "Role description" : "Tag description"}</label>
        <textarea className="textarea" onChange={handleRoleDescChange} value={i18n.language === "en" ? roleDescEn : roleDescFr}/>
      </div> : null}
        </> : null}
    </div>
      {displayRole && (!selectedRoles || !selectedRoles[0]) ? <>
      <div className="columns mt-1">
        <div className="column is-two-fifth">
          {(!roles || !roles[0]) ? <>
            <div className="control has-icons-right">
          <input type="text" placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default roles" : "Roles"} className="input" value={i18n.language === "en" ? roleEnValue : roleFrValue} onChange={handleRoleChange}/>

          <span class="icon is-small is-right pointer">
           <i className="has-text-info  pointer" ><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
    </span>
    </div>          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentRole} onChange={changeCurrentRole} name={"roles" + location + scope} id={"roles" + location + scope}>
                {pending !== "" ? <>
                  <option value={pending}>{pending} ({t('draft')})</option>
                </> : null}
                {roles.map((t) => {
                  console.log(t.scope)
                  if (t.scope === scope) {
                    return <Fragment key={t.slug}>
                    <option value={t.slug}>{getContent(t.title, lang)}</option>
                  </Fragment>
                  }
                })}
                
            </select>
          </div>}
        </div>
        <div className="column ">
          {/* {(!roles || !roles[0]) && !roleForm ? <>
            {(roleEnValue !== "" || roleFrValue !== "") && !rolesLoading ? <button className="button is-primary" onClick={searchRoleValue}>{t('search')}</button> : <button className="button is-primary is-disabled" onClick={searchRoleValue} disabled>{t('search')}</button>}
          </> : <>
            {!roleForm ? <>{roleEnValue !== "" || roleFrValue !== "" ? <button className="button is-primary " onClick={handleRoleBtn}>
            {isRoleExisting() ? t('add') : t('create')}
              </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}</> : <button className="button is-primary" onClick={handleCreateRole}>{t('confirm')}</button>}

              <i className="has-text-danger ml-3 pointer" onClick={(e) => {
                setRoles([]);
                setRoleForm(false)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>
          </>} */}
        </div>
      </div>
      {roleForm ? <div className="field">
        <label className="label has-text-left">{location === "support-form-doc" ? "Type description" : location !== "templates-tags" ? "Role description" : "Tag description"}</label>
        <textarea className="textarea" onChange={handleRoleDescChange} value={i18n.language === "en" ? roleDescEn : roleDescFr}/>
      </div> : null}
      </> : null}
      
    </div>
  </>
}

export default RoleForm