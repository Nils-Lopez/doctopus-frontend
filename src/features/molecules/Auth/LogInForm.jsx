import React, {useState, useEffect} from 'react';

//Atoms
import Alert from '../../atoms/Alert'

//Dependencies
import validator from "validator"

import { useTranslation } from 'react-i18next';

const LogInForm = ({handleSubmit, formAlert, setFormAlert}) => {
    const { t, i18n } = useTranslation();

    const [disabled, setDisabled] = useState({ email: true, pwd: true})
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [formValid, setFormValid] = useState(false)

     const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleChangeEmail = event => {
        if (!isValidEmail(event.target.value)) {
            setDisabled({email: true, pwd: disabled.pwd, confirmPwd: disabled.confirmPwd})
        } else {
            setFormAlert(false)
            setDisabled({email: false, pwd: disabled.pwd, confirmPwd: disabled.confirmPwd})
        }
        setEmail(event.target.value);
    };

    const handleChangePassword = event => {
        // if (validator.isStrongPassword(event.target.value, {
        //     minLength: 7,
        //     minLowercase: 1,
        //     minUppercase: 1,
        //     minNumbers: 1,
        //     minSymbols: 1
        // })) {
        //     setFormAlert(false)
        //     setDisabled({ email: disabled.email, pwd: false, confirmPwd: disabled.confirmPwd})
        // } else {
            
        //     setFormAlert({ type: "error", message: { en: 'Password is invalid. It must contains at least 7 symbol, numbers, lowercases and uppercases letters', fr: "Mot de passe invalide, il doit contenir minimum 7 lettres en minuscules, majuscules, des nombres et des caractères spéciaux." } });
        //     setDisabled({email: disabled.email, pwd: true, confirmPwd: disabled.confirmPwd})
        // }
        setPassword(event.target.value);
    };

    useEffect(() => {
        if (!disabled.email && !disabled.pwd) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [disabled])

    return <div className="columns is-flex is-justify-content-center mb-1">
        <div className="column is-three-quarters is-centered mt-5">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <div className="control">
                        <label htmlFor="input" name="email" className="label is-6 has-text-left has-text-primary mb-0">{t('email')}</label>
                        <input type="email" value={email} onChange={handleChangeEmail} className="input is-size-5" />
                    </div>
                </div>
                <div className="field mb-0">
                    <label htmlFor="password" name="password" className="label is-6 has-text-left has-text-primary mb-0">{t('pwd')}</label>
                    <input type="password" value={password} onChange={handleChangePassword} className="input is-size-5" />
                </div>
                <a href="" className='is-7 mt-1 ml-1 pt-0 has-text-left is-flex is-justify-content-start'><small>{t('forgot-pwd')}</small></a>
                <div className="is-flex is-justify-content-center mt-5">
                    <div className="field">
                        <button className="button pl-5 pr-5 is-primary" role="submit">
                            <span>{t('confirm')}</span>
                        </button>
                    </div>
                </div>
                
                    {formAlert ? <div className="mt-3">
                        <Alert alertType={formAlert.type} message={formAlert.message} setAlert={setFormAlert}/>
                    </div> : null}
           </form>
        </div>
    </div>
}

export default LogInForm