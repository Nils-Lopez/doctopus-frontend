import React, {useState} from 'react';
import Auth from './Auth';
import Admin from './Admin';
import {Link} from "react-router-dom"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import logoOrange from "../../logo-cyan.png"
import { useTranslation } from "react-i18next";

const Navbar = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert}) => {

    const [hamburger, setHamburger] = useState(false)
    const { t, i18n } = useTranslation();

    return <>
        <nav className="navbar has-shadow pt-0 pb-0 is-fixed-top" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">         
                <div className="navbar-item">
                    <a href="https://contredanse.org" className="mt-1"><img src={logoOrange} className="lg-navbar"/></a>
                    <h2 className="title is-4 mt-0 mb-1 ml-2 mr-2"><strong>{t('documentation-center')}</strong></h2>
                    <h3 className="subtitle is-6 mt-0 mb-1 ml-2 mr-2 has-text-grey tagline">{t('of-contredanse')}</h3>
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
            
                  <div className="navbar-item">
                    <Link to="/about"><p className="has-text-primary"><strong>{t('about')}</strong></p></Link>
                  </div>
                  
                  
                    {/* <div className="navbar-item">
                        <Link to="/contact"><p className="has-text-primary"><strong>Contact us</strong></p></Link>
                    </div>   */}
            {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ?
              <Admin />
              : null}
                </div>
                
                

               
                <Auth bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
                
                
                
            </div>
            <a href="https://doctopus.app" className='mr-3 poweredBy '><p className="has-text-grey has-text-left title is-7 tag is-white">powered by&nbsp;<span className="is-6 has-text-primary">dOctopus</span></p></a>

        </nav>
    </>
}

export default Navbar