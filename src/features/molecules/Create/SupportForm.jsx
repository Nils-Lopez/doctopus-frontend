import React, {useState, useEffect, Fragment} from "react"

import SupportPreviewCard from "../../atoms/supports/SupportPreviewCard"
import RoleForm from "../../atoms/forms/RoleForm"
import ExemplariesForm from "../../atoms/forms/docs/ExemplariesForm"

const SupportForm = ({ pendingSupports, setPendingSupports, selectedRoles, selectRole, pendingExemplaries, setPendingExemplaries, roles, template}) => {
    
  const [idLang, setIdLang] = useState("fr")
  const [titleEnValue, setTitleEnValue] = useState("")
  const [titleFrValue, setTitleFrValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [publiDateValue, setPubliDateValue] = useState("")
  const [pdfValue, setPdfValue] = useState("")
  const [isbnValue, setIsbnValue] = useState("")
  const [pagesValue, setPagesValue] = useState("")
  const [durationValue, setDurationValue] = useState("")
  const [thumbValue, setThumbValue] = useState("")
  const [issnValue, setIssnValue] = useState("")
  const [formatValue, setFormatValue] = useState("")
  const [accessValue, setAccessValue] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [volumeValue, setVolumeValue] = useState("")
  const [numberValue, setNumberValue] = useState("")

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

  const handleFormatChange = (e) => {
    e.preventDefault()
    setFormatValue(e.target.value)
  }

  const handleIssnChange = (e) => {
    e.preventDefault()
    setIssnValue(e.target.value)
  }

  const handleAccessChange = (e) => {
    e.preventDefault()
    setAccessValue(e.target.value)
  }

  const handleDateChange = (e) => {
    e.preventDefault()
    setDateValue(e.target.value)
  }
  
  const handleVolumeChange = (e) => {
    e.preventDefault()
    setVolumeValue(e.target.value)
  }
  const handleNumberChange = (e) => {
    e.preventDefault()
    setNumberValue(e.target.value)
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
      publishedAt: publiDateValue,
      date: dateValue,
      issn: issnValue,
      format: formatValue,
      accessibility: accessValue,
      exemplaries: pendingExemplaries, 
      roles: selectedRoles,
      volume: volumeValue,
      number: numberValue
    }
    setPendingSupports([...pendingSupports, newSupport])
    setTitleEnValue("")
    setTitleFrValue("")
    selectRole([])
    setDescEnValue("")
    setDescFrValue("")
    setUrlValue("")
    setPdfValue("")
    setPagesValue("")
    setThumbValue("")
    setPubliDateValue("")
    setDurationValue("")
    setFormatValue("")
    setIssnValue("")
    setDateValue("")
    setAccessValue("")
    setVolumeValue('')
    setNumberValue('')
    setPendingExemplaries([])
  }
  
  const deleteSupportPreview = (support) => {
    const filtered = pendingSupports.filter((supp) => {return supp !== support})
    
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
    setPubliDateValue(support.publishedAt)
    setDurationValue(support.duration)
    selectRole(support.roles)
    setFormatValue(support.format)
    setIssnValue(support.issn)
    setAccessValue(support.accessibility)
    setDateValue(support.date)
    setVolumeValue(support.volume)
    setNumberValue(support.number)
    deleteSupportPreview(support)
  }

  useEffect(() => {
    if (template && template.schema_name) {
      selectRole(template.support_role_defaults)
      if (template.support_issn_default && template.support_issn_default !== "" && issnValue === "") {
        setIssnValue(template.support_issn_default)
      }
    }
  }, [template])
  
  return <>
    {pendingSupports.map((support) => {
      return <Fragment key={support.title["fr"] + support.title["en"] + support.date}>
        <SupportPreviewCard support={support} editSupportPreview={editSupportPreview} deleteSupportPreview={deleteSupportPreview}/>
      </Fragment>
    })}
      <div className="tabs">
        <ul>
          <li onClick={() => {setIdLang("fr")}} className={idLang === "fr" ? "is-active" : ""}><a href="#">Français</a></li>
          <li onClick={() => {setIdLang("en")}} className={idLang === "en" ? "is-active" : ""}><a href="#">English</a></li>
        </ul>
      </div>
    <div className="field mt-3" id="supportTitle">
      <label className="label">Title</label>
      {idLang === "en" ? <input type="text" className="input" value={titleEnValue} onChange={handleTitleEnChange}/> : <input type="text" className="input" value={titleFrValue} onChange={handleTitleFrChange}/>}
    </div>
    <div className="field" id="supportDesc">
       <label className="label">Description</label>
      {idLang === "en" ? <textarea className="textarea" value={descEnValue} onChange={handleDescEnChange}/> : <textarea  className="textarea" value={descFrValue} onChange={handleDescFrChange}/>}
    </div>
    {template && template.support_role ? <RoleForm roles={roles} scope="docs" location="support-form-doc" selectedRoles={selectedRoles} selectRole={selectRole} defaults={template.support_role_defaults} lang={idLang} /> : null}
    {template && template.support_url ? <div className="field">
      <label className="label">
        Url
      </label>
      
      <input type="text" className="input" value={urlValue} onChange={handleUrlChange}/>
    </div> : null}
    {template && template.support_publishedAt ? <div className="field">
      <label className="label">
        Date
      </label>
      
      <input type="date" className="input" value={publiDateValue} onChange={handlePubliDateChange}/>
    </div> : null}
    {template && template.support_publishedAt ? <div className="field">
      <label className="label">
        Publication Date
      </label>
      
      <input type="text" className="input" value={dateValue} onChange={handleDateChange}/>
    </div> : null}
    {template && template.support_pdf ? <div className="field">
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
    </div> : null}
    {template && template.support_eanIsbn ?  <div className="field">
      <label className="label">
        EAN/ISBN
      </label>
      
      <input type="text" className="input" value={isbnValue} onChange={handleIsbnChange}/>
    </div> : null}
     {template && template.support_pages ? <div className="field">
      <label className="label">
        Pages number
      </label>
      
      <input type="text" className="input" value={pagesValue} onChange={handlePagesChange}/>
    </div> : null}
    {template && template.support_duration ?  <div className="field">
      <label className="label">
        Duration
      </label>
      
      <input type="text" className="input" step="1" value={durationValue} onChange={handleDurationChange}/>
    </div> : null}
    {template && template.support_thumb ? <div className="field">
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
    </div> : null}
    {template && template.support_format ? <>
      <div className="field">
        <label className="label">Format</label>
        <input type="text" className="input" value={formatValue} onChange={handleFormatChange} />
      </div>
    </> : null}
    {template && template.support_number ? <>
      <div className="field">
        <label className="label">Number</label>
        <input type="text" className="input" value={numberValue} onChange={handleNumberChange} />
      </div>
    </> : null}
    {template && template.support_volume ? <>
      <div className="field">
        <label className="label">Volume</label>
        <input type="text" className="input" value={volumeValue} onChange={handleVolumeChange} />
      </div>
    </> : null}
    {template && template.support_issn ? <>
      <div className="field">
        <label className="label">ISSN</label>
        <input type="text" className="input" value={issnValue} onChange={handleIssnChange}/>
      </div>
    </> : null}
    {template && template.support_accessibility ? <>
      <div className="field">
        <label className="label">Accessibility</label>
        <input type="text" className="input" value={accessValue} onChange={handleAccessChange}/>
      </div>
    </> : null}
  {template && template.copies ? <ExemplariesForm setPendingExemplaries={setPendingExemplaries} pendingExemplaries={pendingExemplaries} template={template} /> : null}
    
    <div className="is-flex is-justify-content-end">
      <button onClick={handleNewSupportBtn} className="button is-primary">Create New Support</button>
    </div>
  </>
}

export default SupportForm