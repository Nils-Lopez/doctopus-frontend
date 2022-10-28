import React, {useState} from 'react';

import {Link} from "react-router-dom"

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'


const Admin = () => {


    return <div className="navbar-end"> 
      <div className="navbar-item">
        <Link to="/admin/dashboard">
          <p className="has-text-primary">Dashboard</p>
        </Link>
      </div>
      <div className="navbar-item">
        <Link to="/admin/settings">
          <p className="has-text-primary">Settings</p>
         </Link>
      </div>
      <div className="navbar-item">
        <div className="button is-primary">
          <Link to="/admin/create">
            <div className="has-text-white is-flex">
              <p className="mr-2 mt-1 mb-1">Create</p> <p className="mt-1 mb-1"><FontAwesomeIcon icon={faCirclePlus} /></p>
            </div>
          </Link>
        </div>
      </div>
    </div>
}    

export default Admin;