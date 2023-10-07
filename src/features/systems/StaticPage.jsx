import React, {Fragment} from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
} 

const StaticPage = ({applicationSettings}) => {
    let params = useParams()
    const { t, i18n } = useTranslation();

    const page = applicationSettings.staticPages.filter((p) => {
        if (p.title[0].content.toLowerCase().replaceAll(' ', '-') === params.name) return p
    })[0]

    const Components = {paragraph, title}

    return <>
        <div className="container pt-6 mt-4 no-overflow">
            {page.components?.map((component) => {
                const ComponentType = Components[component.type]
                return <ComponentType content={component.content} i18n={i18n}/>
            })}
       </div>
    </>
}

const paragraph = ({content, i18n}) => {
    const string = getContent(content, i18n.language)
    const words = string.split(' ')
    const text = []
    words.map((word) => {
        if (word.includes('mailto:')) {
            text.push(<br/>)
            text.push(<><a href={word}>{word.replaceAll('mailto:', '')}</a></>)
        }
        else if (word === "<br/>") text.push(<br/>)
        else if (word.includes('https://') || word.includes('www.')) {
            text.push(<br/>)
            text.push(<a href={word}>{word}</a>)
        }
        else text.push(word)
    })
    return <div className='mt-4 p-3'>
        {string.includes('mailto:') || string.includes('<br/>') || string.includes('https://') || string.includes('www.') ? <>
            {text.map((word) => <Fragment key={word}>
                {word}&nbsp;
            </Fragment>)}
        </> : <p>{string}</p>}
    </div>
}

const title = ({content, i18n}) => {
    return <>
        <h1 className='title is-4'>{getContent(content, i18n.language)}</h1>
    </>
}

export default StaticPage