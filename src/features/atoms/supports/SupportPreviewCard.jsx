import React from "react"
import {useTranslation} from "react-i18next"

const SupportPreviewCard = ({support, editSupportPreview, deleteSupportPreview}) => {
  const { t, i18n } = useTranslation()
  console.log(support)
  return <>
    <div className="card pt-5">
      <h3 className="subtitle">{support.title && support.title[0] && support.title[0].content !== "" ? t('title') + ": " +  getContent(support.title, i18n.language) : null}</h3>
 
    
      {support.description && support.description[0] && support.description[0].content !== "" ? t('description') + ": " + getContent(support.description, i18n.language) : null}
      <br/>

  <footer className="card-footer pt-1 mt-5 pb-1">
    <button onClick={(e) => {
      e.preventDefault()
      editSupportPreview(support)
    }} className="button is-light ml-2">{t('edit')}</button>
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