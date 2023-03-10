import React, {useState, useEffect} from "react"

import {Link} from "react-router-dom"

import SearchBar from "../atoms/SearchBar"

import {useSearch} from "../../utils/hooks/Search.js"

import SearchResult from "./SearchResult"

import loader from "../../octopus2gif.gif"

const HomePage = ({client, setAlert}) => {
  
  const [searchValue, setSearchValue] = useState("")
  const [result, setResult] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [page, setPage] = useState(1)


  const {
    search, 
    responseSearch
  } = useSearch()

  useEffect(() => {
    if (responseSearch && responseSearch.success && responseSearch.data && responseSearch.data.items[0]) {
      setResult(responseSearch.data)
      setLoadingSearch(false)
    } else if (responseSearch && !responseSearch.success) {
      setLoadingSearch(false)
      setAlert({type: "error", message: {en: "An error occured.", fr: "Une erreure est survenue."}})
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
      setEmpty(false)
    }
  }
  
  return <>
    <div>
      <div className="is-flex is-justify-content-center">
       <form className="field" onSubmit={submitSearch}>
          <SearchBar searchValue={searchValue} setSearchValue={setSearchValue}/>
        </form>
      </div>    
      <svg className="background-landing-ctn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f1825a" fillOpacity="0.95" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,240C672,235,768,181,864,176C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      <div className="landing-content">
          {empty ? <>No match were found with your query, try something else ...</> : <>
            {loadingSearch ? <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> : (!result.items || !result.items[0]) ? <Landing/> : <SearchResult result={result} client={client} setAlert={setAlert} page={page} setPage={setPage} loadingSearch={loadingSearch}/>}
          </>}
          
      </div>
    </div>   
    
  </>
}

const Landing = ({}) => {
  return <>
  
  <div className="container box mt-2 mb-6">
        <h1 className="title is-5">Contredanse Documentation Center</h1>
        <p className="mb-3">
          Donec gravida maximus nulla id vulputate. Fusce a dictum tortor, tincidunt molestie massa. Vivamus ac tristique mi, id interdum odio. Nullam vestibulum a libero nec blandit. Ut et aliquet diam, et tempus odio. Fusce ultrices, tortor elementum tincidunt pellentesque, urna tortor porta nisi, ac hendrerit lorem velit quis justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.      </p>
        <Link to="/contredanse">Read more ...</Link>
      </div>
  <div className="container recents-container">
        <h1 className="title is-5">Recents</h1>
        <div className="columns">
          <div className="column">
            <div className="card">
              Latest POST tsbbb
            </div>
          </div>
          <div className="column">
            <div className="card">
              numéro 2 
            </div>
          </div>
          <div className="column">
            <div className="card">
              number 3
            </div>
          </div>
        </div>
        </div>
        <div className="container mt-6">
          <h1 className="title is-5">Favorites</h1>
        <div className="columns">
          <div className="column">
            <div className="card">
              Latest POST tsbbb
            </div>
          </div>
          <div className="column">
            <div className="card">
              numéro 2 
            </div>
          </div>
          <div className="column">
            <div className="card">
              number 3
            </div>
          </div>
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