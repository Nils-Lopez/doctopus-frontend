import React, {useState} from 'react';

import SignUpForm from './SignUpForm';
import { useTranslation } from "react-i18next";

const SignUpModal = ({isActive, setSignUpModal, setLogInModal, handleSubmit, formAlert, setFormAlert}) => {
    const { t, i18n } = useTranslation();

    return <>
        <div className={"modal modal-auth " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card p-5">
                <div className="modal-card-head">
                    <p className="modal-card-title is-size-3 ml-6"><strong>{t('signup')}</strong></p>
                    <button onClick={() => setSignUpModal(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body ">
                    <SignUpForm handleSubmit={handleSubmit} formAlert={formAlert} setFormAlert={setFormAlert} />
                   
                </div>
                   
                <footer className="modal-card-foot">
                <div className="border-t">
    
                        <p className='is-7 mt-3'><small>{t('already-registered')} ?</small></p>
   
                        <a onClick={(e) => {
                            e.preventDefault()
                            setLogInModal(true)
                            setSignUpModal(false)
                        }}>{t('login')}</a>
                </div>
                </footer>
            </div>
            
        </div>
    </>
}

export default SignUpModal