import React, {useState, Fragment, useEffect} from "react"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronDown, faChevronUp, faAngleLeft, faAngleRight, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import { useTranslation } from "react-i18next";

import {useRoles} from "../../../utils/hooks/Roles"

const RolesDash = ({}) => {

    const {t, i18n} = useTranslation()
    const [scopeDropdown, setScopeDropdown] = useState(false)
    const [scope, setScope] = useState('docs')
    const [query, setQuery] = useState("")

    const {findAllRoles, responseFindAllRoles} = useRoles()

    const [roles, setRoles] = useState([])
    const [rolesLoading, setRolesLoading] = useState(false)
    const [matchingRoles, setMatchingRoles] = useState([])

    useEffect(() => {
        if (!rolesLoading && !roles[0]) {
            setRolesLoading(true)
            findAllRoles()
        }
    }, [])

    useEffect(() => {
        if (rolesLoading && responseFindAllRoles && responseFindAllRoles.success) {
            setRoles(responseFindAllRoles.data)
            setRolesLoading(false)
        }
    }, [responseFindAllRoles])

    

    useEffect(() => {
        if (query.length > 0) {
            const matching = []
            roles.map((role) => {
                if (role.scope === scope) {
                    if (getContent(role.title, "en").toLowerCase().includes(query.toLowerCase())) matching.push(role)
                    else if (getContent(role.title, "fr").toLowerCase().includes(query.toLowerCase())) matching.push(role)
                }
            })
            console.log('mach: ', matching)
            setMatchingRoles(matching)
        } else {
            setMatchingRoles([])
        }
    }, [query])

    const [merging, setMerging] = useState(false)




    return <>
     
        <div className="panel is-shadowless">
            <div className="panel-heading has-background-white is-flex is-justify-content-space-between">
            <div className="dropdown is-active" onMouseEnter={() => setScopeDropdown(true)} onMouseLeave={() => setScopeDropdown(false)}>
                <div className="dropdown-trigger ml--1">
                    <div className="button tag is-medium is-primary ">
                        {scope === "docs" ? t("Document's types") : t("Roles/Functions")} &nbsp;{scopeDropdown ? <FontAwesomeIcon icon={faChevronUp}/> : <FontAwesomeIcon icon={faChevronDown}/>}
                    </div>
                </div>
                {scopeDropdown ? <div className="dropdown-menu">
                    <div className="dropdown-content dropdown-dashboard">
                        {scope === "docs" ? <>
                            <a className="dropdown-item has-text-left" onClick={() => {
                                            setScope('parents')
                                            setScopeDropdown(false)
                                            setQuery('')
                                            setMerging(false)
                                         }}>
                                            {t("Roles/Functions")}
                                        </a>
                        </> : <>
                            <a className="dropdown-item has-text-left" onClick={() => {
                                            setScope('docs')
                                            setScopeDropdown(false)
                                            setQuery('')
                                            setMerging(false)
                                         }}>
                                            {t("Document's types")}
                                        </a>
                        </>}
                    </div>
                </div> : null}
            </div>
                <div className="field max-50">
                    <div className="control has-icons-left">
                        
                        <input type="text" className="input" placeholder={merging ? t('merge-with') : t('title')} value={query} onChange={(e) => {
                            e.preventDefault()
                            setQuery(e.target.value)
                        }}/>
                        <span className="icon is-small is-left has-text-primary">
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </span>
                    </div>
                </div>
            </div>
            {rolesLoading ? <div className="loader mt-6 pt-6">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div> : <>
                {merging ? <RoleBlock role={merging}  t={t} roles={roles} setRoles={setRoles} setQuery={setQuery} setMerging={setMerging} merging={merging} setMatchingRoles={setMatchingRoles} matchingRoles={matchingRoles}/> : null}
                {!matchingRoles[0] && !merging ? roles?.map((role) => {
                    if (role.scope === scope && merging !== role) {
                        return <>
                            <Fragment key={role._id}>
                                <RoleBlock role={role} t={t} roles={roles} setRoles={setRoles} setQuery={setQuery} setMerging={setMerging} merging={merging} setMatchingRoles={setMatchingRoles} matchingRoles={matchingRoles}/>
                            </Fragment>
                        </>
                    }
                }) : !merging ? matchingRoles?.map((role) => {
                    if (role.scope === scope && merging !== role) {

                        return <>
                            <Fragment key={role._id}>
                                <RoleBlock role={role} t={t} roles={roles} setRoles={setRoles} setQuery={setQuery} setMerging={setMerging} merging={merging} setMatchingRoles={setMatchingRoles} matchingRoles={matchingRoles}/>
                            </Fragment>
                        </>
                    }
                }) : null}
                
            </>}
        </div>
    </>
}

