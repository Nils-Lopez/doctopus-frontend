 import React, {useState, useEffect, Fragment} from "react"

import SupportPreviewCard from "../../atoms/supports/SupportPreviewCard"
import RoleForm from "../../atoms/forms/RoleForm"
import ExemplariesForm from "../../atoms/forms/docs/ExemplariesForm"
import { useTranslation } from "react-i18next";

import FileForm from "../../atoms/forms/FileForm"

const SupportForm = ({ pendingSupports, setPendingSupports, selectedRoles, selectRole, pendingExemplaries, setPendingExemplaries, roles, template, dataUpdate}) => {
    
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

  const handlePdfValue = (v) => {
    setPdfValue(v)
  }



  const handleNewSupportBtn = () => {
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
    setPendingSupports([newSupport])
    console.log('eeh new support', newSupport, pdfValue)
    // setTitleEnValue("")
    // setTitleFrValue("")
    // selectRole([])
    // setDescEnValue("")
    // setDescFrValue("")
    // setUrlValue("")
    // setPdfValue("")
    // setFormatValue("")

    // setAccessValue("")
    // setPendingExemplaries([])
  }

  useEffect(() => {
    handleNewSupportBtn()
  }, [pdfValue, urlValue, formatValue, accessValue, pendingExemplaries, selectedRoles, descEnValue, descFrValue, titleEnValue, titleFrValue])
  
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
  
  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }

  useEffect(() => {
    if (dataUpdate && dataUpdate.supports && dataUpdate.supports.length > 0) {
      const updateSupport = dataUpdate.supports[0]
      if (updateSupport.title && updateSupport.title.length > 0) {
        setTitleEnValue(getContent(updateSupport.title, "fr"))
        setTitleFrValue(getContent(updateSupport.title, "fr"))
      } else if (updateSupport.description && updateSupport.description.length > 0) {
        setDescEnValue(getContent(updateSupport.description, "en"))
        setDescFrValue(getContent(updateSupport.description, "fr"))
      }
      console.log("pdf:", updateSupport.pdf)
      setAccessValue(updateSupport.accessibility)
      setFormatValue(updateSupport.format)
      setUrlValue(updateSupport.url)
      setPdfValue(updateSupport.pdf)
      selectRole(updateSupport.roles)
      setPendingExemplaries(updateSupport.exemplaries)
    }
  }, [dataUpdate])

  return <>
    {/* {pendingSupports.map((support) => {
      return <Fragment key={support.title["fr"] + support.title["en"] + support.date}>
        <SupportPreviewCard support={support} editSupportPreview={editSupportPreview} deleteSupportPreview={deleteSupportPreview}/>
      </Fragment>
    })} */}
    
    {/* <div className="field mt-3" id="supportTitle">
      <label className="label has-text-left">{t('title')}</label>
      {i18n.language === "en" ? <input type="text" className="input" value={titleEnValue} onChange={handleTitleEnChange}/> : <input type="text" className="input" value={titleFrValue} onChange={handleTitleFrChange}/>}
    </div> */}
    <div className="field" id="supportDesc">
       <label className="label has-text-left">{t('description')}</label>
      {i18n.language === "en" ? <input type="text" className="input" value={descEnValue} onChange={handleDescEnChange}/> : <input type="text" className="input" value={descFrValue} onChange={handleDescFrChange}/>}
    </div>
    {template && template.support_role ? <RoleForm roles={roles} scope="docs" location="support-form-doc" selectedRoles={selectedRoles} selectRole={selectRole} defaults={template.support_role_defaults} lang={i18n.language} /> : null}
    

    <div className="columns">
      <div className="column">
      {template && template.support_format ? <>
      <div className="field">
        <label className="label has-text-left">{t('format')}</label>
        <input type="text" className="input" value={formatValue} onChange={handleFormatChange} />
      </div>
    </> : null}
      </div>
      <div className="column">
      {template && template.support_url ? <div className="field">
      <label className="label has-text-left">
        {t('link-url')}
      </label>
      
      <input type="text" className="input" value={urlValue} onChange={handleUrlChange}/>
    </div> : null}
      </div>
    </div>
    
    {template && template.support_pdf ? <div className="field">
       <label className="label has-text-left">
        PDF
      </label>
 
<FileForm setFile={handlePdfValue} pdf={pdfValue}/>
    </div> : null}
    
    

    {template && template.support_accessibility ? <>
      <div className="field">
        <label className="label has-text-left">{t('accessibility')}</label>
        <input type="text" className="input" value={accessValue} onChange={handleAccessChange}/>
      </div>
    </> : null}
  {template && template.copies ? <ExemplariesForm setPendingExemplaries={setPendingExemplaries} pendingExemplaries={pendingExemplaries} template={template} /> : null}
    
    {/* <div className="is-flex is-justify-content-end">
      <button onClick={handleNewSupportBtn} className="button is-primary">{t('create-support')}</button>
    </div> */}
  </>
}

export default SupportForm