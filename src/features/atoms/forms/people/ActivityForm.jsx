import React, {useState, Fragment} from "react"

import RoleForm from "../RoleForm"
import OrganisationParentForm from "../docs/OrganisationParentForm"
import {useTranslation} from "react-i18next"

const ActivityForm = ({activites, selectedActivities, selectActivity, lang, roles}) => {
 const [activityValue, setActivityValue] = useState("")
  const [activityForm, setActivityForm] = useState(false)
  const [selectedRoles, selectRole] = useState([])
  const [selectedOrg, selectOrg] = useState([])

  const { t, i18n } = useTranslation() 

  const handleActivityChange = (e) => {
    e.preventDefault()
    setActivityValue(e.target.value)
  }
  
  const activities = [
    {slug: "titlmodee", title:"Mode"},
    {slug: "titldecoe", title:"Deco"},
    {slug: "titlcorpse", title:"Le corps"},
    { slug: "titlesprite", title: "L'esprit'" }
  ]
    
    
  const isActivityExisting = (r) =>  {
    let retrievedActivity = undefined
    activities.map((activity) => {
      if (activity.title.toLowerCase() === r.toLowerCase()) {
        retrievedActivity = activity
      } 
    })
    if (retrievedActivity) {
      return retrievedActivity
    } else return false
  }
  
  const handleActivityBtn = (e) => {
    e.preventDefault()
    const activityDoc = isActivityExisting(activityValue)
    let unique = true
    selectedActivities.map((activity) => {
      if (activity.title === activityValue) {
        unique = false
      }
    })
    if (unique) {
      if (activityDoc) {
      selectActivity([...selectedActivities, activityDoc])
      setActivityValue("")
    } else {
      setActivityForm(true)
    }
    }
  }
  
  const handleCreateActivity = (e) => {
    e.preventDefault()
    const newActivity = {slug: "new-tag", title: activityValue}
    selectActivity([...selectedActivities, newActivity])
    setActivityValue("")
    setActivityForm(false)
  }

  
  
  return <>
    <div className="field">
      <label className="label title is-5">{t('activities')}</label>
      <div className="columns">
        <div className="column is-four-fifth">
          <input type="text" list="tags" className="input" value={activityValue} onChange={handleActivityChange}/>
        </div>
        <div className="column is-one-fifth">
          {!activityForm ? <>{activityValue !== "" ? <button className="button is-primary " onClick={handleActivityBtn}>
            {isActivityExisting(activityValue) ? t('add') : t('create')}
          </button> : <button className="button is-primary is-disabled" disabled>{t('add')}</button>}</> : <button className="button is-primary" onClick={handleCreateActivity}>{t('confirm')}</button>}
        </div>
      </div>
      {activityForm ? <>
        <RoleForm roles={roles} scope="parents" location="activity-form-people" selectedRoles={selectedRoles} selectRole={selectRole} lang={lang} />       
        <OrganisationParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} location="activity-form"/>
      </> : null}
      <datalist id="tags">
        {activities.map((t) => {
          return <Fragment key={t.slug}>
            <option>{t.title}</option>
          </Fragment>
        })}
      </datalist>
      {selectedActivities.map((activity) => {
        return <Fragment key={activity.slug}>
          <span className="tag is-success is-medium mr-3" onClick={() => console.log(activity)}>{activity.title}</span>
        </Fragment>
      })}
    </div>
  </>
}

export default ActivityForm