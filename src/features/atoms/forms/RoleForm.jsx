import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import {useRoles} from '../../../utils/hooks/Roles'

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
    if (lang === "en") {
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
    setRoleDescFr("")
    setRoleDescEn("")
    setRoleForm(false)
  }
  
  const handleRoleDescChange = (e) => {
    e.preventDefault()
    if (lang === "en") {
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
    setRoles([])
  }
  

  const {
    searchRoles, 
    responseSearchRoles
  } = useRoles()

  const searchRoleValue = (e) => {
    e.preventDefault()
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
        if (getContent(role.title, lang) === roleEnValue || getContent(role.title, lang) === roleEnValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(lang === "en" ? roleEnValue : roleFrValue)
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
    {setLang ? <div className="tabs">
        <ul>
        <li onClick={() => {
          setLang("fr")
        }} className={lang === "fr" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>Français</a></li>
          <li onClick={() => {setLang("en")}} className={lang === "en" ? "is-active" : ""}><a href="#" onClick={(e) => e.preventDefault()}>English</a></li>
        </ul>
      </div> : null}
    <div className="field">
      {location !== "templates" && location !== "templates-parents" && location !== "templates-tags" ? <label className="label title is-5">{location === "support-form-doc" ? "Types" : "Roles"}</label> : null}
      <div className="columns">
        <div className="column is-four-fifth">
          {(!roles || !roles[0]) ? <>
            <input type="text" placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default roles" : ""} className="input" value={lang === "en" ? roleEnValue : roleFrValue} onChange={handleRoleChange}/>
          </> : <div className="select is-fullwidth is-multiple">
            <select value={currentRole} onChange={changeCurrentRole} name={"roles" + location + scope} id={"roles" + location + scope}>
                {pending !== "" ? <>
                  <option value={pending}>{pending} (draft)</option>
                </> : null}
                {roles.map((t) => {
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
            {(roleEnValue !== "" || roleFrValue !== "") && !rolesLoading ? <button className="button is-primary" onClick={searchRoleValue}>Search</button> : <button className="button is-primary is-disabled" onClick={searchRoleValue} disabled>Search</button>}
          </> : <>
            {!roleForm ? <>{roleEnValue !== "" || roleFrValue !== "" ? <button className="button is-primary " onClick={handleRoleBtn}>
            {isRoleExisting() ? "Add" : "Create"}
              </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateRole}>Confirm</button>}
              <span className="tag is-danger is-medium ml-2 mt-1 button" onClick={() => {
                setRoles([]);
                setRoleForm(false)
              }}><FontAwesomeIcon icon={faTrash}/></span>
          </>}
        </div>
      </div>
      {roleForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">{location === "support-form-doc" ? "Type description" : location !== "templates-tags" ? "Role description" : "Tag description"}</label>
        <textarea className="textarea" onChange={handleRoleDescChange} value={lang === "en" ? roleDescEn : roleDescFr}/>
      </div> : null}
      {selectedRoles ? selectedRoles.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-success is-medium mr-1">{getContent(role.title, lang)}</span>
          <span className="tag is-danger is-medium mr-2 button" onClick={(e) => handleDeleteRole(e, role)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
      }) : null}
    </div>
  </>
}

export default RoleForm