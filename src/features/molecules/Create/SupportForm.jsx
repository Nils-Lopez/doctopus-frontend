 import React, {useState, useEffect, Fragment} from "react"

import SupportPreviewCard from "../../atoms/supports/SupportPreviewCard"
import RoleForm from "../../atoms/forms/RoleForm"
import ExemplariesForm from "../../atoms/forms/docs/ExemplariesForm"
import { useTranslation } from "react-i18next";

import FileForm from "../../atoms/forms/FileForm"

const SupportForm = ({ pendingSupports, setPendingSupports, selectedRoles, selectRole, pendingExemplaries, setPendingExemplaries, roles, template}) => {
    
  const [idLang, setIdLang] = useState("fr")
  const [titleEnValue, setTitleEnValue] = useState("")
  const [titleFrValue, setTitleFrValue] = useState("")
  const [descEnValue, setDescEnValue] = useState("")
  const [descFrValue, setDescFrValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [pdfValue, setPdfValue] = useState("")
  const [formatValue, setFormatValue] = useState("")
  const [accessValue, setAccessValue] = useState("")


  const { t, i18n } = useTranslation();

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
  
 

  const handleFormatChange = (e) => {
    e.preventDefault()
    setFormatValue(e.target.value)
  }



  const handleAccessChange = (e) => {
    e.preventDefault()
    setAccessValue(e.target.value)
  }



  const handleNewSupportBtn = (e) => {
    e.preventDefault()
    const newSupport = {
      title: [{lang: "en", content: titleEnValue}, {lang: "fr", content: titleFrValue}],
      description: [{lang: "en", content: descEnValue}, {lang: "fr", content: descFrValue}],
      url: urlValue,
      pdf: pdfValue,
      format: formatValue,
      accessibility: accessValue,
      exemplaries: pendingExemplaries, 
      roles: selectedRoles
    }
    setPendingSupports([...pendingSupports, newSupport])
    setTitleEnValue("")
    setTitleFrValue("")
    selectRole([])
    setDescEnValue("")
    setDescFrValue("")
    setUrlValue("")
    setPdfValue("")
    setFormatValue("")

    setAccessValue("")
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
    selectRole(support.roles)
    setFormatValue(support.format)
    setAccessValue(support.accessibility)
    deleteSupportPreview(support)
  }

  useEffect(() => {
    if (template && template.schema_name) {
      selectRole(template.support_role_defaults)
     
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
      <label className="label has-text-left">{t('title')}</label>
      {idLang === "en" ? <input type="text" className="input" value={titleEnValue} onChange={handleTitleEnChange}/> : <input type="text" className="input" value={titleFrValue} onChange={handleTitleFrChange}/>}
    </div>
    <div className="field" id="supportDesc">
       <label className="label has-text-left">{t('description')}</label>
      {idLang === "en" ? <textarea className="textarea" value={descEnValue} onChange={handleDescEnChange}/> : <textarea  className="textarea" value={descFrValue} onChange={handleDescFrChange}/>}
    </div>
    {template && template.support_role ? <RoleForm roles={roles} scope="docs" location="support-form-doc" selectedRoles={selectedRoles} selectRole={selectRole} defaults={template.support_role_defaults} lang={idLang} /> : null}
    {template && template.support_url ? <div className="field">
      <label className="label has-text-left">
        {t('link-url')}
      </label>
      
      <input type="text" className="input" value={urlValue} onChange={handleUrlChange}/>
    </div> : null}
    
    {template && template.support_pdf ? <div className="field">
       <label className="label has-text-left">
        PDF
      </label>
 
<FileForm setFile={setPdfValue}/>
    </div> : null}
    
    {template && template.support_format ? <>
      <div className="field">
        <label className="label has-text-left">{t('format')}</label>
        <input type="text" className="input" value={formatValue} onChange={handleFormatChange} />
      </div>
    </> : null}

    {template && template.support_accessibility ? <>
      <div className="field">
        <label className="label has-text-left">{t('accessibility')}</label>
        <input type="text" className="input" value={accessValue} onChange={handleAccessChange}/>
      </div>
    </> : null}
  {template && template.copies ? <ExemplariesForm setPendingExemplaries={setPendingExemplaries} pendingExemplaries={pendingExemplaries} template={template} /> : null}
    
    <div className="is-flex is-justify-content-end">
      <button onClick={handleNewSupportBtn} className="button is-primary">{t('create-support')}</button>
    </div>
  </>
}

export default SupportForm