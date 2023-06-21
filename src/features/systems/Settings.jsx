import React, { useState } from "react";

import TemplatesForm from "../molecules/Settings/TemplatesForm"
import { useTranslation } from "react-i18next";

const Settings = ({client, setClient, setAlert}) => {
    const { t, i18n } = useTranslation();

    return <>
        <div className="columns mx-2 mt-5 ">
            <div className="column is-one-third template-fixed mt-5">
                <div className="box">
                    <h3 className="title is-3">{t('settings')}</h3>
                    <div className="panel is-grey">
                        <p className="panel-heading">
                            {t('admin')}
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('models')}
  </a>
  {/* <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('app')}
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('database')}
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('admin')}
  </a> */}
                    </div>
                     {/* <div className="panel is-grey">
                        <p className="panel-heading">
                            {t('user')}
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('account')}
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('privacy')}
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    {t('security')}
  </a>

                    </div> */}
                </div>
            </div>
            <div className="column is-two-third settings-scrollable mt-5">
                <div className="box overflow-hidden">
                    <h3 className="title is-3">{t('models')}</h3>
            <TemplatesForm setAlert={setAlert} setClient={setClient} client={client}/>
                </div>
            </div>
        </div>
    </>
}

export default Settings