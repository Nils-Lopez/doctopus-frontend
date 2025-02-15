import React, { Fragment, useState, useEffect } from "react";

import SearchItem from "../atoms/docs/SearchItem";
import SearchItemParent from "../atoms/parents/SearchItem";
import ShowTag from "../atoms/tags/Show";
import ShowDoc from "../atoms/docs/Show";
import ShowParent from "../atoms/parents/Show";
import Watchlist from "../atoms/users/Watchlist";
import History from "../atoms/users/History";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faAngleRight,
  faAngleLeft,
  faEyeSlash,
  faArrowDownAZ,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SelectForm from "../atoms/forms/SelectForm";

import { useTags } from "../../utils/hooks/Tags";
import { useProjects } from "../../utils/hooks/Projects";
import { useEntities } from "../../utils/hooks/Entities";
import { usePeople } from "../../utils/hooks/People";
import { useDocs } from "../../utils/hooks/docs/Docs";

import { useTranslation } from "react-i18next";
import {
  filterDocList,
  getDocTypes,
  nextPage,
} from "../../utils/helpers/pagination";

const SearchResult = ({
  result,
  client,
  setAlert,
  setClient,
  page,
  setPage,
  handleSearch,
  loadingSearch,
  setResult,
  displayDoc,
  setDisplayDoc,
  setDisplayParent,
  displayParent,
  watchlist,
  history,
  displayTag,
  navHistory,
  setNavHistory,
  setDisplayTag,
  setSignUpModal,
  applicationSettings,
  docsPage,
  setDocsPage,
}) => {
  const [dataList, setDataList] = useState([]);
  const [tags, setTags] = useState([]);

  const [searchTags, setSearchTags] = useState(false);
  const [searchTagsLoading, setSearchTagsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showParentDoc, setShowParentDoc] = useState(false);
  const [showDocParent, setShowDocParent] = useState(false);
  const [goHome, setGoHome] = useState(false);

  const { t, i18n } = useTranslation();

  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (result.docs) {
      if (page === 1) {
        setDataList(result.docs.slice(0, 20));
      } else if (page === 2) {
        setDataList(result.docs.slice(20, 40));
      } else {
        setDataList(result.docs.slice(40, 60));
      }
    }
  }, [page]);

  if (result && tags !== result.tags) {
    setTags(result.tags);
  }

  if (goHome && !watchlist) {
    setGoHome(false);
    setResult({});
  }

  useEffect(() => {
    let path = "/document/" + displayDoc._id;
    if (displayDoc && displayDoc._id) {
      setDisplayParent(false);
      setDisplayTag(false);
      if (location.pathname !== path) {
        navigate(path);
      }
    }
  }, [displayDoc]);

  const handleBack = () => {
    setResult({});
    setDisplayParent(false);
    setDisplayTag(false);
    setDisplayDoc(false);
    if (navHistory.length > 1) {
      navigate(navHistory[navHistory.length - 2]);
      const filtered = [];
      navHistory.map((n, i) => {
        if (i !== navHistory.length - 1) filtered.push(n);
      });
      setNavHistory(filtered);
    } else {
      navigate("/");
    }
  };

  const { findDocByTag, responseFindDocByTag } = useTags();

  const handleSearchTag = (tag) => {
    if (!searchTagsLoading) {
      setDisplayDoc(false);
      setDisplayParent(false);
      navigate("/tag/" + tag.slug);
      setSearchTags({ tag: tag });
      setSearchTagsLoading(true);
      findDocByTag(tag._id);
    }
  };

  useEffect(() => {
    if (displayTag && !searchTags) {
      setSearchTags(displayTag);
    }
  }, [displayTag]);

  useEffect(() => {
    if (
      searchTagsLoading &&
      responseFindDocByTag &&
      responseFindDocByTag.data &&
      responseFindDocByTag.data[0] &&
      responseFindDocByTag.success
    ) {
      setSearchTagsLoading(false);

      setSearchTags({ docs: responseFindDocByTag.data, tag: searchTags.tag });
    } else if (searchTagsLoading) {
      setSearchTagsLoading(false);

      setAlert({
        type: "error",
        message: { en: t("empty-tag"), fr: t("empty-tag") },
      });
    }
  }, [responseFindDocByTag]);

  const { findProjectById, responseFindProjectById } = useProjects();

  const { findEntityById, responseFindEntityById, findEntityByScapin } =
    useEntities();

  const { findPersonById, responseFindPersonById, findPersonByScapin } =
    usePeople();

  const handleSearchParent = (parent) => {
    setDisplayDoc(false);
    console.log("aqui: ", parent);
    if (showParentDoc) {
      setShowParentDoc(false);
      setShowDocParent(true);
    }
    if (parent.entities) {
      navigate("/project/" + parent._id);
      findProjectById(parent._id);
      setLoading(true);
    } else if (parent.projects) {
      navigate("/entity/" + parent._id);

      findEntityById(parent._id);
      setLoading(true);
    } else {
      console.log(parent);
      navigate("/person/" + parent._id);

      findPersonById(parent._id);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (loading) {
      if (responseFindProjectById && responseFindProjectById.success) {
        setDisplayParent(responseFindProjectById.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [responseFindProjectById]);

  useEffect(() => {
    if (loading) {
      if (responseFindEntityById && responseFindEntityById.success) {
        setDisplayParent(responseFindEntityById.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [responseFindEntityById]);

  useEffect(() => {
    if (loading) {
      if (responseFindPersonById && responseFindPersonById.success) {
        setDisplayParent(responseFindPersonById.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [responseFindPersonById]);

  const { findDocById, responseFindDocById } = useDocs();

  const handleSearchDoc = (doc) => {
    if (doc) {
      navigate("/document/" + doc._id);
      findDocById(doc._id);
      setShowParentDoc(true);
      setLoading(true);
    } else {
      navigate("/");
    }
  };

  const handleSearchScapinParent = (doc) => {
    if (doc) {
      if (doc.person) {
        findPersonByScapin(doc._id);
      } else if (doc.entity) {
        findEntityByScapin(doc._id);
      }
      setLoading(true);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (loading) {
      if (responseFindDocById && responseFindDocById.success) {
        setDisplayDoc(responseFindDocById.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [responseFindDocById]);

  useEffect(() => {
    if (goHome) {
      navigate("/");
    }
  }, [goHome]);

  const [filterBtn, setFilterBtn] = useState(false);
  const [filters, setFilters] = useState({ value: "all", label: t("all") });

  const [filtersOptions, setFiltersOptions] = useState([]);

  useEffect(() => {
    if (result.docs && result.docs[0] && !filtersOptions[0]) {
      getDocTypes(result.docs, i18n, setFiltersOptions, t);
    }
  }, [result.docs, filtersOptions, i18n.language]);

  const [filteredList, setFilteredList] = useState(result.docs);

  useEffect(() => {
    filterDocList(
      result.docs,
      setDocsPage,
      setFilteredList,
      filters,
      filterBtn
    );
  }, [filters, filterBtn, result.docs]);

  const [parentsPage, setParentsPage] = useState(1);
  let params = useParams();

  return loading || searchTagsLoading ? (
    <div className="loader">
      <div className="inner one"></div>
      <div className="inner two"></div>
      <div className="inner three"></div>
    </div>
  ) : (
    <>
      <div className="container pb-6 overflow-auto box has-background-white pb-6">
        {!(client && client.user && watchlist) &&
        !(displayParent && !showParentDoc) &&
        !displayDoc &&
        !history &&
        !searchTags.docs ? (
          <div
            className="is-flex is-justify-content-start mt-0 mb-0 pb-0 pt-0"
            id="backBtn">
            <button className="button is-light" onClick={handleBack}>
              <FontAwesomeIcon icon={faRotateLeft} size="lg" />
              <strong>&nbsp;{t("back")}</strong>
            </button>
            {result.docs && result.items ? (
              <span className="tag is-white is-rounded has-text-grey  mt-1 pt-1 ml-1 is-medium">
                {result.totalDocs
                  ? result.totalDocs + (result.items && result.items.length)
                  : result.docs.length + result.items.length}
              </span>
            ) : null}
          </div>
        ) : null}

        {client && client.user && watchlist ? (
          <>
            <Watchlist
              docs={client.user.watchList}
              handleBack={handleBack}
              setDisplayDoc={handleSearchDoc}
              setHideWatchlist={setGoHome}
              client={client}
            />
          </>
        ) : history ? (
          <>
            <History
              client={client}
              handleSearch={handleSearch}
              setHideHistory={setGoHome}
              handleBack={handleBack}
            />
          </>
        ) : searchTags.docs ? (
          <>
            <ShowTag
              docs={searchTags.docs}
              tag={searchTags.tag}
              applicationSettings={applicationSettings}
              client={client}
              setAlert={setAlert}
              handleBack={handleBack}
              setDisplayDoc={setDisplayDoc}
              handleSearchTag={setSearchTags}
            />
          </>
        ) : displayParent && !showParentDoc ? (
          <>
            <ShowParent
              parent={displayParent}
              applicationSettings={applicationSettings}
              setAlert={setAlert}
              client={client}
              handleSearchParent={handleSearchParent}
              handleBack={handleBack}
              handleSearchDoc={handleSearchDoc}
              handleSearchScapinID={handleSearchScapinParent}
            />
          </>
        ) : displayDoc ? (
          <>
            <ShowDoc
              doc={displayDoc}
              setClient={setClient}
              setAlert={setAlert}
              client={client}
              handleBack={handleBack}
              handleSearchTag={handleSearchTag}
              handleSearchParent={handleSearchParent}
              handleSearchDoc={handleSearchDoc}
              handleSearchScapinID={handleSearchScapinParent}
              setSignUpModal={setSignUpModal}
            />
          </>
        ) : (
          <>
            {tags && tags[0] ? (
              <>
                {tags[4] ? (
                  <div className="is-flex is-justify-content-start tags-result mt-5 ml-0">
                    {tags.map((item, index) => {
                      return (
                        <Fragment key={JSON.stringify(item)}>
                          <span
                            className="tag is-big is-info is-medium mr-2 indextag"
                            onClick={() => handleSearchTag(item.tag)}>
                            {item.tag.title && item.tag.title[0]
                              ? getContent(item.tag.title, i18n.language)
                                  .length > 14
                                ? getContent(
                                    item.tag.title,
                                    i18n.language
                                  ).slice(0, 15) + "..."
                                : getContent(item.tag.title, i18n.language)
                              : null}
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <div className="is-flex is-justify-content-start tags-result mt-5 ml-0">
                    {tags.map((item, index) => {
                      return (
                        <Fragment key={JSON.stringify(item)}>
                          <span
                            className="tag is-big is-info is-medium  ml-3 indextag"
                            onClick={() => handleSearchTag(item.tag)}>
                            {item.tag.title && item.tag.title[0]
                              ? getContent(item.tag.title, i18n.language)
                              : null}
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>
                )}
              </>
            ) : null}
            {page === 1 && result.items && result.items[0] ? (
              <>
                <hr />
                <div className="is-flex is-justify-content-space-between">
                  <div className="is-flex is-justify-content-start pt-1">
                    <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 mb-1">
                      {t("result")}
                    </h3>
                  </div>
                  <div className="mt--3">
                    {parentsPage !== 1 ? (
                      <button
                        className="button is-white"
                        onClick={() => setParentsPage(parentsPage - 1)}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </button>
                    ) : null}

                    {result.items.length > 8 * parentsPage ? (
                      <button
                        className="button is-white"
                        onClick={() =>
                          nextPage(
                            result.items,
                            parentsPage,
                            setParentsPage,
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

                <div className="columns is-multiline">
                  {result.items &&
                    result.items[0] &&
                    result.items.map((item, i) => {
                      if (
                        (parentsPage === 1 && i < 8) ||
                        (i > (parentsPage - 1) * 8 - 1 && i < parentsPage * 8)
                      ) {
                        return (
                          <Fragment key={JSON.stringify(item)}>
                            <SearchItemParent
                              item={item}
                              handleSearchParent={handleSearchParent}
                              i={i}
                            />
                          </Fragment>
                        );
                      }
                    })}
                </div>
              </>
            ) : null}
            {result.docs && result.docs[0] ? (
              <>
                <hr />

                <div className="is-flex is-justify-content-space-between">
                  <div className="is-flex is-justify-content-start pt-1">
                    <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 mb-1">
                      {t("documents")}
                    </h3>
                    {result.docs &&
                    result.docs.length > 5 &&
                    !(
                      params &&
                      params.query &&
                      params.query.includes("section:")
                    ) ? (
                      <button
                        className="button is-primary has-background-transparent is-small  is-filter-btn is-rounded  mt--3   ml-3 "
                        onClick={() => setFilterBtn(!filterBtn)}>
                        <strong>
                          <span>
                            <FontAwesomeIcon
                              icon={filterBtn ? faEyeSlash : faArrowDownAZ}
                            />{" "}
                            {filterBtn ? null : <>&nbsp;&nbsp;{t("filters")}</>}{" "}
                          </span>
                        </strong>
                      </button>
                    ) : null}

                    {filterBtn ? (
                      <>
                        <div className="ml-1 mt--3">
                          <SelectForm
                            selected={filters}
                            select={setFilters}
                            options={filtersOptions}
                            applicationSettings={applicationSettings}
                            mode="filters"
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="mt--3">
                    {docsPage !== 1 ? (
                      <button
                        className="button is-white"
                        onClick={() => setDocsPage(docsPage - 1)}>
                        <FontAwesomeIcon
                          icon={faAngleLeft}
                          className=" is-size-3 has-text-grey"
                        />
                      </button>
                    ) : null}

                    {filteredList.length > 15 * docsPage ? (
                      <button
                        className="button is-white"
                        onClick={() =>
                          nextPage(
                            result.docs,
                            docsPage,
                            setDocsPage,
                            true,
                            15,
                            page
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
                <div className="columns is-multiline">
                  {filteredList.map((item, i) => {
                    if (
                      (docsPage === 1 && i < 15) ||
                      (i > (docsPage - 1) * 15 - 1 && i < docsPage * 15)
                    ) {
                      return (
                        <Fragment key={JSON.stringify(item)}>
                          <SearchItem
                            item={item}
                            setDisplay={setDisplayDoc}
                            handleSearchTag={handleSearchTag}
                            i={i}
                          />
                        </Fragment>
                      );
                    }
                  })}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </>
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

export default SearchResult;
