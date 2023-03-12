import React, {useState, useEffect} from 'react';

//Systems
import Navbar from '../features/systems/Navbar';
import Create from '../features/systems/admin/Create';
import Dashboard from '../features/systems/admin/Dashboard';

import HomePage from "../features/systems/HomePage"
import Settings from "../features/systems/Settings"

import AboutUs from "../features/molecules/AboutUs"

//Dependencies
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Atoms
import Alert from '../features/atoms/Alert';

//hooks
import {useUsers} from "./hooks/Users"


const Router = () => {

    const [client, setClient] = useState(false) 
    const [loadingClient, setLoadingClient] = useState(false)
    const [alert, setAlert] = useState(false) 

    const cookieKey = "VISITOR_COOKIE_TOKEN"

    //Fetch Users API
    const {
        responseFindUserById,
        findUserById
    } = useUsers()

    //Check for cookies
    if (read_cookie(cookieKey).id && !client && !loadingClient) {
        findUserById(read_cookie(cookieKey).id)
        setLoadingClient(true)
    }

    //Restore session and user data from cookie
    useEffect(() => {
        if (responseFindUserById && loadingClient) {
            if (responseFindUserById.success) {
                setClient({user: responseFindUserById.data })
                setLoadingClient(false)
            } else {
                delete_cookie(cookieKey)
                setLoadingClient(false)
            }
        }
    }, [responseFindUserById, loadingClient])


    return <div className="is-fullheight app-ctn">
        <BrowserRouter>
        <Navbar bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
            <div className="page-content">
                 {alert ? <>
            <div className="columns is-flex is-justify-content-end mt-6 appAlert">
                <div className="column is-three-quarters-mobile is-two-thirds-tablet is-one-third-desktop">
                    <Alert alertType={alert.type} message={alert.message} setAlert={setAlert} />
                </div>
            </div>        
        </> : null}
            <div className="content">
                <Routes>
            <Route path="/">
              <Route index element={<HomePage client={client} setAlert={setAlert}/>}/>
                {client && client.user && client.user.type === "admin" ? <>
                    <Route path="/admin/create" element={<Create client={client} setAlert={setAlert} />} />
                    <Route path="/admin/dashboard" element={<Dashboard client={client} setAlert={setAlert} />}/>                 
                    <Route path="/admin/settings" element={<Settings client={client} setClient={setClient} setAlert={setAlert} />} />
                </> : null}
                <Route path="/about" element={<AboutUs/>}/>
                <Route path="*" element={<>
                    <div className="container">
                        <div className="is-flex is-justify-content-center">
                            <img src="/404.png" className="image404" alt="Error 404, page not found" />   
                            
                        </div>
                        <h1 className="title is-4 mt-0 mb-1">This page doesn't exist...</h1>
                        <a href="/"><strong>Back to homepage</strong></a>
                    </div>
                </>} />
            </Route>
            </Routes>
        </div>
        <a href="https://oqto.tech" className='mr-3 border-top'><p className="has-text-grey has-text-left title is-7">powered by <span className="is-6 has-text-primary">dOctopus</span></p></a>

        <footer className="footer box footer-app">
            <div className="content">
                <div className="columns">
                        <div className="column has-text-right">
                        <a href="https://oqto.tech">OQTO Tech</a>
                            <p className="is-size-7 mb-0 mt-1">© 2023 - dOctopus, Document Manager</p>
                            <a className="is-size-7 mt-0" href="https://oqto.tech">https://oqto.tech</a>
                        </div>  
                        <div className="column has-text-centered">
                            
                            Contredanse
                            <p className="is-size-7 mb-0 mt-1">© 2023 - All data rights reserved</p>
                            <a className="is-size-7 mt-0" href="https://contredanse.org">https://contredanse.org</a>
                        </div>  
                        <div className="column has-text-left">
                            Contact
                            <p className="is-size-7 mb-0 mt-1"><a className="is-size-7 mt-0" href="mailto:centrededoc@contredanse.org">centrededoc@contredanse.org</a></p>
                            <p className="is-size-7 mb-0 mt-1"><a className="is-size-7 mt-0" href="mailto:contact@oqto.tech">contact@oqto.tech</a></p>
                        </div>  
                </div>
            </div>
        </footer>
       </div>
        </BrowserRouter>
    </div>
}

export default Router;