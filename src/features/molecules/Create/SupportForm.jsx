import React, {useState, Fragment} from "react"

import SupportPreviewCard from "../../atoms/supports/SupportPreviewCard"
import RoleForm from "../../atoms/forms/RoleForm"
import ExemplariesForm from "../../atoms/forms/docs/ExemplariesForm"

const SupportForm = ({pendingSupports, setPendingSupports, selectedRoles, selectRole, pendingExemplaries, setPendingExemplaries}) => {
    
  const [titleEnglish, setTitleEnglish] = useState(false)
  const [titleEnValue, setTitleEnValue] = useState("")
  const [titleFrValue, setTitleFrValue] = useState("")
  const [descEnglish, setDescEnglish] = useState(false)
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [publiDateValue, setPubliDateValue] = useState("")
  const [pdfValue, setPdfValue] = useState("")
  const [isbnValue, setIsbnValue] = useState("")
  const [pagesValue, setPagesValue] = useState("")
  const [durationValue, setDurationValue] = useState("")
  const [thumbValue, setThumbValue] = useState("")
  

  
  const handleTitleEnChange = (e) => {
    e.preventDefault()
    setTitleEnValue(e.target.value)
  }
  
  const handleTitleFrChange = (e) => {
    e.preventDefault()
    setTitleFrValue(e.target.value)
  }
  const handleDescEnChange = (e) => {
    e.preventDefault()
    setDescEnValue(e.target.value)
  }
  
  const handleDescFrChange = (e) => {
    e.preventDefault()
    setDescFrValue(e.target.value)
  }
  
  const handleUrlChange = (e) => {
    e.preventDefault()
    setUrlValue(e.target.value)
  }
  
  const handlePubliDateChange = (e) => {
    e.preventDefault()
    setPubliDateValue(e.target.value)
  }
 
  const handleIsbnChange = (e) => {
    e.preventDefault()
    setIsbnValue(e.target.value)
  }
  
  const handlePagesChange = (e) => {
    e.preventDefault()
    setPagesValue(e.target.value)
  }
  
  const handleDurationChange = (e) => {
    e.preventDefault()
    setDurationValue(e.target.value)
  }
  
  const handleNewSupportBtn = (e) => {
    e.preventDefault()
    const newSupport = {
      title: [{lang: "en", content: titleEnValue}, {lang: "fr", content: titleFrValue}],
      description: [{lang: "en", content: descEnValue}, {lang: "fr", content: descFrValue}],
      url: urlValue,
      thumb: thumbValue,
      pdf: pdfValue,
      pages: pagesValue,
      duration: durationValue,
      isbn: isbnValue,
      date: publiDateValue
    }
    setPendingSupports([...pendingSupports, newSupport])
    setTitleEnValue("")
    setTitleFrValue("")
    setDescEnValue("")
    setDescFrValue("")
    setUrlValue("")
    setPdfValue("")
    setPagesValue("")
    setThumbValue("")
    setPubliDateValue("")
    setDurationValue("")
  }
  
  const deleteSupportPreview = (support) => {
    const filtered = pendingSupports
    filtered.filter((supp) => {return supp !== support})
    setPendingSupports(filtered)
  }
  
  const editSupportPreview = (support) => {
    setTitleEnValue(support.title[0].content)
    setTitleFrValue(support.title[1].content)
    setDescEnValue(support.description[0].content)
    setDescFrValue(support.description[1].content)
    setUrlValue(support.url)
    setPdfValue(support.pdf)
    setPagesValue(support.pages)
    setThumbValue(support.thumb)
    setPubliDateValue(support.date)
    setDurationValue(support.duration)
  }
  
    const roles = [
    {slug: "titlmodee", title:"Mode"},
    {slug: "titldecoe", title:"Deco"},
    {slug: "titlcorpse", title:"Le corps"},
    {slug: "titlesprite", title:"L'esprit'"}
]
  
  
  return <>
    {pendingSupports.map((support) => {
      return <Fragment key={support.title["fr"] + support.title["en"] + support.date}>
        <SupportPreviewCard support={support} editSupportPreview={editSupportPreview} deleteSupportPreview={deleteSupportPreview}/>
      </Fragment>
    })}
    <div className="field mt-3" id="supportTitle">
      <label className="label">Title</label>
      <div className="tabs">
        <ul>
          <li onClick={() => {setTitleEnglish(false)}} className={!titleEnglish ? "is-active" : ""}><a href="#supportTitle">Français</a></li>
          <li onClick={() => {setTitleEnglish(true)}} className={titleEnglish ? "is-active" : ""}><a href="#supportTitle">English</a></li>
        </ul>
      </div>
      {titleEnglish ? <input type="text" className="input" value={titleEnValue} onChange={handleTitleEnChange}/> : <input type="text" className="input" value={titleFrValue} onChange={handleTitleFrChange}/>}
    </div>
    <div className="field" id="supportDesc">
       <label className="label">Description</label>
      <div className="tabs">
        <ul>
          <li onClick={() => {setDescEnglish(false)}} className={!descEnglish ? "is-active" : ""}><a href="#supportDesc">Français</a></li>
          <li onClick={() => {setDescEnglish(true)}} className={descEnglish ? "is-active" : ""}><a href="#supportDesc">English</a></li>
        </ul>
      </div>
      {descEnglish ? <textarea className="textarea" value={descEnValue} onChange={handleDescEnChange}/> : <textarea  className="textarea" value={descFrValue} onChange={handleDescFrChange}/>}
    </div>
    <RoleForm roles={roles} scope="support" location="support-form-doc" selectedRoles={selectedRoles} selectRole={selectRole}/>
    <div className="field">
      <label className="label">
        Url
      </label>
      
      <input type="text" className="input" value={urlValue} onChange={handleUrlChange}/>
    </div>
    <div className="field">
      <label className="label">
        Publication Date
      </label>
      
      <input type="date" className="input" value={publiDateValue} onChange={handlePubliDateChange}/>
    </div>
    <div className="field">
       <label className="label">
        PDF
      </label>
      <div className="file has-name is-fullwidth">
  <label className="file-label">
    <input className="file-input" type="file" onChange={(e) => setPdfValue(e.target.value)} name="resume"/>
    <span className="file-cta">
      <span className="file-icon">
        <i className="fas fa-upload"></i>
      </span>
      <span className="file-label">
        Choose a file…
      </span>
    </span>
    {pdfValue !== "" ? <span className="file-name">
      {pdfValue}
    </span> : null}
  </label>
</div>
    </div>
     <div className="field">
      <label className="label">
        EAN/ISBN
      </label>
      
      <input type="text" className="input" value={isbnValue} onChange={handleIsbnChange}/>
    </div>
     <div className="field">
      <label className="label">
        Pages number
      </label>
      
      <input type="text" className="input" value={pagesValue} onChange={handlePagesChange}/>
    </div>
     <div className="field">
      <label className="label">
        Duration
      </label>
      
      <input type="time" className="input" step="1" value={durationValue} onChange={handleDurationChange}/>
    </div>
    <div className="field">
       <label className="label">
        Thumbnail
      </label>
      <div className="file has-name is-fullwidth">
  <label className="file-label">
    <input className="file-input" type="file" onChange={(e) => setThumbValue(e.target.value)} name="resume"/>
    <span className="file-cta">
      <span className="file-icon">
        <i className="fas fa-upload"></i>
      </span>
      <span className="file-label">
        Choose a file…
      </span>
    </span>
    {thumbValue !== "" ? <span className="file-name">
      {thumbValue}
    </span> : null}
  </label>
</div>
  <ExemplariesForm setPendingExemplaries={setPendingExemplaries} pendingExemplaries={pendingExemplaries}/>
    </div>
    <div className="is-flex is-justify-content-end">
      <button onClick={handleNewSupportBtn} className="button is-primary">Create New Support</button>
    </div>
  </>
}

export default SupportForm