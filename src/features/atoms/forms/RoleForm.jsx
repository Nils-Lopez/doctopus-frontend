import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const RoleForm = ({roles, scope, location, selectedRoles, selectRole, defaults, lang, setLang}) => {
  const [roleEnValue, setRoleEnValue] = useState("")
  const [roleFrValue, setRoleFrValue] = useState("")
  const [roleForm, setRoleForm] = useState(false)
  const [roleDescEn, setRoleDescEn] = useState("")
  const [roleDescFr, setRoleDescFr] = useState("")
  const [roleSlug, setRoleSlug] = useState("")

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
      role.title.map((title) => {
        if (title.content.toLowerCase() === roleEnValue.toLowerCase() || title.content.toLowerCase() === roleFrValue.toLowerCase()) {
          retrievedRole = role
        }
      })
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
  }
  
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
          <input type="text" list={"roles" + location} placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default roles" : ""} className="input" value={lang === "en" ? roleEnValue : roleFrValue} onChange={handleRoleChange}/>
        </div>
        <div className="column is-one-fifth">
          {!roleForm ? <>{roleEnValue !== "" || roleFrValue !== "" ? <button className="button is-primary " onClick={handleRoleBtn}>
            {isRoleExisting() ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateRole}>Confirm</button>}
        </div>
      </div>
      {roleForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">{location === "support-form-doc" ? "Type description" : location !== "templates-tags" ? "Role description" : "Tag description"}</label>
        <textarea className="textarea" onChange={handleRoleDescChange} value={lang === "en" ? roleDescEn : roleDescFr}/>
      </div> : null}
      <datalist id={"roles" + location}>
        {roles.map((t) => {
          if (t.scope === scope) {
            return <Fragment key={t.slug}>
            <option>{getContent(t.title, lang)}</option>
          </Fragment>
          }
        })}
      </datalist>
      {selectedRoles.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-success is-medium mr-1">{getContent(role.title, lang)}</span>
          <span className="tag is-danger is-medium mr-2 button" onClick={(e) => handleDeleteRole(e, role)}><FontAwesomeIcon icon={faTrash}/></span>
        </Fragment>
      })}
    </div>
  </>
}

export default RoleForm