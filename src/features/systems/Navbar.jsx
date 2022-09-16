import React, {useState} from 'react';
import Auth from './Auth';
import Admin from './Admin';
import {Link} from "react-router-dom"

const Navbar = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert}) => {

    const [hamburger, setHamburger] = useState(false)

    return <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">         
                <div className="navbar-item">
                  <Link to="/">dOctopus</Link>
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
                    <Link to="/">Home</Link>
                  </div>
                    
                  <div className="navbar-item">
                    <Link to="/tuto">Tutorial</Link>
                  </div>
                  
                  <div className="navbar-item">
                    <Link to="/about">About dOctopus</Link>
                  </div>
                  
                  <div className="navbar-item">
                    <Link to="/contact">Contact us</Link>
                  </div>
                </div>
                
                {"client.admin" === "client.admin" ? 
                  <Admin />
                 : null}
                
                <Auth bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
                
                
                
            </div>
        </nav>
    </>
}

export default Navbar