import React, {useState, useEffect, Fragment} from 'react';
  
import DocForm from "../../molecules/Create/DocForm"
import OrganisationForm from "../../molecules/Create/OrganisationForm"
import PersonForm from "../../molecules/Create/PersonForm"

import {useRoles} from "../../../utils/hooks/Roles"
import {useTags} from "../../../utils/hooks/Tags"
import {usePeople} from "../../../utils/hooks/People"
import { useEntities } from "../../../utils/hooks/Entities"
import {useDocTemplates} from "../../../utils/hooks/templates/DocTemplates"
import {useBrotherhoods} from "../../../utils/hooks/docs/Brotherhoods"
import {useProjects} from "../../../utils/hooks/entities/Projects"
import { useTranslation } from "react-i18next";
import SelectForm from '../../atoms/forms/SelectForm';


const Create = ({client, setAlert, setClient, applicationSettings}) => {
    const {t, i18n} = useTranslation()
    const [selectedType, selectType] = useState({value: 'document', label: t('document')})

    const handleSelectType = (e) => {
      console.log(e)
      selectType(e)
    }

    return <div className="columns is-flex is-justify-content-center mt-5">
      <div className="column is-7 mt-5">
        <div className="box">
          {selectedType && selectedType.value === "document" ? null : <div className="columns">
            <div className="column is-one-third">
              <div className="field">
            <label className="label">{t('type')}</label>
            <SelectForm select={handleSelectType} selected={selectedType} applicationSettings={applicationSettings} options={[{value: "document", label: t('document')}, {value: 'organisation', label: t('organization')}, {value: 'person', label: t('person')}]} />
          
          </div>
            </div>
            
            <hr/>
          </div>}
          
          <div className="form">
            {selectedType && selectedType.value ? <> {selectedType.value === "document" ? 
              <DocForm client={client} setClient={setClient} applicationSettings={applicationSettings} setAlert={setAlert} handleSelectType={handleSelectType} selectedType={selectedType}/>
            : selectedType.value === "organisation" ? 
              <OrganisationForm client={client} setAlert={setAlert} />
            :
                <PersonForm client={client} setAlert={setAlert} />
            }</> : null}
          </div>
        </div>
      </div>
    </div>
}    

export default Create;