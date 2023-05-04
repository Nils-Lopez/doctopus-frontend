import React, {Fragment, useState, useEffect} from 'react';

import SearchItem from "../atoms/docs/SearchItem"
import SearchItemParent from "../atoms/parents/SearchItem"
import ShowTag from "../atoms/tags/Show"
import ShowDoc from "../atoms/docs/Show"
import ShowParent from "../atoms/parents/Show"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'

import {useTags} from "../../utils/hooks/Tags"
import {useProjects} from "../../utils/hooks/Projects"
import {useEntities} from "../../utils/hooks/Entities"
import {usePeople} from "../../utils/hooks/People"
import {useDocs} from "../../utils/hooks/docs/Docs"

import { useTranslation } from "react-i18next";

const SearchResult = ({result, client, setAlert, page, setPage, loadingSearch, setResult, displayDoc, setDisplayDoc, setDisplayParent, displayParent}) => {

    const [dataList, setDataList] = useState([])
    const [tags, setTags] = useState([])

    const [searchTags, setSearchTags] = useState(false)
    const [searchTagsLoading, setSearchTagsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
   


    const { t, i18n } = useTranslation();


    useEffect(() => {
        if (page === 1) {
            setDataList(result.docs.slice(0, 20))
        } else if (page === 2) {
            setDataList(result.docs.slice(20, 40))
        } else {
            setDataList(result.docs.slice(40, 60))
        }
    }, [page])

    if (tags !== result.tags) {
        setTags(result.tags)
    }

    const handleBack = () => {
        if (searchTags) {
            setSearchTags(false)
        } else if (displayParent) {
          setDisplayParent(false)
        } else if (displayDoc) {
            if (dataList.length === 1) {
                setDisplayDoc(false)
                setResult({})
            } else {
                setDisplayDoc(false)
            }
        } else if (page === 1) {
            setResult({})
        } else  {
            setPage(page - 1)
        }
    }

    const {
        findDocByTag,
        responseFindDocByTag
    } = useTags()
    
    const handleSearchTag = (tag) => {
        if (!searchTagsLoading) {
            setSearchTags({tag: tag})
            setSearchTagsLoading(true)
            findDocByTag(tag._id)
        }
    }


    useEffect(() => {
        if (searchTagsLoading && responseFindDocByTag && responseFindDocByTag.data && responseFindDocByTag.data[0] && responseFindDocByTag.success) {
            setSearchTagsLoading(false)

            setSearchTags({docs: responseFindDocByTag.data, tag: searchTags.tag})
        } else if(searchTagsLoading) {
            setSearchTagsLoading(false)

            setAlert({type: "error", message: {en: t('empty-tag'), fr: t('empty-tag')}})
        }
    }, [responseFindDocByTag])

    const {findProjectById, responseFindProjectById} = useProjects()

    const {findEntityById, responseFindEntityById} = useEntities()

    const {findPersonById, responseFindPersonById} = usePeople()

    const handleSearchParent = (parent) => {
      console.log('ici broski : ', parent)
        if (parent.entities) {
            findProjectById(parent._id)
            setLoading(true)
        } else if (parent.createdDocs) {
            findEntityById(parent._id)    
            setLoading(true)
        } else {
            findPersonById(parent._id)
            setLoading(true)
        }
    }

    useEffect(() => {
      if (loading) {
        if (responseFindProjectById && responseFindProjectById.success) {
          setDisplayParent(responseFindProjectById.data)
          setLoading(false)
        } else {
          setLoading(false)
        }  
      }
    }, [responseFindProjectById])
    
        useEffect(() => {
      if (loading) {
        if (responseFindEntityById && responseFindEntityById.success) {
          setDisplayParent(responseFindEntityById.data)
          setLoading(false)
        } else {
          setLoading(false)
        }  
      }
    }, [responseFindEntityById])
    
     useEffect(() => {
      if (loading) {
        if (responseFindPersonById && responseFindPersonById.success) {
          setDisplayParent(responseFindPersonById.data)
          setLoading(false)
        } else {
          setLoading(false)
        }  
      }
    }, [responseFindPersonById])
    
      
    const {findDocById, responseFindDocById} = useDocs()
    
    const handleSearchDoc = (doc) => {
      findDocById(doc.id)
      setLoading(true)
    }
    
    useEffect(() => {
      if (loading) {
        if (responseFindDocById && responseFindDocById.success) {
          setDisplayDoc(responseFindDocById.data)
          setLoading(false)
        } else {
          setLoading(false)
        }  
      }
    }, [responseFindDocById])

    return loading || searchTagsLoading ? <div className="loader">
    <div className="inner one"></div>
    <div className="inner two"></div>
    <div className="inner three"></div>
  </div> : <>
    <div className="container pb-6">
        <div className="is-flex is-justify-content-start mt-0 mb-0 pb-0 pt-0" id="backBtn">
            <button className="button is-light" onClick={handleBack}>
                <FontAwesomeIcon icon={faRotateLeft} size="lg"/>
                <strong>&nbsp;{t('back')}</strong>
            </button>
        </div>
        {searchTags.docs ? <>
            <ShowTag docs={searchTags.docs} tag={searchTags.tag} setDisplayDoc={setDisplayDoc} handleSearchTag={setSearchTags}/>
        </> : displayParent ? <> 
            <ShowParent parent={displayParent} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
        </> : displayDoc ? <>
            <ShowDoc doc={displayDoc} handleSearchTag={handleSearchTag} handleSearchParent={handleSearchParent} handleSearchDoc={handleSearchDoc}/>
        </> : <>
        {tags && tags[0] ? <>
        <h3 className="subtitle has-text-right is-5 has-text-grey mt-0 pt-0 mb-4">{t('tags')}</h3>
            {tags[4] ? <div className="is-flex is-justify-content-space-around">
                    {tags.map((item, index) => {
                        return <Fragment key={JSON.stringify(item)}>
                            <span className="tag is-big is-info is-medium indextag" onClick={() => handleSearchTag(item.tag)}>{item.tag.title && item.tag.title[0] ? getContent(item.tag.title, i18n.language) : null}</span>
                        </Fragment>
                    })}
                </div> : <div className="is-flex is-justify-content-end">
                    {tags.map((item, index) => {
                        return <Fragment key={JSON.stringify(item)}>
                            <span className="tag is-big is-info is-medium ml-3 indextag" onClick={() => handleSearchTag(item.tag)}>{item.tag.title && item.tag.title[0] ? getContent(item.tag.title, i18n.language) : null}</span>
                        </Fragment>
                    })}
                </div> }     
            </> : null}
            {page === 1 && result.items && result.items[0] ? <>
                <hr className='mb-3 mt-4'/>
            <h3 className="subtitle has-text-right is-5 has-text-grey mt-1 mb-3">{t('result')}</h3>

        <div className="columns is-multiline">
        
            {result.items && result.items[0] && result.items.map((item) => {
                return <Fragment key={JSON.stringify(item)}>
                    <SearchItemParent item={item} handleSearchParent={handleSearchParent}/>
                </Fragment>
            })}
            
        </div>
            </> : null}
        <hr className='mb-3 mt-4'/>
            <h3 className="subtitle has-text-right is-5 has-text-grey mt-1 mb-3">Documents</h3>

        <div className="columns is-multiline">
        
            {dataList.map((item, index) => {
                if (index < 20) {
                    return <Fragment key={JSON.stringify(item)}>
                        <SearchItem item={item} setDisplay={setDisplayDoc} handleSearchTag={handleSearchTag} />
                    </Fragment>
                }
            })}
            
        </div>
        {!loadingSearch && result.docs && result.docs.length > 20 ? <div className="is-flex is-justify-content-end ">
            <nav className="pagination" role="navigation" aria-label="pagination">
          
          <ul className="pagination-list">
            <li>
              <a href="#searchBlock" className={"pagination-link " + (page === 1 ? "is-current" : "")} aria-label="Page 1" aria-current="page" onClick={() => setPage(1)}>1</a>
            </li>
            <li>
              <a href="#searchBlock" className={"pagination-link " + (page === 2 ? "is-current" : "")} aria-label="Goto page 2" onClick={() => setPage(2)}>2</a>
            </li>
            {result.docs.length > 40 ? <li>
              <a href="#searchBlock" className={"pagination-link " + (page === 3 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(3)}>3</a>
            </li> : null}
          </ul>
        </nav>
      </div> : null}
        </>}
        
    </div>
</>
}


const getContent = (value, lang = "fr") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default SearchResult