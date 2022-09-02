import React, {useState, useEffect} from 'react';

//Atoms
import Alert from '../../atoms/Alert'

//Dependencies
import validator from "validator"

const SignUpForm = ({handleSubmit, formAlert, setFormAlert}) => {

    const [disabled, setDisabled] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPwd, setConfirmPwd] = useState("")

    const [formValid, setFormValid] = useState(false)

     const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const handleChangeEmail = event => {
        if (!isValidEmail(event.target.value)) {
            setFormAlert({ type: "error", message: { en: 'Email is invalid.', fr: "Adresse email invalide." } });
            setDisabled({email: true, pwd: disabled.pwd})
        } else {
            setFormAlert(false)
            setDisabled({email: false, pwd: disabled.pwd})
        }
        setEmail(event.target.value);
    };

     const handleChangePassword = event => {
        if (validator.isStrongPassword(event.target.value, {
            minLength: 7,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            setFormAlert(false)
            setDisabled({ email: disabled.email, pwd: false })
        } else {
            
            setFormAlert({ type: "error", message: { en: 'Password is invalid. It must contains at least 7 symbol, numbers, lowercases and uppercases letters', fr: "Mot de passe invalide, il doit contenir minimum 7 lettres en minuscules, majuscules, des nombres et des caractères spéciaux." } });
            setDisabled({email: disabled.email, pwd: true})
        }
        setPassword(event.target.value);
    };

    const handleChangeConfirmPwd = event => {
        if (event.target.value === password) {
            setFormAlert({ type: "error", message: { en: 'Password must match', fr: "Les mots de passe ne correspondent pas." } });
            setDisabled({email: disabled.email, pwd: disabled.pwd, confirmPwd: true})
        } else {
            setFormAlert(false)
            setDisabled({email: disabled.email, pwd: disabled.pwd, confirmPwd: false})
        }
        setConfirmPwd(event.target.value)
    }

    useEffect(() => {
        if (!disabled.email && !disabled.pwd) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [disabled])


    return <div className="columns is-flex is-justify-content-center">
        <div className="column is-three-quarters is-centered">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <div className="control">
                        <label htmlFor="input" name="email" value={email} onChange={handleChangeEmail} className="label is-size-5">Email</label>
                        <input type="email" className="input is-size-5" />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="password" name="password" value={password} onChange={handleChangePassword} className="label is-size-5">Password</label>
                    <input type="password" className="input is-size-5" />
                </div>
                <div className="field">
                    <label htmlFor="password" name="password" value={confirmPwd} onChange={handleChangeConfirmPwd} className="label is-size-5">Confirm password</label>
                    <input type="password" className="input is-size-5" />
                </div>
                <div className="is-flex is-justify-content-center mt-5">
                    <div className="field">
                        <button className="button is-dark" role="submit" disabled={formValid ? false : true}>Confirm</button>
                    </div>
                </div>
                <div className="mt-3">
                    {formAlert ? <>
                        <Alert alertType={formAlert.type} message={formAlert.message} />
                    </> : null}
                </div>
           </form>
        </div>
    </div>
}

export default SignUpForm