import React, {Fragment} from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import image from'../../visu_centrededoc_apropos.png';

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
        <div className="container mt-7 no-overflow box has-background-white has-text-left">
            {page.components?.map((component, i) => {
                const ComponentType = Components[component.type]
                if (i < 3) {
                    return <ComponentType content={component.content} i18n={i18n}/>
                }
            })}
            <div className="columns mt-2">
                <div className="column is-8">
                    {page.components?.map((component, i) => {
                        const ComponentType = Components[component.type]
                        if (i >= 3 && i < 14) {
                            return <ComponentType content={component.content} i18n={i18n}/>
                        }
                    })}
                </div>
                {page && page._id !== "67af54384c03f60444dfe812" && <div className="column is-flex is-justify-content-end">
                    <img src={image} alt="" style={{maxHeight: "660px"}}/>
                </div>}
            </div>
            {page.components?.map((component, i) => {
                const ComponentType = Components[component.type]
                if (i >= 14) {
                    return <ComponentType content={component.content} i18n={i18n}/>
                }
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
            text.push(<><a href={word} className='logolink'>{word.replaceAll('mailto:', '')}</a></>)
        }
        else if (word === "<br/>") text.push(<br/>)
        else if (word.includes('https://') || word.includes('www.')) {
            text.push(<br/>)
            text.push(<a href={word}>{word}</a>)
        }
        else text.push(word)
    })
    return <div className='mt-4 '>
        {string.includes('mailto:') || string.includes('<br/>') || string.includes('https://') || string.includes('www.') ? <>
            {text.map((word) => <Fragment key={word}>
                {word}&nbsp;
            </Fragment>)}
        </> : <p>{string}</p>}
    </div>
}

const title = ({content, i18n}) => {
    return <>
        <h1 className='title is-5 mb-0 '>{getContent(content, i18n.language)}</h1>
    </>
}

export default StaticPage