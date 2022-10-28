import React, {useState} from 'react';
import Auth from './Auth';
import Admin from './Admin';
import {Link} from "react-router-dom"


  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const Navbar = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert}) => {

    const [hamburger, setHamburger] = useState(false)

    return <>
        <nav className="navbar has-shadow mb-1" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">         
                <div className="navbar-item">
                  <Link to="/"><p className="has-text-dark">dOctopus</p></Link>
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
                    <Link to="/"><p className="has-text-primary">Home</p></Link>
                  </div>
                    
                  
            {client && client.user && client.user.type === "admin" ? 
                  <Admin />
              : <>
              <div className="navbar-item">
                    <Link to="/tuto"><p className="has-text-primary">Tutorial</p></Link>
                  </div>
                  
                  <div className="navbar-item">
                    <Link to="/about"><p className="has-text-primary">About dOctopus</p></Link>
                  </div>
                  
                  <div className="navbar-item">
                    <Link to="/contact"><p className="has-text-primary">Contact us</p></Link>
            </div>
              </>}
                </div>
                
                
                
                <Auth bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
                
                
                
            </div>
        </nav>
    </>
}

export default Navbar