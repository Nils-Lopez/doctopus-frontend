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


const Create = ({client, setAlert}) => {
    
    const [selectedType, selectType] = useState('Document')

    const handleSelectType = (e) => {
      e.preventDefault()
      selectType(e.target.value)
    }

    return <div className="columns is-flex is-justify-content-center mt-5">
      <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-half-widescreen mt-5">
        <div className="box">
          {selectedType === "Document" ? null : <div className="columns">
            <div className="column is-one-third">
              <div className="field">
            <label className="label">Type</label>
            <div className="select">
              <select value={selectedType} onChange={handleSelectType}>
                <option>Document</option>
                <option>Organisation</option>
                <option>Person</option>
              </select>
            </div>
          </div>
            </div>
            
            
          </div>}
          <hr/>
          <div className="form">
            {selectedType === "Document" ? 
              <DocForm client={client} setAlert={setAlert} handleSelectType={handleSelectType} selectedType={selectedType}/>
            : selectedType === "Organisation" ? 
              <OrganisationForm client={client} setAlert={setAlert} />
            :
                <PersonForm client={client} setAlert={setAlert} />
            }
          </div>
        </div>
      </div>
    </div>
}    

export default Create;