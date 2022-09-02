import React, {useState} from 'react';
import Auth from './Auth';


const Navbar = ({bake_cookie, read_cookie, delete_cookie, client, setClient, setAlert}) => {

    const [hamburger, setHamburger] = useState(false)

    return <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a href="#" className="navbar-item">
                    <h2 className="title">dOctopus</h2>
                </a>

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
                    <a href="#" className="navbar-item">
                        Home
                    </a>

                    <a href="#" className="navbar-item">
                        Documentation
                    </a>
                </div>

                <Auth bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
                
            </div>
        </nav>
    </>
}

export default Navbar