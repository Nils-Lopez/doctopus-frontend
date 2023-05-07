import React, {useState} from 'react';

import SignUpForm from './SignUpForm';
import { useTranslation } from "react-i18next";

const SignUpModal = ({isActive, setSignUpModal, handleSubmit, formAlert, setFormAlert}) => {
    const { t, i18n } = useTranslation();

    return <>
        <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6"><strong>{t('signup')}</strong></p>
                    <button onClick={() => setSignUpModal(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                    <SignUpForm handleSubmit={handleSubmit} formAlert={formAlert} setFormAlert={setFormAlert} />
                   <div className="border-t">
    
                        <p className='is-7 mt-3'><small>{t('already-registered')} ?</small></p>
   
                        <a href=""><strong>{t('login')}</strong></a>
                </div>
                </div>
                   
                
            </div>
            
        </div>
    </>
}

export default SignUpModal