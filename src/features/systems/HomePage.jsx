import React, {
  useState,
  useRef,
  useEffect,
  Fragment,
  useCallback,
} from "react";

import { Link } from "react-router-dom";

import SearchBar from "../atoms/SearchBar";
import SearchResult from "./SearchResult";
import SearchItem from "../atoms/docs/SearchItem";

import { useSearch } from "../../utils/hooks/Search.js";
import { useDocs } from "../../utils/hooks/docs/Docs.js";
import { apiFetch } from "../../utils/middlewares/apiFetch";

import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

import { useUsers } from "../../utils/hooks/Users.js";
import { useTags } from "../../utils/hooks/Tags.js";
import { useProjects } from "../../utils/hooks/Projects.js";
import { useEntities } from "../../utils/hooks/Entities.js";
import { usePeople } from "../../utils/hooks/People.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useApplication } from "../../utils/hooks/Application";
import { init } from "i18next";
import { read_cookie } from "sfcookies";

const HomePage = ({
  client,
  setClient,
  setAlert,
  watchlist,
  history,
  applicationSettings,
  setSignUpModal,
}) => {
  const { t, i18n } = useTranslation();

  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [page, setPage] = useState(1);
  const [popularDocs, setPopularDocs] = useState(false);
  const [displayDoc, setDisplayDoc] = useState(false);
  const [displayParent, setDisplayParent] = useState(false);
  const [displayTag, setDisplayTag] = useState(false);
  const [filtersValue, setFiltersValue] = useState(false);
  const [filtersData, setFiltersData] = useState(false);

  const [navHistory, setNavHistory] = useState(["/"]);
  let location = useLocation();
  let navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname &&
      (location.pathname !== "/" || navHistory.length === 0) &&
      location.pathname !== navHistory[navHistory.length - 1]
    ) {
      if (navHistory.indexOf(location.pathname) !== navHistory.length - 1) {
        const navHistoryFiltered = [...navHistory].filter(
          (e) => e !== location.pathname
        );
        setNavHistory([...navHistoryFiltered, location.pathname]);
      }
    }
  }, [location.pathname]);

  const { search, responseSearch } = useSearch();

  const { findPopularDocs, responseFindPopularDocs } = useDocs();

  const { findProjectById, responseFindProjectById } = useProjects();

  const { findEntityById, responseFindEntityById } = useEntities();

  const { findPersonById, responseFindPersonById } = usePeople();

  const { findDocByTagSlug, responseFindDocByTagSlug } = useTags();

  const { findDocById, responseFindDocById } = useDocs();

  let params = useParams();

  const submitSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!loadingSearch) {
      setDisplayDoc(false);
      setDisplayParent(false);
      setDisplayTag(false);
      setEmpty(false);
      setResult({});
      console.log("ici");
      setLoadingSearch(true);

      navigate("/search/" + searchValue.replaceAll(" ", "%20"));
      if (client && client.user) {
        updateUser(
          { history: [...client.user.history, { query: searchValue }] },
          client.user._id
        );
      }
      setPage(1);
    }
  });

  useEffect(() => {
    if (params && params.query) {
      setSearchValue(params.query.replaceAll("%20", " "));
      setLoadingSearch(true);
      search({
        query: params.query.replaceAll("%20", " "),
        page: 1,
        filters: filtersValue,
      });
    } else if (params && params.tag_slug) {
      setLoadingSearch(true);

      findDocByTagSlug(params.tag_slug);
    } else if (params && params.project_slug) {
      setLoadingSearch(true);

      findProjectById(params.project_slug);
    } else if (params && params.entity_slug) {
      setLoadingSearch(true);

      findEntityById(params.entity_slug);
    } else if (params && params.person_slug) {
      setLoadingSearch(true);

      findPersonById(params.person_slug);
    } else if (params && params.doc_slug) {
      setLoadingSearch(true);

      findDocById(params.doc_slug);
    } 
  }, [params]);

  useEffect(() => {
    if (responseFindDocByTagSlug && responseFindDocByTagSlug.success) {
      setDisplayTag(responseFindDocByTagSlug.data);
      setLoadingSearch(false);
    }
  }, [responseFindDocByTagSlug]);

  useEffect(() => {
    if (responseFindProjectById && responseFindProjectById.success) {
      setDisplayParent(responseFindProjectById.data);
      setLoadingSearch(false);
    }
  }, [responseFindProjectById]);

  useEffect(() => {
    if (responseFindEntityById && responseFindEntityById.success) {
      setDisplayParent(responseFindEntityById.data);
      setLoadingSearch(false);
    }
  }, [responseFindEntityById]);

  useEffect(() => {
    if (responseFindPersonById && responseFindPersonById.success) {
      setDisplayParent(responseFindPersonById.data);
      setLoadingSearch(false);
    }
  }, [responseFindPersonById]);

  useEffect(() => {
    if (responseFindDocById && responseFindDocById.success) {
      setDisplayDoc(responseFindDocById.data);
      setLoadingSearch(false);
    }
  }, [responseFindDocById]);

  const { updateUser } = useUsers();

  const { registerVisitor } = useApplication();

  useEffect(() => {
    if (responseSearch.data !== result) {
      if (
        responseSearch &&
        responseSearch.success &&
        responseSearch.data &&
        (responseSearch.data.items[0] ||
          responseSearch.data.docs[0] ||
          responseSearch.data.tags[0])
      ) {
        setResult(responseSearch.data);
        setPage(1);
        setLoadingSearch(false);
        setEmpty(false);
      } else if (responseSearch && !responseSearch.success) {
        setLoadingSearch(false);
        setEmpty(false);

        setAlert({
          type: "error",
          message: { en: t("error"), fr: t("error") },
        });
      } else if (
        responseSearch &&
        responseSearch.data &&
        !responseSearch.data[0]
      ) {
        setLoadingSearch(false);
        setEmpty(true);
      }
    }
  }, [responseSearch]);

  useEffect(() => {
    if (!popularDocs) {
      if (params && params.category) {
        setLastDocType(params.category);
        findPopularDocs(params.category);
        setPopularDocs(true);
        registerVisitor();
        setLoadingSearch(true);
      } else {
        findPopularDocs("book");
        setPopularDocs(true);
        registerVisitor();
        setLoadingSearch(true);
      }
      
    }
  }, []);

  useEffect(() => {
    if (
      responseFindPopularDocs &&
      responseFindPopularDocs.success &&
      responseFindPopularDocs.data
    ) {
      setPopularDocs(responseFindPopularDocs.data);
      setFiltersData(responseFindPopularDocs.appData);
      setLoadingSearch(false);
      setLoadingLastDocs(false);
    }
  }, [responseFindPopularDocs]);

  if (
    client &&
    client.user &&
    watchlist &&
    result.docs !== client.user.watchList
  ) {
    setResult({ docs: client.user.watchList });
  }

  if (
    client &&
    client.user &&
    history &&
    result.docs !== client.user.watchList
  ) {
    setResult({ docs: client.user.watchList });
  }

  const handleFindLastDocs = (type) => {
    findPopularDocs(type);
    setPopularDocs(true);
    setLoadingLastDocs(true);
  };

  const [loadingLastDocs, setLoadingLastDocs] = useState(false);
  const [lastDocType, setLastDocType] = useState("book");
  const [initialDoc, setInitialDoc] = useState(true);

  useEffect(() => {
    if (lastDocType && !initialDoc) {
      handleFindLastDocs(lastDocType);
    }
  }, [lastDocType]);

  const className =
    (!result ||
      !result.docs ||
      !result.docs[0] ||
      (!window.location.href.includes("watchlist") &&
        client &&
        client.user &&
        result.docs === client.user.watchList)) &&
    (!result || !result.items || !result.items[0]) &&
    (!result || !result.tags || !result.tags[0]) &&
    !displayDoc &&
    !displayParent &&
    !displayTag
      ? "landing"
      : "search";
  return (
    <>
      <div className={className}>
        <div className="is-flex is-justify-content-center mb-6 mt-6 w-100">
          <form className="field w-100" onSubmit={submitSearch}>
            <SearchBar
              searchValue={searchValue}
              applicationSettings={applicationSettings}
              setSearchValue={setSearchValue}
              filtersData={filtersData}
              setFiltersValue={setFiltersValue}
            />
          </form>
        </div>
        <div className="landing-content pl-3 pr-3">
          {empty ? (
            <h1 className="title is-4 has-text-white has-text-shadow mb-0 mt-6 pt-6">
              {t("no-match")}
            </h1>
          ) : (
            <>
              {loadingSearch ? (
                <div className="loader">
                  <div className="inner one"></div>
                  <div className="inner two"></div>
                  <div className="inner three"></div>
                </div>
              ) : (!result ||
                  !result.docs ||
                  !result.docs[0] ||
                  (!window.location.href.includes("watchlist") &&
                    client &&
                    client.user &&
                    result.docs === client.user.watchList)) &&
                (!result || !result.items || !result.items[0]) &&
                (!result || !result.tags || !result.tags[0]) &&
                !displayDoc &&
                !displayParent &&
                !displayTag ? (
                <Landing
                  popularDocs={popularDocs}
                  setClient={setClient}
                  loadingLastDocs={loadingLastDocs}
                  setInitialDoc={setInitialDoc}
                  lastDocType={lastDocType}
                  setLastDocType={setLastDocType}
                  setDisplayDoc={setDisplayDoc}
                  i18n={i18n}
                  setResult={setResult}
                  t={t}
                  client={client}
                  applicationSettings={applicationSettings}
                />
              ) : (
                <SearchResult
                  result={result}
                  client={client}
                  setClient={setClient}
                  applicationSettings={applicationSettings}
                  setAlert={setAlert}
                  page={page}
                  setPage={setPage}
                  loadingSearch={loadingSearch}
                  setResult={setResult}
                  displayDoc={displayDoc}
                  setDisplayDoc={setDisplayDoc}
                  displayParent={displayParent}
                  setDisplayParent={setDisplayParent}
                  setLoading={setLoadingSearch}
                  watchlist={watchlist}
                  history={history}
                  handleSearch={submitSearch}
                  displayTag={displayTag}
                  navHistory={navHistory}
                  setNavHistory={setNavHistory}
                  setDisplayTag={setDisplayTag}
                  setSignUpModal={setSignUpModal}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const getContent = (value, lang) => {
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

const Counter = ({ number }) => {
  return <CountUp duration={2.7} className="counter" end={number} />;
};

const Landing = ({
  popularDocs,
  setDisplayDoc,
  setClient,
  setResult,
  loadingLastDocs,
  setInitialDoc,
  lastDocType,
  setLastDocType,
  t,
  i18n,
  client,
  applicationSettings,
}) => {
  const setDisplay = (item) => {
    setResult({ docs: [item] });
    setDisplayDoc(item);
  };

  const [loadingClient, setLoadingClient] = useState(false);

  const cookieKey = "VISITOR_COOKIE_TOKEN";

  //Fetch Users API
  const { responseFindUserById, findUserById } = useUsers();

  useEffect(() => {
    //Check for cookies
    if (read_cookie(cookieKey).id && !client && !loadingClient) {
      findUserById(read_cookie(cookieKey).id);
      setLoadingClient(true);
    }
  }, []);

  //Restore session and user data from cookie
  useEffect(() => {
    if (responseFindUserById && loadingClient) {
      if (responseFindUserById.success) {
        setClient({ user: responseFindUserById.data });
        setLoadingClient(false);
      }
    }
  }, [responseFindUserById, loadingClient]);

  return (
    <>
      <div className="container recents-container mt-6 mb-0 pb-0 ">
        <div className="metrics">
          <h1 className="title is-5 has-text-white has-text-shadow has-text-left mb-0">
            {applicationSettings &&
            applicationSettings.homePageSubtitles &&
            applicationSettings.homePageSubtitles[0]
              ? getContent(
                  applicationSettings.homePageSubtitles[0].subtitle,
                  i18n.language
                )
              : null}
          </h1>
          <div className="columns is-multiline pb-0 mb-0 pt-2 is-mobile">
            <div className="column results-col  is-one-fifth-desktop is-one-third-tablet is-half-mobile">
              {lastDocType === "book" ? (
                <>
                  <div
                    className="box is-paddingless pt-2 pb-2 smooth-appear has-background-primary "
                    onClick={() => {}}>
                    <h1 className="title is-6 mt-2 has-text-white">
                      <strong className="title is-4">
                        <Counter number={2157} />
                      </strong>{" "}
                      <br />
                      {t("books")}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="box clickable-is-primary is-paddingless pt-2 pb-2 smooth-appear  "
                    onClick={() => {
                      setLastDocType("book");
                    }}>
                    <h1 className="title is-6 mt-2 ">
                      <strong className="title is-4">
                        <Counter number={2157} />
                      </strong>{" "}
                      <br />
                      {t("books")}
                    </h1>
                  </div>
                </>
              )}
            </div>
            <div className="column results-col is-one-fifth-desktop is-one-third-tablet is-half-mobile">
              {lastDocType === "periodical" ? (
                <>
                  <div
                    className="box is-paddingless pt-2 pb-2 smooth-appear has-background-primary "
                    onClick={() => {}}>
                    <h1 className="title is-6 mt-2 has-text-white">
                      <strong className="title is-4">
                        <Counter number={351} />
                      </strong>{" "}
                      <br />
                      {t("periodical")}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="box clickable-is-primary is-paddingless pt-2 pb-2 smooth-appear  "
                    onClick={() => {
                      setLastDocType("periodical");
                      setInitialDoc(false);
                    }}>
                    <h1 className="title is-6 mt-2 ">
                      <strong className="title is-4">
                        <Counter number={351} />
                      </strong>{" "}
                      <br />
                      {t("periodical")}
                    </h1>
                  </div>
                </>
              )}
            </div>
            <div className="column results-col is-one-fifth-desktop is-one-third-tablet is-half-mobile">
              {lastDocType === "articles" ? (
                <>
                  <div
                    className="box is-paddingless pt-2 pb-2 smooth-appear has-background-primary "
                    onClick={() => {}}>
                    <h1 className="title is-6 mt-2 has-text-white">
                      <strong className="title is-4 is-clipped max-50 no-wrap">
                        <Counter number={17377} />
                      </strong>{" "}
                      <br />
                      {t("articles")}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="box clickable-is-primary is-paddingless pt-2 pb-2 smooth-appear  "
                    onClick={() => {
                      setLastDocType("articles");
                      setInitialDoc(false);
                    }}>
                    <h1 className="title is-6 mt-2 ">
                      <strong className="title is-4 is-clipped max-50 no-wrap">
                        <Counter number={17377} />
                      </strong>{" "}
                      <br />
                      {t("articles")}
                    </h1>
                  </div>
                </>
              )}
            </div>
            <div className="column results-col is-one-fifth-desktop is-one-third-tablet ml-auto mr-auto tablet-centered-item is-half-mobile">
              {lastDocType === "videos" ? (
                <>
                  <div
                    className="box 
                    is-paddingless pt-2 pb-2 smooth-appear has-background-primary "
                    onClick={() => {}}>
                    <h1 className="title is-6 mt-2 has-text-white">
                      <strong className="title is-4">
                        <Counter number={2554} />
                      </strong>{" "}
                      <br />
                      {t("videos")}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="box clickable-is-primary is-paddingless pt-2 pb-2 smooth-appear  "
                    onClick={() => {
                      setLastDocType("videos");
                      setInitialDoc(false);
                    }}>
                    <h1 className="title is-6 mt-2 ">
                      <strong className="title is-4">
                        <Counter number={2554} />
                      </strong>{" "}
                      <br />
                      {t("videos")}
                    </h1>
                  </div>
                </>
              )}
            </div>
            <div className="column results-col is-half-mobile  is-one-fifth-desktop is-one-third-tablet tablet-centered-item ml-auto mr-auto ">
              {lastDocType === "photos" ? (
                <>
                  <div
                    className="box  is-paddingless pt-2 pb-2 smooth-appear has-background-primary "
                    onClick={() => {}}>
                    <h1 className="title is-6 mt-2 has-text-white">
                      <strong className="title is-4 ">
                        <Counter number={5396} />
                      </strong>{" "}
                      <br />
                      {t("photos")}
                    </h1>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="box clickable-is-primary is-paddingless pt-2 pb-2 smooth-appear  "
                    onClick={() => {
                      setLastDocType("photos");
                      setInitialDoc(false);
                    }}>
                    <h1 className="title is-6 mt-2 ">
                      <strong className="title is-4 ">
                        <Counter number={5396} />
                      </strong>{" "}
                      <br />
                      {t("photos")}
                    </h1>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {client &&
        client.user &&
        client.user.drafts &&
        client.user.drafts[0] &&
        client.user.drafts[0].title &&
        client.type !== "visitor" ? (
          <>
            <h1 className="title is-4 has-text-white has-text-shadow mb-0 pb-0 mt-0 pt-0">
              {t("drafts")} :
            </h1>
            <div className="columns is-multiline pb-3 mb-4 mt-0 pt-0">
              {client.user.drafts.map((item, index) => {
                return (
                  <Fragment key={JSON.stringify(item)}>
                    <SearchItem
                      item={{ doc: item }}
                      setDisplay={setDisplayDoc}
                      i={index}
                    />
                  </Fragment>
                );
              })}
            </div>
          </>
        ) : null}

        {loadingLastDocs ? (
          <div className="loader mt-4 pt-4">
            <div className="inner one"></div>
            <div className="inner two"></div>
            <div className="inner three"></div>
          </div>
        ) : (
          <>
            <h1 className="title is-5 has-text-white has-text-shadow has-text-left mb--1  pb-0 mt-3 pt-0">
              {applicationSettings &&
              applicationSettings.homePageSubtitles &&
              applicationSettings.homePageSubtitles[1]
                ? getContent(
                    applicationSettings.homePageSubtitles[1].subtitle,
                    i18n.language
                  )
                : null}{" "}
              :
            </h1>

            <div className="columns is-multiline pb-3 mb-0 mt--3 pt-0 popular">
              {popularDocs[0] &&
                popularDocs.map((item, index) => {
                  return (
                    <Fragment key={JSON.stringify(item)}>
                      <SearchItem
                        item={{ doc: item }}
                        setDisplay={setDisplayDoc}
                        i={index}
                      />
                    </Fragment>
                  );
                })}
            </div>
          </>
        )}
      </div>

      {/* <div className="box">
        <h1 className="title is-5">About dOctopus</h1>
        <p className="mb-3">
          Your favorite octopus was born in the early 2022, even if it's a new born he's proud to say that he's definitely the best documents manager of the ocean. dOctopus is the result of several months of thinking about new ways to manage documents, ways that needed to be easier for both users and organisations. Ways that had to optimize each part of the process, and finally dOctopus needed to be accessible for every organisations that is struggling with managing their huge amount of documents, books, movies etc... 
        </p>
        <Link to="/tutorial">Read more ...</Link>
      </div> */}
      {/* <div className="container box mt-2 mb-6">
        <h1 className="title is-5">Contredanse {t('documentation-center')}</h1>
        <p className="mb-3">
          Donec gravida maximus nulla id vulputate. Fusce a dictum tortor, tincidunt molestie massa. Vivamus ac tristique mi, id interdum odio. Nullam vestibulum a libero nec blandit. Ut et aliquet diam, et tempus odio. Fusce ultrices, tortor elementum tincidunt pellentesque, urna tortor porta nisi, ac hendrerit lorem velit quis justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.      </p>
        <Link to="/about">{t('read-more')}</Link>
      </div> */}
    </>
  );
};

export default HomePage;
