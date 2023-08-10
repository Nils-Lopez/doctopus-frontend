import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowRotateLeft, faMagnifyingGlass, faCircleCheck} from '@fortawesome/free-solid-svg-icons'

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
    if (e.target.value.length >= 3) {
      searchRoleValue(e)
    } else if (e.target.value.length === 0) {
      setRoles([])
    }
  }
  
  const isRoleExisting = () =>  {
    let retrievedRole = undefined
    roles.map((role) => {
     if (roleEnValue === getContent(role.title, "en")) {
        retrievedRole = roleEnValue
      } else if (roleFrValue === getContent(role.title, "fr")) {
        retrievedRole = role
      }    
    })
    if (retrievedRole) {
      return retrievedRole
    } else return false
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
    if (e.target.value.length >= 3) {
      setRolesLoading(true)
      searchRoles(e.target.value)
    } 
  }

  useEffect(() => {
    if (responseSearchRoles && responseSearchRoles.success && responseSearchRoles.data[0] && rolesLoading) {
      setRolesLoading(false)
      setRoles(responseSearchRoles.data)


    } else if (responseSearchRoles && rolesLoading) {
      setRolesLoading(false)
      setRoles([])
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


  let inputClasses = (!isRoleExisting() && (roleEnValue.length >= 3 || roleFrValue.length >= 3 )) ? "control has-icons-left min-90" : "control has-icons-left min-100"
console.log('selectedRoles: ', selectedRoles)
  return <>
 
    <div className="field mt-4">
    {location !== "templates" && location !== "templates-parents" && location !== "templates-tags" && location !== "org-parent-doc" ? <label className="label has-text-left">{location === "support-form-doc" ? "Types" : "Roles"}</label> : null}

    <div className="is-flex is-justify-content-start is-fullwidth">
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
    
    
 
              

        </div>
        
    
         {displayRole ? <div className="is-flex is-fullwidth mt-2">
            <div className={inputClasses}>
          <input type="text" placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default roles" : location.includes("parent") ? "Roles": ""} className="input" value={i18n.language === "en" ? roleEnValue : roleFrValue} onChange={handleRoleChange}/>

          <span className="icon is-small is-left pointer">
           <i className="has-text-grey  pointer" ><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
    </span>
 
    </div>      
    {!isRoleExisting() && (roleEnValue.length >= 3 || roleFrValue.length >= 3 ) ?   <i className=" ml-3 mt-1 pt-1 has-text-info title is-5 pointer" onClick={(e) => {
              handleCreateRole(e)
              }}><FontAwesomeIcon icon={faCirclePlus} /></i> : null}
              
        </div>  : null}
       
       <div className="is-flex is-justify-content-start">
       {roles.map((t) => {
                  if (t.scope === scope) {
                    return <Fragment key={t.slug}>
                    <span className="tag is-info mt-2 is-small mr-1 opacity-50" onClick={(e) => {
                      console.log('rols: ', selectedRoles)
                        selectRole([...selectedRoles, t])
                        setRoles([])
                        setRoleForm(false)
                        setRoleFrValue("")
                        setRoleEnValue("")    
                        setDisplayRole(false)

                        }}>{getContent(t.title, i18n.language)}        <i className="has-text-light ml-3 pointer"><FontAwesomeIcon icon={faCircleCheck} /></i>  </span>
                  </Fragment>
                  }
                })}  
       </div>
          </div>

      
     
     
  </>
}

export default RoleForm