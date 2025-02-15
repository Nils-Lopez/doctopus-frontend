import React, { useState, Fragment, useEffect, useCallback } from "react";

import RoleForm from "../../atoms/forms/RoleForm";

import { useEntities } from "../../../utils/hooks/Entities";

import ActorForm from "../../atoms/forms/orgs/ActorForm";
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm";
import DocTagsForm from "../../atoms/forms/docs/DocTagsForm";
import { useTranslation } from "react-i18next";
import MergeForm from "../../atoms/forms/MergeForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { usePeople } from "../../../utils/hooks/People";
import SearchForm from "../../atoms/forms/SearchForm";
const OrganisationForm = ({
  client,
  setAlert,
  setCreated,
  dataUpdate,
  setDataUpdate,
  draftOrg,
}) => {
  const [nameValue, setNameValue] = useState("");
  const [descEnValue, setDescEnValue] = useState("");
  const [descFrValue, setDescFrValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [idLang, setIdLang] = useState("fr");
  const [langEnValue, setLangEnValue] = useState("");
  const [langFrValue, setLangFrValue] = useState("");
  const [selectedLangs, selectLang] = useState([]);

  const [selectedRoles, selectRole] = useState([]);
  const [selectedActors, selectActor] = useState([]);
  const [selectedProj, selectProj] = useState([]);

  const [loading, setLoading] = useState(false);

  const [aliases, setAliases] = useState([]);

  const [postalAddress, setPostalAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [activityStartDate, setActivityStartDate] = useState("");
  const [activityEndDate, setActivityEndDate] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    findEntityById,
    responseFindEntityById,
    createEntity,
    responseCreateEntity,
    updateEntity,
    responseUpdateEntity,
    deleteEntity,
    mergeEntities,
    responseMergeEntities,
    searchEntities,
    responseSearchEntities,
    responseDeleteEntity,
    findEntityBySlug,
    responseFindEntityBySlug,
  } = useEntities();

  const handleNameChange = (e) => {
    e.preventDefault();
    setNameValue(e.target.value);
  };

  const handleDescChange = (e) => {
    e.preventDefault();
    if (i18n.language === "en") {
      setDescEnValue(e.target.value);
    } else {
      setDescFrValue(e.target.value);
    }
  };

  const handleUrlChange = (e) => {
    e.preventDefault();
    setUrlValue(e.target.value);
  };

  const handleCityChange = (e) => {
    e.preventDefault();
    setCityValue(e.target.value);
  };

  const handleCountryChange = (e) => {
    e.preventDefault();
    setCountryValue(e.target.value);
  };

  const handleLangChange = (e) => {
    e.preventDefault();
    if (i18n.language === "en") {
      setLangEnValue(e.target.value);
    } else {
      setLangFrValue(e.target.value);
    }
  };

  const addLang = (e) => {
    e.preventDefault();
    const newLang = {
      labels: [
        { lang: "en", content: langEnValue },
        { lang: "fr", content: langFrValue },
      ],
      code:
        langEnValue !== ""
          ? langEnValue.slice(0, 2).toLowerCase()
          : langFrValue.slice(0, 2).toLowerCase(),
    };
    selectLang([...selectedLangs, newLang]);
    setLangEnValue("");
    setLangFrValue("");
  };

  const handleDeleteLang = (e, lang) => {
    e.preventDefault();
    const filtered = selectedLangs.filter((l) => {
      return l.code !== lang.code;
    });
    selectLang(filtered);
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

  const handleAliasAdd = (e) => {
    e.preventDefault();
    const value = e.target.parentElement.previousElementSibling.querySelector('input').value;
    if (value && value.trim()) {
      setAliases([...aliases, value.trim()]);
      e.target.parentElement.previousElementSibling.querySelector('input').value = '';
    }
  };

  const handleAliasRemove = (index) => {
    setAliases(aliases.filter((_, i) => i !== index));
  };

  // Debounced search function
  const debouncedAddressSearch = useCallback(
    (() => {
      let timeoutId;
      return (address) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async () => {
          if (address.length > 5) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
              );
              const data = await response.json();
              setAddressSuggestions(data.slice(0, 5));
              setShowSuggestions(true);
            } catch (error) {
              console.error("Error fetching address details:", error);
            }
          } else {
            setAddressSuggestions([]);
            setShowSuggestions(false);
          }
        }, 1500); // Wait 500ms after last keystroke before searching
      };
    })(),
    []
  );

  const handlePostalAddressSearch = (e) => {
    const address = e.target.value;
    setPostalAddress(address);
    debouncedAddressSearch(address);
  };

  const handleAddressSelect = (suggestion) => {
    setPostalAddress(suggestion.display_name);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (dataUpdate && nameValue !== dataUpdate.name) {
      setNameValue(dataUpdate.name);
      if (dataUpdate.description && dataUpdate.description[0]) {
        setDescFrValue(getContent(dataUpdate.description, "fr"));
        setDescEnValue(getContent(dataUpdate.description, "en"));
      }
      setUrlValue(dataUpdate.url);
      setCityValue(dataUpdate.city);
      setCountryValue(dataUpdate.country);
      selectLang(dataUpdate.languages);
      selectRole(dataUpdate.roles);
      selectActor(dataUpdate.associatedPeople);
      selectProj(dataUpdate.proj);
      setAliases(dataUpdate.aliases || []);
      setPostalAddress(dataUpdate.postalAddress || "");
      setLatitude(dataUpdate.latitude || "");
      setLongitude(dataUpdate.longitude || "");
      setContactEmail(dataUpdate.contactEmail || "");
      setActivityStartDate(dataUpdate.activityStartDate ? new Date(dataUpdate.activityStartDate).toISOString().split('T')[0] : "");
      setActivityEndDate(dataUpdate.activityEndDate ? new Date(dataUpdate.activityEndDate).toISOString().split('T')[0] : "");
    }
  }, [dataUpdate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const reqData = {
      entity: {
        name: nameValue,
        description: [
          { lang: "en", content: descEnValue },
          { lang: "fr", content: descFrValue },
        ],
        type: "entity",
        url: urlValue,
        slug: nameValue.replaceAll(" ", "-").toLowerCase(),
        city: cityValue,
        country: countryValue,
        languages: selectedLangs,
        associatedPeople: selectedActors,
        aliases: aliases,
        postalAddress,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        contactEmail,
        activityStartDate: activityStartDate || null,
        activityEndDate: activityEndDate || null,
      },
      roles: selectedRoles,
      projects: selectedProj,
    };
    if (dataUpdate) {
      await updateEntity(reqData, dataUpdate._id);
    } else {
      await createEntity(reqData);
    }
  };

  useEffect(() => {
    if (responseCreateEntity && responseCreateEntity.success) {
      setLoading(false);
      if (setCreated) {
        setCreated(responseCreateEntity.data);
      } else {
        setAlert({
          type: "success",
          message: {
            en: "Organisation has been successfully created.",
            fr: "L'organisation a été créé avec succès",
          },
        });
      }
    } else if (responseCreateEntity && !responseCreateEntity.success) {
      setAlert({
        type: "error",
        message: {
          en: "An error occured while creating organisation.",
          fr: "Une erreure est survenue lors de la création de l'organisation",
        },
      });
      setLoading(false);
    }
  }, [responseCreateEntity]);

  useEffect(() => {
    if (responseUpdateEntity && responseUpdateEntity.success) {
      setAlert({
        type: "success",
        message: {
          en: "Organisation has been successfully created.",
          fr: "L'organisation a été créé avec succès",
        },
      });
      setLoading(false);
      setDataUpdate({ success: true });
    } else if (responseUpdateEntity && !responseUpdateEntity.success) {
      setAlert({
        type: "error",
        message: {
          en: "An error occured while creating organisation.",
          fr: "Une erreure est survenue lors de la création de l'organisation",
        },
      });
      setLoading(false);
    }
  }, [responseUpdateEntity]);

  useEffect(() => {
    if (responseMergeEntities && responseMergeEntities.success) {
      setAlert({
        type: "success",
        message: {
          en: "Organisation has been successfully merged.",
          fr: "L'organisation a été fusionné avec succès",
        },
      });
      setLoading(false);
      setDataUpdate({ success: true });
    } else if (responseMergeEntities && !responseMergeEntities.success) {
      setAlert({
        type: "error",
        message: {
          en: "An error occured while merging organisation.",
          fr: "Une erreure est survenue lors de la fusion de l'organisation",
        },
      });
      setLoading(false);
    }
  }, [responseMergeEntities]);

  const { t, i18n } = useTranslation();

  const [confirmDelete, setConfirmDelete] = useState(false);
  let navigate = useNavigate();

  const handleDeleteOrg = (e) => {
    e.preventDefault();
    if (confirmDelete) {
      deleteEntity(dataUpdate._id);
      setConfirmDelete(false);
      setAlert({
        type: "success",
        message: {
          en: "Document has been successfully deleted.",
          fr: "Le document a été supprimé avec succès",
        },
      });
      navigate("/");
    } else {
      setConfirmDelete(true);
    }
  };

  useEffect(() => {
    if (draftOrg && draftOrg.name) {
      setNameValue(draftOrg.name);
    }
  }, [draftOrg]);
  const [merge, setMerge] = useState(false);

  const handleMergeOrg = (e) => {
    e.preventDefault();
    setMerge(!merge);
  };

  const {
    searchPeople,
    responseSearchPeople,
  } = usePeople();



  return loading ? (
    <div className="loader">
      <div className="inner one"></div>
      <div className="inner two"></div>
      <div className="inner three"></div>
    </div>
  ) : (
    <div >
      <div className="is-flex is-justify-content-end">
        {dataUpdate ? (
          <>
            <button
              className="button is-primary is-small mt-3 ml-3"
              onClick={handleMergeOrg}>
              {!merge ? t("merge") : t("cancel")}
            </button>
            <button
              className="button is-danger is-small mt-3 ml-3"
              onClick={handleDeleteOrg}>
              {confirmDelete ? t("confirm") : t("delete")}
            </button>
          </>
        ) : null}
      </div>
      {merge ? (
        <>
          <MergeForm
            originItem={dataUpdate}
            searchItem={searchEntities}
            responseSearchItem={responseSearchEntities}
            mergeItem={mergeEntities}
          />
        </>
      ) : (
        <>
          <div className="field">
            <label className="label has-text-left">{t("name")}</label>
            <input
              type="text"
              value={nameValue}
              onChange={handleNameChange}
              className="input"
            />
          </div>
          <div className="field">
            <label className="label has-text-left">{t("description")}</label>
            <textarea
              value={i18n.language === "en" ? descEnValue : descFrValue}
              onChange={handleDescChange}
              className="textarea"></textarea>
          </div>

          <div className="field">
            <label className="label has-text-left">{t("link-url")}</label>
            <input
              type="text"
              value={urlValue}
              onChange={handleUrlChange}
              className="input"
            />
          </div>
          <div className="columns">
            <div className="column field">
              <label className="label has-text-left">{t("city")}</label>
              <input
                type="text"
                value={cityValue}
                onChange={handleCityChange}
                className="input"
              />
            </div>
            <div className="column field">
              <label className="label has-text-left">{t("country")}</label>
              <input
                type="text"
                value={countryValue}
                onChange={handleCountryChange}
                className="input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label has-text-left">Adresse postale</label>
            <div className="dropdown is-active" style={{ width: '100%' }}>
              <div className="dropdown-trigger" style={{ width: '100%' }}>
                <input
                  type="text"
                  value={postalAddress}
                  onChange={handlePostalAddressSearch}
                  onFocus={() => setShowSuggestions(true)}
                  className="input"
                  placeholder="Rechercher une adresse..."
                />
              </div>
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="dropdown-menu" style={{ width: '100%' }}>
                  <div className="dropdown-content">
                    {addressSuggestions.map((suggestion, index) => (
                      <a
                        key={index}
                        className="dropdown-item"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        {suggestion.display_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="columns">
            <div className="column field">
              <label className="label has-text-left">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="input"
                readOnly
              />
            </div>
            <div className="column field">
              <label className="label has-text-left">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="input"
                readOnly
              />
            </div>
          </div>

          <div className="field">
            <label className="label has-text-left">Email de contact</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="input"
            />
          </div>

          <div className="columns">
            <div className="column field">
              <label className="label has-text-left">Date début d'activité</label>
              <input
                type="date"
                value={activityStartDate}
                onChange={(e) => setActivityStartDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="column field">
              <label className="label has-text-left">Date fin d'activité</label>
              <input
                type="date"
                value={activityEndDate}
                onChange={(e) => setActivityEndDate(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <label className="label has-text-left mb--1 mt--2">
            {t("roles")}
          </label>
          <RoleForm
            scope="parents"
            location="org-form"
            selectedRoles={selectedRoles}
            selectRole={selectRole}
            lang={i18n.language}
          />
          <label className="label has-text-left mb--1 mt-3">
            {t('people')}
            </label>
        <SearchForm selectedItems={selectedActors} selectItem={selectActor} searchItems={searchPeople} responseSearchItems={responseSearchPeople} mainField={"name"}/>
     
        

          <div className="field ">
            <label className="label has-text-left">Alias</label>
            <div className="is-flex is-flex-wrap-wrap mb-2">
              {aliases.map((alias, index) => (
                <span key={index} className="tag is-info is-medium mr-2 mb-2">
                  {alias}
                  <button className="delete is-small" onClick={() => handleAliasRemove(index)}></button>
                </span>
              ))}
            </div>
            <div className="field has-addons mt--1">
              <div className="control is-expanded">
                <input type="text" className="input"/>
              </div>
              <div className="control">
                <button className="button is-info" onClick={handleAliasAdd}>
                  {t("add")}
                </button>
              </div>
            </div>
          </div>

          <footer className="card-footer mt-3 pt-4 is-flex is-justify-content-end">
            <button
              className="button is-primary is-radiusless"
              onClick={handleFormSubmit}>
              {t("confirm")}
            </button>
          </footer>
        </>
      )}
    </div>

  );
};

export default OrganisationForm;
