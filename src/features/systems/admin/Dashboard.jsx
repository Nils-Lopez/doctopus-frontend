import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Dashboard = ({ }) => {
    const { t, i18n } = useTranslation();

    return <>
        <div className="columns mx-2">
            <div className="column is-one-third">
                <div className="box">
                    <h3 className="title is-3">{t('dashboard')}</h3>
                </div>
            </div>
            <div className="column is-two-third">
                <div className="box">
                    <h3 className="title is-3">{t('statistics')}</h3>

                </div>
            </div>
        </div>
    </>
}

export default Dashboard