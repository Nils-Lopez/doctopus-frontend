//Dependencies
import React, { useState, useEffect } from 'react';

//Components
import SignUpModal from '../molecules/Auth/SignUpModal'
import LogInModal from '../molecules/Auth/LogInModal'

//API Hooks
import {useAuth} from '../../utils/hooks/Auth'
import {useUsers} from '../../utils/hooks/Users'

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import {Link, useNavigate} from "react-router-dom"

const Auth = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert, signUpModal, setSignUpModal}) => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate()

    const [logInModal, setLogInModal] = useState(false)

    const [loadingSignUp, setLoadingSignUp] = useState(false)
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false)

    const [userDropdown, setUserDropdown] = useState(false)

    const [formAlert, setFormAlert] = useState(false)

    const [lang, setLang] = useState("en")

    const {
        login, 
        responseLogin,
        signUp,
        responseSignUp,
        logout, 
        responseLogout
    } = useAuth()

	const { updateUser, responseUpdateUser } = useUsers()

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

	const handleUpdateUser = ({lang}) => {
		if (client && client.user) {
			updateUser({defaultLanguage: lang}, client.user._id) 
		}
	}

	//useEffect(() => {
	//	if (reponseUpdateUser && responseUpdateUser.success) {
			
	//	}
	//}, [responseUpdateUser])

    const cookieKey = "VISITOR_COOKIE_TOKEN"

    //|Update data| or |Display error| from API response

    useEffect(() => {
        if (responseSignUp && loadingSignUp) {
            if (responseSignUp.success) {
                setAlert({type: "success", message: {en: t('signup-success'), fr: t('signup-success')}})
                bake_cookie(cookieKey, {session: responseSignUp.data.session, id: responseSignUp.data.user._id}, {path: "/"})
                setClient(responseSignUp.data)
                setSignUpModal(false)
                setLoadingSignUp(false)
            } else {
                setFormAlert({type: "error", message: {en: t('email-taken'), fr: t('email-taken')}})
                setLoadingSignUp(false)
            }
        }
    }, [responseSignUp])

    useEffect(() => {
        if (responseLogin && loadingLogin) {
            if (responseLogin.success) {
                setAlert({type: "success", message: {en: t('login-success'), fr: t('login-success')}})
                bake_cookie(cookieKey, {session: responseLogin.data.session, id: responseLogin.data.user._id}, {path: "/"})
                setClient(responseLogin.data)
                setLogInModal(false)
                setLoadingLogin(false)
            } else {
                setFormAlert({type: "error", message: {en: t('wrong-cred'), fr: t('wrong-cred')}})
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
            navigate('/')
        }
    }

    useEffect(() => {
        if (responseLogout && loadingLogout) {
            if (responseLogout.success) {
                setAlert({ type: "success", message: { en: t('logout-success'), fr: t('logout-success')}})
                setLoadingLogout(false)
            } else {
                setAlert({type: "error", message: {en: t('error'), fr: t('error')}})
                setLoadingLogout(false)
            }
        }
    }, [responseLogout])


    return <>
        <div className="navbar-end">
            
            <div className="navbar-item">
               
                
                <div className="buttons">
                    {!client ? <>
                        <div className="navbar-item mr-4 mb-1">
                            <a href="" className={lang === "en" ? "langchoose has-text-dark" : "langchoose"} onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("en")
                                setLang("en")
                            }}>EN</a>
                            
                            <a href="" className={lang === "fr" ? "has-text-dark" : ""} onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("fr")
                                setLang("fr")
                            }}>FR</a>
                        </div>
               
                        <button onClick={() => setSignUpModal(true)} className="button is-primary auth-btn">
                            <strong>{t('signup')}</strong>
                        </button>
                        <button onClick={() => setLogInModal(true)} className="button is-light auth-btn">
                            {t('login')}
                        </button>
                    </> : <>
                        
                            
                        <div className="dropdown is-active is-hoverable" onMouseLeave={() => setUserDropdown(!userDropdown)}>
                            <div className="dropdown-trigger">
                                <button onClick={() => setUserDropdown(!userDropdown)} onMouseEnter={() => setUserDropdown(!userDropdown)} className={"button is-primary has-text-white is-rounded "} aria-haspopup="true" aria-controls="dropdown-menu">
                                    <FontAwesomeIcon icon={faUser} size="xl"/>
                                    <FontAwesomeIcon icon={userDropdown ? faChevronUp : faChevronDown} />
                                </button>
                            </div>
                                {userDropdown ? <>
                                    <div className="dropdown-menu dropdown-user-logged is-mobile is-tablet" id="dropdown-menu" role="menu" onClick={() => setUserDropdown(!userDropdown)}>
                                    <div className="dropdown-content">
                                        <Link to="/watchlist" className="dropdown-item pl-6">
        {t('watchlist')}
                                            </Link>
                                            {/* <Link to="/history" className="dropdown-item  pl-6">
        {t('history')}
      </Link> */}

      {/* <a className="dropdown-item  pl-6">
        {t('settings')}
      </a>
      
      <a href="#" className="dropdown-item pl-6">
        {t('help')}
      </a> */}
	<div className="dropdown-item is-flex is-justify-content-center">
                            <a href="" className={lang === "en" ? "langchoose has-text-dark" : "langchoose"} onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("en")
                                setLang("en")
handleUpdateUser({lang: "en"})
                            }}>EN</a>
                            
                            <a href="" className={lang === "fr" ? "has-text-dark" : ""} onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("fr")
                                setLang("fr")
									handleUpdateUser({lang: "fr"})
                            }}>FR</a>
                        </div>
      <hr className="dropdown-divider"/>
      <button className="button is-small mt-2 is-dark" onClick={() => handleLogOut()}>
        {t('logout')}
      </button>
    </div>
  </div>
                                </> : null}
                        </div>
                            
                    </>}
                </div>
            </div>
        </div> 
        {signUpModal ? <SignUpModal isActive={signUpModal} setSignUpModal={setSignUpModal} setLogInModal={setLogInModal} handleSubmit={handleSignUp} formAlert={formAlert} setFormAlert={setFormAlert} loading={loadingSignUp}/> : null}
        {logInModal ? <LogInModal isActive={logInModal} setLogInModal={setLogInModal} setSignUpModal={setSignUpModal} handleSubmit={handleLogIn} formAlert={formAlert} setFormAlert={setFormAlert} loading={loadingLogin}/> : null}  
    </>
}

export default Auth