import React, {Fragment, useState, useEffect} from 'react';

import SearchItem from "../atoms/docs/SearchItem"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'


const SearchResult = ({result, client, setAlert, page, setPage, loadingSearch, setResult}) => {

    const [dataList, setDataList] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        if (page === 1) {
            setDataList(result.items.slice(0, 20))
        } else if (page === 2) {
            setDataList(result.items.slice(20, 40))
        } else {
            setDataList(result.items.slice(40, 60))
        }
    }, [page])

    if (tags !== result.tags) {
        setTags(result.tags)
    }

    const handleBack = () => {
        if (page === 1) {
            setResult([])
        } else {
            setPage(page - 1)
        }
    }

    return <>
        <div className="container pb-6">
        <div className="is-flex is-justify-content-start mt-0 mb-0 pb-0 pt-0" id="backBtn">
            <button className="button is-light" onClick={handleBack}>
            <FontAwesomeIcon icon={faRotateLeft} size="l"/>
        <strong>&nbsp;Back</strong>
            </button>
        </div>
        {tags && tags[0] ? <>
            <h3 className="subtitle has-text-right is-5 has-text-grey mt-0 pt-0 mb-4">Tags</h3>
                {tags[4] ? <div className="is-flex is-justify-content-space-around">
                        {tags.map((item, index) => {
                            return <Fragment key={JSON.stringify(item)}>
                                <span className="tag is-big is-info is-medium">{item.tag.title && item.tag.title[0] ? getContent(item.tag.title) : null}</span>
                            </Fragment>
                        })}
                    </div> : <div className="is-flex is-justify-content-end">
                        {tags.map((item, index) => {
                            return <Fragment key={JSON.stringify(item)}>
                                <span className="tag is-big is-info is-medium ml-3 ">{item.tag.title && item.tag.title[0] ? getContent(item.tag.title) : null}</span>
                            </Fragment>
                        })}
                    </div> }     
                </> : null}
                <hr className='mb-3 mt-4'/>
                <h3 className="subtitle has-text-right is-5 has-text-grey mt-1 mb-3">Result</h3>

            <div className="columns is-multiline">
            
                {dataList.map((item, index) => {
                    if (index < 20) {
                        return <Fragment key={JSON.stringify(item)}>
                            <BoxItem item={item}/>
                        </Fragment>
                    }
                })}
                
            </div>
            {!loadingSearch && result.items && result.items.length > 20 ? <div className="is-flex is-justify-content-end ">
                <nav className="pagination" role="navigation" aria-label="pagination">
              
              <ul className="pagination-list">
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 1 ? "is-current" : "")} aria-label="Page 1" aria-current="page" onClick={() => setPage(1)}>1</a>
                </li>
                <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 2 ? "is-current" : "")} aria-label="Goto page 2" onClick={() => setPage(2)}>2</a>
                </li>
                {result.items.length > 40 ? <li>
                  <a href="#searchBlock" className={"pagination-link " + (page === 3 ? "is-current" : "")} aria-label="Goto page 3" onClick={() => setPage(3)}>3</a>
                </li> : null}
              </ul>
            </nav>
          </div> : null}
            
        </div>
    </>
}

const BoxItem = ({item}) => {
    if (item.project) {
        return <div className="column is-one-quarter">
            <div className="box results-col ">
            <div className="is-flex is-justify-content-end mb-0 mt-0">
                    <span className="tag is-primary">
                        Project
                    </span>
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.project.title}</h3>
                <p>{item.project.description && item.project.description[0] && getContent(item.project.description) ? getContent(item.project.description).substring(0,25) + "..." : null}</p>
                
            </div>
        </div>
    } else if (item.person) {
        if (item.person.productions)
        return <div className="column is-one-quarter">
            <div className="box results-col ">
            <div className="is-flex is-justify-content-end mt-0 mb-0 tag-bottom">
                    <span className="tag is-primary">
                        Person
                    </span>
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.person.name !== "" ? item.person.name : item.person.firstName + " " + item.person.lastName}</h3>
                <span className='has-text-grey'><small>{item.person.country && item.person.country[0] ? getContent(item.person.country[0].labels) + (item.person.city ? ", " : "") : null}{item.person.city}</small></span>
                <p>{item.person.description && item.person.description[0] ? getContent(item.person.description).substring(0,20) + "..." : null}</p>
                {item.person.productions && item.person.productions[0] ? <>
                    <hr />
                    <div className="is-flex is-justify-content-start mb-2">
                        <span className="subtitle is-7 has-text-left mb-0"><strong>Documents: </strong></span>
                    </div>
                    <div className="is-flex is-justify-content-start ">
                        <div className="mt-0">
                        {item.person.productions.map((prod, i) => {
                            if (i < 2) {
                                return prod.docs.map((doc) => {
                                    return <Fragment key={JSON.stringify(doc)}>
                                        <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{doc.title.slice(0,20) + "..."}</span>
                                    </Fragment>
                                })
                            }
                        })}
                        {item.person.productions.length > 2 ? <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.person.productions.length -2} more...</span> : null}
                        </div>
                    </div>
                </> : null}
                
            </div>
        </div>
    } else if (item.entity) {
        return <div className="column is-one-quarter">
            <div className="box results-col ">
            <div className="is-flex is-justify-content-end mt-0 mb-0">
                    <span className="tag is-primary">
                        Organisation
                    </span>
                </div>
                <h3 className="subtitle is-5 mb-1 mt-1">{item.entity.name}</h3>
                <span className='has-text-grey'><small>{item.entity.country ? item.entity.country + ", " : null}{item.entity.city}</small></span>
                <p>{item.entity.description && item.entity.description[0] ? getContent(item.entity.description).substring(0,20) + "..." : null}</p>
                
            </div>
        </div>
    } else if (item.doc) {
        return <SearchItem item={item}/>
    }
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default SearchResult