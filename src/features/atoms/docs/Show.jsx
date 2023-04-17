import React, {Fragment} from "react";
import {useTranslation} from "react-i18next"

const Show = ({doc, handleSearchTag}) => {
    const {
        title,
        description,
        languages,
        types,
        supports,
        parents,
        tags,
      } = doc

    const { t, i18n } = useTranslation() 
    return <>
        <h1>{title}</h1>
        {description && description[0] ? <p>{getContent(description, i18n.language)}</p> : null}
        {languages && languages[0] ? <p>{getContent(languages[0].labels, i18n.language)}</p> : null}
        {types && types[0] ? <>
            {types.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-primary mr-1 ml-1">
                        {getContent(type.title,i18n.language)}
                    </span>
                </Fragment>
            })}
        </> : null}
        {tags && tags[0] ? <>
            {tags.map((type) => {
                let title = getContent(type.title, i18n.language)
                if (title !== "" && title !== " ") {
                    return <Fragment key={JSON.stringify(type)}>
                        <span className="tag is-medium is-info mr-1 ml-1 mt-1 indextag" onClick={() => handleSearchTag(type)}>
                            {title && title.length >= 14 ? title.slice(0, 14) + ".." : title}
                        </span>
                    </Fragment>
                }
            })}
        </> : null}
        {doc.views ? <></> : 1 }
    </>
}

const getContent = (value, lang = "fr") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Show;