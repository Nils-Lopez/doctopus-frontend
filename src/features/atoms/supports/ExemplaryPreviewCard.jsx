import { faPenAlt, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import {useTranslation} from "react-i18next"

const ExemplaryPreviewCard = ({exemplary, editExemplary, deleteExemplary}) => {
  const { t, i18n } = useTranslation() 
  return <>
    <div className="card column is-3 mr-3">
      <div className="is-flex is-justify-content-end mt--1 mb-0 pb-0">
      <button onClick={(e) => {
      e.preventDefault()
      editExemplary(exemplary)
    }} className=" button has-background-transparent is-medium is-borderless pointer has-text-primary  px-1 py-0"><FontAwesomeIcon icon={faPenAlt}/></button>
    <button onClick={(e) => {
      e.preventDefault()
      deleteExemplary(exemplary)
    }} className=" button has-background-transparent is-medium is-borderless pointer has-text-danger  px-1 py-0"><FontAwesomeIcon icon={faXmarkCircle}/></button>
      </div>
      <div className="card-content has-text-left pl-0 mt--2 mb-0 pb-0">
        
       
            {exemplary.location && exemplary.location !== "" ? <h4 className="subtitle is-6 mt-0 mb-1"><small className="has-text-grey">{t('location')}: </small>{exemplary.location}</h4> : null}
         
            {exemplary.position && exemplary.position !== "" ? <h4 className="subtitle is-6 mt-0 mb-1"><small className="has-text-grey">{t('position')}: </small>{exemplary.position}</h4> : null}
        
            {exemplary.cote && exemplary.cote !== "" ? <h4 className="subtitle is-6 mt-0 mb-1">
              <small className="has-text-grey">{t('rank')}: </small>{exemplary.cote}
            </h4> : null}
            {exemplary.quality && exemplary.quality !== "" ? <h4 className="subtitle is-6 mt-0 mb-1">
            <small className="has-text-grey">{t('quality').split('/')[0].replace(" ", "")}: </small>{exemplary.quality}
            </h4> : null}
        
      </div>
      
    </div>
  </>
}

export default ExemplaryPreviewCard