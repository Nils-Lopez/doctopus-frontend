import React, {useState} from "react"

const OrganisationForm = ({}) => {
  
  const [nameValue, setNameValue] = useState("")
  const [descValue, setDescValue] = useState("")
  const [urlValue, setUrlValue] = useState("")
  const [locValue, setLocValue] = useState("")
  
  const handleNameChange = (e) => {
    e.preventDefault()
    setNameValue(e.target.value)
  }
  
  const handleDescChange = (e) => {
    e.preventDefault()
    setDescValue(e.target.value)
  }
  
  const handleUrlChange = (e) => {
    e.preventDefault()
    setUrlValue(e.target.value)
  }
  
  const handleLocChange = (e) => {
    e.preventDefault()
    setLocValue(e.target.value)
  }
  
  return <>
    <div className="field">
      <label className="label">
        Name
      </label>
      <input type="text" value={nameValue} onChange={handleNameChange} className="input"/>
    </div>
    <div className="field">
      <label className="label">
        Description
      </label>
      <textarea value={descValue} onChange={handleDescChange} className="textarea"></textarea>
    </div>
    <div className="columns">
      <div className="column field">
        <label className="label">
          Website
        </label>
        <input type="text" value={urlValue} onChange={handleUrlChange} className="input"/>
      </div>
      <div className="column field">
        <label className="label">
          Location
        </label>
        <input type="text" value={locValue} onChange={handleLocChange} className="input"/>
      </div>
    </div>
    
  </>
}

export default OrganisationForm