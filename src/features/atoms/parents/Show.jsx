import React, {Fragment} from "react";
import {useTranslation} from "react-i18next"



const Show = ({parent}) => {

    const { t, i18n } = useTranslation() 
    const {
        roles, 
        languages, 
        description, 
        name, 
        firstName, 
        lastName, 
        birthDate, 
        deathDate, 
        country, 
        city, 
        startedAt, 
        endedAt, 
        url, 
        issn, 
        title, 
        date,
        website, 
        //DEPS
        productions, 
        activities, 
        actors, 
        projects, 
        productionIds, 
        prodIds, 
        createdDocs
    } = parent

    return <>
        <div className="is-flex is-justify-content-end">
        {roles && roles[0] ? <>
            {roles.map((type) => {
                return <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-medium is-primary mr-1 ml-1 mb-0">
                        {getContent(type.title,i18n.language)}
                    </span>
                </Fragment>
            })}
        </> : null}
        </div>
        <h1 className="mt-2">{title && title !== "" ? title : name && name !== "" ? name : firstName + " " + lastName}</h1>
        {description && description[0] ? <p>{getContent(description, i18n.language)}</p> : null}
        {languages && languages[0] ? <p>{getContent(languages[0].labels, i18n.language)}</p> : null}
        
        <div className="container mt-3">
        {country && country !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{country}</span>
                                </> : null} 
                                { city && city !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{city}</span>
                                </> :null} 
                                { website && website !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1"><a href={website}>{website}</a></span>
                                </> : null}
                                { url && url !== "" ? <> 
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1"><a href={url}>{url}</a></span>
                                </> : null}
                                {birthDate && birthDate !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{birthDate} {deathDate && deathDate !== "" ? " - " + deathDate : null}</span>
                                </> : null}
                                {startedAt && startedAt !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{startedAt} {endedAt && endedAt !== "" ? " - " + endedAt : null}</span>
                                </> : null}

                               {issn && issn !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">ISSN: {issn} </span>
                                </> : null}
                                {date && date !== "" ? <>
                                    <span className="tag is-light is-small mb-2 ml-1 mr-1">{date} </span>
                                </> : null}
                               
                                <hr />
        </div>                    
         <div className="columns is-multiline is-flex is-justify-content-center">
            {productions && productions[0] ? productions.map((prod) => {
                return <Fragment key={JSON.stringify(prod)}>
                    
                </Fragment>   
            }) : null}
         </div>
{/*    
        docs: [{ type: mongoose.Schema.ObjectId, ref: "Doc" }], //Link to child document
        roles: [{ type: mongoose.Schema.ObjectId, ref: "Role" }], //E.G. author, publisher, illustrator, developer..
        entity: [{ type: mongoose.Schema.ObjectId, ref: "Entity" }], //Replace with link to entity
        organism: [{type: mongoose.Schema.ObjectId, ref: "Organism"}],
        person: {type: mongoose.Schema.ObjectId, ref: "Person"}, //Replace with link to person
                tags: [{ type: mongoose.Schema.ObjectId, ref: "Tags" }] //Functions of the person
         */}
        

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