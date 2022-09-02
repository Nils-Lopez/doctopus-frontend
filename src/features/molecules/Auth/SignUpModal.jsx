import React, {useState} from 'react';

import SignUpForm from './SignUpForm';

const SignUpModal = ({isActive, setSignUpModal, handleSubmit, formAlert, setFormAlert}) => {

    return <>
        <div className={"modal " + (isActive ? "is-active" : "")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <div className="modal-card-head has-background-white-ter">
                    <p className="modal-card-title is-size-3 ml-6">Sign Up</p>
                    <button onClick={() => setSignUpModal(false)} className="delete is-large ml-4" aria-label="close"></button>
                </div>
                <div className="modal-card-body has-background-white-ter">
                    <SignUpForm handleSubmit={handleSubmit} formAlert={formAlert} setFormAlert={setFormAlert} />
                </div>
       
            </div>
            
        </div>
    </>
}

export default SignUpModal