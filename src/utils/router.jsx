import React, { useState, useEffect } from "react";

//Systems
import Navbar from "../features/systems/Navbar";
import Create from "../features/systems/admin/Create";
import Dashboard from "../features/systems/admin/Dashboard";

import HomePage from "../features/systems/HomePage";
import Settings from "../features/systems/Settings";

import StaticPage from "../features/systems/StaticPage";

//Dependencies
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Atoms
import Alert from "../features/atoms/Alert";

//hooks
import { useUsers } from "./hooks/Users";
import { useTranslation } from "react-i18next";

const Router = ({ applicationSettings, setApplicationSettings, bgCreds }) => {
  const [client, setClient] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [alert, setAlert] = useState(false);
  const { t, i18n } = useTranslation();
  const [signUpModal, setSignUpModal] = useState(false);

  const cookieKey = "VISITOR_COOKIE_TOKEN";

  //Fetch Users API
  const { responseFindUserById, findUserById } = useUsers();

  //Check for cookies
  if (read_cookie(cookieKey).id && !client && !loadingClient) {
    findUserById(read_cookie(cookieKey).id);
    setLoadingClient(true);
  }

  //Restore session and user data from cookie
  useEffect(() => {
    if (responseFindUserById && loadingClient) {
      if (responseFindUserById.success && responseFindUserById.data) {
        setClient({ user: responseFindUserById.data });
        setLoadingClient(false);
        i18n.changeLanguage(responseFindUserById.data.defaultLanguage);
      } else {
        delete_cookie(cookieKey);
        setLoadingClient(false);
      }
    }
  }, [responseFindUserById, loadingClient]);
  console.log('applicationSettings', applicationSettings)
  return (
    <div className="app-ctn">
      <BrowserRouter>
        <Navbar
          bake_cookie={bake_cookie}
          read_cookie={read_cookie}
          delete_cookie={delete_cookie}
          client={client}
          setClient={setClient}
          setAlert={setAlert}
          applicationSettings={applicationSettings}
          signUpModal={signUpModal}
          setSignUpModal={setSignUpModal}
          bgCreds={bgCreds}
        />
        <div className="page-content">
          {alert ? (
            <>
              <div className="columns is-flex is-justify-content-end mt-6 appAlert">
                <div className="column is-three-quarters-mobile is-two-thirds-tablet is-one-third-desktop">
                  <Alert
                    alertType={alert.type}
                    message={alert.message}
                    setAlert={setAlert}
                  />
                </div>
              </div>
            </>
          ) : null}
          <div className={applicationSettings && applicationSettings.backgroundUrls && applicationSettings.backgroundUrls[0] ? "content" : "content bg-color"}>
            <Routes>
              <Route path="/">
                <Route
                  path="/"
                  element={
                    <HomePage
                      client={client}
                      setClient={setClient}
                      watchlist={false}
                      setAlert={setAlert}
                      applicationSettings={applicationSettings}
                    />
                  }
                />
                <Route path="/search">
                  <Route
                    path=":query"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                <Route path="/category">
                  <Route
                    path=":category"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                <Route path="/person">
                  <Route
                    path=":person_slug"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                <Route path="/project">
                  <Route
                    path=":project_slug"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                <Route path="/document">
                  <Route
                    path=":doc_slug"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                        setSignUpModal={setSignUpModal}
                      />
                    }
                  />
                </Route>
                <Route path="/entity">
                  <Route
                    path=":entity_slug"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                
                <Route
                  path="/production/:prod_id"
                  element={
                    <HomePage
                      client={client}
                      setClient={setClient}
                      watchlist={false}
                      setAlert={setAlert}
                      applicationSettings={applicationSettings}
                    />
                  }
                />
                <Route path="/tag">
                  <Route
                    path=":tag_slug"
                    element={
                      <HomePage
                        client={client}
                        setClient={setClient}
                        watchlist={false}
                        setAlert={setAlert}
                        applicationSettings={applicationSettings}
                      />
                    }
                  />
                </Route>
                {client &&
                client.user &&
                (client.user.type === "admin" ||
                  client.user.type === "moderator" ||
                  client.user.type ===
                    "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
                  <>
                    <Route
                      path="/admin/create"
                      element={
                        <Create
                          client={client}
                          setClient={setClient}
                          setAlert={setAlert}
                          applicationSettings={applicationSettings}
                        />
                      }
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <Dashboard
                          client={client}
                          setAlert={setAlert}
                          applicationSettings={applicationSettings}
                        />
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <Settings
                          client={client}
                          setClient={setClient}
                          setAlert={setAlert}
                          applicationSettings={applicationSettings}
                          setApplicationSettings={setApplicationSettings}
                        />
                      }
                    />
                  </>
                ) : null}
                <Route
                  path="/watchlist"
                  element={
                    <HomePage
                      client={client}
                      setClient={setClient}
                      setAlert={setAlert}
                      applicationSettings={applicationSettings}
                      watchlist={true}
                    />
                  }
                />
                <Route
                  path="/history"
                  element={
                    <HomePage
                      client={client}
                      setClient={setClient}
                      setAlert={setAlert}
                      applicationSettings={applicationSettings}
                      history={true}
                    />
                  }
                />

                <Route
                  path="/pages/:name"
                  element={
                    <StaticPage applicationSettings={applicationSettings} />
                  }
                />
                <Route
                  path="*"
                  element={
                    <>
                      <div className="container">
                        <div className="is-flex is-justify-content-center">
                          <img
                            src="/404.png"
                            className="image404"
                            alt="Error 404, page not found"
                          />
                        </div>
                        <h1 className="title is-4 mt-0 mb-1">
                          This page doesn't exist...
                        </h1>
                        <a href="/">
                          <strong>Back to homepage</strong>
                        </a>
                      </div>
                    </>
                  }
                />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default Router;
