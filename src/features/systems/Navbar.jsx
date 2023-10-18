import React, {Fragment, useState} from 'react';
import Auth from './Auth';
import Admin from './Admin';
import {Link} from "react-router-dom"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import logoOrange from "../../logo-cyan.png"
import { useTranslation } from "react-i18next";

const Navbar = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert, applicationSettings, signUpModal, setSignUpModal}) => {

    const [hamburger, setHamburger] = useState(false)
    const { t, i18n } = useTranslation();

    const getContent = (value, lang) => {
        if (value) {
          return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
        } else {
          return "Error"
        }
    }

    

    return <>
        <nav className="navbar has-shadow pt-0 pb-0 is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">         
                <div className="navbar-item">
                    <a href="/" className="mt-1"><img src={applicationSettings?.global?.logo ? applicationSettings?.global?.logo  : logoOrange} className="lg-navbar"/></a>
                    <h2 className="title is-4 mt-2 mb-1 ml-2 mr-2 title-nav has-text-left">
                        <strong>{applicationSettings?.global?.title[0] ? getContent(applicationSettings?.global?.title, i18n.language)  : t('documentation-center')}</strong> 
                        <br />                     
                        <span className="subtitle is-6 mt-0 mb-1 mr-2 has-text-grey has-text-left  is-family-primary  desktop-only">{applicationSettings?.global?.tagline[0] ? getContent(applicationSettings?.global?.tagline, i18n.language)  : t('of-contredanse')}</span>
                    </h2>
                </div>   
                <button onClick={() => {
                    if (hamburger) {
                        setHamburger(false)
                    } else {
                        setHamburger(true)
                    }
                }} className={"navbar-burger " + (hamburger ? "is-active" : "")} aria-label="menu" aria-expanded={hamburger ? "true" : "false"} data-target="navbar">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div id="navbar" className={"navbar-menu " + (hamburger ? "is-active" : "")}>
                <div className="navbar-start">
                  <div className="navbar-item">
                    <Link to="/"><p className="has-text-primary"><strong>{t('home')}</strong></p></Link>
                  </div>
                    {applicationSettings?.staticPages?.map((page) => {
                        return <Fragment key={JSON.stringify(page)}>
                            <div className="navbar-item">
                                <Link to={"/pages/" + page.title[0].content.toLowerCase().replaceAll(' ', '-')}><p className="has-text-primary"><strong>{getContent(page.title, i18n.language)}</strong></p></Link>
                            </div>
                        </Fragment>
                    })}
                  
            {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ?
              <Admin />
              : null}
                </div>
                
                

               
                <Auth bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} signUpModal={signUpModal} setSignUpModal={setSignUpModal}/>
                
                
                
            </div>
            <a href="https://doctopus.app" className='mr-3 poweredBy is-hidden-tablet-only'><p className="has-text-grey has-text-left title is-7 tag is-white">powered by&nbsp;<span className="is-6 has-text-primary">dOctopus</span></p></a>

        </nav>
    </>
}

export default Navbar