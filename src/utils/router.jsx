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
import { useTranslation } from "react-i18next";


const Router = () => {

    const [client, setClient] = useState(false) 
    const [loadingClient, setLoadingClient] = useState(false)
    const [alert, setAlert] = useState(false) 
    const { t, i18n } = useTranslation();

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
                console.log(responseFindUserById.data)
                setClient({user: responseFindUserById.data })
                setLoadingClient(false)
                i18n.changeLanguage(responseFindUserById.data.defaultLanguage)
            } else {
                delete_cookie(cookieKey)
                setLoadingClient(false)
            }
        }
    }, [responseFindUserById, loadingClient])


    return <div className="app-ctn">
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
              <Route index element={<HomePage client={client} setClient={setClient} watchlist={false} setAlert={setAlert}/>}/>
                {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <>
                    <Route path="/admin/create" element={<Create client={client} setAlert={setAlert} />} />
                    <Route path="/admin/dashboard" element={<Dashboard client={client} setAlert={setAlert} />}/>                 
                    <Route path="/admin/settings" element={<Settings client={client} setClient={setClient} setAlert={setAlert} />} />
                </> : null}
                <Route path="/watchlist" element={<HomePage client={client} setClient={setClient} setAlert={setAlert} watchlist={true}/>}/>
                <Route path="/history" element={<HomePage client={client} setClient={setClient} setAlert={setAlert} history={true}/>}/>

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