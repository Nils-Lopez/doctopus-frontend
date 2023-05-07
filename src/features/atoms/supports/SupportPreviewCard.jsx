import React from "react"
import {useTranslation} from "react-i18next"

const SupportPreviewCard = ({support, editSupportPreview, deleteSupportPreview}) => {
  const { t, i18n } = useTranslation()
  return <>
    <div className="card">
  <header className="card-header">
    <p className="card-header-title">
      {support.title[0].content !== "" ? getContent(support.title) : null}
    </p>
    <br/>
    
    <time>{support.date}</time>
  </header>
  <div className="card-content">
    <div className="content">
      {support.description[0].content !== "" ? getContent(support.description, i18n.language) : null}
      <br/>
      {support.pages !== "" ? support.pages : support.duration}
    </div>
  </div>
  <footer className="card-footer pt-1 pb-1">
    <button onClick={(e) => {
      e.preventDefault()
      editSupportPreview(support)
    }} className="button is-primary ml-2">{t('edit')}</button>
    <button onClick={(e) => {
      e.preventDefault()
      deleteSupportPreview(support)
    }} className="button is-danger ml-2 ">{t('delete')}</button>
  </footer>
</div>
  </>
}

const getContent = (value, lang = "en") => {
  if (value) {
    return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
  } else {
    return "Error"
  }
}

export default SupportPreviewCard