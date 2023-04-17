import React from "react"
import {useTranslation} from "react-i18next"

const ExemplaryPreviewCard = ({exemplary, editExemplary, deleteExemplary}) => {
  const { t, i18n } = useTranslation() 
  return <>
    <div className="card">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <h4 className="title is-6">{exemplary.location}</h4>
          </div>
          <div className="column">
            <h4 className="title is-6">{exemplary.position}</h4>
          </div>
          <div className="column">
            <h4 className="title is-6">
              {exemplary.rank}
            </h4>
          </div>
        </div>
        
      </div>
      <footer className="card-footer pt-2 pb-2">
    <button onClick={(e) => {
      e.preventDefault()
      editExemplary(exemplary)
    }} className=" button is-primary ml-2 mr-3">{t('edit')}</button>
    <button onClick={(e) => {
      e.preventDefault()
      deleteExemplary(exemplary)
    }} className=" button is-danger">{t('delete')}</button>
  </footer>
    </div>
  </>
}

export default ExemplaryPreviewCard