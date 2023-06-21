import React, {useState, useRef, useEffect, Fragment, useCallback} from "react"

import {Link} from "react-router-dom"

import SearchBar from "../atoms/SearchBar"
import SearchResult from "./SearchResult"
import SearchItem from "../atoms/docs/SearchItem"

import {useSearch} from "../../utils/hooks/Search.js"
import {useDocs} from "../../utils/hooks/docs/Docs.js"
import {apiFetch} from '../../utils/middlewares/apiFetch';

import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

import {useUsers} from "../../utils/hooks/Users.js"
import {useTags} from "../../utils/hooks/Tags.js"
import {useProjects} from "../../utils/hooks/Projects.js"
import {useEntities} from "../../utils/hooks/Entities.js"
import {usePeople} from "../../utils/hooks/People.js"
import { useNavigate, useParams, useLocation } from "react-router-dom";

const HomePage = ({client, setClient, setAlert, watchlist, history}) => {
  const { t, i18n } = useTranslation();

  const [searchValue, setSearchValue] = useState("")
  const [result, setResult] = useState([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [page, setPage] = useState(1)
  const [popularDocs, setPopularDocs] = useState(false)
  const [displayDoc, setDisplayDoc] = useState(false)
  const [displayParent, setDisplayParent] = useState(false)
  const [displayTag, setDisplayTag] = useState(false)
  const [filtersValue, setFiltersValue] = useState(false)
  const [filtersData, setFiltersData] = useState(false)

  const [navHistory, setNavHistory] = useState(["/"])
  let location = useLocation()
 

  useEffect(() => {
    if (location.pathname) {
      if (navHistory.indexOf(location.pathname) !== navHistory.length - 1) {
        const navHistoryFiltered = [...navHistory].filter(e => e !== location.pathname)
        setNavHistory([...navHistoryFiltered, location.pathname])
      }
    }
  }, [location.pathname, navHistory])

  const {
    search, 
    responseSearch
  } = useSearch()

  const { 
    findPopularDocs, 
    responseFindPopularDocs
  } = useDocs()
	
  const {findProjectById, responseFindProjectById} = useProjects()

  const {findEntityById, responseFindEntityById} = useEntities()

  const {findPersonById, responseFindPersonById} = usePeople()

  const {findDocByTagSlug,responseFindDocByTagSlug} = useTags()

  const {findDocById, responseFindDocById} = useDocs()

  let params = useParams()

  const submitSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!loadingSearch) {
        setLoadingSearch(true)
      search({query: searchValue, filters: filtersValue})
      if (client && client.user) {
        updateUser({history:  [...client.user.history, {query: searchValue}]}, client.user._id)
      }
      setPage(1)
      setDisplayDoc(false)
      setDisplayParent(false)
      setDisplayTag(false)
      
    }
  })

  useEffect(() => {
    if (params && params.query) {
        setSearchValue(params.query.replaceAll("-", " "))
        if (searchValue && searchValue !== "") {
          submitSearch({preventDefault: () => {}})
        }
      
    } else if (params && params.tag_slug) {
      setLoadingSearch(true)

      findDocByTagSlug(params.tag_slug)
    } else if (params && params.project_slug) {
      setLoadingSearch(true)

      findProjectById(params.project_slug)
    } else if (params && params.entity_slug) {
      setLoadingSearch(true)

      findEntityById(params.entity_slug)
    } else if (params && params.person_slug) {
      setLoadingSearch(true)

      findPersonById(params.person_slug)
    } else if (params && params.doc_slug) {
      setLoadingSearch(true)

      findDocById(params.doc_slug)
    }
    
  }, [params])

  useEffect(() => {
    if (responseFindDocByTagSlug && responseFindDocByTagSlug.success) {
      setDisplayTag(responseFindDocByTagSlug.data)
      setLoadingSearch(false)

    }
  }, [responseFindDocByTagSlug])

  useEffect(() => {
    if (responseFindProjectById && responseFindProjectById.success) {
      setDisplayParent(responseFindProjectById.data)
      setLoadingSearch(false)

    }
  }, [responseFindProjectById])

  useEffect(() => {
    if (responseFindEntityById && responseFindEntityById.success) {
      setDisplayParent(responseFindEntityById.data)
      setLoadingSearch(false)

    }
  }, [responseFindEntityById])

  useEffect(() => {
    if (responseFindPersonById && responseFindPersonById.success) {
      setDisplayParent(responseFindPersonById.data)
      setLoadingSearch(false)

    }
  }, [responseFindPersonById])

  useEffect(() => {
    if (responseFindDocById && responseFindDocById.success) {
      setDisplayDoc(responseFindDocById.data)
      setLoadingSearch(false)

    }
  }, [responseFindDocById])


	const {
		updateUser
	} = useUsers()

  useEffect(() => {
    if (loadingSearch){
      if (responseSearch && responseSearch.success && responseSearch.data && responseSearch.data !== result && (responseSearch.data.items[0] || responseSearch.data.docs[0] || responseSearch.data.tags[0])) {
        setResult(responseSearch.data)
        setPage(1)
        setEmpty(false)

        console.log('ici1', result)
      } else if (responseSearch && !responseSearch.success) {
        setLoadingSearch(false)
        console.log('ici2')
        setEmpty(false)

        setAlert({type: "error", message: {en: t('error'), fr: t('error')}})
      } else if (responseSearch && responseSearch.data && !responseSearch.data[0]) {
        setLoadingSearch(false)
        console.log('ici3')
        setEmpty(true)
      } 
    }
  }, [responseSearch.success, loadingSearch, setAlert, t])
  
  useEffect(() => {
    if (result === responseSearch.data && loadingSearch) {
      setLoadingSearch(false)
      console.log('stop loading')
    }
  }, [result])
  
  if (!popularDocs) {
    findPopularDocs()
    setPopularDocs(true)
    setLoadingSearch(true)
  }

  useEffect(() => {
    if (responseFindPopularDocs && responseFindPopularDocs.success && responseFindPopularDocs.data) {
      setPopularDocs(responseFindPopularDocs.data)
      setFiltersData(responseFindPopularDocs.appData)
      setLoadingSearch(false)
    }
  }, [responseFindPopularDocs])

    if (client && client.user && watchlist && result.docs !== client.user.watchList) {
      console.log(client.user.watchList)
      setResult({docs: client.user.watchList})
    }
  
    if (client && client.user && history && result.docs !== client.user.watchList) {
      setResult({docs: client.user.watchList})
    }

    const handleSearch = async (value) => {
      console.log('eh jzsuis la', value)
      setSearchValue(value)
      search({query: searchValue, filters: filtersValue})
      setLoadingSearch(true)
      setDisplayDoc(false)
      setDisplayParent(false)
      setEmpty(false)
    }


    const className = (!result || !result.docs || !result.docs[0]) && (!result || !result.items || !result.items[0]) && (!result || !result.tags || !result.tags[0]) && !displayDoc && !displayParent && !displayTag ? "landing" : "search"
  return <>
    <div className={className}>
      <button className="button" onClick={() => console.log((!result.docs || !result.docs[0]) && (!result.docs || !result.docs[0]))}>Btn</button>
      <div className="is-flex is-justify-content-center mb-6">
       <form className="field" onSubmit={submitSearch}>
          <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} filtersData={filtersData} setFiltersValue={setFiltersValue}/>
        </form>
      </div>    
      <div className="landing-content">
          {empty ? <>{t('no-match')}</> : <>
            {loadingSearch ? <div className="loader">
  <div className="inner one"></div>
  <div className="inner two"></div>
  <div className="inner three"></div>
</div> : (!result || !result.docs ||  !result.docs[0]) && (!result || !result.items || !result.items[0]) && (!result || !result.tags || !result.tags[0]) && !displayDoc && !displayParent && !displayTag ? <Landing popularDocs={popularDocs} setDisplayDoc={setDisplayDoc} setResult={setResult} t={t}/> : <SearchResult result={result} client={client} setClient={setClient} setAlert={setAlert} page={page} setPage={setPage} loadingSearch={loadingSearch} setResult={setResult} displayDoc={displayDoc} setDisplayDoc={setDisplayDoc} displayParent={displayParent} setDisplayParent={setDisplayParent} setLoading={setLoadingSearch} watchlist={watchlist} history={history} handleSearch={handleSearch} displayTag={displayTag} navHistory={navHistory} setNavHistory={setNavHistory} setDisplayTag={setDisplayTag}/>}
          </>}
          
      </div>
    </div>   
    
  </>
}


