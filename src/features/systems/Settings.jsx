import React, { useState } from "react";

import TemplatesForm from "../molecules/Settings/TemplatesForm"

const Settings = ({ }) => {
    
    return <>
        <div className="columns mx-2">
            <div className="column is-one-third">
                <div className="box">
                    <h3 className="title is-3">Settings</h3>
                    <div className="panel is-info">
                        <p className="panel-heading">
                            Admin
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Templates
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
                     <div className="panel is-info">
                        <p className="panel-heading">
                            User
                        </p>
                        <a className="panel-block is-active">
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    Templates
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
                </div>
            </div>
            <div className="column is-two-third">
                <div className="box">
                    <h3 className="title is-3">Templates</h3>
                    <TemplatesForm/>
                </div>
            </div>
        </div>
    </>
}

export default Settings