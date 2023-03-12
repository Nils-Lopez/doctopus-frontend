import React, {Fragment} from "react";

const Show = ({doc}) => {
    const {
        title,
        description,
        languages,
        types,
        supports,
        parents,
        tags,
      } = doc

    return <>
        <h1>{title}</h1>
        {description && description[0] ? <p>{getContent(description)}</p> : null}
        {languages && languages[0] ? <p>{getContent(languages[0].labels)}</p> : null}
        {types && types[0] ? <>
            {types.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-primary mr-1 ml-1">
                        {getContent(type.title)}
                    </span>
                </Fragment>
            })}
        </> : null}
        {tags && tags[0] ? <>
            {tags.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-info mr-1 ml-1">
                        {getContent(type.title)}
                    </span>
                </Fragment>
            })}
        </> : null}

    </>
}

const getContent = (value, lang = "en") => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
}

export default Show;