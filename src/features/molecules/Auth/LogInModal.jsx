import React, {useState} from 'react';

import LogInForm from './LogInForm';

const LogInModal = ({isActive, setLogInModal, handleSubmit, formAlert, setFormAlert}) => {

    return <>
        <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">Login</p>
                    <button onClick={() => setLogInModal(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                    <LogInForm handleSubmit={handleSubmit} formAlert={formAlert} setFormAlert={setFormAlert} />
                </div>
                <div className="modal-card-foot is-flex is-justify-content-center">
                   
                    <div>
                        <p>Don't have an account yet ?</p>
                 
                        <p>I forgot my password</p>
                    </div>
                       
                </div>
            </div>
            
        </div>
    </>
}

export default LogInModal