import React, {Fragment} from "react";
import {useTranslation} from "react-i18next"


const SearchItem = ({item, setDisplay, handleSearchTag, location = "index", handleSearchDoc = "false", relTypes, client}) => {
    const colClasses = location !== "index" ? "is-one-third" : "is-one-quarter"

    const { t, i18n } = useTranslation() 

    return <div className={"column " + colClasses}>
            <div className="box results-col " onClick={() => {
                   
                if (handleSearchDoc !== "false") {
                    console.log('ici : ', item.doc)
                    handleSearchDoc(item.doc)
                } else {
                    setDisplay(item.doc)
                }
            }}>
            {!relTypes ? <div className="is-flex is-justify-content-end mt-0 mb-0">
                    <span className="tag is-primary">
                        {item.doc.types && item.doc.types[0] ? getContent(item.doc.types[0].title, i18n.language) : t('document')}
                    </span>
                </div> : <div className="is-flex is-justify-content-space-between mt-0 mb-0">
                    <span className="tag is-info">
                        {getContent(relTypes.title, i18n.language)}
                    </span>
                    <span className="tag is-primary">
                        {item.doc.types && item.doc.types[0] ? getContent(item.doc.types[0].title, i18n.language) : t('document')}
                    </span>
                </div>}
            <h3 className="subtitle is-5 mb-1 mt-1">{item.doc.title}</h3>
                <p>{item.doc.description && item.doc.description[0] ? getContent(item.doc.description, i18n.language).substring(0,20) + "..." : null}</p>
               
                    
                     <hr/>
                    <div className="is-flex is-justify-content-start">
                    <div>
    
                                {item.doc.pages && item.doc.pages !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{!(item.doc.pages.charAt(0) * 2 && item.doc.pages.charAt(item.doc.pages.length -1) * 2) ? "Pages : " : null}  {item.doc.pages} {item.doc.pages.charAt(0) * 2 && item.doc.pages.charAt(item.doc.pages.length -1) * 2 ? "pages" : null}</span>
                                </> : item.doc.volume && item.doc.volume !== "" ? <> 
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{t('volume')} {item.doc.volume}</span>
                                </> : item.doc.number && item.doc.number !== "" ? <> 
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{t('number')} {item.doc.number}</span>
                                </> : null}
                                {item.doc.date && item.doc.date !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.doc.date} </span>
                                </> : null}
                                {item.doc.publishedAt && item.doc.publishedAt !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.doc.publishedAt} </span>
                                </> : null}
                               
                                {item.doc.duration && item.doc.duration !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.doc.duration} </span>
                                </> : null}
                                {item.doc.additionalCopyrights && item.doc.additionalCopyrights !== "" ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{t('credits')}: {item.doc.additionalCopyrights} </span>
                                </> : null}
                                {client && client.user && (client.user.type === "admin" || client.user.type === "moderator" || client.user.type === "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? item.doc.views && item.doc.views !== "" && item.doc.views !== null ? <>
                                    <span className="tag is-light is-small is-flex is-justify-content-start mb-2">{item.doc.views} {t("views")}</span>
                                </> : null : null}
                                
                        </div>
                    </div>


                {item.doc.tags && item.doc.tags[0] ? <>
                    <hr />
         
                    <div className="is-flex is-justify-content-space-around">
                        {item.doc.tags.map((tag, i) => {
                            let title = getContent(tag.title, i18n.language)
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