const Counter = ({ number }) => {
  return (
      <CountUp duration={2.1} className="counter" end={number} />
  );
}

const Landing = ({popularDocs, setDisplayDoc, setResult, t}) => {

  const setDisplay = (item) => {
    setResult({docs: [item]})
    setDisplayDoc(item)
  }

  

  return <>
  
 
      <div className="container recents-container mt-6 mb-0 pb-0">
        <h1 className="title is-4 has-text-white has-text-shadow ">{t('find-in-doctopus')}</h1>
        <div className="columns is-multiline pb-6 mb-6 mt-2">
            <div className="column is-one-fifth">
              <div className="box pt-5 smooth-appear">
                <h1 className="title is-4 mt-2"><strong className="title is-2"><Counter number={2157}/></strong> <br />{t('books')}</h1>
              </div>
            </div>
            <div className="column is-one-fifth">
              <div className="box pt-5 smooth-appear sm2">
                <h1 className="title is-4 mt-2"><strong className="title is-2"><Counter number={351}/></strong> <br />{t('periodical')}</h1>
              </div>
            </div>
            <div className="column is-one-fifth">
              <div className="box pt-5 smooth-appear sm3">
                <h1 className="title is-4 mt-2"><strong className="title is-2"><Counter number={17377}/></strong> <br />{t('articles')}</h1>
              </div>
            </div>
            <div className="column is-one-fifth">
              <div className="box pt-5 smooth-appear sm4">
                <h1 className="title is-4 mt-2"><strong className="title is-2"><Counter number={2554}/></strong> <br />{t('videos')}</h1>
              </div>
            </div>
            <div className="column is-one-fifth">
              <div className="box pt-5 smooth-appear sm5">
                <h1 className="title is-4 mt-2"><strong className="title is-2"><Counter number={472}/></strong> <br />{t('photos')}</h1>
              </div>
            </div>
        </div>
        <div className="columns is-multiline pb-0">
        {popularDocs[0] && popularDocs.map((item, index) => {

return <Fragment key={JSON.stringify(item)}>
                        <SearchItem item={{doc: item}} setDisplay={setDisplayDoc} i={index}/>
                    </Fragment>
          
        })}
      </div>
      </div>

  
        
      {/* <div className="box">
        <h1 className="title is-5">About dOctopus</h1>
        <p className="mb-3">
          Your favorite octopus was born in the early 2022, even if it's a new born he's proud to say that he's definitely the best documents manager of the ocean. dOctopus is the result of several months of thinking about new ways to manage documents, ways that needed to be easier for both users and organisations. Ways that had to optimize each part of the process, and finally dOctopus needed to be accessible for every organisations that is struggling with managing their huge amount of documents, books, movies etc... 
        </p>
        <Link to="/tutorial">Read more ...</Link>
      </div> */}
         {/* <div className="container box mt-2 mb-6">
        <h1 className="title is-5">Contredanse {t('documentation-center')}</h1>
        <p className="mb-3">
          Donec gravida maximus nulla id vulputate. Fusce a dictum tortor, tincidunt molestie massa. Vivamus ac tristique mi, id interdum odio. Nullam vestibulum a libero nec blandit. Ut et aliquet diam, et tempus odio. Fusce ultrices, tortor elementum tincidunt pellentesque, urna tortor porta nisi, ac hendrerit lorem velit quis justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.      </p>
        <Link to="/about">{t('read-more')}</Link>
      </div> */}
    </>

}

export default HomePage