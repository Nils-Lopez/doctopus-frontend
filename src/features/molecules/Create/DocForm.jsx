import React, {useState, Fragment, useEffect} from 'react';
  
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm"
import SupportForm from "./SupportForm"  
import ParentForm from "./ParentForm"  

import {useDocs} from "../../../utils/hooks/docs/Docs"

const DocForm = ({client, setAlert, template, brotherhood, roles, tags, orgs, people}) => {
  
  const [titleValue, setTitleValue] = useState("")
  const [defaultSlug, setDefaultSlug] = useState("")
  const [slugValue, setSlugValue] = useState("")
  const [descValue, setDescValue] = useState("")
  const [descFrench, setDescFrench] = useState(true)
  const [descEnglish, setDescEnglish] = useState(false)
  const [showIdentityForm, setShowIdentityForm] = useState(true)
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [showParentForm, setShowParentForm] = useState(false)
  
  const [selectedTags, selectTag] = useState([])
  
  const [selectedOrg, selectOrg] = useState([])
  const [selectedPeople, selectPerson] = useState([])
  const [selectedProjects, selectProject] = useState([])
  
  const [pendingSupports, setPendingSupports] = useState([])
  const [selectedRoles, selectRole] = useState([])
  const [pendingExemplaries, setPendingExemplaries] = useState([])
  
  const {
    findDocById, 
    responseFindDocById, 
    createDoc, 
    responseCreateDoc,
    updateDoc, 
    responseUpdateDoc,
    deleteDoc, 
    responseDeleteDoc,
    findDocBySlug, 
    responseFindDocBySlug
  } = useDocs()

  const handleTitleChange = (e) => {
    e.preventDefault()
    setTitleValue(e.target.value)
    const newSlug = e.target.value.replaceAll(' ', '-').toLowerCase()
    if (slugValue === null || slugValue === "" || slugValue === defaultSlug) {
      setSlugValue(newSlug)
      setDefaultSlug(newSlug)
    }
  }  
  
  const handleSlugChange = (e) => {
    e.preventDefault()
    setSlugValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    setDescValue(e.target.value)
  }
  
  const handleIdentityShowing = (e) => {
    e.preventDefault()
    if (showIdentityForm) {
      setShowIdentityForm(false)
    } else {
      setShowIdentityForm(true)
    }
  }
  
  const handleSupportShowing = (e) => {
    e.preventDefault()
    if (showSupportForm) {
      setShowSupportForm(false)
    } else {
      setShowSupportForm(true)
    }
  }
  
  const handleParentsShowing = (e) => {
    e.preventDefault()
    if (showParentForm) {
      setShowParentForm(false)
    } else {
      setShowParentForm(true)
    }
  }


  const handleDocSubmit = async (e) => {
    e.preventDefault()
    const reqData = {
      doc: {
        slug: slugValue,
        title: [{ lang: "fr", content: titleValue }],
        description: [{ lang: "en", content: descValue }]
      },
      tags: selectedTags,
      supports: pendingSupports,
      parents: [...selectedOrg, ...selectedPeople, ...selectedProjects]
    }
    await createDoc(reqData)
  }
  
  useEffect(() => {
    console.log("res create doc : ", responseCreateDoc)
  }, [responseCreateDoc])

  return <form onSubmit={handleDocSubmit}>
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleIdentityShowing}>
        <h3 className="title is-4">Identity </h3>
      </button>
    </div>
    {showIdentityForm ? <><div className="columns">
      <div className="column">
        <div className="field">
          <label className="label">
            Title
          </label>
          <input type="text" className="input" value={titleValue} onChange={handleTitleChange}/>
        </div>
      </div>
      <div className="column">
        <div className="field">
          <label className="label">
            Slug
          </label>
          <input type="text" className="input" value={slugValue} onChange={handleSlugChange}/>
        </div>
      </div>
    </div>
    {template && template.description ? <div className="field" id="docDesc">
      <label className="label title is-5">
        Description
      </label>
      <div className="tabs">
        <ul>
          <li onClick={() => {setDescFrench(true); setDescEnglish(false)}} className={descFrench ? "is-active" : ""}><a href="#docDesc">Français</a></li>
          <li onClick={() => {setDescEnglish(true); setDescFrench(false)}} className={descEnglish ? "is-active" : ""}><a href="#docDesc">English</a></li>
        </ul>
      </div>
      <textarea className="textarea" value={descValue} onChange={handleDescChange}></textarea>
    </div> : null}
    <DocTagsForm selectedTags={selectedTags} selectTag={selectTag} tags={tags} />
    </>: null}
    <hr/>
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleSupportShowing}>
        <h3 className="title is-4">Supports</h3>
      </button>
    </div>
    {showSupportForm ? <SupportForm pendingSupports={pendingSupports} setPendingSupports={setPendingSupports} selectedRoles={selectedRoles} selectRole={selectRole} pendingExemplaries={pendingExemplaries} setPendingExemplaries={setPendingExemplaries} roles={roles} template={template}/> : null}
    <hr/>
    <div className="is-flex is-justify-content-start">
      <button className="button is-light mb-3" onClick={handleParentsShowing}>
        <h3 className="title is-4">Parents</h3>
      </button>
    </div>
    {showParentForm ? <ParentForm selectedOrg={selectedOrg} selectOrg={selectOrg} selectedPeople={selectedPeople} selectPerson={selectPerson} selectedProj={selectedProjects} selectProj={selectProject} roles={roles} people={people} orgs={orgs} template={template}/> : null}
    <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-center">
      <button className="button is-primary is-medium" type="submit">
        Create
      </button>
    </footer>
  </form>
}

export default DocForm