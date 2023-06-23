import React, {useState} from 'react';

import LogInForm from './LogInForm';
import { useTranslation } from 'react-i18next';
const LogInModal = ({isActive, setLogInModal, setSignUpModal, handleSubmit, formAlert, setFormAlert, loading}) => {

    const { t, i18n } = useTranslation();

    return <>
        <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter border-0">
                    <p className="modal-card-title is-size-3 ml-6"><strong>{t('login')}</strong></p>
                    <button onClick={() => setLogInModal(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter border-0">
                    {loading ? <div className="mt-6"><div className="loader mb-6">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div></div> : <LogInForm handleSubmit={handleSubmit} formAlert={formAlert} setFormAlert={setFormAlert} />}
                
                </div>
                <footer className="modal-card-foot has-background-white-ter border-0">
                <div className="border-t">
    
    <p className='is-7 mt-3'><small>{t('no-account')}</small></p>

    <a onClick={(e) => {
        e.preventDefault()
        setLogInModal(false)
        setSignUpModal(true)
    }}><strong>{t('signup')}</strong></a>
    
</div>
                </footer>
              
            </div>
            
        </div>
    </>
}

export default LogInModal