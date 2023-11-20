import React, { useState, Fragment, useEffect } from "react";

import OrganisationParentForm from "../../atoms/forms/docs/OrganisationParentForm";
import PersonParentForm from "../../atoms/forms/docs/PersonParentForm";
import ProjectParentForm from "../../atoms/forms/docs/ProjectParentForm";
import DocParentForm from "../../atoms/forms/docs/DocParentForm";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaste, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ParentForm = ({
  selectedOrg,
  selectOrg,
  selectedPeople,
  selectPerson,
  selectedProj,
  selectProj,
  selectedDoc,
  selectDoc,
  selectedProds,
  selectProd,
  template,
  client,
  setAlert,
  autoCompletion,
  setAutoCompletion,
}) => {
  const [create, setCreate] = useState("organisation");
  const { t, i18n } = useTranslation();
  const handleOrganisationBtn = (e) => {
    e.preventDefault();
    setCreate("organisation");
  };

  const handlePersonBtn = (e) => {
    e.preventDefault();
    setCreate("person");
  };
  const handleProjectBtn = (e) => {
    e.preventDefault();
    setCreate("project");
  };

  const handleDocBtn = (e) => {
    e.preventDefault();
    setCreate("doc");
  };

  const handleProdBtn = (e) => {
    e.preventDefault();
    setCreate("prod");
  };

  // if (template && !template.parent_entity) {
  //   setCreate("person")
  // }

  const [prodValue, setProdValue] = useState("");
  const handleNewProd = (e) => {
    e.preventDefault();
    if (prodValue && prodValue !== "") {
      selectProd([...selectedProds, { productionId: prodValue }]);
      setProdValue("");
    }
  };

  const handleDeleteProd = (e, item) => {
    e.preventDefault();
    console.log(item);
    selectProd(selectedProds.filter((prod) => prod !== item));
  };

  const handleProdChange = (e) => {
    e.preventDefault();
    setProdValue(e.target.value);
  };

  return (
    <>
      <div className="tabs   pl-0 ml-0 mb-1 mt-1 is-centered">
        <ul className="pl-0 ml-0">
          {template && template.parent_entity ? (
            <>
              {create === "organisation" ? (
                <li className=" is-active ">
                  <a className="logolink">{t("organization")}</a>
                </li>
              ) : (
                <li className="is-transparent" onClick={handleOrganisationBtn}>
                  <a className="logolink has-text-grey">{t("organization")}</a>
                </li>
              )}
            </>
          ) : null}
          {template && template.parent_person ? (
            <>
              {create === "person" ? (
                <li className=" is-active" onClick={handlePersonBtn}>
                  <a className="logolink">{t("person")}</a>
                </li>
              ) : (
                <li className=" is-light" onClick={handlePersonBtn}>
                  <a className="logolink has-text-grey">{t("person")}</a>
                </li>
              )}
            </>
          ) : null}
          {template && template.parent_project ? (
            <>
              {create === "project" ? (
                <li className=" is-active">
                  <a className="logolink">{t("project")}</a>
                </li>
              ) : (
                <li className=" is-light" onClick={handleProjectBtn}>
                  <a className="logolink has-text-grey">{t("project")}</a>
                </li>
              )}
            </>
          ) : null}
          <>
            {create === "doc" ? (
              <li className=" is-active">
                <a className="logolink">{t("document")}</a>
              </li>
            ) : (
              <li className=" is-light" onClick={handleDocBtn}>
                <a className="logolink has-text-grey">{t("document")}</a>
              </li>
            )}
          </>
          {selectedProds ? (
            <>
              {create === "prod" ? (
                <li className=" is-active">
                  <a className="logolink">{t("production")}</a>
                </li>
              ) : (
                <li className=" is-light" onClick={handleProdBtn}>
                  <a className="logolink has-text-grey">{t("production")}</a>
                </li>
              )}
            </>
          ) : null}
        </ul>
      </div>
      {create === "organisation" ? (
        <>
          <OrganisationParentForm
            selectedOrg={selectedOrg}
            selectOrg={selectOrg}
            template={template}
            client={client}
            setAlert={setAlert}
            autoCompletion={autoCompletion}
            setAutoCompletion={setAutoCompletion}
          />
        </>
      ) : create === "person" ? (
        <>
          <PersonParentForm
            selectedPeople={selectedPeople}
            selectPerson={selectPerson}
            template={template}
            client={client}
            setAlert={setAlert}
            autoCompletion={autoCompletion}
            setAutoCompletion={setAutoCompletion}
          />
        </>
      ) : create === "project" ? (
        <>
          <ProjectParentForm
            selectedProj={selectedProj}
            selectProj={selectProj}
            template={template}
            client={client}
            setAlert={setAlert}
          />
        </>
      ) : create === "doc" ? (
        <>
          <DocParentForm
            selectedDoc={selectedDoc}
            selectDoc={selectDoc}
            template={template}
            client={client}
            setAlert={setAlert}
          />
        </>
      ) : (
        <>
          {selectedProds ? (
            <div className="field">
              <div className="columns mt-3">
                <div className="column is-three-fifth">
                  <div className="control has-icons-right">
                    <input
                      type="text"
                      className="input"
                      value={prodValue}
                      placeholder={"Scapin ID"}
                      onChange={handleProdChange}
                      onClick={async () => {
                        setProdValue(await navigator.clipboard.readText());
                      }}
                    />
                    <span class="icon is-small is-right has-text-primary inputBtn">
                      <FontAwesomeIcon icon={faPaste} />{" "}
                    </span>
                  </div>
                </div>
                <div className="column is-one-fifth">
                  <button className="button is-primary" onClick={handleNewProd}>
                    <span>{t("add")}</span>
                  </button>
                </div>
              </div>

              {selectedProds.map((prod) => {
                if (prod) {
                  return (
                    <Fragment key={prod}>
                      <span className="tag is-info is-medium mr-1 mb-1">
                        {prod.productionId}{" "}
                        <i
                          className="has-text-light ml-3 pointer"
                          onClick={(e) => {
                            handleDeleteProd(e, prod);
                          }}>
                          <FontAwesomeIcon icon={faCircleXmark} />
                        </i>{" "}
                      </span>
                    </Fragment>
                  );
                }
              })}
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ParentForm;
