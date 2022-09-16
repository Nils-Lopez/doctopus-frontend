import React, {useState} from 'react';
  
import DocForm from "../../molecules/Create/DocForm"
import OrganisationForm from "../../molecules/Create/OrganisationForm"
import PersonForm from "../../molecules/Create/PersonForm"

const Create = ({client, setAlert}) => {
    
    const [selectedType, selectType] = useState('Document')
    const [selectedTemplate, selectTemplate] = useState('Default')
    const [selectedBrotherHood, selectBrotherHood] = useState("")
    
    const handleSelectType = (e) => {
      e.preventDefault()
      selectType(e.target.value)
    }
    
    const handleSelectTemplate = (e) => {
      e.preventDefault()
      selectTemplate(e.target.value)
    }
    
    const handleSelectBrotherHood = (e) => {
      e.preventDefault()
      selectBrotherHood(e.target.value)
    }

    return <div className="columns is-flex is-justify-content-center mt-3  ">
      <div className="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen">
        <form className="box">
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
            <div className="column is-one-third">
              <div className="field">
            <label className="label">Template</label>
            <div>
             <input type="text" className="input" value={selectedTemplate} onChange={handleSelectTemplate} list="templates"/>
              <datalist id="templates">
                <option>Default</option>
                <option>Periodic</option>
                <option>News</option>
                <option>Book</option>
                <option>Movie</option>
              </datalist>
            </div>
          </div>
            </div>
          {selectedType === "Document" ? <div className="column is-one-third">
              <div className="field">
            <label className="label">Brotherhood</label>
            <div>
              <input type="text" className="input" value={selectedBrotherHood} onChange={handleSelectBrotherHood} list="brotherhoods"/>
              <datalist id="brotherhoods">
                <option>Nouvelles De Danse</option>
                <option>Le Soir Article</option>
                <option>Le Soir Journal</option>
                <option>Le Seigneur Des Anneaux Trilogie</option>
              </datalist>
            </div>
          </div>
            </div> : null}
          </div>
          <hr/>
          <div className="form">
            {selectedType === "Document" ? 
              <DocForm client={client} setAlert={setAlert} template={selectedTemplate} brotherhood={selectBrotherHood}/>
            : selectedType === "Organisation" ? 
              <OrganisationForm client={client} setAlert={setAlert}/>
            :
              <PersonForm client={client} setAlert={setAlert}/>
            }
          </div>
        </form>
      </div>
    </div>
}    

export default Create;