import React, {useState} from 'react';

import {Link} from "react-router-dom"

const Admin = () => {


    return <div className="navbar-end"> 
      <div className="navbar-item">
        <Link to="/admin/dashboard">
          Dashboard
        </Link>
      </div>
      <div className="navbar-item">
        <Link to="/admin/settings">
          Settings
         </Link>
      </div>
      <div className="navbar-item">
        <div className="button is-primary is-text-white">
          <Link to="/admin/create">
            Create
          </Link>
        </div>
      </div>
    </div>
}    

export default Admin;