import React, { useState } from "react";

import TemplatesForm from "../molecules/Settings/TemplatesForm"

const Settings = ({client, setClient, setAlert}) => {
    
    return <>
        <div className="columns mx-2 mt-5 overflow-hidden">
            <div className="column is-one-third template-fixed mt-5">
                <div className="box">
                    <h3 className="title is-3">Settings</h3>
                    <div className="panel is-grey">
                        <p className="panel-heading">
                            Admin
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Models
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    App
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Database
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Administrators
  </a>
                    </div>
                     <div className="panel is-grey">
                        <p className="panel-heading">
                            User
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Account
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Privacy
  </a>
  <a className="panel-block">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Security
  </a>

                    </div>
                </div>
            </div>
            <div className="column is-two-third settings-scrollable mt-5">
                <div className="box overflow-hidden">
                    <h3 className="title is-3">Models</h3>
            <TemplatesForm setAlert={setAlert} setClient={setClient} client={client}/>
                </div>
            </div>
        </div>
    </>
}

export default Settings