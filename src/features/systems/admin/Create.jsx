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
    const [subTemplate, setSubTemplate] = useState(null)
    const [selectedSubTemplate, selectSubTemplate] = useState("")
    const [templateModel, setTemplateModel] = useState({})
  
    const [docTemplates, setDocTemplates] = useState([])

    const [fullTemplate, setFullTemplate] = useState(false)

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
    
    const handleSelectSubTemplate = (e) => {
      e.preventDefault()
      selectSubTemplate(e.target.value)
      templateModel.schema_childs.map((template) => {
        if (template.schema_name === e.target.value) {
          setSubTemplate(template)
        }
      })
      if (e.target.value === "None") {
        setSubTemplate(false)
      }
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
  
    useEffect(() => {
      if (!subTemplate) {
        console.log("ici")
        setFullTemplate(templateModel)
      } else {
        console.log('la')
        let model = templateModel
        if (model.languages.exist) {
          model.languages.defaults = [...model.languages.defaults, ...subTemplate.languages.defaults]
        }
        if (model.tag) {
          model.tag_defaults = [...model.tag_defaults, ...subTemplate.tag_defaults]
        }
        if (model.type) {
          model.type_defaults = [...model.type_defaults, ...subTemplate.type_defaults]
        }
        if (model.support_role) {
          model.support_role_defaults = [...model.support_role_defaults, ...subTemplate.support_role_defaults]
        }
        if (model.support_issn) {
          model.support_issn_default = subTemplate.support_issn_default
        }
        if (model.parent_role) {
          model.parent_role_defaults = [...model.parent_role_defaults, ...subTemplate.parent_role_defaults]
        }
        if (model.parent_entity) {
          model.parent_entity_defaults = [...model.parent_entity_defaults, ...subTemplate.parent_entity_defaults]
        }
        if (model.parent_person) {
          model.parent_person_defaults = [...model.parent_person_defaults, ...subTemplate.parent_person_defaults]
        }
        if (model.parent_project) {
          model.parent_project_defaults = [...model.parent_project_defaults, ...subTemplate.parent_project_defaults]
        }
        setFullTemplate(model)
        console.log("tags: ", model.tag_defaults)
      }
    }, [subTemplate, templateModel])

    return <div className="columns is-flex is-justify-content-center mt-5">
      <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-half-widescreen mt-5">
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
            <label className="label">Model</label>
            <div className="select">
             <select value={selectedTemplate} onChange={handleSelectTemplate}>
             
                {docTemplates.map((template) => {
                  
                    if (!template.schema_parent) {
                      return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                  
                    }
                })}
              </select>
            </div>
          </div>
              </div>
               
          </> : null}
          {selectedType === "Document" && templateModel && templateModel.schema_childs && templateModel.schema_childs[0] ? <>
          <div className="column is-one-third">
              <div className="field">
            <label className="label">Template</label>
            <div className="select">
             <select value={selectedSubTemplate} onChange={handleSelectSubTemplate}>
             <option value="None">None</option>

                {templateModel.schema_childs.map((template) => {
                  
                    return <Fragment key={template.schema_slug}>
                    <option>{template.schema_name}</option>
                  </Fragment>
                  
                })}
              </select>
            </div>
          </div>
              </div>
               
          </> : null}
          </div>
          <hr/>
          <div className="form">
            {selectedType === "Document" ? 
              <DocForm client={client} setAlert={setAlert} template={fullTemplate} />
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