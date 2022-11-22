import React, {useState, useEffect} from 'react';

//Systems
import Navbar from '../features/systems/Navbar';
import Create from '../features/systems/admin/Create';
import Dashboard from '../features/systems/admin/Dashboard';

import HomePage from "../features/systems/HomePage"
import Settings from "../features/systems/Settings"

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


    return <>
        <BrowserRouter>
        <Navbar bake_cookie={bake_cookie} read_cookie={read_cookie} delete_cookie={delete_cookie} client={client} setClient={setClient} setAlert={setAlert} />
        {alert ? <>
            <div className="columns is-flex is-justify-content-center mr-1 mt-3">
                <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop">
                    <Alert alertType={alert.type} message={alert.message} setAlert={setAlert} />
                </div>
            </div>        
        </> : null}
            <div className="content">
                <Routes>
            <Route path="/">
              <Route index element={<HomePage/>}/>
                {client && client.user && client.user.type === "admin" ? <>
                    <Route path="/admin/create" element={<Create client={client} setAlert={setAlert} />} />
                    <Route path="/admin/dashboard" element={<Dashboard client={client} setAlert={setAlert} />}/>                 
                    <Route path="/admin/settings" element={<Settings client={client} setClient={setClient} setAlert={setAlert} />} />
                </> : null}
                                          
                <Route path="*" element={<>
                    <div className="container">
                        <div className="is-flex is-justify-content-center">
                            <img src="/404.png" className="image404" alt="Error 404, page not found" />   
                        </div>
                    </div>
                </>} />
            </Route>
            </Routes>
        </div>
        <footer className="footer box footer-app">
            <div className="content">
                <div className="columns">
                        <div className="column has-text-right">
                            Contredanse
                        </div>  
                        <div className="column has-text-centered">
                            dOctopus by <a href="https://oqto.tech">OQTO Tech   </a>
                        </div>  
                        <div className="column has-text-left">
                            Contact
                        </div>  
                </div>
            </div>
        </footer>
        </BrowserRouter>
    </>
}

export default Router;