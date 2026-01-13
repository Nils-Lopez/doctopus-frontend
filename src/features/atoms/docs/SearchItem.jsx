import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useUsers } from "../../../utils/hooks/Users";
function checkIfMultiple(num1, num2) {
  return num1 % num2 === 0;
}
const SearchItem = ({
  item,
  setDisplay,
  handleSearchTag,
  location = "index",
  handleSearchDoc = "false",
  relTypes,
  client,
  handleDelete,
  watchlist,
  i,
  removeFromWatchlist,
  readOnly,
}) => {
  const index = i - (i / 5).toString()[0] * 5;
  let colClasses = i || index === 0 ? " smooth-appear" : "";
  colClasses +=
    i && index === 0
      ? ""
      : index === 4
      ? " sm5"
      : index === 3
      ? " sm4"
      : index === 2
      ? " sm3"
      : index === 1
      ? " sm2"
      : "";
  const convertDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };
  const { t, i18n } = useTranslation();

  const [displayThumb, setDisplayThumb] = useState(true);

  const { updateUser } = useUsers();

  const handleRemoveFromWatchlist = (doc) => {
    console.log(doc);
    console.log(client);
    if (client && client.user) {
      console.log("NOT NULL");
      const newList = [];
      client.user.watchList.map((watch) => {
        if (watch._id !== doc._id) {
          newList.push({ _id: watch._id });
        }
      });

      updateUser({ watchList: newList }, client.user._id);
      removeFromWatchlist(doc);
    }
  };

  return (
    <div className={"column is-one-fifth"}>
      <div
        className={"box results-col has-shadow " + colClasses}
        onClick={() => {
          if (handleSearchDoc !== "false") {
            handleSearchDoc(item.doc);
          } else if (setDisplay !== undefined) {
            setDisplay(item.doc);
          }
        }}>
        <div className="is-flex is-justify-content-start">
          {handleDelete || watchlist ? (
            <i
              className="has-text-danger mt--1 pl-1 ml--1  pointer"
              style={{
                zIndex: 1000,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (handleDelete) {
                  handleDelete(item.doc);
                } else {
                  handleRemoveFromWatchlist(item.doc);
                }
              }}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </i>
          ) : null}
        </div>
        <div className="is-flex is-justify-content-end mt-0 mb-0">
          {relTypes &&
          relTypes.title &&
          relTypes.title[0] &&
          getContent(relTypes.title, i18n.language) !== "Error" ? (
            <span className="has-text-muted has-text-grey tag-is-absolute">
              <small>{getContent(relTypes.title, i18n.language)}</small>
            </span>
          ) : null}
          <span className="tag has-background-transparent is-medium pb-5 pr-0 has-text-info has-text-right mr-0 pr-0  is-txt-multiline">
            {item.doc &&
            item.doc.types &&
            item.doc.types[0] &&
            getContent(item.doc.types[0].title, i18n.language) !== "Error" ? (
              getContent(item.doc.types[0].title, i18n.language).length > 14 ? (
                <>
                  {
                    getContent(item.doc.types[0].title, i18n.language).split(
                      " "
                    )[0]
                  }{" "}
                  {getContent(
                    item.doc.types[0].title,
                    i18n.language
                  ).replaceAll(
                    getContent(item.doc.types[0].title, i18n.language).split(
                      " "
                    )[0],
                    ""
                  )}
                </>
              ) : (
                getContent(item.doc.types[0].title, i18n.language)
              )
            ) : (
              t("document")
            )}
          </span>
        </div>
        <h3 className="subtitle is-6 mb-1 mt-1">
          {item.doc && item.doc.title}
        </h3>

        {displayThumb && item.doc && item.doc.thumb && item.doc.thumb !== "" ? (
          <div className="column mb-0 pb-0">
            <img
              onError={() => setDisplayThumb(false)}
              src={item.doc.thumb}
              alt="file"
              className="thumb-search-item"
            />
          </div>
        ) : null}
        {item.doc && item.doc.date ? (
          <h3 className="subtitle is-6 mb-1 mt-1 has-text-grey mt-3">
            <small>{item.doc && item.doc.date}</small>
          </h3>
        ) : item.doc?.publishedAt && item.doc.publishedAt !== "" ? (
          <>
            <span className="tag is-light is-small is-flex is-justify-content-center mb-2">
              {convertDate(item.doc.publishedAt)}{" "}
            </span>
          </>
        ) : null}

        {(window.location.host === "localhost:3000"
          ? "contredanse"
          : window.location.host.split(".")[0]) === "contredanse" ? (
          <span className="tag is-light is-small is-flex is-justify-content-start mb-2">
            {item.doc && item.doc.slug ? item.doc.slug : null}
          </span>
        ) : null}
        {/* <p>{item.doc.description && item.doc.description[0] ? getContent(item.doc.description, i18n.language).substring(0,20) + "..." : null}</p>
               
                    
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
                    </div> */}
        {watchlist && item.doc.supports ? (
          <div className="mt-3">
            {item.doc.supports.map((supp) => {
              return (
                <Fragment key={JSON.stringify(supp)}>
                  {supp.format && supp.format !== "" ? (
                    <>
                      <span className="tag is-light is-medium  mb-2  ml-1 mr-1">
                        {supp.format}
                      </span>
                    </>
                  ) : null}
                  {supp.accessibility && supp.accessibility !== "" ? (
                    <>
                      <span className="tag is-light is-medium  mb-2  ml-1 mr-1">
                        {supp.accessibility}
                      </span>
                    </>
                  ) : null}
                  {supp.exemplaries && supp.exemplaries[0]
                    ? supp.exemplaries.map((ex) => {
                        return (
                          <Fragment key={JSON.stringify(ex)}>
                            {ex.position && ex.position !== "" ? (
                              <>
                                <span className="tag is-light is-medium  mb-2 ml-1 mr-1">
                                  {ex.position}{" "}
                                </span>
                              </>
                            ) : null}
                            {ex.location && ex.location !== "" ? (
                              <>
                                <span className="tag is-light is-medium  mb-2  ml-1 mr-1">
                                  {ex.location}{" "}
                                </span>
                              </>
                            ) : null}
                            {ex.quality && ex.quality !== "" ? (
                              <>
                                <span className="tag is-light is-medium  mb-2  ml-1 mr-1">
                                  {" "}
                                  {ex.quality}{" "}
                                </span>
                              </>
                            ) : null}
                            {ex.cote && ex.cote !== "" && ex.cote !== null ? (
                              <>
                                <span className="tag is-light is-medium  mb-2  ml-1 mr-1">
                                  {ex.cote}
                                </span>
                              </>
                            ) : null}
                          </Fragment>
                        );
                      })
                    : null}
                </Fragment>
              );
            })}
          </div>
        ) : null}

        {!watchlist && item.doc && item.doc.tags && item.doc.tags[0] ? (
          <div className="tags-searchitem">
            <hr />

            <div className="columns is-multiline  is-flex is-justify-content-space-around ">
              {item.doc.tags.map((tag, i) => {
                if (tag) {
                  let title = getContent(tag.title, i18n.language);
                  if (i < 2 && title !== "Error" && title !== "") {
                    return (
                      <Fragment key={JSON.stringify(tag)}>
                        <span className="tag is-info is-small mb-2 ">
                          {title && title.length >= 10
                            ? title.slice(0, 10) + ".."
                            : title}
                        </span>
                      </Fragment>
                    );
                  } else if (i < 2) {
                    let title = item.doc.tags[i + 1]
                      ? getContent(item.doc.tags[i + 1].title, i18n.language)
                      : "";

                    if (title !== "Error" && title !== "") {
                      return (
                        <Fragment key={JSON.stringify(tag)}>
                          <span className="tag is-info is-small mb-2 ">
                            {title && title.length >= 10
                              ? title.slice(0, 10) + ".."
                              : title}
                          </span>
                        </Fragment>
                      );
                    }
                  }
                }
              })}
            </div>
          </div>
        ) : null}
        {watchlist && !readOnly && (
          <button
            onClick={() => handleRemoveFromWatchlist()}
            className="button is-small">
            <span>{t("remove")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

const getContent = (value, lang = "fr") => {
  if (value) {
    return value.filter((obj) => obj.lang === lang)[0]
      ? value.filter((obj) => obj.lang === lang)[0].content
      : value.filter((obj) => obj.lang === "en")[0]
      ? value.filter((obj) => obj.lang === "en")[0].content
      : value.filter((obj) => obj.lang === "fr")[0].content;
  } else {
    return "Error";
  }
};

export default SearchItem;
