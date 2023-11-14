import React, {useState} from 'react';

import {Link} from "react-router-dom"

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";


const Admin = () => {
    const { t, i18n } = useTranslation();


    return <> 

      <div className="navbar-item ml-2">
        <Link to="/admin/settings">
          
          <strong>{t('dashboard')}</strong>
         </Link>
      </div>
      <div className="navbar-item ml-2 mt-1">
        <Link to="/admin/create">
        <div className="button is-primary">
          
              <span>
                <strong>{t('Encode')}</strong>
                {"  "}
                <FontAwesomeIcon icon={faCirclePlus} />
              </span>
      
        </div>
            </Link>
      </div>
    </>
}    

export default Admin;