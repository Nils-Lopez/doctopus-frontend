import React, {Fragment} from "react";

const SearchItem = ({item, setDisplay, handleSearchTag, location = "index"}) => {
    const colClasses = location !== "index" ? "is-one-third" : "is-one-quarter"
    console.log("item : ", item)
    return <div className={"column " + colClasses}>
            <div className="box results-col " onClick={() => setDisplay(item.doc)}>
            <div className="is-flex is-justify-content-end mt-0 mb-0">
                    <span className="tag is-primary">
                        Doc
                    </span>
                </div>
            <h3 className="subtitle is-5 mb-1 mt-1">{item.doc.title}</h3>
                <p>{item.doc.description && item.doc.description[0] ? getContent(item.doc.description).substring(0,20) + "..." : null}</p>
                {item.doc.supports[0] && ((item.doc.supports[0].pages && item.doc.supports[0].pages !== "") || (item.doc.supports[0].volume && item.doc.supports[0].volume !== "") || (item.doc.supports[0].number && item.doc.supports[0].number !== "")) ? <>
                    <hr />
              
                    <div className="is-flex is-justify-content-start">
                    <div>
                        {item.doc.supports.map((support) => {
                            return <Fragment key={JSON.stringify(support)}>
                                {support.pages && support.pages !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{support.pages} {support.pages.charAt(0) * 2 && support.pages.charAt(support.pages.length -1) * 2 ? "pages" : null}</span>
                                </> : support.volume && support.volume !== "" ? <> 
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">Vol. {support.volume}</span>
                                </> : support.number && support.number !== "" ? <> 
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">Number {support.number}</span>
                                </> : null}
                                {support.date && support.date !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{support.date}</span>
                                </> : null}
                            </Fragment>
                        })}
                        </div>
                    </div>
                </> : null}

                {item.doc.tags[0] ? <>
                    <hr />
         
                    <div className="is-flex is-justify-content-space-around">
                        {item.doc.tags.map((tag, i) => {
                            let title = getContent(tag.title)
                            if (i < 2 && title !== "" && title !== " ") {
                                return <Fragment key={JSON.stringify(tag)}>
                                <span className="tag is-info is-small mb-2 indextag" onClick={() => handleSearchTag(tag)}>{title && title.length >= 14 ? title.slice(0, 14) + ".." : title}</span>
                               
                            </Fragment>
                            }
                        })}
                    </div>
                </> : null}
        
            </div>
        </div>
}

const getContent = (value, lang = "fr") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default SearchItem