import React, { useState, Fragment, useEffect } from "react";

import ExemplaryPreviewCard from "../../supports/ExemplaryPreviewCard";
import { useTranslation } from "react-i18next";

const ExemplariesForm = ({
  setPendingExemplaries,
  pendingExemplaries,
  template,
}) => {
  const [locationValue, setLocationValue] = useState("");
  const [positionValue, setPositionValue] = useState("");
  const [rankValue, setRankValue] = useState("");
  const [qualityValue, setQualityValue] = useState("");
  const { t, i18n } = useTranslation();

  const handleLocationChange = (e) => {
    e.preventDefault();
    setLocationValue(e.target.value);
  };

  const handleQualityChange = (e) => {
    e.preventDefault();
    setQualityValue(e.target.value);
  };

  const handlePositionChange = (e) => {
    e.preventDefault();
    setPositionValue(e.target.value);
  };

  const handleRankChange = (e) => {
    e.preventDefault();
    setRankValue(e.target.value);
  };

  const handleExBtn = (e) => {
    e.preventDefault();
    const newEx = {
      location: locationValue,
      position: positionValue,
      cote: rankValue,
      quality: qualityValue,
    };
    setPendingExemplaries([...pendingExemplaries, newEx]);
    setLocationValue("");
    setPositionValue("");
    setQualityValue("");
    setRankValue("");
  };

  const editExemplary = (ex) => {
    deleteExemplary(ex);
    setLocationValue(ex.location);
    setQualityValue(ex.quality);
    setPositionValue(ex.position);
    setRankValue(ex.cote);
  };

  const deleteExemplary = (ex) => {
    let filtered = [...pendingExemplaries].filter((exemplary) => {
      return exemplary !== ex;
    });
    setPendingExemplaries(filtered);
  };

  useEffect(() => {
    if (template && template.copies_position_default) {
      setPositionValue(template.copies_position_default);
    }
    console.log(template);
  }, [template]);

  return (
    <>
      <div className=" mt-5">
        <hr />
        <label className="label subtitle is-5 has-text-left mb-5">
          {t("copies")} <span className="tag">{pendingExemplaries.length}</span>
        </label>

        <div className="container px-4 columns ">
          {pendingExemplaries.map((ex) => {
            return (
              <Fragment key={ex.location}>
                <ExemplaryPreviewCard
                  exemplary={ex}
                  editExemplary={editExemplary}
                  deleteExemplary={deleteExemplary}
                />
              </Fragment>
            );
          })}
        </div>
        {/* {template && template.copies_location ? <div className="field mt-5">
        <label className="label has-text-left">
          {t('location')}
        </label>
        <input type="text" className="input" value={locationValue} onChange={handleLocationChange} />
      </div> : null} */}
        {(template && template.copies_position) || positionValue !== "" ? (
          <div className="field">
            <label className="label has-text-left">{t("position")}</label>
            <input
              type="text"
              className="input"
              value={positionValue}
              onChange={handlePositionChange}
            />
          </div>
        ) : null}
        {template && template.copies_rank ? (
          <div className="field">
            <label className="label has-text-left">{t("rank")}</label>
            <input
              type="text"
              className="input"
              value={rankValue}
              onChange={handleRankChange}
            />
          </div>
        ) : null}
        {template && template.copies_quality ? (
          <div className="field">
            <label className="label has-text-left">{t("quality")}</label>
            <input
              type="text"
              className="input"
              value={qualityValue}
              onChange={handleQualityChange}
            />
          </div>
        ) : null}
        <div className="is-flex is-justify-content-end">
          <button
            className="button is-primary"
            onClick={handleExBtn}>
            <span>{t("confirm")}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ExemplariesForm;
