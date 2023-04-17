import React, {Fragment} from "react"

import SearchItem from "../docs/SearchItem"
import {useTranslation} from "react-i18next"

const Show = ({docs, tag, setDisplayDoc, handleSearchTag}) => {

    const handleDisplay = (doc) => {
        handleSearchTag(false)
        setDisplayDoc(doc)
    }
    const { t, i18n } = useTranslation()

    return <>
        <h3 className="subtitle  is-5 has-text-grey mt-0 pt-0 mb-1"><small>{t('tag')}:</small></h3>
        <h3 className="subtitle is-4 has-text-grey mt-0 pt-0 mb-4"><strong className="has-text-primary">{getContent(tag.title, i18n.language)}</strong></h3>
        <div className="columns is-multiline">
            {docs.map((doc, i) => {
                return <Fragment key={JSON.stringify(doc)}>
                    <SearchItem item={{doc: doc}} setDisplay={handleDisplay}/>
                </Fragment>
            })}
        </div>
    </>
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Show