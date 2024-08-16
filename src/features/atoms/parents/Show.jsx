import React, { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faAngleRight,
  faAngleLeft,
  faCopy,
  faCheck,
  faCircleXmark,
  faShareAlt,
  faPlusCircle,
  faPlus,
  faArrowDownAZ,
  faEyeSlash,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import SearchItemParent from "./SearchItem";
import SearchItemDoc from "../docs/SearchItem";

import SelectForm from "../forms/SelectForm";
import PersonForm from "../../molecules/Create/PersonForm";
import OrganisationForm from "../../molecules/Create/OrganisationForm";
import ProjectForm from "../forms/orgs/ProjectForm";
import Slider from "@mui/material/Slider";

import { useProjects } from "../../../utils/hooks/entities/Projects";
import { useProds } from "../../../utils/hooks/Prods";
import {
  TwitterShareButton,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { useEntities } from "../../../utils/hooks/Entities";
import { usePeople } from "../../../utils/hooks/People";
import { useLocation, useNavigate } from "react-router-dom";

const Show = ({
  parent,
  client,
  setAlert,
  handleSearchParent,
  handleSearchDoc,
  handleSearchScapinID,
  handleBack,
  applicationSettings,
}) => {
  const [dataUpdate, setDataUpdate] = useState(false);

  const { t, i18n } = useTranslation();
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
    entities,
    productionIds,
    prodIds,
    createdDocs,
    parents,
  } = parent;

  const [childs, setChilds] = useState(parent.childs);

  const [productionsScapin, setProductions] = useState(false);
  const [prodLoading, setProdLoading] = useState(false);
  
  let navigate = useNavigate();

  const {
    findProdByIds,
    responseFindProdByIds,
    findProdsByString, 
    responseFindProdsByString,
    findEntityByName,
    responseFindEntityByName,
    findPersonByName,
    responseFindPersonByName,
  } = useProds();

  const [childsData, setChildsData] = useState(false);
  const [childsDataLoading, setChildsDataLoading] = useState(false);

  const [childsPageLoading, setChildsPageLoading] = useState(false);

  const [childsSearchLoading, setChildsSearchLoading] = useState(false);
  const {
    findProjectChildsDataById,
    responseFindProjectChildsDataById,
    findProjectChildsPageById,
    responseFindProjectChildsPageById,
    searchProjectChildsById,
    responseSearchProjectChildsById,
  } = useProjects();

  const {
    findPersonChildsDataById,
    responseFindPersonChildsDataById,
    findPersonChildsPageById,
    responseFindPersonChildsPageById,
    searchPersonChildsById,
    responseSearchPersonChildsById,
  } = usePeople();

  const {
    findEntityChildsDataById,
    responseFindEntityChildsDataById,
    findEntityChildsPageById,
    responseFindEntityChildsPageById,
    searchEntityChildsById,
    responseSearchEntityChildsById,
  } = useEntities();

  useEffect(() => {
    if (
      childs &&
      childs[0] &&
      !childsData &&
      !childsDataLoading &&
      childs.length >= 16
    ) {
      setChildsDataLoading(true);
      switch (window.location.pathname.split("/")[1]) {
        case "project":
          findProjectChildsDataById(window.location.pathname.split("/")[2]);
          break;
        case "entity":
          findEntityChildsDataById(window.location.pathname.split("/")[2]);
          break;
        case "person":
          findPersonChildsDataById(window.location.pathname.split("/")[2]);
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (childsDataLoading && responseFindProjectChildsDataById) {
      if (responseFindProjectChildsDataById.success) {
        setChildsData(responseFindProjectChildsDataById.data);
        setChildsDataLoading(false);
      } else {
        setChildsDataLoading(false);
      }
    }
    if (childsDataLoading && responseFindPersonChildsDataById) {
      if (responseFindPersonChildsDataById.success) {
        setChildsData(responseFindPersonChildsDataById.data);
        setChildsDataLoading(false);
      } else {
        setChildsDataLoading(false);
      }
    }
    if (childsDataLoading && responseFindEntityChildsDataById) {
      if (responseFindEntityChildsDataById.success) {
        setChildsData(responseFindEntityChildsDataById.data);
        setChildsDataLoading(false);
      } else {
        setChildsDataLoading(false);
      }
    }
  }, [
    responseFindProjectChildsDataById,
    responseFindEntityChildsDataById,
    responseFindPersonChildsDataById,
  ]);

  useEffect(() => {
    if (!prodLoading && !productionsScapin[0]) {
      setProdLoading(true)
      if (parent.firstName) {
        findProdsByString(parent.lastName + ", " + parent.firstName, "person");
      } else if (parent.name) {
        findProdsByString(parent.name, "entity");
      }
    }
    
  }, []);

  useEffect(() => {
    if (responseFindProdsByString && prodLoading) {
      setProductions(responseFindProdsByString);
      setProdLoading(false);
    } else if (prodLoading) {
      setProdLoading("doesn't exist");
    }
  }, [responseFindProdsByString]);

  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (dataUpdate && dataUpdate.success && dataUpdate._id) {
      handleSearchParent(dataUpdate);
      setDataUpdate(false);
    }
  }, [dataUpdate]);

  useEffect(() => {
    if ((productions && productions[0]) || (createdDocs && createdDocs[0])) {
      if (!docs[0]) {
        const newDocs = [];
        if (productions) {
          productions.map((prod) => {
            if (prod.docs) {
              prod.docs.map((doc) => {
                if (
                  !newDocs.includes({ ...doc, relTypes: prod.roles[0] }) &&
                  !newDocs.includes({ ...doc })
                )
                  newDocs.push({ ...doc, relTypes: prod.roles[0] });
              });
            } else if (prod.title) {
              if (!newDocs.includes(prod)) newDocs.push(prod);
            }
          });
        }

        if (createdDocs) {
          createdDocs.map((doc) => {
            if (!newDocs.includes(doc)) newDocs.push(doc);
          });
        }
        const finalDocs = newDocs.filter(function (item, pos) {
          return newDocs.indexOf(item) == pos;
        });
        if (finalDocs[0] && finalDocs !== docs) {
          setDocs([...new Set(finalDocs)]);
        }
      }
    }
  }, [docs, parent]);

  useEffect(() => {
    if (page === 1) {
      setDataList(docs.slice(0, 20));
    } else {
      setDataList(docs.slice(page * 10, page * 10 + 20));
    }
  }, [page, docs]);

  const removeDuplicates = (arr) => {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      if (!(arr[i]._id in seen)) {
        ret_arr.push(arr[i]);
        seen[arr[i]._id] = true;
      }
    }
    return ret_arr;
  };

  let filteredRoles = roles ? removeDuplicates(roles) : [];

  const [showScapinParent, setShowScapinParent] = useState(false);

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
      if (item.entity) {
        findEntityByName(item.entity.name);
      } else if (item.person) {
        findPersonByName(item.person.name)
      }
    }
  };

  useEffect(() => {
    if (responseFindPersonByName && responseFindPersonByName.success) {
      navigate('/person/' + responseFindPersonByName.data._id)
    } else if (responseFindPersonByName) {
      setAlert({
        type: "light",
        message: {en: t('no-additional-data'), fr: t('no-additional-data')}
      })
    }
  }, [responseFindPersonByName])
  useEffect(() => {
    if (responseFindEntityByName && responseFindEntityByName.success) {
      
      navigate('/entity/' + responseFindEntityByName.data._id)
    } else if (responseFindEntityByName) {
      setAlert({
        type: "light",
        message: {en: t('no-additional-data'), fr: t('no-additional-data')}
      })
    }
  }, [responseFindEntityByName])

  const [productionsPage, setProductionsPage] = useState(1);
  const [parentsPage, setParentsPage] = useState(1);
  const [childsPage, setChildsPage] = useState(1);

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
        switch (window.location.pathname.split("/")[1]) {
          case "project":
            setChildsPageLoading(true);
            findProjectChildsPageById(window.location.pathname.split("/")[2], {
              page: list.length / 50,
            });
            break;
          case "entity":
            setChildsPageLoading(true);
            findEntityChildsPageById(window.location.pathname.split("/")[2], {
              page: list.length / 50,
            });
            break;
          case "person":
            setChildsPageLoading(true);
            findPersonChildsPageById(window.location.pathname.split("/")[2], {
              page: list.length / 50,
            });
            break;
          default:
            break;
        }
      }
    } else {
      if (page !== 1) {
        let newPage = currentPage - 1;
        setNewPage(newPage);
      }
    }
  };

  useEffect(() => {
    const filteredChilds = []
    childs.map((child) => {
      if (child.doc && child.doc._id) {
        let isUnique = true
        filteredChilds.map((c) => {
          if (c.doc._id === child.doc._id) isUnique = false
        })
        if (isUnique) filteredChilds.push(child)
      }
    })
    if (filteredChilds.length !== childs.length) setChilds(filteredChilds)
  }, [childs])

  useEffect(() => {
    if (childsPageLoading && responseFindProjectChildsPageById) {
      if (responseFindProjectChildsPageById.success) {
        setChilds([
          ...childs,
          ...responseFindProjectChildsPageById.data.childs,
        ]);
        setChildsPageLoading(false);
      } else {
        setChildsPageLoading(false);
      }
    }
    if (childsPageLoading && responseFindEntityChildsPageById) {
      if (responseFindEntityChildsPageById.success) {
        setChilds([...childs, ...responseFindEntityChildsPageById.data.childs]);
        setChildsPageLoading(false);
      } else {
        setChildsPageLoading(false);
      }
    }
    if (childsPageLoading && responseFindPersonChildsPageById) {
      if (responseFindPersonChildsPageById.success) {
        setChilds([...childs, ...responseFindPersonChildsPageById.data.childs]);
        setChildsPageLoading(false);
      } else {
        setChildsPageLoading(false);
      }
    }
  }, [
    responseFindProjectChildsPageById,
    responseFindPersonChildsPageById,
    responseFindEntityChildsPageById,
  ]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1300);
    }
  }, [copied]);

  const [shareBtn, setShareBtn] = useState(false);

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
          child.doc &&
          child.doc.types &&
          child.doc.types[0] &&
          child.doc.types[0]._id &&
          filters &&
          filters.value
        ) {
          if (child.doc.types[0]._id === filters.value) {
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
          child.doc &&
          child.doc.title &&
          child.doc.title !== "" &&
          child.doc.title
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
      switch (window.location.pathname.split("/")[1]) {
        case "project":
          setChildsSearchLoading(true);
          searchProjectChildsById(window.location.pathname.split("/")[2], {
            query: searchInput,
            filters: filters,
          });
          break;
        case "entity":
          setChildsSearchLoading(true);
          searchEntityChildsById(window.location.pathname.split("/")[2], {
            query: searchInput,
            filters: filters,
          });
          break;
        case "person":
          setChildsSearchLoading(true);
          searchPersonChildsById(window.location.pathname.split("/")[2], {
            query: searchInput,
            filters: filters,
          });
          break;
        default:
          break;
      }
    }
  }, [filters, searchInput, filterBtn, childs]);

  useEffect(() => {
    if (childsSearchLoading && responseSearchProjectChildsById) {
      if (responseSearchProjectChildsById.success) {
        const newFilteredList = [...filteredList];
        responseSearchProjectChildsById.data.childs.map((child) => {
          let unique = true;
          newFilteredList.map((c) => {
            if (c._id === child._id) unique = false;
          });
          if (unique) newFilteredList.push(child);
        });
        setFilteredList([...newFilteredList]);
        setChildsSearchLoading(false);
      } else {
        setChildsSearchLoading(false);
      }
    }
    if (childsSearchLoading && responseSearchPersonChildsById) {
      if (responseSearchPersonChildsById.success) {
        const newFilteredList = [...filteredList];
        responseSearchPersonChildsById.data.childs.map((child) => {
          let unique = true;
          newFilteredList.map((c) => {
            if (c._id === child._id) unique = false;
          });
          if (unique) newFilteredList.push(child);
        });
        setFilteredList([...newFilteredList]);
        setChildsSearchLoading(false);
      } else {
        setChildsSearchLoading(false);
      }
    }
    if (childsSearchLoading && responseSearchEntityChildsById) {
      if (responseSearchEntityChildsById.success) {
        const newFilteredList = [...filteredList];
        responseSearchEntityChildsById.data.childs.map((child) => {
          let unique = true;
          newFilteredList.map((c) => {
            if (c._id === child._id) unique = false;
          });
          if (unique) newFilteredList.push(child);
        });
        setFilteredList([...newFilteredList]);
        setChildsSearchLoading(false);
      } else {
        setChildsSearchLoading(false);
      }
    }
  }, [
    responseSearchProjectChildsById,
    responseSearchEntityChildsById,
    responseSearchPersonChildsById,
  ]);

  return showScapinParent ? (
    <>
      <Show
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
      {dataUpdate.projects ? (
        <OrganisationForm
          client={client}
          setAlert={setAlert}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      ) : dataUpdate.entities ? (
        <>
          <ProjectForm
            client={client}
            setAlert={setAlert}
            dataUpdate={dataUpdate}
            setDataUpdate={setDataUpdate}
          />
        </>
      ) : (
        <>
          <PersonForm
            client={client}
            setAlert={setAlert}
            dataUpdate={dataUpdate}
            setDataUpdate={setDataUpdate}
          />
        </>
      )}
    </>
  ) : (
    <div className="">
      <div className="is-flex is-justify-content-space-between mb-5">
        <div className="actions-btn">
          <button
            className="button is-light "
            id="backBtn"
            onClick={handleBack}>
            <FontAwesomeIcon icon={faRotateLeft} size="lg" />
            <strong>&nbsp;{t("back")}</strong>
          </button>
          <button
            className={
              !copied
                ? "button is-light is-light ml-3"
                : "button is-light has-text-primary  ml-3"
            }
            onClick={() => {
              setShareBtn(!shareBtn);
            }}>
            {!shareBtn ? (
              <FontAwesomeIcon icon={faShareAlt} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} size="lg" />
            )}
          </button>
          {client &&
          client.user &&
          (client.user.type === "admin" ||
            client.user.type === "moderator" ||
            client.user.type ===
              "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
            <>
              <button
                className="button is-primary ml-3 "
                onClick={() => setDataUpdate(parent)}>
                <span>{t("update")}</span>
              </button>
            </>
          ) : null}
        </div>
        <div>
          {roles && roles[0] ? (
            <>
              {filteredRoles.map((type) => {
                return (
                  <Fragment key={JSON.stringify(type)}>
                    <span className="tag is-large has-text-info has-background-transparent mr-1 ml-1 mb-0">
                      {getContent(type.title, i18n.language)}
                    </span>
                  </Fragment>
                );
              })}
            </>
          ) : (
            <span className="tag is-large has-text-info has-background-transparent mr-1 ml-1 mb-0">
              <strong className="has-text-info">
                {parent.scapin
                  ? t("production")
                  : parent.projects
                  ? t("organization")
                  : parent.entities
                  ? t("project")
                  : t("person")}
              </strong>
            </span>
          )}
        </div>
      </div>
      {shareBtn ? (
        <div
          className="is-flex mt--1 is-justify-content-start ml-5 pl-1"
          onClick={() => setShareBtn(false)}>
          <button
            className={
              !copied
                ? "button is-white ml-3"
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
            className="button is-white ml-3">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={window.location.href}
            className="button is-white ml-3">
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <PinterestShareButton
            url={window.location.href}
            className="button is-white ml-3">
            <PinterestIcon size={32} round />
          </PinterestShareButton>
        </div>
      ) : null}
      <h1 className="mt-2 has-text-left title is-1">
        {title && title !== ""
          ? title
          : name && name !== ""
          ? name
          : firstName + " " + lastName}
      </h1>
      {parent && parent.scapin ? (
        <>
          {parent.description && parent.description !== "" ? (
            <p className=" subtitle is-5 mt-2 has-text-left">
              {parent.description}
            </p>
          ) : null}
        </>
      ) : (
        <>
          {description && description[0] ? (
            <p className=" subtitle is-5 mt-2 has-text-left">
              {getContent(description, i18n.language)}
            </p>
          ) : null}
          {languages && languages[0] ? (
            <p className="has-text-left">
              {getContent(languages[0].labels, i18n.language)}
            </p>
          ) : null}
        </>
      )}
      <div className="container mt-3">
        {country && country !== "" ? (
          <div className="is-flex is-justify-content-start">
            {typeof country === "string" ? (
              <span className="">{country}</span>
            ) : (
              country.map((c) => {
                if (c.labels[0]) {
                  return (
                    <Fragment key={JSON.stringify(c)}>
                      <span className="">
                        {getContent(c.labels, i18n.language)}
                      </span>
                    </Fragment>
                  );
                }
              })
            )}
          </div>
        ) : null}
        {city && city !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">{city}</span>
          </div>
        ) : null}
        {website && website !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="tag is-light is-small mb-2  mr-1">
              <a href={website}>{website}</a>
            </span>
          </div>
        ) : null}
        {url && url !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="tag is-light is-small mb-2 mr-1">
              <a className="logolink test" href={url}>{url}</a>
            </span>
          </div>
        ) : null}
        {birthDate && birthDate !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">
              {t("birthdate")}:{" "}
              {new Date(birthDate).getDate() +
                "/" +
                (new Date(birthDate).getMonth() + 1) +
                "/" +
                new Date(birthDate).getFullYear()}{" "}
              {deathDate && deathDate !== ""
                ? " - " +
                  t("deathdate") +
                  ": " +
                  new Date(deathDate).getDate() +
                  "/" +
                  (new Date(deathDate).getMonth() + 1) +
                  "/" +
                  new Date(deathDate).getFullYear()
                : null}
            </span>
          </div>
        ) : null}
        {startedAt && startedAt !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">
              {t("birthdate")}:{" "}
              {new Date(startedAt).getDate() +
                "/" +
                (new Date(startedAt).getMonth() + 1) +
                "/" +
                new Date(startedAt).getFullYear()}{" "}
              {endedAt && endedAt !== ""
                ? " - " +
                  t("deathdate") +
                  ": " +
                  new Date(endedAt).getDate() +
                  "/" +
                  (new Date(endedAt).getMonth() + 1) +
                  "/" +
                  new Date(endedAt).getFullYear()
                : null}
            </span>
          </div>
        ) : null}

        {issn && issn !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">ISSN: {issn} </span>
          </div>
        ) : null}
        {date && date !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">
              {parent.scapin && t("season")} {date}{" "}
            </span>
          </div>
        ) : null}
        {parent.publishedAt && parent.publishedAt !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">
              {t("firstdate")}{" "}
              {new Date(parent.publishedAt).getDate() +
                "/" +
                (new Date(parent.publishedAt).getMonth() + 1) +
                "/" +
                new Date(parent.publishedAt).getFullYear()}{" "}
            </span>
          </div>
        ) : null}
        {parent.duration && parent.duration !== "" ? (
          <div className="is-flex is-justify-content-start">
            <span className="">
              {t("duration")} {parent.duration}{" "}
            </span>
          </div>
        ) : null}
        {parent.scapin ? (
          <div className="is-flex is-justify-content-end">
            <div className="is-inline-block">
              <a
                href={
                  "https://scapin.aml-cfwb.be/recherche/details/?pid=" +
                  parent._id
                }
                target="_blank"
                className="scapin-link">
                {t("read-more-scapin")}
              </a>
            </div>
          </div>
        ) : null}
      </div>
      {productionsScapin && productionsScapin[0] ? (
        <>
          <hr />

          <div className="is-flex is-justify-content-space-between pt-2">
            <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 mb-0">
              {t("productions")}
            </h3>

            <div className="mt--3">
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
      <div className="columns is-multiline mb-6">
        {productionsScapin && productionsScapin[0]
          ? productionsScapin.map((prodScapin, i) => {
              if (
                (productionsPage === 1 && i < 8) ||
                (i > (productionsPage - 1) * 8 - 1 && i < productionsPage * 8)
              ) {
                return (
                  <Fragment key={JSON.stringify(prodScapin)}>
                    <SearchItemParent
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
          <hr />
          <div className="is-flex is-justify-content-space-between">
            <h3 className="subtitle has-text-grey has-text-left is-6 mt--2 mb-1">
              {t("relations")}
            </h3>

            <div className="mt--1">
              {parentsPage !== 1 ? (
                <button
                  className="button is-white"
                  onClick={() => setParentsPage(parentsPage - 1)}>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className=" is-size-3 has-text-grey"
                  />
                </button>
              ) : null}

              {parents.length > 8 * parentsPage ? (
                <button
                  className="button is-white"
                  onClick={() =>
                    handleNextPage(
                      parents,
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
          </div>{" "}
        </>
      ) : null}
      <div className="columns is-multiline mb-6">
        {parents && parents[0]
          ? removeDuplicates(parents).map((p, i) => {
              if (
                (parentsPage === 1 && i < 8) ||
                (i > (parentsPage - 1) * 8 - 1 && i < parentsPage * 8)
              ) {
                return (
                  <Fragment key={JSON.stringify(p)}>
                    <SearchItemParent
                      item={p}
                      handleSearchScapinParent={handleSearchScapinParent}
                      handleSearchDoc={handleSearchDoc}
                      i={i}
                    />
                  </Fragment>
                );
              }
            })
          : null}
      </div>
      {(actors && actors[0]) ||
      (entities && entities[0]) ||
      (projects && projects[0]) ? (
        <>
          <hr />

          <h3 className="subtitle has-text-grey has-text-left is-6 mb-5 mt--2">
            {t("relations")}
          </h3>
        </>
      ) : null}
      <div className="columns is-multiline is-flex is-justify-content-start">
        {actors && actors[0]
          ? actors.map((actor) => {
              return (
                <Fragment key={JSON.stringify(actor)}>
                  <SearchItemParent
                    item={{ person: actor }}
                    handleSearchParent={handleSearchParent}
                    relTypes={actor.role}
                  />
                </Fragment>
              );
            })
          : null}
        {entities && entities[0]
          ? entities.map((entity) => (
              <Fragment key={JSON.stringify(entity)}>
                <SearchItemParent
                  item={{ entity: entity }}
                  handleSearchParent={handleSearchParent}
                />
              </Fragment>
            ))
          : null}
      </div>
      <div className="columns is-multiline is-flex is-justify-content-start">
        {projects && projects[0]
          ? removeDuplicates(projects).map((project) => {
              return (
                <Fragment key={JSON.stringify(project)}>
                  <SearchItemParent
                    item={{ project: project }}
                    handleSearchParent={handleSearchParent}
                  />
                </Fragment>
              );
            })
          : null}
      </div>
      {childs && childs[0] ? (
        <>
          <hr />
          <div className="is-flex is-justify-content-space-between pt-1">
            <div className="is-flex is-justify-content-center pb-1">
              <h3 className="subtitle has-text-grey has-text-left  is-6 mt--2 pt-1 mb-0">
                {t("documents")} &nbsp;
                {childsDataLoading ||
                childsPageLoading ||
                childsSearchLoading ? (
                  <span className="button tag is-rounded is-medium has-background-transparent is-borderless has-text-primary is-loading"></span>
                ) : null}
                {!childsData ? null : (
                  <span className="tag is-rounded is-light ">
                    {childsData.length}
                  </span>
                )}
              </h3>
              {childsData && childsData.length > 5 ? (
                <button
                  className="button is-primary  is-small is-rounded   is-filter-btn  ml-3 mt--2 "
                  onClick={() => setFilterBtn(!filterBtn)}>
                  <span>
                    <strong>
                      <FontAwesomeIcon
                        icon={filterBtn ? faEyeSlash : faArrowDownAZ}
                      />{" "}
                      {filterBtn ? null : <>&nbsp;&nbsp;{t("filters")}</>}{" "}
                    </strong>
                  </span>
                </button>
              ) : null}
              {filterBtn ? (
                <>
                  {filtersOptions.length > 2 ? (
                    <div className="ml-1 mt--2">
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
                  <div className="field pb-0 mb-0 mt--2">
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

            <div className="mt--3">
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

              {childsData.length > 15 * childsPage ||
              (!childsData && childs.length > 15) ? (
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
        </>
      ) : (
        console.log(childs)
      )}
      <div className="columns is-multiline is-flex is-justify-content-start">
        {filteredList && filteredList[0]
          ? filteredList.map((child, i) => {
              if (
                (childsPage === 1 && i < 15) ||
                (i > (childsPage - 1) * 15 - 1 && i < childsPage * 15)
              ) {
                let parentType = undefined;
                if (child.person && parent._id === child.person._id)
                  parentType = "person";
                if (child.project && parent._id === child.project._id)
                  parentType = "project";
                if (child.entity && parent._id === child.entity._id)
                  parentType = "entity";
                if (
                  child.roles &&
                  child.roles[0] &&
                  child.roles[0].title &&
                  child.roles[0].title !== ""
                ) {
                  return (
                    <Fragment key={JSON.stringify(child)}>
                      <SearchItemParent
                        item={child}
                        handleSearchParent={handleSearchParent}
                        relTypes={child.roles[0]}
                        handleSearchDoc={handleSearchDoc}
                        parent={parentType}
                        i={i}
                      />
                    </Fragment>
                  );
                } else {
                  return (
                    <Fragment key={JSON.stringify(child)}>
                      <SearchItemParent
                        item={child}
                        handleSearchParent={handleSearchParent}
                        handleSearchDoc={handleSearchDoc}
                        parent={parentType}
                        i={i}
                      />
                    </Fragment>
                  );
                }
              }
            })
          : null}
      </div>

      {/* <div className="columns is-multiline is-flex is-justify-content-center">
            {dataList && dataList[0] ? dataList.map((doc) => {
             
                    return <Fragment key={JSON.stringify(doc)}>
                        <SearchItemDoc item={{doc: doc}} handleSearchDoc={handleSearchDoc} relTypes={doc.relTypes}/>
                    </Fragment>   
                
            }) : null}
         </div> */}
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
