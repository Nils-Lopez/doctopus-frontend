import React, {Fragment, useEffect, useState} from "react"

import SearchItem from "../docs/SearchItem"
import {useTranslation} from "react-i18next"

const Watchlist = ({docs, setDisplayDoc, setDisplayWatchlist}) => {

    const [dataList, setDataList] = useState([])
    const [page, setPage] = useState(1)

    const handleDisplay = (doc) => {
setDisplayWatchlist(false)
        setDisplayDoc(doc)
    }
    const { t, i18n } = useTranslation()

    useEffect(() => {
        if (page === 1) {
            setDataList(docs.slice(0, 20))
        } else {
            setDataList(docs.slice((page*10), ((page*10)+20)))
        }
    }, [page])

    return <>
        <h3 className="subtitle  is-5 has-text-grey mt-0 pt-0 mb-1"><small>{t('watchlist')}:</small></h3>

        <div className="columns is-multiline">
            {dataList.map((doc, i) => {
                return <Fragment key={JSON.stringify(doc)}>
                    <SearchItem item={{doc: doc}} setDisplay={handleDisplay}/>
                </Fragment>
            })}
        </div>
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
    </>
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Watchlist