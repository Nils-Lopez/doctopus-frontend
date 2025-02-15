import React, { Fragment, useEffect, useState } from "react"
import SearchItem from "../docs/SearchItem"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { useNavigate, useLocation } from 'react-router-dom';
import JsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

const Watchlist = ({ docs, client, setDisplayDoc, setHideWatchlist, readOnly }) => {

  const [dataList, setDataList] = useState([])
  const [page, setPage] = useState(1)
  const [pdfDl, setPdfDl] = useState(false)

  let navigate = useNavigate();
  const location = useLocation();

  const handleDisplay = (doc) => {
    navigate('/document/' + doc._id)
  }

  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (page === 1) {
      setDataList(docs.slice(0, 20))
    } else {
      setDataList(docs.slice((page * 10), ((page * 10) + 20)))
    }
  }, [page])

  const additionalInfo = doc => doc.supports && doc.supports[0] ? (doc.supports[0].exemplaries && doc.supports[0].exemplaries[0] ? doc.supports[0].exemplaries[0].cote ? doc.supports[0].exemplaries[0].cote : doc.supports[0].exemplaries[0].position ? doc.supports[0].exemplaries[0].position : doc.supports[0].exemplaries[0].location ? doc.supports[0].exemplaries[0].location : null : null) : ""

  const [displayTable, setDisplayTable] = useState("none")

  const exportPDF = async () => {
    const reportElement = document.querySelector('#report');
    
    // Show the element before capturing
    reportElement.style.display = 'block';
    
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      logging: true,
      width: 1123, // A4 landscape width at 96 DPI
      height: 794  // A4 landscape height at 96 DPI
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new JsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('watchlist.pdf');
    
    // Hide the element after capturing
    reportElement.style.display = 'none';
  };

  const removeFromWatchlist = async (doc) => {
    setDataList(dataList.filter(d => d._id !== doc._id))
  }

  const rels = doc => {
    if (doc.parents && doc.parents.length > 0) {
      let value = false
      doc.parents.forEach((parent, i) => {
        if (parent.parent_doc && parent.parent_doc.length > 0) {
          value = "/document/" + parent.parent_doc
        }
      })
      return value
    } else {
      return false
    }
  }

  const getQRCodeUrl = () => {
    const currentUrl = window.location.origin + location.pathname;
    return currentUrl.replace("watchlist", "admin_watchlist/" + client.user._id);
  };

  console.log(getQRCodeUrl())

  console.log("DOC:  ", docs[docs.length - 1])

  return (
    <div className="container" id="watchlist-table">
      <div className="is-flex is-justify-content-space-between mb-3">
        <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1"><small>{t('watchlist')}:</small></h3>
        <button onClick={exportPDF} className="button is-primary" type="button"><span><FontAwesomeIcon icon={faDownload} /> <span className="ml-3">{t('download')}</span></span></button>
      </div>
     {!readOnly ?  <div className="columns is-multiline">
        {dataList.map((doc, i) => {
          return <Fragment key={JSON.stringify(doc)}>
            <SearchItem item={{ doc: doc }} setDisplay={handleDisplay} watchlist={true} client={client} removeFromWatchlist={removeFromWatchlist} />
          </Fragment>
        })}
      </div> : null}
      
      {/* Visible report preview */}
      <div className="container py-5 px-5" id="report" style={{ 
        width: '1123px',  // A4 landscape width
        height: '794px',  // A4 landscape height
        backgroundColor: 'white',
        padding: '40px',
        boxSizing: 'border-box',
        display: readOnly ? 'block' : 'none'  // Always show in readonly mode
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h2 className="title is-3 has-text-left" style={{ marginBottom: '20px' }}>Favoris</h2>
          <div style={{ marginBottom: '20px', width: 'fit-content' }}>
            <QRCodeCanvas 
              value={getQRCodeUrl()} 
              size={128}
              level="H"
              includeMargin={true}
            />
          </div>
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <table className="table is-fullwidth is-striped" style={{ 
              width: '100%', 
              fontSize: '10pt',
              tableLayout: 'fixed',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr>
                  <td className="title is-5 has-text-left has-text-primary px-2" style={{ width: '35%' }}>{t('title')}</td>
                  <td className="title is-5 has-text-left has-text-primary px-2" style={{ width: '20%' }}>{t('copies')}</td>
                  <td className="title is-5 has-text-left has-text-primary px-2" style={{ width: '25%' }}>{t('Issue de')}</td>
                  <td className="title is-5 has-text-left has-text-primary px-2" style={{ width: '20%' }}>{t('type')}</td>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc._id} className="has-background-white-ter">
                    <td className="has-text-left py-2 px-2" style={{ 
                      border: "1px solid lightgrey",
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      verticalAlign: 'top'
                    }}>
                      {doc.title}
                    </td>
                    <td className="has-text-left py-2 px-2" style={{ 
                      border: "1px solid lightgrey",
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      verticalAlign: 'top'
                    }}>
                      {additionalInfo(doc)}
                    </td>
                    <td className="has-text-left py-2 px-2" style={{ 
                      border: "1px solid lightgrey",
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      verticalAlign: 'top'
                    }}>
                      {rels(doc) && <a href={rels(doc)}>{rels(doc)}</a>}
                    </td>
                    <td className="has-text-left py-2 px-2" style={{ 
                      border: "1px solid lightgrey",
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      verticalAlign: 'top'
                    }}>
                      {doc.types[0]?.title[0].content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const getContent = (value, lang = "en") => {
  if (value) {
    return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
  } else {
    return "Error"
  }
}

export default Watchlist