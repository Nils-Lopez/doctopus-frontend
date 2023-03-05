import React, {Fragment, useState, useEffect} from 'react';

const SearchResult = ({result, client, setAlert, page}) => {

    const [dataList, setDataList] = useState([])

    useEffect(() => {
        if (page === 1) {
            setDataList(result.slice(0, 20))
        } else if (page === 2) {
            setDataList(result.slice(20, 40))
        } else {
            setDataList(result.slice(40, 60))
        }
    }, [page])

    return <>
        <div className="container pb-6">
            <div className="columns is-multiline">
                {dataList.map((item, index) => {
                    if (index < 20) {
                        return <Fragment key={JSON.stringify(item)}>
                            <BoxItem item={item} />
                        </Fragment>
                    }
                })}
                
            </div>
        </div>
    </>
}

const BoxItem = ({item}) => {
    if (item.tag) {
        return <div className="column is-one-quarter">
            <div className="box">
                <h3 className="subtitle is-5 mb-1">{item.tag.title && item.tag.title[0] ? getContent(item.tag.title) : null}</h3>
                <p>{item.tag.description && item.tag.description[0] ? getContent(item.tag.description).substring(0,25) + "..." : null}</p>
                <div className="is-flex is-justify-content-end">
                    <span className="tag">
                        Tag
                    </span>
                </div>
            </div>
        </div>
    } else if (item.project) {
        return <div className="column is-one-quarter">
            <div className="box">
                <h3 className="subtitle is-5 mb-1">{item.project.title}</h3>
                <p>{item.project.description && item.project.description[0] ? getContent(item.project.description).substring(0,25) + "..." : null}</p>
                <div className="is-flex is-justify-content-end">
                    <span className="tag">
                        Project
                    </span>
                </div>
            </div>
        </div>
    } else if (item.person) {
        return <div className="column is-one-quarter">
            <div className="box">
                <h3 className="subtitle is-5 mb-1">{item.person.name !== "" ? item.person.name : item.person.firstName + " " + item.person.lastName}</h3>
                <span className='has-text-grey'><small>{item.person.country && item.person.country[0] ? getContent(item.person.country[0].labels) + (item.person.city ? ", " : "") : null}{item.person.city}</small></span>
                <p>{item.person.description && item.person.description[0] ? getContent(item.person.description[0]).content.substring(0,20) + "..." : null}</p>
                <div className="is-flex is-justify-content-end">
                    <span className="tag">
                        Person
                    </span>
                </div>
            </div>
        </div>
    } else if (item.entity) {
        return <div className="column is-one-quarter">
            <div className="box">
                <h3 className="subtitle is-5 mb-1">{item.entity.name}</h3>
                <span className='has-text-grey'><small>{item.entity.country ? item.entity.country + ", " : null}{item.entity.city}</small></span>
                <p>{item.entity.description && item.entity.description[0] ? getContent(item.entity.description).content.substring(0,20) + "..." : null}</p>
                <div className="is-flex is-justify-content-end mt-1">
                    <span className="tag">
                        Organisation
                    </span>
                </div>
            </div>
        </div>
    } else if (item.doc) {
        return <div className="column is-one-quarter">
            <div className="box">
            <h3 className="subtitle is-5 mb-1">{item.doc.title}</h3>
                {/* <span className='is-flex is-justify-content-start has-text-grey'><small>{item.doc.country ? item.entity.country + ", " : null}{item.entity.city}</small></span> */}
                <p>{item.doc.description && item.doc.description[0] ? getContent(item.doc.description).substring(0,20) + "..." : null}</p>
            <div className="is-flex is-justify-content-end">
                    <span className="tag">
                        Doc
                    </span>
                </div>
            </div>
        </div>
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