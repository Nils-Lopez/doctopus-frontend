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
    const [selectedTemplate, selectTemplate] = useState('')
  
    const [templateModel, setTemplateModel] = useState({})
  
    const [docTemplates, setDocTemplates] = useState([])

    const [docTemplatesLoading, setDocTemplatesLoading] = useState(false)

    const handleSelectType = (e) => {
      e.preventDefault()
      selectType(e.target.value)
    }
    
    const handleSelectTemplate = (e) => {
      e.preventDefault()
      selectTemplate(e.target.value)
      docTemplates.map((template) => {
        if (template.schema_name === e.target.value) {
          setTemplateModel(template)
        }
      })

    }
  
    const {
      responseFindAllDocTemplates,
      findAllDocTemplates
    } = useDocTemplates()
  
    if (!docTemplates[0] && !docTemplatesLoading) {
      findAllDocTemplates()
      setDocTemplatesLoading(true)
    }
  
    useEffect(() => {
      if (responseFindAllDocTemplates && responseFindAllDocTemplates.success) {
        setDocTemplates(responseFindAllDocTemplates.data)
      }
    }, [responseFindAllDocTemplates])
  
    useEffect(() => {
      docTemplates.map((template) => {
        if (client.user.defaultTemplate && client.user.defaultTemplate === template._id && selectedTemplate === "") {
          selectTemplate(template.schema_name)
          setTemplateModel(template)
        }
      })
    }, [docTemplates])
  
    return <div className="columns is-flex is-justify-content-center mt-3  ">
      <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-half-widescreen">
        <div className="box">
          <div className="columns">
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
            
            {selectedType === "Document" ? <>
          <div className="column is-one-third">
              <div className="field">
            <label className="label">Template</label>
            <div>
             <input type="text" className="input" value={selectedTemplate} onChange={handleSelectTemplate} list="templates"/>
              <datalist id="templates">
             
                {docTemplates.map((template) => {
                  
                    return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                  
                })}
              </datalist>
            </div>
          </div>
              </div>
               
          </> : null}
          </div>
          <hr/>
          <div className="form">
            {selectedType === "Document" ? 
              <DocForm client={client} setAlert={setAlert} template={templateModel} />
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