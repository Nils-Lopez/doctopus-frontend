import React, { useEffect, useState } from "react";

import TemplatesForm from "../molecules/Settings/TemplatesForm"
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faBook, faFile, faSitemap, faGears, faUserAstronaut, faBookAtlas } from "@fortawesome/free-solid-svg-icons";
import DocumentsDash from "../molecules/Settings/DocumentsDash";
import { useDashboard } from "../../utils/hooks/Dashboard";
import RolesDash from "../molecules/Settings/RolesDash";
import VisitorsDash from "../molecules/Settings/VisitorsDash";
import ApplicationDash from "../molecules/Settings/ApplicationDash";

const Settings = ({client, setClient, setAlert, applicationSettings, setApplicationSettings}) => {
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState("documents")

    const classNames = (p) => {
      if (p === page) return "panel-block is-active has-text-primary"
      else return "panel-block is-active"
    }

    const {getDocsStat, responseDocsStat, getVisitorsStat, responseVisitorsStat} = useDashboard()

    const [docStatistics, setDocStatistics] = useState(false)
    const [docStatBox, setDocStatBox] = useState(0)
    const [visitorsStatistics, setVisitorsStatistics] = useState(false)
    
    useEffect(() => {
      if (!docStatistics) {
        getDocsStat()
      }
    }, [docStatistics])

    useEffect(() => {
      if (responseDocsStat && responseDocsStat.success) {
        setDocStatistics(responseDocsStat.data)
      }
    }, [responseDocsStat])

    useEffect(() => {
      if (!visitorsStatistics) {
        getVisitorsStat()
      }
    }, [visitorsStatistics])

    useEffect(() => {
      if (responseVisitorsStat && responseVisitorsStat.success) {
        setVisitorsStatistics(responseVisitorsStat.data)
      }
    }, [responseVisitorsStat])

    useEffect(() => {
        setTimeout(() => {
          setDocStatBox(docStatBox === 3 ? 0 : docStatBox+1)
        }, 4000)
    }, [docStatBox])

    return <>
        <div className="columns mx-2 mt-5 overflow-hidden">
            <div className="column is-one-quarter template-fixed mt-5 ">
                <div className="is-fixed">
                <div className="panel is-grey has-background-white">
                    <a className={classNames('documents')} onClick={() => setPage("documents")}>
                      <span className="panel-icon">
                        
                        <FontAwesomeIcon icon={faBook}/>
                      </span>
                      {t('documents')}
                    </a>
                   
  <a className={classNames('roles')}  onClick={() => setPage("roles")}>
    <span className="panel-icon">
    <FontAwesomeIcon icon={faArchive}/>
    </span>
    {t('roles')}/{t('types')}/{t('tags')}
  </a>
  <a className={classNames('visitors')}  onClick={() => setPage("visitors")}>
    <span className="panel-icon">
    <FontAwesomeIcon icon={faUserAstronaut}/>
    </span>
    {t('visitors')}
  </a>
                        <a className={classNames('models')}  onClick={() => setPage("models")}>
    <span className="panel-icon">
    <FontAwesomeIcon icon={faFile}/>    </span>
    {t('models')}
  </a>
  {(client && client.user && client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <a className={classNames('application')}  onClick={() => setPage("application")}>
    <span className="panel-icon">
    <FontAwesomeIcon icon={faGears}/>    </span>
    {t('application')}
  </a> : null}
 
                    </div>
              <div className="box pt-3 pb-2">
                <h1 className="title has-text-primary is-1">
                  <FontAwesomeIcon icon={faUserAstronaut} className="mb-1"/>&nbsp; {docStatBox === 0 ? visitorsStatistics.total : docStatBox === 1 ? visitorsStatistics.lastYear : 
                  docStatBox === 2 ? visitorsStatistics.lastMonth : visitorsStatistics.today}
                </h1>
                <h3 className="subtitle has-text-grey">
                  {t('visitors')} <br />
                  {docStatBox === 0 ? t('total') : docStatBox === 1 ? t("this-year").toLowerCase() : 
                  docStatBox === 2 ? t('this-month').toLowerCase() : t('today')}
                </h3>
              </div>
              <div className="box pt-3 pb-2">
                <h1 className="title has-text-primary is-1">
                  <FontAwesomeIcon icon={faBookAtlas} className="mb-1"/>&nbsp;
                  {docStatBox === 0 ? docStatistics.total : docStatBox === 1 ? docStatistics.lastYear : 
                  docStatBox === 2 ? docStatistics.lastMonth : docStatistics.todayDocs}
                </h1>
                <h3 className="subtitle has-text-grey">
                  {t('created-docs')} <br />
                  {docStatBox === 0 ? "" : docStatBox === 1 ? t("this-year").toLowerCase() : 
                  docStatBox === 2 ? t('this-month').toLowerCase() : t('today')}
                </h3>
              </div>
                </div>
            </div>
            <div className="column  settings-scrollable mt-5">
                <div className="box overflow-hidden">
                  {page === "models" ? <TemplatesForm setAlert={setAlert} setClient={setClient} client={client}/> :
                  page === "visitors" ? <>
                    <VisitorsDash/>
                  </> : 
                  page === "application" && (client && client.user && client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? <>
                    <ApplicationDash applicationSettings={applicationSettings} setApplicationSettings={setApplicationSettings}/>
                  </> :
                  page === "roles" ? <>
                    <RolesDash/>
                  </> :
                  <>
                    <DocumentsDash/>
                  </>}
                </div>
            </div>
        </div>
    </>
}

export default Settings