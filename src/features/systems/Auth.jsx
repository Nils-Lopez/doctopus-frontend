//Dependencies
import React, { useState, useEffect } from 'react';

//Components
import SignUpModal from '../molecules/Auth/SignUpModal'
import LogInModal from '../molecules/Auth/LogInModal'

//API Hooks
import {useAuth} from '../../utils/hooks/Auth'

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

const Auth = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert}) => {

    const [signUpModal, setSignUpModal] = useState(false)
    const [logInModal, setLogInModal] = useState(false)

    const [loadingSignUp, setLoadingSignUp] = useState(false)
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false)

    const [userDropdown, setUserDropdown] = useState(false)

    const [formAlert, setFormAlert] = useState(false)

    const {
        login, 
        responseLogin,
        signUp,
        responseSignUp,
        logout, 
        responseLogout
    } = useAuth()

    //Handle submitting forms

    const handleSignUp = (e) => {
        e.preventDefault();
        const data = { email: e.target[0].value, password: e.target[1].value }
        signUp(data)
        setLoadingSignUp(true)
    }

    const handleLogIn = (e) => {
        e.preventDefault();
        const data = { email: e.target[0].value, password: e.target[1].value }
        login(data)
        setLoadingLogin(true)
    }

    const cookieKey = "VISITOR_COOKIE_TOKEN"

    //|Update data| or |Display error| from API response

    useEffect(() => {
        if (responseSignUp && loadingSignUp) {
            if (responseSignUp.success) {
                setAlert({type: "success", message: {en: "Account successfully created, welcome to dOctopus !", fr: "Votre compte a été créé avec succès, bienvenue sur dOctopus !"}})
                bake_cookie(cookieKey, {session: responseSignUp.data.session, id: responseSignUp.data.user._id}, {path: "/"})
                setClient(responseSignUp.data)
                setSignUpModal(false)
                setLoadingSignUp(false)
            } else {
                setFormAlert({type: "error", message: {en: "Email adress already taken.", fr: "L'adresse email est déjà prise"}})
                setLoadingSignUp(false)
            }
        }
    }, [responseSignUp])

    useEffect(() => {
        if (responseLogin && loadingLogin) {
            if (responseLogin.success) {
                setAlert({type: "success", message: {en: "Successfully connected !", fr: "Connecté avec succès !"}})
                bake_cookie(cookieKey, {session: responseLogin.data.session, id: responseLogin.data.user._id}, {path: "/"})
                setClient(responseLogin.data)
                setLogInModal(false)
                setLoadingLogin(false)
            } else {
                setFormAlert({type: "error", message: {en: "Wrong credentials.", fr: "Mot de passe ou adresse email incorrect."}})
                setLoadingLogin(false)
            }
        }
    }, [responseLogin])

    //Erase cookie, remove session and user data

    const handleLogOut = () => {
        if (read_cookie(cookieKey) && !loadingLogout) {
            logout(read_cookie(cookieKey).client)
            delete_cookie(cookieKey)
            setClient(null)
            setLoadingLogout(true)
        }
    }

    useEffect(() => {
        if (responseLogout && loadingLogout) {
            if (responseLogout.success) {
                setAlert({ type: "success", message: { en: "Successfully logged out.", fr: "Vous avez été déconnecté !"}})
                setLoadingLogout(false)
            } else {
                setAlert({type: "error", message: {en: "An error occured.", fr: "Un problème est survenu."}})
                setLoadingLogout(false)
            }
        }
    }, [responseLogout])

    return <>
        <div className="navbar-end">
            
            <div className="navbar-item">
               
                
                <div className="buttons">
                    {!client ? <>
                        <button onClick={() => setSignUpModal(true)} className="button is-primary">
                            <strong>Sign Up</strong>
                        </button>
                        <button onClick={() => setLogInModal(true)} className="button is-light">
                            Log In
                        </button>
                    </> : <>
                        
                            
                        <div className="dropdown is-active">
                            <div className="dropdown-trigger">
                                <button onClick={() => setUserDropdown(!userDropdown)} className={"button is-primary has-text-white is-rounded "} aria-haspopup="true" aria-controls="dropdown-menu">
                                    <FontAwesomeIcon icon={faUser} size="xl"/>
                                    <FontAwesomeIcon icon={userDropdown ? faChevronUp : faChevronDown} />
                                </button>
                            </div>
                                {userDropdown ? <>
                                    <div className="dropdown-menu dropdown-user-logged is-mobile is-tablet" id="dropdown-menu" role="menu">
                                    <div className="dropdown-content">
                                        <a href="#" className="dropdown-item pl-6">
        Watchlist
                                            </a>
                                            <a href="#" className="dropdown-item  pl-6">
        History
      </a>
      <a href="#" className="dropdown-item pl-6">
        Profile
      </a>
      <a className="dropdown-item  pl-6">
        Settings
      </a>
      
      <a href="#" className="dropdown-item pl-6">
        Help
      </a>
      <hr className="dropdown-divider"/>
      <button className="button is-small mt-2 is-dark" onClick={() => handleLogOut()}>
        Logout
      </button>
    </div>
  </div>
                                </> : null}
                        </div>
                            
                    </>}
                </div>
            </div>
        </div> 
        {signUpModal ? <SignUpModal isActive={signUpModal} setSignUpModal={setSignUpModal} handleSubmit={handleSignUp} formAlert={formAlert} setFormAlert={setFormAlert} loading={loadingSignUp}/> : null}
        {logInModal ? <LogInModal isActive={logInModal} setLogInModal={setLogInModal} handleSubmit={handleLogIn} formAlert={formAlert} setFormAlert={setFormAlert} loading={loadingLogin}/> : null}  
    </>
}

export default Auth