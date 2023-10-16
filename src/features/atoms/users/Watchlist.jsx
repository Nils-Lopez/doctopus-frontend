import React, {Fragment, useEffect, useState} from "react"

import SearchItem from "../docs/SearchItem"
import {useTranslation} from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom';
import JsPDF from 'jspdf';

const Watchlist = ({docs, setDisplayDoc, setHideWatchlist}) => {

    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)
    const [pdfDl, setPdfDl] = useState(false)

    let navigate = useNavigate();

    const handleDisplay = (doc) => {
      navigate('/document/' + doc._id)


        
    }
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (page === 1) {
            setDataList(docs.slice(0, 20))
        } else {
            setDataList(docs.slice((page*10), ((page*10)+20)))
        }
    }, [page])

    const additionalInfo = doc => doc.supports && doc.supports[0] ? (doc.supports[0].exemplaries && doc.supports[0].exemplaries[0] ? doc.supports[0].exemplaries[0].cote ? doc.supports[0].exemplaries[0].cote : doc.supports[0].exemplaries[0].position ? doc.supports[0].exemplaries[0].position: doc.supports[0].exemplaries[0].location ? doc.supports[0].exemplaries[0].location : null : null ) : ""



    const [displayTable, setDisplayTable] = useState("none")

    const exportPDF = () => {
      const report = new JsPDF('portrait','pt','a4');
      setDisplayTable("block")
      report.html(document.querySelector('#report')).then(() => {
          report.save('watchlist.pdf')
          setDisplayTable('none')
      })
    }

    return <div className="container"id="watchlist-table">
        <div className="is-flex is-justify-content-space-between mb-3">
        <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1"><small>{t('watchlist')}:</small></h3>
        <button onClick={exportPDF} className="button tag is-medium is-primary" type="button"><FontAwesomeIcon icon={faDownload}/> <span className="ml-3">{t('download')}</span></button>
        
        </div>
        <div className="columns is-multiline">
            {dataList.map((doc, i) => {
                return <Fragment key={JSON.stringify(doc)}>
                    <SearchItem item={{doc: doc}} setDisplay={handleDisplay} watchlist={true}/>
                </Fragment>
            })}
        </div>
       <div className="container py-5 px-5 ml-5 " id="report" style={{display: displayTable}}>
        <h2 className="title is-3 ml-2 has-text-left">Watchlist</h2>
        <table className="ml-4">
        <thead>
          <tr>
            <td className=" title is-5 has-text-left has-text-primary px-0 mb-3">{t('title')}</td>
            <td className="title is-5 has-text-left has-text-primary px-0 mb-3">{t('copies')}</td>
          </tr>
        </thead>
            <tbody>
               {docs.map((doc) => <>
                  <tr className="has-background-white-ter " style={{letterSpacing: "2px"}}>
                  <td className="subtitle is-6 has-text-left py-3 px-2 " style={{ border: "1px solid lightgrey"}}>{doc.title.length >= 30 ? doc.title.slice(0, 25) + "..." : doc.title}</td>
                  <td className="has-text-left py-3 px-2 ml-5" style={{ border: "1px solid lightgrey"}}>{additionalInfo(doc) && additionalInfo(doc).length > 15 ? additionalInfo(doc).slice(0, 15) +"..." : additionalInfo(doc)}</td>
                  </tr>
               </>)}
               
            </tbody>
            
       </table>
       </div>
        
    </div>
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}


export default Watchlist