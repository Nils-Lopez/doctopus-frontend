import React, {useState, Fragment} from "react"

const DocTagsForm = ({selectedTags, selectTag, tags}) => {
  const [tagValue, setTagValue] = useState("")
  const [tagForm, setTagForm] = useState(false)
  const [tagDesc, setTagDesc] = useState("")
  
  const handleTagChange = (e) => {
    e.preventDefault()
    setTagValue(e.target.value)
  }
  
  const isTagExisting = (tag) =>  {
    let retrievedTag = undefined
    tags.map((t) => {
      if (t.title.toLowerCase() === tag.toLowerCase()) {
        retrievedTag = t
      } 
    })
    if (retrievedTag) {
      return retrievedTag
    } else return false
  }
  
  const handleTagBtn = (e) => {
    e.preventDefault()
    const tagDoc = isTagExisting(tagValue)
    let unique = true
    selectedTags.map((tag) => {
      if (tag.title === tagValue) {
        unique = false
      }
    })
    if (unique) {
      if (tagDoc) {
      selectTag([...selectedTags, tagDoc])
      setTagValue("")
    } else {
      setTagForm(true)
    }
    }
  }
  
  const handleCreateTag = (e) => {
    e.preventDefault()
    const newTag = {slug: "new-tag", title: tagValue, description: tagDesc}
    selectTag([...selectedTags, newTag])
    setTagValue("")
    setTagForm(false)
  }
  
  const handleTagDescChange = (e) => {
    e.preventDefault()
    setTagDesc(e.target.value)
  }
  
  
  return <>
    <div className="field">
      <label className="label title is-5">Tags</label>
      <div className="columns">
        <div className="column is-four-fifth">
          <input type="text" list="tags" className="input" value={tagValue} onChange={handleTagChange}/>
        </div>
        <div className="column is-one-fifth">
          {!tagForm ? <>{tagValue !== "" ? <button className="button is-primary " onClick={handleTagBtn}>
            {isTagExisting(tagValue) ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateTag}>Confirm</button>}
        </div>
      </div>
      {tagForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">Tag description</label>
        <textarea className="textarea" onChange={handleTagDescChange} value={tagDesc}/>
      </div> : null}
      <datalist id="tags">
        {tags.map((t) => {
          return <Fragment key={t.slug}>
            <option>{t.title}</option>
          </Fragment>
        })}
      </datalist>
      {selectedTags.map((tag) => {
        return <Fragment key={tag.slug}>
          <span className="tag is-primary is-medium mr-3">{tag.title}</span>
        </Fragment>
      })}
    </div>
  </>
}

export default DocTagsForm