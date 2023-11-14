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

    const [lang, setLang] = useState("fr")

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

    useEffect(() => {
        if (lang && client && client.user) {
            handleUpdateUser({lang})
        }
    }, [lang])

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
    }, [responseLogin, loadingLogin])

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
                            
                            {lang === "en" ? <>
                               <a className="langLink" onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("fr")
                                setLang("fr")
                            }}>
                                <small>
                                    Français
                                </small>    
                            </a> 
                            </> : <>
                                <a className="langLink" onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("en")
                                setLang("en")
                            }}>
                                <small>
                                    English
                                </small>    
                            </a>
                            </>}
                        </div>
 <button onClick={() => setLogInModal(true)} className="button is-light auth-btn">
                            <span>
                                <strong>{t('login')}</strong>
                            </span>
                        </button>
               
                        <button onClick={() => setSignUpModal(true)} className="button is-primary auth-btn">
                            <span>
                                 <strong>{t('signup')}</strong>
                            </span>
                        </button>
                       
                    </> : <>
                        <div className="mobile-auth-menu">
                             <Link to="/watchlist" className="navbar-item ">
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

	 
                            <div className="mt--05">
                                {lang === "en" ? <>
                               <a className='navbar-item' onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("fr")
                                setLang("fr")
                            }}>
                                    Français
                                
                            </a> 
                            </> : <>
                                <a className='navbar-item' onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("en")
                                setLang("en")
                            }}>
                                    English
                            </a>
                            </>}
                            </div>
      <div className=" navbar-item  pb-05 mb-0 mt-3 mb-0 pb-0"><button className="button is-small  is-light" onClick={() => handleLogOut()}>
        <span>{t('logout')}</span>
      </button></div>
                        </div>
                            
                        <div className="dropdown is-active is-hoverable" onMouseLeave={() => setUserDropdown(false)}>
                            <div className="dropdown-trigger">
                                <button onClick={() => setUserDropdown(!userDropdown)} onMouseEnter={() => setUserDropdown(!userDropdown)} className={"button is-primary has-text-white px-5 "} aria-haspopup="true" aria-controls="dropdown-menu">
                                    <span>
                                        <FontAwesomeIcon icon={faUser} size="xl"/>
                                    <FontAwesomeIcon icon={userDropdown ? faChevronUp : faChevronDown} />
                                    </span>
                                </button>
                            </div>
                                {userDropdown ? <>
                                    <div className="dropdown-menu pb-0 pr--1 left-0 dropdown-user-logged is-mobile is-tablet" id="dropdown-menu" role="menu" onClick={() => setUserDropdown(!userDropdown)}>
                                    <div className="dropdown-content pb-0">
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

	 
                            <div className="mt--05">
                                {lang === "en" ? <>
                               <a className='dropdown-item pl-6' onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("fr")
                                setLang("fr")
                            }}>
                                    Français
                                
                            </a> 
                            </> : <>
                                <a className='dropdown-item pl-6' onClick={(e) => {
                                e.preventDefault()
                                i18n.changeLanguage("en")
                                setLang("en")
                            }}>
                                    English
                            </a>
                            </>}
                            </div>
      <div className="is-flex is-justify-content-end mr-3 pb-05 mb-0 mt-3"><button className="button is-small  is-light" onClick={() => handleLogOut()}>
        <span>{t('logout')}</span>
      </button></div>
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