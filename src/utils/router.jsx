import React, {useState, useEffect} from 'react';

//Systems
import Navbar from '../features/systems/Navbar';
import Create from '../features/systems/admin/Create';

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
        responseFindById,
        findById
    } = useUsers()

    //Check for cookies
    if (read_cookie(cookieKey).id && !client && !loadingClient) {
        findById(read_cookie(cookieKey).id)
        setLoadingClient(true)
    }

    //Restore session and user data from cookie
    useEffect(() => {
        if (responseFindById && loadingClient) {
            if (responseFindById.success) {
                setClient(responseFindById.data)
                setLoadingClient(false)
            } else {
                delete_cookie(cookieKey)
                setLoadingClient(false)
            }
        }
    }, [responseFindById, loadingClient])

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
        
          <Routes>
            <Route path="/">
              <Route index element={<>TRQL DRR</>}/>
              <Route path="/admin/create" element={<Create client={client} setAlert={setAlert}/>}/>
              <Route path="/admin/dashboard" element={<>Dashboard</>}/>                 
              <Route path="/admin/settings" element={<>Settings</>}/>
                                          
              <Route path="*" element={<>404 t duper</>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </>
}

export default Router;