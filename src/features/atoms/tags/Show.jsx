import React, { Fragment, useEffect, useState } from "react";

import SearchItem from "../docs/SearchItem";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DocTagsForm from "../forms/docs/DocTagsForm";
import { useTags } from "../../../utils/hooks/Tags";
import SelectForm from "../forms/SelectForm";
import {
  faRotateLeft,
  faAngleRight,
  faAngleLeft,
  faArrowDownAZ,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const Show = ({
  client,
  docs,
  tag,
  setDisplayDoc,
  handleSearchTag,
  handleBack,
  setAlert,
  applicationSettings,
}) => {
  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [updateTag, setUpdateTag] = useState(null);
  const [mergeTag, setMergeTag] = useState(null);

  const handleDisplay = (doc) => {
    handleSearchTag(false);
    setDisplayDoc(doc);
  };
  const { t, i18n } = useTranslation();
  const [idLang, setIdLang] = useState("fr");

  useEffect(() => {
    if (page === 1) {
      setDataList(docs.slice(0, 20));
    } else {
      setDataList(docs.slice(page * 10, page * 10 + 20));
    }
  }, [page]);

  const handleUpdate = (e) => {
    e.preventDefault();

    setUpdateTag(tag);
  };

  const [childsPage, setChildsPage] = useState(1);
  const [childs, setChilds] = useState(docs);

  const {
    findTagChildsDataById,
    responseFindTagChildsDataById,
    findTagChildsPageById,
    responseFindTagChildsPageById,
    searchTagChildsById,
    responseSearchTagChildsById,
  } = useTags();

  const [childsData, setChildsData] = useState(false);
  const [childsDataLoading, setChildsDataLoading] = useState(false);

  const [childsPageLoading, setChildsPageLoading] = useState(false);

  const [childsSearchLoading, setChildsSearchLoading] = useState(false);

  const handleNextPage = (list, currentPage, setNewPage, next, rowSize) => {
    if (next) {
      if (list.length > currentPage * rowSize) {
        setNewPage(currentPage + 1);
      }
      if (
        list.length < (currentPage + 1) * rowSize + 6 &&
        list.length < childsData.length &&
        !childsPageLoading &&
        (!filterBtn || (filters.value === "all" && searchInput === ""))
      ) {
        setChildsPageLoading(true);
        findTagChildsPageById(tag._id, { page: list.length / 50 });
      }
    } else {
      if (page !== 1) {
        let newPage = currentPage - 1;
        setNewPage(newPage);
      }
    }
  };

  useEffect(() => {
    if (
      childs &&
      childs[0] &&
      !childsData &&
      !childsDataLoading &&
      childs.length >= 50
    ) {
      setChildsDataLoading(true);
      findTagChildsDataById(tag._id);
    }
  }, []);

  useEffect(() => {
    if (childsDataLoading && responseFindTagChildsDataById) {
      if (responseFindTagChildsDataById.success) {
        setChildsData(responseFindTagChildsDataById.data);
        setChildsDataLoading(false);
      } else {
        setChildsDataLoading(false);
      }
    }
  }, [responseFindTagChildsDataById]);

  useEffect(() => {
    if (childsPageLoading && responseFindTagChildsPageById) {
      if (responseFindTagChildsPageById.success) {
        setChilds([...childs, ...responseFindTagChildsPageById.data.childs]);
        setChildsPageLoading(false);
      } else {
        setChildsPageLoading(false);
      }
    }
  }, [responseFindTagChildsPageById]);

  const [filterBtn, setFilterBtn] = useState(false);
  const [filters, setFilters] = useState({ value: "all", label: t("all") });

  const [filtersOptions, setFiltersOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (childsData && !filtersOptions[0]) {
      const newOptions = [{ value: "all", label: t("all") }];
      childsData.options.map((option) =>
        newOptions.push({
          value: option.value,
          label: getContent(option.title, i18n.language),
        })
      );
      setFiltersOptions([...new Set(newOptions)]);
    }
  }, [childsData]);
  const [filteredList, setFilteredList] = useState(childs);

  useEffect(() => {
    let newFilteredList = [];
    if (filters && filters.value !== "all") {
      childs.map((child) => {
        if (
          child &&
          child.types &&
          child.types[0] &&
          child.types[0]._id &&
          filters &&
          filters.value
        ) {
          if (child.types[0]._id === filters.value) {
            newFilteredList.push(child);
          }
        }
      });
      setChildsPage(1);

      setFilteredList(newFilteredList);
    } else newFilteredList = childs;
    if (searchInput.length > 2) {
      const matchingList = [];
      newFilteredList.map((child) => {
        if (
          child &&
          child.title &&
          child.title !== "" &&
          child.title
            .toLowerCase()
            .replace(/[^\w ]/, "")
            .includes(searchInput.toLowerCase().replace(/[^\w ]/, ""))
        ) {
          matchingList.push(child);
        }
      });
      setChildsPage(1);

      setFilteredList(matchingList);
    }
    if (!filterBtn || (filters.value === "all" && searchInput === ""))
      setFilteredList(childs);
    else if (searchInput.length > 2 || filters.value !== "all") {
      setChildsSearchLoading(true);
      searchTagChildsById(tag._id, {
        query: searchInput,
        filters: filters,
      });
    }
  }, [filters, searchInput, filterBtn, childs]);

  useEffect(() => {
    if (childsSearchLoading && responseSearchTagChildsById) {
      if (responseSearchTagChildsById.success) {
        setFilteredList([...responseSearchTagChildsById.data.childs]);
        setChildsSearchLoading(false);
      } else {
        setChildsSearchLoading(false);
      }
    }
  }, [responseSearchTagChildsById]);

  return (
    <div className="">
      <div className="is-flex is-justify-content-space-between">
        <button
          className="button is-light"
          id="backBtn"
          onClick={handleBack}>
          <FontAwesomeIcon icon={faRotateLeft} size="lg" />
          <strong>&nbsp;{t("back")}</strong>
        </button>
        {client &&
        client.user &&
        (client.user.type === "admin" ||
          client.user.type === "moderator" ||
          client.user.type ===
            "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
          <div>
            {!updateTag ? (
              <button
                className="button is-primary"
                onClick={handleUpdate}>
                <span><strong>{t("update")}</strong>&nbsp;</span>
              </button>
            ) : (
              <>
                {!mergeTag ? (
                  <button
                    className="button is-primary  mr-2"
                    onClick={() => {
                      setMergeTag(true);
                    }}>
                    <span><strong>{t("merge")}</strong>&nbsp;</span>
                  </button>
                ) : null}
                <button
                  className="button is-info"
                  onClick={() => {
                    if (mergeTag) setMergeTag(false);
                    else setUpdateTag(false);
                  }}>
                  <span><strong>{t("cancel")}</strong>&nbsp;</span>
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
      {!updateTag ? (
        <>
        
          <h3 className="subtitle is-2 mt-0 pt-0 mb-6">
            <strong className="has-text-primary">
              {getContent(tag.title, i18n.language)}
            </strong>
          </h3>
          <div className="is-flex is-justify-content-space-between">
            <div className="is-flex is-justify-content-start">
              {!childsDataLoading && childsData.length ? (
                <span className="tag is-primary is-medium is-rounded">
                  {childsData.length} {t("results")}
                </span>
              ) : null}
              {childsDataLoading || childsPageLoading || childsSearchLoading ? (
                <span className="button tag is-rounded is-medium has-background-transparent is-borderless has-text-primary is-loading"></span>
              ) : null}

              {childsData && childsData.length > 5 ? (
                <button
                  className="button is-primary has-background-transparent is-small is-rounded     ml-3 "
                  onClick={() => setFilterBtn(!filterBtn)}>
                  <strong>
                    <FontAwesomeIcon
                      icon={filterBtn ? faEyeSlash : faArrowDownAZ}
                    />{" "}
                    {filterBtn ? null : <>&nbsp;&nbsp;{t("filters")}</>}{" "}
                  </strong>
                </button>
              ) : null}
              {filterBtn ? (
                <>
                  {filtersOptions.length > 2 ? (
                    <div className="ml-1">
                      <SelectForm
                        selected={filters}
                        select={setFilters}
                        options={filtersOptions}
                        applicationSettings={applicationSettings}
                        mode="filters"
                      />
                    </div>
                  ) : (
                    <>&nbsp;&nbsp;</>
                  )}
                  <div className="field pb-0 mb-0">
                    <div
                      className="control has-icons-left ml-1 "
                      style={{ minWidth: "200px" }}>
                      <input
                        type="text"
                        className="input is-rounded is-small py-3 "
                        value={searchInput}
                        onChange={(e) => {
                          e.preventDefault();
                          setSearchInput(e.target.value);
                        }}
                      />
                      <span className="icon is-left ">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </span>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="mt--1 mb-3">
              {childsPage !== 1 ? (
                <button
                  className="button is-white"
                  onClick={() => setChildsPage(childsPage - 1)}>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className=" is-size-3 has-text-grey"
                  />
                </button>
              ) : null}

              {filteredList.length > 15 * childsPage ? (
                <button
                  className="button is-white"
                  onClick={() =>
                    handleNextPage(
                      filteredList,
                      childsPage,
                      setChildsPage,
                      true,
                      15
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
            {filteredList.map((doc, i) => {
              if (
                (childsPage === 1 && i < 15) ||
                (i > (childsPage - 1) * 15 - 1 && i < childsPage * 15)
              ) {
                return (
                  <Fragment key={JSON.stringify(doc)}>
                    <SearchItem
                      item={{ doc: doc }}
                      setDisplay={handleDisplay}
                      i={i}
                    />
                  </Fragment>
                );
              }
            })}
          </div>
        </>
      ) : client &&
        client.user &&
        (client.user.type === "admin" ||
          client.user.type === "moderator" ||
          client.user.type ===
            "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
        <>
          {updateTag === "loading" ? (
            <div className="loader">
              <div className="inner one"></div>
              <div className="inner two"></div>
              <div className="inner three"></div>
            </div>
          ) : (
            <div className="is-flex is-justify-content-center columns">
              {!mergeTag ? (
                <div className="column is-half container">
                  <div className="tabs">
                    <ul>
                      <li
                        onClick={() => setIdLang("fr")}
                        className={idLang === "fr" ? "is-active" : ""}>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          Français
                        </a>
                      </li>
                      <li
                        onClick={() => setIdLang("en")}
                        className={idLang === "en" ? "is-active" : ""}>
                        <a href="#" onClick={(e) => e.preventDefault()}>
                          English
                        </a>
                      </li>
                    </ul>
                  </div>
                  <DocTagsForm
                    tag={updateTag}
                    handleSearchTag={handleSearchTag}
                    setUpdateTag={setUpdateTag}
                    setAlert={setAlert}
                    lang={idLang}
                  />
                </div>
              ) : (
                <div className="column is-half container">
                  <h3 className="subtitle  is-4 has-text-grey mt-0 pt-0 mb-1">
                    <small>{t("merge")}:</small>
                  </h3>
                  <h3 className="subtitle is-2 has-text-grey mt-0 pt-0 mb-6">
                    <strong className="has-text-primary">
                      {getContent(tag.title, i18n.language)}
                    </strong>
                  </h3>
                  <DocTagsForm
                    merge={updateTag}
                    handleSearchTag={handleSearchTag}
                    setUpdateTag={setUpdateTag}
                    setMergeTag={setMergeTag}
                    setAlert={setAlert}
                    lang={idLang}
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

const getContent = (value, lang = "en") => {
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
