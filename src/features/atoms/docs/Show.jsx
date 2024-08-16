import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BoxItemParent from "../parents/SearchItem.jsx";
import ShowParent from "../parents/Show.jsx";

import { useUsers } from "../../../utils/hooks/Users.js";

import DocForm from "../../molecules/Create/DocForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faGlobe,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  faChevronDown,
  faChevronUp,
  faCopy,
  faCheck,
  faCircleXmark,
  faShareAlt,
  faAngleRight,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  TwitterShareButton,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { useProds } from "../../../utils/hooks/Prods";
import removeDuplicates from "../../../utils/helpers/duplicates.js";

const Show = ({
  doc,
  handleSearchTag,
  client,
  setClient,
  setAlert,
  handleSearchParent,
  handleSearchDoc,
  handleBack,
  handleSearchScapinID,
  setSignUpModal,
}) => {
  const {
    title,
    description,
    langs,
    thumb,
    types,
    supports,
    parents,
    tags,
    childs,
    child_docs,
  } = doc;

  const [addingWatchlist, setAddingWatchlist] = useState(false);
  const { updateUser, responseUpdateUser } = useUsers();
  const [displayFile, setDisplayFile] = useState(false);

  const [dataUpdate, setDataUpdate] = useState(false);

  useEffect(() => {
    if (dataUpdate && dataUpdate.success && dataUpdate._id) {
      handleSearchDoc(dataUpdate._id);
      setDataUpdate(false);
    }
  }, [dataUpdate]);

  const handleDisplayFile = (e) => {
    e.preventDefault();

    setDisplayFile(!displayFile);
  };

  const handleUpdateUser = (remove) => {
    if (client && client.user) {
      if (remove) {
        const newList = [];
        client.user.watchList.map((watch) => {
          if (watch._id !== doc._id) {
            newList.push({ _id: watch._id });
          }
        });
        updateUser({ watchList: newList }, client.user._id);
      } else {
        const watchlist = [...client.user.watchList, doc];
        updateUser({ watchList: watchlist }, client.user._id);
      }
    }
  };

  const showPdf = (url) => {
    window.open(url, "_blank", "noreferrer");
    setDisplayFile(false);
  };

  useEffect(() => {
    if (
      responseUpdateUser &&
      responseUpdateUser.success &&
      responseUpdateUser.data
    ) {
      setClient({ user: responseUpdateUser.data });
      setAddingWatchlist(false);
    } else {
      setAddingWatchlist(false);
    }
  }, [responseUpdateUser]);
  const includeParentType = (type, parents) => {
    let included = false;
    parents.map((parent) => {
      if (parent[type]) {
        included = true;
      }
    });
    return included;
  };
  const convertDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };
  const { t, i18n } = useTranslation();

  const checkWatchlist = () => {
    let alreadyIn = false;
    if (client && client.user) {
      client.user.watchList.map((watch) => {
        if (watch._id === doc._id) {
          alreadyIn = true;
        }
      });
    }
    return alreadyIn;
  };

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1300);
    }
  }, [copied]);

  const [shareBtn, setShareBtn] = useState(false);

  const [showScapinParent, setShowScapinParent] = useState(false);
  const { findProdByIds, responseFindProdByIds } = useProds();

  const [productionsScapin, setProductions] = useState(false);
  const [prodLoading, setProdLoading] = useState(false);

  const handleSearchScapinParent = (item, type) => {
    if (!type) {
      if (!showScapinParent && item)
        setShowScapinParent({
          ...item.prod,
          scapin: true,
          parents: item.parents,
        });
      else setShowScapinParent(false);
    } else {
      handleSearchScapinID(item);
    }
  };

  useEffect(() => {
    if (responseFindProdByIds && prodLoading) {
      setProductions(responseFindProdByIds);
      setProdLoading(false);
    }
  }, [responseFindProdByIds]);

  const [productionsPage, setProductionsPage] = useState(1);

  useEffect(() => {
    const prodIds = [];
    parents?.map((p) => {
      if (p.productionId && p.productionId.length > 1) {
        prodIds.push(p.productionId);
      }
    });
    if (prodIds && prodIds[0] && !prodLoading && !productionsScapin[0]) {
      setProdLoading(true);
      findProdByIds(prodIds);
    }
  }, [parents]);

  const handleNextPage = (list, currentPage, setNewPage, next, rowSize) => {
    if (next) {
      if (list.length > currentPage * rowSize) {
        setNewPage(currentPage + 1);
      }
    } else {
      if (productionsPage !== 1) {
        let newPage = currentPage - 1;
        setNewPage(newPage);
      }
    }
  };

  const [displayThumb, setDisplayThumb] = useState(true);
  const [displayVideo, setDisplayVideo] = useState(false);

  return showScapinParent ? (
    <>
      <ShowParent
        parent={showScapinParent}
        client={client}
        setAlert={setAlert}
        handleSearchParent={handleSearchScapinParent}
        handleSearchScapinID={handleSearchScapinID}
        handleSearchDoc={handleSearchDoc}
        handleBack={handleSearchScapinParent}
      />
    </>
  ) : dataUpdate && !dataUpdate.success ? (
    <>
      <DocForm
        client={client}
        setClient={setClient}
        setAlert={setAlert}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  ) : (
    <div className="">
      <div className="is-flex is-justify-content-space-between  mb-5">
        <div>
          <div className="actions-btn">
            <button
              className="button is-light   mb-2"
              id="backBtn"
              onClick={handleBack}>
              <span>
                <FontAwesomeIcon icon={faRotateLeft} size="lg" />
                <strong>&nbsp;{t("back")}</strong>
              </span>
            </button>
            <button
              className={
                !copied
                  ? "button is-light is-light ml-3"
                  : "button is-light has-text-primary is-light ml-3"
              }
              onClick={() => {
                setShareBtn(!shareBtn);
              }}>
              <span>
                {!shareBtn ? (
                  <FontAwesomeIcon icon={faShareAlt} size="lg" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                )}
              </span>
            </button>
            {client && client.user ? (
              !addingWatchlist ? (
                checkWatchlist() ? (
                  <button
                    className="button   mb-2 is-primary ml-3 "
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateUser("remove");
                      setAddingWatchlist(true);
                    }}>
                    <span>{t("Remove from watchlist")}</span>
                  </button>
                ) : (
                  <button
                    className="button is-primary  mb-2 ml-3 "
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateUser();
                      setAddingWatchlist(true);
                    }}>
                    <span>{t("Add to watchlist")}</span>
                  </button>
                )
              ) : (
                <button
                  className="button is-primary  mb-2 ml-3   disabled is-disabled"
                  disabled>
                  <span>{t("Loading...")}</span>
                </button>
              )
            ) : (
              <button
                className=" button is-primary  mb-2 ml-3  "
                onClick={(e) => {
                  e.preventDefault();
                  setSignUpModal(true);
                }}>
                <span>
                  <strong>{t("Add to watchlist")}</strong>
                </span>
              </button>
            )}

            {client &&
            client.user &&
            (client.user.type === "admin" ||
              client.user.type === "moderator" ||
              client.user.type ===
                "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
              <button
                className="button is-primary ml-3  "
                onClick={() => setDataUpdate(doc)}>
                <span>{t("update")}</span>
              </button>
            ) : null}
            {client &&
            client.user &&
            (client.user.type === "admin" ||
              client.user.type === "moderator" ||
              client.user.type ===
                "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") &&
            doc.views &&
            doc.views !== "" &&
            doc.views !== null ? (
              <>
                <span className=" is-light button  ml-3">
                  {doc.views} {t("views")}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div>
          {doc &&
          (!doc.restrictedContent ||
            doc.restrictedContent === "all" ||
            (client && client.user && client.user.type !== "visitor")) &&
          supports[0] &&
          supports[0].url &&
          supports[0].url.includes("vimeo") ? (
            <div className="button has-name pl-5 pr-5 mt-0 is-primary file-doc-btn">
              <span
                className="file-label"
                onClick={() => setDisplayVideo(!displayVideo)}>
                {!displayVideo ? (
                  <>
                    {t("show-video")}
                    <FontAwesomeIcon
                      icon={faEye}
                      className="is-primary mt-1 ml-2"
                    />
                  </>
                ) : (
                  <>
                    {t("hide-video")}{" "}
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="is-primary mt-1 ml-2"
                    />
                  </>
                )}
              </span>
            </div>
          ) : null}
          {doc &&
          (!doc.restrictedContent ||
            doc.restrictedContent === "all" ||
            (client && client.user && client.user.type !== "visitor")) &&
          supports[0] &&
          supports[0].pdf &&
          supports[0].pdf !== "" ? (
            <>
              <div className="button has-name pl-5 pr-5 mt-05 is-primary file-doc-btn">
                <span className="file-label" onClick={handleDisplayFile}>
                  {!displayVideo ? (
                    <>
                      {t("read-doc")}
                      <FontAwesomeIcon
                        icon={faEye}
                        className="is-primary mt-05 ml-2"
                      />
                    </>
                  ) : (
                    <>
                      {t("hide-video")}{" "}
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        className="is-primary mt-1 ml-2"
                      />
                    </>
                  )}
                </span>
              </div>
            </>
          ) : null}
          {types && types[0] ? (
            <>
              {types.map((type) => {
                return (
                  <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-large is-white has-text-info mr-1 ml-1 mb-0 mt-1 text-wrap">
                      <strong className="has-text-info">
                        {getContent(type.title, i18n.language)}
                      </strong>
                    </span>
                  </Fragment>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
      {shareBtn ? (
        <div
          className="is-flex mt--2 is-justify-content-start ml-5 pl-1"
          onClick={() => setShareBtn(false)}>
          <button
            className={
              !copied
                ? "button is-white  ml-3"
                : "button is-white has-text-primary ml-3"
            }
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
            }}>
            {!copied ? (
              <FontAwesomeIcon icon={faCopy} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faCheck} size="lg" />
            )}
          </button>
          <FacebookShareButton
            url={window.location.href}
            className="button is-white     ml-3">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={window.location.href}
            className="button is-white  ml-3">
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <PinterestShareButton
            url={window.location.href}
            className="button is-white   ml-3">
            <PinterestIcon size={32} round />
          </PinterestShareButton>
        </div>
      ) : null}
      {thumb && thumb !== "" ? (
        <>
          <div className="columns mb-0 pb-0">
            <div className="column mb-0 pb-0">
              <div className=" is-flex is-justify-content-start">
                <h1 className="mt-2 title is-1 has-text-left">{title}</h1>
              </div>
              <div
                className="is-flex is-justify-content-start mt--05 mb-3
              ">
                {doc &&
                (!doc.restrictedContent ||
                  doc.restrictedContent === "all" ||
                  (client && client.user && client.user.type !== "visitor")) &&
                supports[0] &&
                supports[0].url &&
                supports[0].url.includes("vimeo") ? (
                  <div className="button has-name pl-5 pr-5 mt-0 is-primary mobile-file-doc-btn">
                    <span
                      className="file-label"
                      onClick={() => setDisplayVideo(!displayVideo)}>
                      {!displayVideo ? (
                        <>
                          {t("show-video")}
                          <FontAwesomeIcon
                            icon={faEye}
                            className="is-primary mt-1 ml-2"
                          />
                        </>
                      ) : (
                        <>
                          {t("hide-video")}{" "}
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            className="is-primary mt-1 ml-2"
                          />
                        </>
                      )}
                    </span>
                  </div>
                ) : null}
                {doc &&
                (!doc.restrictedContent ||
                  doc.restrictedContent === "all" ||
                  (client && client.user && client.user.type !== "visitor")) &&
                supports[0] &&
                supports[0].pdf &&
                supports[0].pdf !== "" ? (
                  <>
                    <div className="button has-name pl-5 pr-5 mt-05 is-primary mobile-file-doc-btn">
                      <span className="file-label" onClick={handleDisplayFile}>
                        {!displayVideo ? (
                          <>
                            {t("read-doc")}
                            <FontAwesomeIcon
                              icon={faEye}
                              className="is-primary mt-05 ml-2"
                            />
                          </>
                        ) : (
                          <>
                            {t("hide-video")}{" "}
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              className="is-primary mt-1 ml-2"
                            />
                          </>
                        )}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              {doc &&
              (!doc.restrictedContent ||
                doc.restrictedContent === "all" ||
                (client && client.user && client.user.type !== "visitor")) ? (
                <>
                  {" "}
                  {supports[0] &&
                  supports[0].url &&
                  supports[0].url.includes("vimeo") ? (
                    <>
                      {displayVideo ? (
                        <div className="is-flex is-justify-content-center ">
                          <iframe
                            src={supports[0].url}
                            width="740"
                            height="460"
                            frameborder="0"
                            allow="autoplay; fullscreen"
                            allowfullscreen></iframe>
                        </div>
                      ) : null}
                    </>
                  ) : null}{" "}
                </>
              ) : null}
              {langs && langs.length > 1 ? (
                <>
                  <p className="has-text-left mb-1">
                    {t("language") + "s"}:
                    {langs.map((l) => {
                      if (l && l.title) {
                        return (
                          <Fragment key={l._id}>
                            {getContent(l.title, i18n.language)}
                          </Fragment>
                        );
                      }
                    })}
                  </p>
                </>
              ) : langs && langs[0] ? (
                <p className="has-text-left mb-1">
                  {t("language")}: {getContent(langs[0].title, i18n.language)}
                </p>
              ) : null}
              {doc.date && doc.date !== "" ? (
                <p className="has-text-left mt-0  mb-0 pt-0">
                  {t("publication date")}: {doc.date}{" "}
                </p>
              ) : doc.publishedAt && doc.publishedAt !== "" ? (
                <p className="has-text-left mt-0  mb-0 pt-0">
                  {t("publication date")}:{" "}
                  {new Date(doc.publishedAt).getDate() +
                    "/" +
                    (new Date(doc.publishedAt).getMonth() + 1) +
                    "/" +
                    new Date(doc.publishedAt).getFullYear()}{" "}
                </p>
              ) : null}
              {doc.eanIsbn && doc.eanIsbn !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  EAN/ISBN: {doc.eanIsbn}{" "}
                </p>
              ) : null}
              {doc.pages && doc.pages !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  Pages :{doc.pages}{" "}
                </p>
              ) : doc.volume && doc.volume !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  {t("volume")} {doc.volume}
                </p>
              ) : null}
              {doc.number && doc.number !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  {t("number")} {doc.number}
                </p>
              ) : null}
              {doc.issn && doc.issn !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  ISSN: {doc.issn}{" "}
                </p>
              ) : null}
              {doc.duration && doc.duration !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  {t("duration")}: {doc.duration}{" "}
                </p>
              ) : null}
              {doc.additionalCopyrights && doc.additionalCopyrights !== "" ? (
                <p className="has-text-left mt-1  mb-0 pt-0">
                  {t("credits")}: {doc.additionalCopyrights}{" "}
                </p>
              ) : null}
              {description && description[0] ? (
                <p className="  mt-1 mb-0 pb-0 has-text-left">
                  {getContent(description, i18n.language)}
                </p>
              ) : null}
            </div>
            {displayThumb && !displayVideo ? (
              <div className="column mb-0 pb-0">
                <img
                  onError={() => setDisplayThumb(false)}
                  src={thumb}
                  alt="file"
                  className="thumb-img"
                />
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-2 title is-1 has-text-left">{title}</h1>
          {doc &&
          (!doc.restrictedContent ||
            doc.restrictedContent === "all" ||
            (client && client.user && client.user.type !== "visitor")) ? (
            <>
              {" "}
              {supports[0] &&
              supports[0].url &&
              supports[0].url.includes("vimeo") ? (
                <>
                  {displayVideo ? (
                    <div className="is-flex is-justify-content-center ">
                      <iframe
                        src={supports[0].url}
                        width="740"
                        height="460"
                        frameborder="0"
                        allow="autoplay; fullscreen"
                        allowfullscreen></iframe>
                    </div>
                  ) : null}
                </>
              ) : null}{" "}
            </>
          ) : null}
          {langs && langs.length > 1 ? (
            <>
              <p className="has-text-left mb-1">
                {t("language") + "s: "}
                {langs.map((l, i) => {
                  if (l && l.title) {
                    return (
                      <Fragment key={l._id}>
                        {getContent(l.title, i18n.language)}
                        {i !== langs.length - 1 ? ", " : null}
                      </Fragment>
                    );
                  }
                })}
              </p>
            </>
          ) : langs && langs[0] ? (
            <p className="has-text-left mb-1">
              {t("language")}: {getContent(langs[0].title, i18n.language)}
            </p>
          ) : null}{" "}
          {doc.date && doc.date !== "" ? (
            <p className="has-text-left mt-0  mb-0 pt-0">
              {t("publication date")}: {doc.date}{" "}
            </p>
          ) : doc.publishedAt && doc.publishedAt !== "" ? (
            <p className="has-text-left mt-0  mb-0 pt-0">
              {t("publication date")}:{" "}
              {new Date(doc.publishedAt).getDate() +
                "/" +
                (new Date(doc.publishedAt).getMonth() + 1) +
                "/" +
                new Date(doc.publishedAt).getFullYear()}{" "}
            </p>
          ) : null}
          {doc.eanIsbn && doc.eanIsbn !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">
              EAN/ISBN: {doc.eanIsbn}{" "}
            </p>
          ) : null}
          {doc.pages && doc.pages !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">Pages: {doc.pages} </p>
          ) : doc.volume && doc.volume !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">
              {t("volume")} {doc.volume}
            </p>
          ) : null}
          {doc.number && doc.number !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">
              {t("number")} {doc.number}
            </p>
          ) : null}
          {doc.issn && doc.issn !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">ISSN: {doc.issn} </p>
          ) : null}
          {doc.duration && doc.duration !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">
              {t("duration")}: {doc.duration}{" "}
            </p>
          ) : null}
          {doc.additionalCopyrights && doc.additionalCopyrights !== "" ? (
            <p className="has-text-left mt-1  mb-0 pt-0">
              {t("credits")}: {doc.additionalCopyrights}{" "}
            </p>
          ) : null}
          {description && description[0] ? (
            <p className="  mt-1 mb-1 pb-0 has-text-left">
              {getContent(description, i18n.language)}
            </p>
          ) : null}
        </>
      )}

      {supports && supports[0] ? (
        <>
          {supports.map((supp) => {
            return (
              <Fragment key={JSON.stringify(supp)}>
                {supp.description &&
                supp.description[0] &&
                getContent(supp.description, i18n.language) !== "" ? (
                  <p className="has-text-left mt-1  mb-0 pt-0">
                    {getContent(supp.description, i18n.language)}
                  </p>
                ) : null}

                {supp.format && supp.format !== "" ? (
                  <p className="has-text-left mt-1  mb-0 pt-0">
                    Format: {supp.format}
                  </p>
                ) : null}
                {supp.accessibility && supp.accessibility !== "" ? (
                  <p className="has-text-left mt-1  mb-0 pt-0">
                    {supp.accessibility}
                  </p>
                ) : null}
                {supp.url && supp.url !== "" && !supp.url.includes("vimeo") ? (
                  <p className="has-text-left mt-1  mb-0 pt-0">
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="has-text-primary mr-1 pt-1"
                    />{" "}
                    <a href={supp.url}>
                      {supp.url
                        .replaceAll("//", "$4:")
                        .split("/")[0]
                        .replaceAll("$4:", "//")}
                    </a>
                  </p>
                ) : null}

                {supp.exemplaries && supp.exemplaries[0]
                  ? supp.exemplaries.map((ex) => {
                      return (
                        <Fragment key={JSON.stringify(ex)}>
                          <p className="has-text-left mt-0 pt-0">
                            {ex.position}{" "}
                            {ex.position && ex.position !== "" ? "|" : null}{" "}
                            {ex.location}{" "}
                            {ex.location && ex.location !== "" ? "|" : null}{" "}
                            {ex.quality}{" "}
                            {ex.quality && ex.quality !== "" ? "|" : null}{" "}
                            {ex.cote}{" "}
                          </p>
                        </Fragment>
                      );
                    })
                  : null}

                {doc &&
                (!doc.restrictedContent ||
                  doc.restrictedContent === "all" ||
                  (client && client.user && client.user.type !== "visitor")) ? (
                  <>
                    {displayFile && (
                      <div className="mt-3 h-100">
                        {supp.pdf
                          .split(".")
                          [supp.pdf.split(".").length - 1].toLowerCase() ===
                        "pdf" ? (
                          showPdf(supp.pdf)
                        ) : [
                            "png",
                            "jpg",
                            "jpeg",
                            "gif",
                            "ico",
                            "svg",
                          ].includes(
                            supp.pdf
                              .split(".")
                              [supp.pdf.split(".").length - 1].toLowerCase()
                          ) ? (
                          <img src={supp.pdf} alt="file" className="file-img" />
                        ) : [
                            "mp4",
                            "avi",
                            "mov",
                            "wmv",
                            "flv",
                            "mkv",
                            "webm",
                          ].includes(
                            supp.pdf
                              .split(".")
                              [supp.pdf.split(".").length - 1].toLowerCase()
                          ) ? (
                          <video
                            src={supp.pdf}
                            className="file-video"
                            controls
                          />
                        ) : ["wav", "mp3", "flac", "m4a"].includes(
                            supp.pdf
                              .split(".")
                              [supp.pdf.split(".").length - 1].toLowerCase()
                          ) ? (
                          <audio src={supp.pdf} controls />
                        ) : null}
                      </div>
                    )}
                  </>
                ) : null}
              </Fragment>
            );
          })}
        </>
      ) : null}
      <div className="container mt-3">
        {tags && tags[0] ? (
          <>
            {tags.map((type) => {
              let title = getContent(type.title, i18n.language);
              if (title !== "" && title !== " ") {
                return (
                  <Fragment key={JSON.stringify(type)}>
                    <span
                      className="tag is-medium is-info mr-1 ml-1 mt-1 indextag"
                      onClick={() => handleSearchTag(type)}>
                      {title && title.length >= 14
                        ? title.slice(0, 14) + ".."
                        : title}
                    </span>
                  </Fragment>
                );
              }
            })}
          </>
        ) : null}
      </div>
      {productionsScapin && productionsScapin[0] ? (
        <>
          <hr className="mt-5" />

          <div className="is-flex is-justify-content-space-between mt-0">
            <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 pt-1 mb-0">
              {t("productions")}
            </h3>

            <div className="mt--1">
              {productionsPage !== 1 ? (
                <button
                  className="button is-white"
                  onClick={() => setProductionsPage(productionsPage - 1)}>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className=" is-size-3 has-text-grey"
                  />
                </button>
              ) : null}

              {productionsScapin.length > 8 * productionsPage ? (
                <button
                  className="button is-white"
                  onClick={() =>
                    handleNextPage(
                      productionsScapin,
                      productionsPage,
                      setProductionsPage,
                      true,
                      8
                    )
                  }>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className=" is-size-3 has-text-grey"
                  />
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      <div className="columns is-multiline mb-6 ">
        {productionsScapin && productionsScapin[0]
          ? productionsScapin.map((prodScapin, i) => {
              if (
                (productionsPage === 1 && i < 8) ||
                (i > (productionsPage - 1) * 8 - 1 && i < productionsPage * 8)
              ) {
                return (
                  <Fragment key={JSON.stringify(prodScapin)}>
                    <BoxItemParent
                      item={prodScapin.item}
                      handleSearchScapinParent={handleSearchScapinParent}
                      parent="production"
                      i={i}
                    />
                  </Fragment>
                );
              }
            })
          : null}
      </div>
      {parents && parents[0] ? (
        <>
          {includeParentType("project", parents) ? (
            <>
              <hr className="mt--1" />
              <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 pt-1 mb-4 pb-1">
                {t("projects")}
              </h3>
              <div className="columns is-multiline is-flex is-justify-content-start">
                {parents && parents ? (
                  <>
                    {parents.map((parent) => {
                      if (parent.project) {
                        return (
                          <Fragment key={JSON.stringify(parent)}>
                            <BoxItemParent
                              item={parent}
                              handleSearchParent={handleSearchParent}
                              handleSearchDoc={handleSearchDoc}
                            />
                          </Fragment>
                        );
                      }
                    })}
                  </>
                ) : null}
              </div>
            </>
          ) : null}

          {includeParentType("person", parents) ? (
            <>
              <hr className="mt--1" />
              <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 pt-1 mb-4 pb-1">
                {t("people")}
              </h3>
              <div className="columns is-multiline is-flex is-justify-content-start">
                {parents && parents ? (
                  <>
                    {parents.map((parent) => {
                      if (parent.person) {
                        return (
                          <Fragment key={JSON.stringify(parent)}>
                            <BoxItemParent
                              item={parent}
                              handleSearchParent={handleSearchParent}
                              handleSearchDoc={handleSearchDoc}
                            />
                          </Fragment>
                        );
                      }
                    })}
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {includeParentType("entity", parents) ? (
            <>
              <hr className="mt--1" />
              <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 pt-1 mb-4 pb-1">
                {t("Organizations")}
              </h3>
              <div className="columns is-multiline is-flex is-justify-content-start">
                {parents && parents ? (
                  <>
                    {parents.map((parent) => {
                      if (parent.entity) {
                        return (
                          <Fragment key={JSON.stringify(parent)}>
                            <BoxItemParent
                              item={parent}
                              handleSearchParent={handleSearchParent}
                              handleSearchDoc={handleSearchDoc}
                            />
                          </Fragment>
                        );
                      }
                    })}
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </>
      ) : null}
      {(childs && childs[0]) ||
      (child_docs && child_docs[0]) ||
      includeParentType("parent_doc", parents) ? (
        <>
          <hr className="mt--1" />
          <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 pt-1 mb-4 pb-1">
            {types && types[0] && types[0]._id === "6404c457e377d276c2dcac8a"
              ? t("Articles")
              : t("documents")}
          </h3>
          <div className="columns is-multiline is-flex is-justify-content-start">
            {parents && parents ? (
              <>
                {parents.map((parent) => {
                  if (parent.parent_doc) {
                    return (
                      <Fragment key={JSON.stringify(parent)}>
                        <BoxItemParent
                          item={parent}
                          handleSearchParent={handleSearchParent}
                          handleSearchDoc={handleSearchDoc}
                        />
                      </Fragment>
                    );
                  }
                })}
              </>
            ) : null}
            {removeDuplicates([...childs, ...child_docs]).map((parent, i) => {
              if (parent.doc) {
                return (
                  <Fragment key={JSON.stringify(parent)}>
                    <BoxItemParent
                      item={parent}
                      handleSearchParent={handleSearchParent}
                      handleSearchDoc={handleSearchDoc}
                      parent="parent_doc"
                    />
                  </Fragment>
                );
              }
            })}
          </div>
        </>
      ) : null}
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

export default Show;
