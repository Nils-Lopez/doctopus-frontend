import React, {Fragment, useEffect, useState} from "react"

import SearchItem from "../docs/SearchItem"
import {useTranslation} from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom';

import jsPDF from "jspdf";
import "jspdf-autotable";
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


    const exportPDF = () => {
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape
  
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
  
      doc.setFontSize(15);
  
      const title = "My dOctopus Watchlist";
      const headers = [["Document", "Info"]];
      const additionalInfo = doc => doc.supports && doc.supports[0] ? (doc.supports[0].exemplaries && doc.supports[0].exemplaries[0] ? doc.supports[0].exemplaries[0].cote ? doc.supports[0].exemplaries[0].cote : doc.supports[0].exemplaries[0].position ? doc.supports[0].exemplaries[0].position: doc.supports[0].exemplaries[0].location ? doc.supports[0].exemplaries[0].location : null : null ) : ""

      const data = docs.map(elt=> {
        let title = elt.title.length <= 25 ? elt.title.slice(0, 25) + "..." : elt.title
        let more = additionalInfo(elt)
        return [title, more]
      });
  
      let content = {
        startY: 50,
        head: headers,
        body: data
      };
  
      doc.text(title, marginLeft, 40);
      doc.autoTable(content);
      doc.save("Watchlist-doctopus.pdf")
    }


    return <div className="container"id="watchlist-table">
        <div className="is-flex is-justify-content-space-between mb-3">
        <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1"><small>{t('watchlist')}:</small></h3>
        <button onClick={exportPDF} className="button tag is-medium is-primary" type="button"><FontAwesomeIcon icon={faDownload}/> <span className="ml-3">{t('download')}</span></button>

        </div>
        <div className="columns is-multiline" >
            {dataList.map((doc, i) => {
                return <Fragment key={JSON.stringify(doc)}>
                    <SearchItem item={{doc: doc}} setDisplay={handleDisplay} watchlist={true}/>
                </Fragment>
            })}
        </div>
       <nav className="column is-two-thirds panel mt-4 pT-0 pb-2" id="pdf-watchlist" style={{display: pdfDl ? "block" : "none"}}>
  <p className="panel-heading mb-0">
    {t('watchlist')}
  </p> 
  
</nav>
        {docs && docs.length > 20 ? <div className="is-flex is-justify-content-end ">
                <nav className="pagination" role="navigation" aria-label="pagination">
              
              <ul className="pagination-list">
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 1 ? "is-current" : "")} aria-label="Page 1" aria-current="page" onClick={() => setPage(1)}>1</a>
                </li>
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 2 ? "is-current" : "")} aria-label="Goto page 2" onClick={() => setPage(2)}>2</a>
                </li>
                {docs.length > 40 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 3 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(3)}>3</a>
                </li> : null}
                {docs.length > 60 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 4 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(4)}>4</a>
                </li> : null}
                {docs.length > 80 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 5 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(5)}>5</a>
                </li> : null}
              </ul>
            </nav>
          </div> : null}
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