const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

const RoleBlock = ({role, t, roles, setRoles, setQuery, setMerging, merging, matchingRoles, setMatchingRoles}) => {

    const [update, setUpdate] = useState(false)
    const [merge, setMerge] = useState(false)

    const [titleEnValue, setTitleEnValue] = useState(getContent(role.title, "en"))
    const [titleFrValue, setTitleFrValue] = useState(getContent(role.title, "fr"))

    const {updateRole, responseUpdateRole, mergeRoles, handleMergeRole} = useRoles()

    if (merging === role && !merge) {
        setMerge(true)
    }

    const sendRole = (e) => {
        e.preventDefault()
        const newRole = {title: [
            {lang: "fr", content: titleFrValue},
            {lang: "en", content: titleEnValue}
        ]}
        updateRole(newRole, role._id)
    }

    useEffect(() => {
        if (responseUpdateRole && responseUpdateRole.success) {
            const newRoles = [...roles]
            newRoles[roles.indexOf(role)] = responseUpdateRole.data
            setRoles(newRoles)
            setUpdate(false)
            setQuery('')
        }
    }, [responseUpdateRole])

    const handleMerge = (e, matchingRole) => {
        e.preventDefault()
        const reqData = {
            origin: role,
            duplicate: matchingRole
        }
        mergeRoles(reqData)
        const newRoles = roles.filter((r) => {
            if (r !== matchingRole) return r
        })
        setRoles(newRoles)
        setMerging(false)
        setMerge(false)
        setMatchingRoles([])
    }


    return <>
        <div className="panel-block columns">
            <p className="column is-4 has-text-left">{!update ? getContent(role.title, "fr") : <>
                <input type="text" className="input mb--1" value={titleFrValue} onChange={e => {
                    e.preventDefault()
                    setTitleFrValue(e.target.value)
                }}/>
            </>}</p>
            <p className="column is-4 has-text-left">{!update ? getContent(role.title, "en") : <>
                <input type="text" className="input mb--1" value={titleEnValue} onChange={e => {
                    e.preventDefault()
                    setTitleEnValue(e.target.value)
                }}/>
            </>}</p>
            <div className="column is-4 is-flex is-justify-content-end">
                <button className="button tag is-medium is-info mr-2" onClick={(e) => {
                    e.preventDefault()
                    if (!merging) setUpdate(!update)
                    else {
                        setMerge(false)
                        setMerging(false)
                    }
                }}>
                    {update || merge ? t('cancel') : t('update')}
                </button>
                {update ? (titleFrValue !== getContent(role.title, "fr") || titleEnValue !== getContent(role.title, "en")) ? <button className="button tag is-medium is-primary mr-2" onClick={sendRole}>
                    {t('confirm')}
                </button> : <button className="button tag is-medium is-primary mr-2" disabled>
                    {t('confirm')}
                </button> : !merge ? <button className="button tag is-medium is-primary mr-2" onClick={() => {
                    setMerge(true)
                    setMerging(role)
                    setQuery('')
                    setMatchingRoles([])
                }}>
                    {t('merge')}
                </button> : null}
            </div>
        </div>
        {matchingRoles[0] && merging ? matchingRoles.map((matchingRole) => {
                    if (matchingRole._id !== merging._id) {
                        return <Fragment key={matchingRole._id}>
                            <div className="panel-block columns">
                                <p className="column is-4 has-text-left">{getContent(matchingRole.title, "fr")}</p>
                                <p className="column is-4 has-text-left">{getContent(matchingRole.title, "en")}</p>
                                <div className="column is-4 is-flex is-justify-content-end">
                                
                                <button className="button tag is-medium is-primary mr-2" onClick={(e) => handleMerge(e, matchingRole)}>
                                        {t('merge')}
                                    </button>
                                </div>
                            </div>
                        </Fragment>
                    }
                }) : null}
    </>
}

export default RolesDash