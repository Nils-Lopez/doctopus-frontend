import React, { useState, useEffect, Fragment } from "react";

import { useRoles } from "../../../utils/hooks/Roles";
import { useTags } from "../../../utils/hooks/Tags";
import { usePeople } from "../../../utils/hooks/People";
import { useEntities } from "../../../utils/hooks/Entities";
import { useDocTemplates } from "../../../utils/hooks/templates/DocTemplates";
import { useUsers } from "../../../utils/hooks/Users";
import { useDocs } from "../../../utils/hooks/docs/Docs";

import DocTagsForm from "../../atoms/forms/docs/DocTagsForm";
import RoleForm from "../../atoms/forms/RoleForm";
import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm";
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm";
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import SearchTagsForm from "../../atoms/forms/docs/SearchTagsForm";
import SelectForm from "../../atoms/forms/SelectForm";

const TemplatesForm = ({
  client,
  setClient,
  setAlert,
  applicationSettings,
}) => {
  const [editTemplate, setEditTemplate] = useState(false);
  const { t, i18n } = useTranslation();

  const [nameValue, setNameValue] = useState("");
  const [descValue, setDescValue] = useState(true);
  const [langValue, setLangValue] = useState(true);
  const [langEnDefaultValue, setLangEnDefaultValue] = useState("");
  const [langFrDefaultValue, setLangFrDefaultValue] = useState("");
  const [selectedLangs, selectLang] = useState([]);
  const [typeValue, setTypeValue] = useState(true);
  const [publiDateValue, setPubliDateValue] = useState(true);
  const [dateValue, setDateValue] = useState(true);
  const [copyrightsValue, setCopyrightsValue] = useState(true);
  const [urlValue, setUrlValue] = useState(true);
  const [pdfValue, setPdfValue] = useState(true);
  const [eanValue, setEanValue] = useState(true);
  const [pagesValue, setPagesValue] = useState(true);
  const [durationValue, setDurationValue] = useState(true);
  const [thumbValue, setThumbValue] = useState(true);
  const [volumeValue, setVolumeValue] = useState(true);
  const [numberValue, setNumberValue] = useState(true);
  const [parentRolesValue, setParentRolesValue] = useState(true);
  const [orgValue, setOrgValue] = useState(true);
  const [peopleValue, setPeopleValue] = useState(true);
  const [projValue, setProjValue] = useState(true);
  const [supportDescValue, setSupportDescValue] = useState(true);
  const [tagValue, setTagValue] = useState(true);
  const [copiesValue, setCopiesValue] = useState(true);
  const [copiesLocation, setCopiesLocation] = useState(true);
  const [copiesPosition, setCopiesPosition] = useState(true);
  const [copiesRank, setCopiesRank] = useState(true);
  const [copiesQuality, setCopiesQuality] = useState(true);
  const [idLang, setIdLang] = useState("fr");
  const [formatValue, setFormatValue] = useState(true);
  const [accessValue, setAccessValue] = useState(true);
  const [issnValue, setIssnValue] = useState(true);
  const [issnDefault, setIssnDefault] = useState("");
  const [materialValue, setMaterialValue] = useState(false);
  const [dimensionsValue, setDimensionsValue] = useState(false);
  const [locationValue, setLocationValue] = useState(false);

  const handleEditTemplate = (template) => {
    setNameValue(template.schema_name);
    setDescValue(template.description);
    setLangValue(template.languages.exist);
    setLocationValue(template.location);
    setDimensionsValue(template.dimensions);
    setMaterialValue(template.material);
    setLangEnDefaultValue("");
    setLangFrDefaultValue("");
    selectLang(
      template.langs
        ? template.langs.map((l) => {
            return { value: l._id, label: getContent(l.title, i18n.language) };
          })
        : []
    );
    setTypeValue(template.support_role);
    selectType(template.support_role_defaults);
    setSupportDescValue(template.support_desc);
    setPubliDateValue(template.support_publishedAt);
    setUrlValue(template.support_url);
    setPdfValue(template.support_pdf);
    setEanValue(template.support_eanIsbn);
    setPagesValue(template.support_pages);
    setDurationValue(template.support_duration);
    setThumbValue(template.support_thumb);
    setParentRolesValue(template.parent_role);
    selectRole(template.parent_role_defaults);
    setOrgValue(template.parent_entity);
    selectOrg(template.parent_entity_defaults);
    setPeopleValue(template.parent_person);
    selectPerson(template.parent_person_defaults);
    setProjValue(template.parent_project);
    selectProj(template.parent_project_defaults);
    setTagValue(template.tag);
    selectTag(template.tag_defaults);
    setEditTemplate(template._id);
    setCopiesValue(template.copies);
    setCopiesLocation(template.copies_location);
    setCopiesRank(template.copies_rank);
    setCopiesPosition(template.copies_position);
    setFormatValue(template.support_format);
    setAccessValue(template.support_accessibility);
    setIssnValue(template.support_issn);
    setIssnDefault(template.support_issn_default);
    setVolumeValue(template.support_volume);
    setNumberValue(template.support_number);
    setCopiesQuality(template.copies_quality);
    setCopyrightsValue(template.copyrights);
    setDateValue(template.support_date);
    selectDocType(template.type_defaults);
  };

  const handleNewTemplate = () => {
    setNameValue("");
    setDescValue(true);
    setLangValue(true);
    setLangEnDefaultValue("");
    setLangFrDefaultValue("");
    setTypeValue(true);
    selectType([]);
    setSupportDescValue(true);
    setPubliDateValue(true);
    setUrlValue(true);
    setPdfValue(true);
    setEanValue(true);
    setPagesValue(true);
    setDurationValue(true);
    setThumbValue(true);
    setParentRolesValue(true);
    selectRole([]);
    setOrgValue(true);
    selectOrg([]);
    setPeopleValue(true);
    selectPerson([]);
    setProjValue(true);
    selectProj([]);
    setTagValue(true);
    selectTag([]);
    setEditTemplate(false);
    setCopiesValue(true);
    setCopiesLocation(true);
    setCopiesRank(true);
    setCopiesPosition(true);
    setFormatValue(true);
    setAccessValue(true);
    setIssnValue(true);
    setIssnDefault("");
    setVolumeValue(true);
    setNumberValue(true);
    setCopiesQuality(true);
    setCopyrightsValue(true);
    setDateValue(true);
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

  const [selectedTypes, selectType] = useState([]);
  const [selectedRoles, selectRole] = useState([]);
  const [selectedOrg, selectOrg] = useState([]);
  const [selectedPeople, selectPerson] = useState([]);
  const [selectedProj, selectProj] = useState([]);
  const [selectedTags, selectTag] = useState([]);
  const [selectedDocTypes, selectDocType] = useState([]);
  const [docTypeValue, setDocTypeValue] = useState(true);

  const [docTemplates, setDocTemplates] = useState([]);

  const [docTemplatesLoading, setDocTemplatesLoading] = useState(false);
  const [loadingCreateDocTemplate, setLoadingCreateDocTemplate] =
    useState(false);
  const [loadingUpdateDocTemplate, setLoadingUpdateDocTemplate] =
    useState(false);

  const {
    responseFindAllDocTemplates,
    findAllDocTemplates,
    createDocTemplate,
    responseCreateDocTemplate,
    updateDocTemplate,
    responseUpdateDocTemplate,
    deleteDocTemplate,
    responseDeleteDocTemplate,
  } = useDocTemplates();

  if (!docTemplates[0] && !docTemplatesLoading) {
    findAllDocTemplates();
    setDocTemplatesLoading(true);
  }

  useEffect(() => {
    if (responseFindAllDocTemplates && responseFindAllDocTemplates.success) {
      setDocTemplates(responseFindAllDocTemplates.data);
      setDocTemplatesLoading(false);
    }
  }, [responseFindAllDocTemplates]);

  const handleNameChange = (e) => {
    e.preventDefault();
    setNameValue(e.target.value);
  };

  const handleLangDefaultChange = (e) => {
    e.preventDefault();
    if (idLang === "en") {
      setLangEnDefaultValue(e.target.value);
    } else {
      setLangFrDefaultValue(e.target.value);
    }
  };

  const handleTemplateSubmit = (e) => {
    e.preventDefault();
    const reqData = {
      template: {
        schema_name: nameValue,
        schema_slug: nameValue.toLowerCase(),
        description: descValue,
        languages: { exist: langValue, defaults: selectedLangs },
        lang: langValue,
        langs: selectedLangs.map((lang) => lang.value),
        location: locationValue,
        dimensions: dimensionsValue,
        material: materialValue,
        //Relations
        support_role: typeValue, //Kind of doc support (media, book, ebook, article, movie etc)
        support_desc: supportDescValue,
        support_publishedAt: publiDateValue, //Publication date of support
        support_url: urlValue, //Url of media
        support_pdf: pdfValue, //Url of pdf
        support_eanIsbn: eanValue, //EAN OR ISBN key
        support_pages: pagesValue, //Number of pages
        support_duration: durationValue, //Duration of video/movie
        support_thumb: thumbValue, //Url of thumbnail
        support_format: formatValue, //
        support_accessibility: accessValue,
        support_issn: issnValue,
        support_issn_default: issnDefault,
        parent_role: parentRolesValue,
        parent_entity: orgValue,
        parent_project: projValue,
        parent_person: peopleValue,
        tag: tagValue,
        type: docTypeValue,
        copies: copiesValue,
        copies_position: copiesPosition,
        copies_location: copiesLocation,
        copies_rank: copiesRank,
        copies_quality: copiesQuality,
        support_volume: volumeValue,
        support_number: numberValue,
        support_date: dateValue,
        copyrights: copyrightsValue,
        schema_parent: parentTemplate,
      },
      support_role_defaults: selectedTypes,
      type_defaults: selectedDocTypes,
      parent_role_defaults: selectedRoles,
      parent_entity_defaults: selectedOrg,
      parent_person_defaults: selectedPeople,
      parent_project_defaults: selectedProj,
      tag_defaults: selectedTags,
    };
    if (editTemplate) {
      if (reqData.template.schema_parent)
        reqData.template.schema_parent = {
          _id: reqData.template.schema_parent._id,
        };
      updateDocTemplate(reqData, editTemplate);
      setLoadingUpdateDocTemplate(true);
    } else {
      createDocTemplate(reqData);
      setLoadingCreateDocTemplate(true);
    }
  };

  useEffect(() => {
    if (
      responseCreateDocTemplate &&
      responseCreateDocTemplate.success &&
      loadingCreateDocTemplate
    ) {
      setAlert({
        type: "success",
        message: { en: t("template-created"), fr: t("template-created") },
      });
      setDocTemplates([...docTemplates, responseCreateDocTemplate.data]);
      handleNewTemplate();
      setLoadingCreateDocTemplate(false);
    } else if (responseCreateDocTemplate) {
      setAlert({
        type: "error",
        message: {
          en: t("error-template-create"),
          fr: t("error-template-create"),
        },
      });
      setLoadingCreateDocTemplate(false);
    }
  }, [responseCreateDocTemplate]);

  useEffect(() => {
    if (
      responseUpdateDocTemplate &&
      responseUpdateDocTemplate.success &&
      loadingUpdateDocTemplate
    ) {
      setAlert({
        type: "success",
        message: { en: t("template-updated"), fr: t("template-updated") },
      });
      setLoadingUpdateDocTemplate(false);
    } else if (responseUpdateDocTemplate && loadingUpdateDocTemplate) {
      setAlert({
        type: "error",
        message: {
          en: t("error-template-update"),
          fr: t("error-template-update"),
        },
      });
    }
  }, [responseUpdateDocTemplate]);

  const { updateUser, responseUpdateUser } = useUsers();

  const setDefaultTemplate = (id) => {
    updateUser({ defaultTemplate: id }, client.user._id);
    const user = { ...client.user };
    user.defaultTemplate = id;
    setClient({ ...client, user: user });
  };

  useEffect(() => {
    if (responseUpdateUser && responseUpdateUser.success) {
      setAlert({
        type: "success",
        message: {
          en: "Template has been sucessfully set as default",
          fr: "Le template a été configuré par défaut avec succès !",
        },
      });
    } else if (responseUpdateUser && !responseUpdateUser.success) {
      setAlert({
        type: "error",
        message: {
          en: "An error occured while adding default template.",
          fr: "Une erreure est survenue lors de l'ajout du template par défaut",
        },
      });
    }
  }, [responseUpdateUser]);

  useEffect(() => {
    if (responseDeleteDocTemplate && responseDeleteDocTemplate.success) {
      setAlert({
        type: "success",
        message: {
          en: "Template has been sucessfully deleted",
          fr: "Le template a été supprimé avec succès !",
        },
      });
    } else if (responseUpdateUser && !responseUpdateUser.success) {
      setAlert({
        type: "error",
        message: {
          en: "An error occured while deleting template.",
          fr: "Une erreure est survenue lors de la suppression du template !",
        },
      });
    }
  }, [responseDeleteDocTemplate]);

  const handleCopiesChange = () => {
    if (!copiesValue === false) {
      setCopiesLocation(false);
      setCopiesPosition(false);
      setCopiesRank(false);
      setCopiesQuality(false);
    }
    setCopiesValue(!copiesValue);
  };

  const handleIssnDefaultChange = (e) => {
    e.preventDefault();
    setIssnDefault(e.target.value);
  };

  //Handle double form sub-templates/models

  const [parentTemplate, setParentTemplate] = useState(null);
  const [displayChilds, setDisplayChilds] = useState(null);

  useEffect(() => {
    if (parentTemplate) {
      parentTemplate.support_role_defaults?.map((r) => {
        if (!selectedTypes.includes(r)) selectType([...selectedTypes, r]);
      });
      parentTemplate.type_defaults?.map((r) => {
        if (!selectedDocTypes.includes(r))
          selectDocType([...selectedDocTypes, r]);
      });
      parentTemplate.tag_defaults?.map((t) => {
        if (!selectedTags.includes(t)) selectTag([...selectedTags, t]);
      });
    }
  }, [parentTemplate]);

  const { findAllLanguages, responseFindAllLanguages } = useDocs();

  const [languagesOptions, setLanguagesOptions] = useState([]);

  useEffect(() => {
    if (!responseFindAllLanguages && !languagesOptions[0]) {
      findAllLanguages();
    }
  }, []);

  useEffect(() => {
    if (responseFindAllLanguages && responseFindAllLanguages.success) {
      const newOptions = [];
      responseFindAllLanguages.data.map((lang) => {
        newOptions.push({
          value: lang._id,
          label: getContent(lang.title, i18n.language),
        });
      });
      setLanguagesOptions(newOptions);
    }
  }, [responseFindAllLanguages]);

  return loadingCreateDocTemplate ||
    loadingUpdateDocTemplate ||
    docTemplatesLoading ? (
    <>
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </>
  ) : (
    <>
      <div className=" mb-6 template-form-panel is-shadowless">
        {docTemplates.map((template) => {
          if (
            (!parentTemplate || parentTemplate._id === template._id) &&
            !template.schema_parent
          ) {
            return (
              <Fragment key={template.schema_slug}>
                <div
                  className="panel-block columns "
                  onClick={() => {
                    setDisplayChilds(
                      displayChilds === template ? null : template
                    );
                  }}>
                  <div className="column is-four-fifth">
                    <span className="panel-block">{template.schema_name}</span>
                  </div>
                  <div className="column is-one-quarter is-flex is-justify-content-end">
                    {client &&
                    client.user &&
                    client.user.defaultTemplate &&
                    (client.user.defaultTemplate._id === template._id ||
                      client.user.defaultTemplate === template._id) ? (
                      <>
                        <span className="tag is-primary is-medium z-100">
                          {t("default")}
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          className="button is-outline-primary is-small z-100"
                          onClick={() => setDefaultTemplate(template._id)}>
                          {t("set-default")}
                        </button>
                      </>
                    )}
                    {client &&
                    client.user &&
                    client.user.type ===
                      "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice" ? (
                      <>
                        {!editTemplate || editTemplate !== template._id ? (
                          <button
                            className="button is-info is-small ml-3 z-100"
                            onClick={() => {
                              handleEditTemplate(template);
                              setParentTemplate(null);
                            }}>
                            {t("edit")}
                          </button>
                        ) : (
                          <button
                            className="button is-danger is-small ml-3 z-100"
                            onClick={() => {
                              deleteDocTemplate(template._id);
                              setDocTemplates(
                                docTemplates.filter(
                                  (doc) => doc._id !== template._id
                                )
                              );
                            }}>
                            {t("delete")}
                          </button>
                        )}
                      </>
                    ) : null}
                    {parentTemplate ? (
                      <button
                        className="button is-danger is-small ml-3 z-100"
                        onClick={() => {
                          setParentTemplate(null);
                          handleNewTemplate();
                        }}>
                        {t("cancel")}
                      </button>
                    ) : (
                      <button
                        className="button is-info is-small ml-3 z-100"
                        onClick={() => setParentTemplate(template)}>
                        {t("create-template")}
                      </button>
                    )}
                  </div>
                </div>
                {displayChilds &&
                  displayChilds.schema_childs &&
                  displayChilds.schema_childs[0] &&
                  displayChilds === template &&
                  displayChilds.schema_childs.map((child) => {
                    return (
                      <Fragment key={JSON.stringify(child)}>
                        <div className="panel-block columns panel-hover pt-0 pb-0 ">
                          <div className="column is-four-fifth">
                            <span className="panel-block">
                              <small className="has-text-grey">
                                <i>{t("template")}: </i>
                              </small>{" "}
                              &nbsp;{child.schema_name}
                            </span>
                          </div>
                          <div className="column is-one-quarter is-flex is-justify-content-end">
                            {!editTemplate || editTemplate !== child._id ? (
                              <button
                                className="button is-info is-small ml-3 z-100"
                                onClick={() => {
                                  setParentTemplate(template);
                                  handleEditTemplate(child);
                                }}>
                                {t("edit")}
                              </button>
                            ) : (
                              <>
                                {client &&
                                client.user &&
                                client.user.type ===
                                  "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice" ? (
                                  <>
                                    <button
                                      className="button is-danger is-small ml-3 z-100"
                                      onClick={() => {
                                        deleteDocTemplate(child._id);
                                        setDocTemplates(
                                          docTemplates.filter(
                                            (doc) => doc._id !== child._id
                                          )
                                        );
                                      }}>
                                      {t("delete")}
                                    </button>
                                  </>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      </Fragment>
                    );
                  })}
              </Fragment>
            );
          }
        })}
        {editTemplate ? (
          <div className="panel-block">
            <button className="button is-primary" onClick={handleNewTemplate}>
              <span> {t("create-template")}</span>
            </button>
          </div>
        ) : null}
      </div>
      <hr />
      {parentTemplate ||
      (client &&
        client.user &&
        client.user.type ===
          "Grand:Mafieu:De:La:Tech:s/o:Smith:dans:la:Matrice") ? (
        <form onSubmit={handleTemplateSubmit}>
          <div className="field">
            <label className="label ">{t("template-name")}</label>
            <input
              type="text"
              className="input"
              value={nameValue}
              onChange={handleNameChange}
            />
          </div>
          {!parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  <input
                    id="switchDesc"
                    type="checkbox"
                    name="switchDesc"
                    className="switch is-rtl"
                    checked={descValue ? "checked" : ""}
                    value={descValue}
                    onChange={() => {
                      setDescValue(!descValue);
                    }}
                  />
                  <label htmlFor="switchDesc" className="label">
                    {t("description")}
                  </label>
                </div>
              </div>
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  <input
                    id="switchCopyr"
                    type="checkbox"
                    name="switchCopyr"
                    className="switch is-rtl"
                    checked={copyrightsValue ? "checked" : ""}
                    value={copyrightsValue}
                    onChange={() => setCopyrightsValue(!copyrightsValue)}
                  />
                  <label htmlFor="switchCopyr" className="label">
                    {t("copyrights")}
                  </label>
                </div>
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.lang) || !parentTemplate ? (
            <div className="columns ml-6 mr-6  mt-3">
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  {!parentTemplate ? (
                    <input
                      id="switchLang"
                      type="checkbox"
                      name="switchLang"
                      className="switch is-rtl"
                      checked={langValue ? "checked" : ""}
                      value={langValue}
                      onChange={() => setLangValue(!langValue)}
                    />
                  ) : null}
                  <label htmlFor="switchLang" className="label">
                    {t("language")}
                  </label>
                </div>
              </div>
              <div className="column">
                <SelectForm
                  applicationSettings={applicationSettings}
                  select={selectLang}
                  selected={selectedLangs}
                  options={languagesOptions}
                  multiple={true}
                />
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.tag) || !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column">
                <div className="field is-flex is-flex is-justify-content-start">
                  {!parentTemplate ? (
                    <input
                      id="switchTags"
                      type="checkbox"
                      name="switchTags"
                      className="switch is-rtl"
                      checked={tagValue ? "checked" : ""}
                      value={tagValue}
                      onChange={() => setTagValue(!tagValue)}
                    />
                  ) : null}
                  <label htmlFor="switchTags" className="label">
                    {t("tags")}
                  </label>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  {tagValue ? (
                    <>
                      <SearchTagsForm
                        selectedTags={selectedTags}
                        selectTag={selectTag}
                        location="templates-tags"
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.type) || !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column">
                <div className="field is-flex is-flex is-justify-content-start">
                  {!parentTemplate ? (
                    <input
                      id="switchDocTypes"
                      type="checkbox"
                      name="switchDocTypes"
                      className="switch is-rtl"
                      checked={docTypeValue ? "checked" : ""}
                      value={docTypeValue}
                      onChange={() => setDocTypeValue(!docTypeValue)}
                    />
                  ) : null}
                  <label htmlFor="switchDocTypes" className="label">
                    {t("types")}
                  </label>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  {docTypeValue ? (
                    <>
                      <RoleForm
                        location={"templates"}
                        scope="docs"
                        selectedRoles={selectedDocTypes}
                        selectRole={selectDocType}
                        lang={idLang}
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {!parentTemplate ||
            (parentTemplate &&
              (parentTemplate.support_issn || parentTemplate.support_role))}
          {(parentTemplate && parentTemplate.support_role) ||
          !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column">
                <div className="field is-flex is-flex is-justify-content-start">
                  {!parentTemplate ? (
                    <input
                      id="switchExample"
                      type="checkbox"
                      name="switchExample"
                      className="switch is-rtl"
                      checked={typeValue ? "checked" : ""}
                      value={typeValue}
                      onChange={() => setTypeValue(!typeValue)}
                    />
                  ) : null}
                  <label htmlFor="switchExample" className="label">
                    {t("supports")} {t("types")}
                  </label>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  {typeValue ? (
                    <>
                      <RoleForm
                        location={"templates"}
                        scope="docs"
                        selectedRoles={selectedTypes}
                        selectRole={selectType}
                        lang={idLang}
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.support_issn) ||
          !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column is-flex is-justify-content-start">
                <div className="field is-flex is-flex is-justify-content-start">
                  {!parentTemplate ? (
                    <input
                      id="switchIssn"
                      type="checkbox"
                      name="switchIssn"
                      className="switch is-rtl"
                      value={issnValue}
                      checked={issnValue ? "checked" : ""}
                      onChange={() => setIssnValue(!issnValue)}
                    />
                  ) : null}
                  <label htmlFor="switchIssn" className="label">
                    {t("issn")}
                  </label>
                </div>
              </div>
              <div className="column is-flex is-justify-content-space-between">
                <div className="field">
                  {issnValue ? (
                    <>
                      <input
                        type="text"
                        placeholder="Default ISSN"
                        className="input"
                        value={issnDefault}
                        onChange={handleIssnDefaultChange}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="input"
                        value={issnDefault}
                        onChange={handleIssnDefaultChange}
                        disabled
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {!parentTemplate ? (
            <>
              <div className="columns ml-6 mr-6">
                <div className="column is-half">
                  <div className="field is-flex is-flex is-justify-content-space-between">
                    <input
                      id="switchDescSupp"
                      type="checkbox"
                      name="switchDescSupp"
                      className="switch is-rtl"
                      value={supportDescValue}
                      checked={supportDescValue ? "checked" : ""}
                      onChange={() => setSupportDescValue(!supportDescValue)}
                    />
                    <label htmlFor="switchDescSupp" className="label">
                      {t("description")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchDate"
                      type="checkbox"
                      name="switchDate"
                      className="switch is-rtl"
                      value={publiDateValue}
                      checked={publiDateValue ? "checked" : ""}
                      onChange={() => setPubliDateValue(!publiDateValue)}
                    />
                    <label htmlFor="switchDate" className="label">
                      {t("sort-date")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchDateTxt"
                      type="checkbox"
                      name="switchDateTxt"
                      className="switch is-rtl"
                      value={dateValue}
                      checked={dateValue ? "checked" : ""}
                      onChange={() => setDateValue(!dateValue)}
                    />
                    <label htmlFor="switchDateTxt" className="label">
                      {t("date-text")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchPdf"
                      type="checkbox"
                      name="switchPdf"
                      className="switch is-rtl"
                      value={pdfValue}
                      checked={pdfValue ? "checked" : ""}
                      onChange={() => setPdfValue(!pdfValue)}
                    />
                    <label htmlFor="switchPdf" className="label">
                      Pdf
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchEan"
                      type="checkbox"
                      name="switchEan"
                      className="switch is-rtl"
                      value={eanValue}
                      checked={eanValue ? "checked" : ""}
                      onChange={() => setEanValue(!eanValue)}
                    />
                    <label htmlFor="switchEan" className="label">
                      {t("ean-isbn")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchVolume"
                      type="checkbox"
                      name="switchVolume"
                      className="switch is-rtl"
                      value={volumeValue}
                      checked={volumeValue ? "checked" : ""}
                      onChange={() => setVolumeValue(!volumeValue)}
                    />
                    <label htmlFor="switchVolume" className="label">
                      {t("volume")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchFormat"
                      type="checkbox"
                      name="switchFormat"
                      className="switch is-rtl"
                      value={formatValue}
                      checked={formatValue ? "checked" : ""}
                      onChange={() => setFormatValue(!formatValue)}
                    />
                    <label htmlFor="switchFormat" className="label">
                      {t("format")}
                    </label>
                  </div>
                </div>
                <div className="column is-half">
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchPages"
                      type="checkbox"
                      name="switchPages"
                      className="switch is-rtl"
                      value={pagesValue}
                      checked={pagesValue ? "checked" : ""}
                      onChange={() => setPagesValue(!pagesValue)}
                    />
                    <label htmlFor="switchPages" className="label">
                      {t("pages")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchDuration"
                      type="checkbox"
                      name="switchDuration"
                      className="switch is-rtl"
                      value={durationValue}
                      checked={durationValue ? "checked" : ""}
                      onChange={() => setDurationValue(!durationValue)}
                    />
                    <label htmlFor="switchDuration" className="label">
                      {t("duration")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchThumb"
                      type="checkbox"
                      name="switchThumb"
                      className="switch is-rtl"
                      value={thumbValue}
                      checked={thumbValue ? "checked" : ""}
                      onChange={() => setThumbValue(!thumbValue)}
                    />
                    <label htmlFor="switchThumb" className="label">
                      {t("thumbnail")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchUrl"
                      type="checkbox"
                      name="switchUrl"
                      className="switch is-rtl"
                      checked={urlValue ? "checked" : ""}
                      onChange={() => setUrlValue(!urlValue)}
                    />
                    <label htmlFor="switchUrl" className="label">
                      {t("link-url")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchAccess"
                      type="checkbox"
                      name="switchAccess"
                      className="switch is-rtl"
                      checked={accessValue ? "checked" : ""}
                      onChange={() => setAccessValue(!accessValue)}
                    />
                    <label htmlFor="switchAccess" className="label">
                      {t("accessibility")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchNumber"
                      type="checkbox"
                      name="switchNumber"
                      className="switch is-rtl"
                      checked={numberValue ? "checked" : ""}
                      onChange={() => setNumberValue(!numberValue)}
                    />
                    <label htmlFor="switchNumber" className="label">
                      {t("number")}
                    </label>
                  </div>

                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchLocation"
                      type="checkbox"
                      name="switchLocation"
                      className="switch is-rtl"
                      checked={locationValue ? "checked" : ""}
                      onChange={() => setLocationValue(!locationValue)}
                    />
                    <label htmlFor="switchLocation" className="label">
                      {t("Location")}
                    </label>
                  </div>

                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchDimensions"
                      type="checkbox"
                      name="switchDimensions"
                      className="switch is-rtl"
                      checked={dimensionsValue ? "checked" : ""}
                      onChange={() => setDimensionsValue(!dimensionsValue)}
                    />
                    <label htmlFor="switchDimensions" className="label">
                      {t("Dimensions")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchMaterial"
                      type="checkbox"
                      name="switchMaterial"
                      className="switch is-rtl"
                      checked={materialValue ? "checked" : ""}
                      onChange={() => setMaterialValue(!materialValue)}
                    />
                    <label htmlFor="switchMaterial" className="label">
                      {t("Material")}
                    </label>
                  </div>
                </div>
              </div>
              <hr />
              <div className="columns mr-6 ml-6">
                <div className="column is-half">
                  <div className="field is-flex is-flex is-justify-content-space-between">
                    <input
                      id="switchCopies"
                      type="checkbox"
                      name="switchCopies"
                      className="switch is-rtl"
                      checked={copiesValue ? "checked" : ""}
                      onChange={() => handleCopiesChange()}
                    />
                    <label htmlFor="switchCopies" className="label">
                      {t("copies")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-space-between">
                    <input
                      id="switchRank"
                      type="checkbox"
                      name="switchRank"
                      className="switch is-rtl"
                      checked={copiesRank ? "checked" : ""}
                      onChange={() => setCopiesRank(!copiesRank)}
                    />
                    <label htmlFor="switchRank" className="label">
                      {t("rank")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-space-between">
                    <input
                      id="switchQUal"
                      type="checkbox"
                      name="switchQUal"
                      className="switch is-rtl"
                      checked={copiesQuality ? "checked" : ""}
                      onChange={() => setCopiesQuality(!copiesQuality)}
                    />
                    <label htmlFor="switchQUal" className="label">
                      {t("quality")}
                    </label>
                  </div>
                </div>
                <div className="column is-half">
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchPosition"
                      type="checkbox"
                      name="switchPosition"
                      className="switch is-rtl"
                      checked={copiesPosition ? "checked" : ""}
                      onChange={() => setCopiesPosition(!copiesPosition)}
                    />
                    <label htmlFor="switchPosition" className="label">
                      {t("position")}
                    </label>
                  </div>
                  <div className="field is-flex is-flex is-justify-content-start">
                    <input
                      id="switchLoc"
                      type="checkbox"
                      name="switchLoc"
                      className="switch is-rtl"
                      checked={copiesLocation ? "checked" : ""}
                      onChange={() => setCopiesLocation(!copiesLocation)}
                    />
                    <label htmlFor="switchLoc" className="label">
                      {t("location")}
                    </label>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ) : null}
          <hr />

          <h3 className="title is-4">{t("parents")}</h3>

          {(parentTemplate && parentTemplate.parent_entity) ||
          !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  {!parentTemplate ? (
                    <input
                      id="switchParentOrg"
                      type="checkbox"
                      name="switchParentOrg"
                      className="switch is-rtl"
                      checked={orgValue ? "checked" : ""}
                      onChange={() => setOrgValue(!orgValue)}
                    />
                  ) : null}
                  <label htmlFor="switchParentOrg" className="label">
                    {t("organization")}
                  </label>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  {orgValue ? (
                    <>
                      <OrganisationParentForm
                        location={"templates-parents"}
                        selectedOrg={selectedOrg}
                        selectOrg={selectOrg}
                        lang={idLang}
                        hideRoles={!parentRolesValue}
                        client={client}
                        setAlert={setAlert}
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.parent_project) ||
          !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  {!parentTemplate ? (
                    <input
                      id="switchParentProj"
                      type="checkbox"
                      name="switchParentProj"
                      className="switch is-rtl"
                      checked={projValue ? "checked" : ""}
                      onChange={() => setProjValue(!projValue)}
                    />
                  ) : null}
                  <label htmlFor="switchParentProj" className="label">
                    {t("projects")}
                  </label>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  {projValue ? (
                    <>
                      <ProjectParentForm
                        location={"templates-parents"}
                        selectedProj={selectedProj}
                        selectProj={selectProj}
                        lang={idLang}
                        hideRoles={!parentRolesValue}
                        client={client}
                        setAlert={setAlert}
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {(parentTemplate && parentTemplate.parent_person) ||
          !parentTemplate ? (
            <div className="columns ml-6 mr-6">
              <div className="column is-flex is-justify-content-start">
                <div className="field">
                  {!parentTemplate ? (
                    <input
                      id="switchParentPeople"
                      type="checkbox"
                      name="switchParentPeople"
                      className="switch is-rtl"
                      checked={peopleValue ? "checked" : ""}
                      onChange={() => setPeopleValue(!peopleValue)}
                    />
                  ) : null}
                  <label htmlFor="switchParentPeople" className="label">
                    {t("people")}
                  </label>
                </div>
              </div>
              <div className="column ">
                <div className="field">
                  {peopleValue ? (
                    <>
                      <PersonParentForm
                        location={"templates-parents"}
                        selectedPeople={selectedPeople}
                        selectPerson={selectPerson}
                        lang={idLang}
                        hideRoles={!parentRolesValue}
                        client={client}
                        setAlert={setAlert}
                      />
                    </>
                  ) : (
                    <>
                      <input type="text" className="input" disabled />
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          <button type="submit" className="button is-primary mt-4">
            <span>
              {editTemplate ? t("update-template") : t("create-template")}
            </span>
          </button>
        </form>
      ) : null}
    </>
  );
};

export default TemplatesForm;
