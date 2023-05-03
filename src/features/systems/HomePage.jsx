import React, {useState, useEffect, Fragment} from "react"

import {Link} from "react-router-dom"

import SearchBar from "../atoms/SearchBar"
import SearchResult from "./SearchResult"
import SearchItem from "../atoms/docs/SearchItem"

import {useSearch} from "../../utils/hooks/Search.js"
import {useDocs} from "../../utils/hooks/docs/Docs.js"

import { useTranslation } from "react-i18next";



const HomePage = ({client, setAlert}) => {
  const { t, i18n } = useTranslation();

  const [searchValue, setSearchValue] = useState("")
  const [result, setResult] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [page, setPage] = useState(1)
  const [popularDocs, setPopularDocs] = useState(false)
  const [displayDoc, setDisplayDoc] = useState(false)
  const [displayParent, setDisplayParent] = useState(false)

  const {
    search, 
    responseSearch
  } = useSearch()

  const { 
    findPopularDocs, 
    responseFindPopularDocs
  } = useDocs()

  useEffect(() => {
    if (responseSearch && responseSearch.success && responseSearch.data && (responseSearch.data.items[0] || responseSearch.data.docs[0] || responseSearch.data.tags[0])) {
      setResult(responseSearch.data)
      setPage(1)
      setLoadingSearch(false)
    } else if (responseSearch && !responseSearch.success) {
      setLoadingSearch(false)
      setAlert({type: "error", message: {en: t('error'), fr: t('error')}})
    } else if (responseSearch && responseSearch.data && !responseSearch.data[0]) {
      setLoadingSearch(false)
      setEmpty(true)
    }
  }, [responseSearch])
  
  const submitSearch = (e) => {
    if (!loadingSearch) {
      e.preventDefault()
      search(searchValue)
      setLoadingSearch(true)
      setDisplayDoc(false)
      setEmpty(false)
    }
  }

  if (!popularDocs) {
    findPopularDocs()
    setPopularDocs(true)
  }

  useEffect(() => {
    if (responseFindPopularDocs && responseFindPopularDocs.success && responseFindPopularDocs.data) {
      setPopularDocs(responseFindPopularDocs.data)
      console.log(popularDocs)
    }
  }, [responseFindPopularDocs])
  
  return <>
    <div>
      <div className="is-flex is-justify-content-center">
       <form className="field" onSubmit={submitSearch}>
          <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
        </form>
      </div>    
      <svg className="background-landing-ctn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f1825a" fillOpacity="0.95" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,240C672,235,768,181,864,176C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      <div className="landing-content">
          {empty ? <>{t('no-match')}</> : <>
            {loadingSearch ? <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> : (!result.docs || !result.docs[0]) ? <Landing popularDocs={popularDocs} setDisplayDoc={setDisplayDoc} setResult={setResult} t={t}/> : <SearchResult result={result} client={client} setAlert={setAlert} page={page} setPage={setPage} loadingSearch={loadingSearch} setResult={setResult} displayDoc={displayDoc} setDisplayDoc={setDisplayDoc} displayParent={displayParent} setDisplayParent={setDisplayParent} setLoading={setLoadingSearch}/>}
          </>}
          
      </div>
    </div>   
    
  </>
}

const Landing = ({popularDocs, setDisplayDoc, setResult, t}) => {

  const setDisplay = (item) => {
    setResult({docs: [item]})
    setDisplayDoc(item)
  }

  return <>
  
  <div className="container box mt-2 mb-6">
        <h1 className="title is-5">Contredanse {t('documentation-center')}</h1>
        <p className="mb-3">
          Donec gravida maximus nulla id vulputate. Fusce a dictum tortor, tincidunt molestie massa. Vivamus ac tristique mi, id interdum odio. Nullam vestibulum a libero nec blandit. Ut et aliquet diam, et tempus odio. Fusce ultrices, tortor elementum tincidunt pellentesque, urna tortor porta nisi, ac hendrerit lorem velit quis justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.      </p>
        <Link to="/about">{t('read-more')}</Link>
      </div>
      <div className="container recents-container">
        <h1 className="title is-5">{t('most-viewed')}</h1>
        <div className="columns is-multiline">
            {popularDocs && popularDocs[0] ? popularDocs.map((doc, index) => {
              return <Fragment key={JSON.stringify(doc)}>
                <SearchItem item={{doc: doc}} location="landing" setDisplay={setDisplay}/>
              </Fragment>
            }) : <div className="container mt-3 pt-4">
              <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div>
            </div>}
        </div>
      </div>
        
      {/* <div className="box">
        <h1 className="title is-5">About dOctopus</h1>
        <p className="mb-3">
          Your favorite octopus was born in the early 2022, even if it's a new born he's proud to say that he's definitely the best documents manager of the ocean. dOctopus is the result of several months of thinking about new ways to manage documents, ways that needed to be easier for both users and organisations. Ways that had to optimize each part of the process, and finally dOctopus needed to be accessible for every organisations that is struggling with managing their huge amount of documents, books, movies etc... 
        </p>
        <Link to="/tutorial">Read more ...</Link>
      </div> */}
        
    </>

}

export default HomePage