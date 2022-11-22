import React, {useState, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const DocTagsForm = ({selectedTags, selectTag, tags, scope, lang}) => {
  const [tagFrValue, setTagFrValue] = useState("")
  const [tagEnValue, setTagEnValue] = useState("")
  const [tagForm, setTagForm] = useState(false)
  const [tagDescFr, setTagDescFr] = useState("")
  const [tagDescEn, setTagDescEn] = useState("")

  const getContent = (value, lang) => {
    return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
  }
 
  const handleTagChange = (e) => {
    e.preventDefault()
    if (lang === "en") {
      setTagEnValue(e.target.value)
    } else {
      setTagFrValue(e.target.value)
    } 
  }
  const isTagExisting = () =>  {
    let retrievedTag = undefined
    tags.map((t) => {
      t.title.map((title) => {
        if (title.content.toLowerCase() === tagEnValue.toLowerCase() || title.content.toLowerCase() === tagFrValue.toLowerCase()) {
          retrievedTag = t
        }
      })
    })
    if (retrievedTag) {
      return retrievedTag
    } else return false
  }
  
  const handleTagBtn = (e) => {
    e.preventDefault()
    const tagDoc = isTagExisting()
    let unique = true
    selectedTags.map((tag) => {
      tag.title.map((title) => {
        if (title.content.toLowerCase() === tagEnValue.toLowerCase() && tagEnValue !== "" || title.content.toLowerCase() === tagFrValue.toLowerCase() && tagFrValue !== "") {
          unique = false
        }
      })
    })
    if (unique) {
      if (tagDoc) {
        selectTag([...selectedTags, tagDoc])
        setTagEnValue("")
        setTagFrValue("")
      } else {
        setTagForm(true)
      }
    }
  }
  
  const handleCreateTag = (e) => {
    e.preventDefault()
    const newTag = { slug: tagEnValue.replaceAll(' ', '-').toLowerCase(), title: [{ lang: "en", content: tagEnValue }, { lang: "fr", content: tagFrValue }], description: [{ lang: "en", content: tagDescEn }, { lang: "fr", content: tagDescFr}], scope: scope}
    selectTag([...selectedTags, newTag])
    setTagFrValue("")
    setTagEnValue("")
    setTagDescEn("")
    setTagDescFr("")
    setTagForm(false)
  }
  
  const handleTagDescChange = (e) => {
    e.preventDefault()
    if (lang === "en") {
      setTagDescEn(e.target.value)
    } else {
      setTagDescFr(e.target.value)
    }
  }
  
  const handleDeleteTag = (e, tag) => {
    e.preventDefault()
    const filtered = selectedTags.filter((t) => {
      return t.slug !== tag.slug
    })
    selectTag(filtered)
  }
  
  return <>
    <div className="field">
      <label className="label title is-5">Tags</label>
      <div className="columns">
        <div className="column is-four-fifth">
          <input type="text" list="tags" className="input" value={lang === "en" ? tagEnValue : tagFrValue} onChange={handleTagChange}/>
        </div>
        <div className="column is-one-fifth">
          {!tagForm ? <>{tagFrValue !== "" || tagEnValue !== "" ? <button className="button is-primary " onClick={handleTagBtn}>
            {isTagExisting() ? "Add" : "Create"}
          </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateTag}>Confirm</button>}
        </div>
      </div>
      {tagForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">Tag description</label>
        <textarea className="textarea" onChange={handleTagDescChange} value={lang === "en" ? tagDescEn : tagDescFr}/>
      </div> : null}
      <datalist id="tags">
        {tags.map((t) => {
          if (t.scope === scope) {
            return <Fragment key={t.slug}>
                <option>{getContent(t.title)}</option>
              </Fragment>
          }
          
        })}
      </datalist>
      {selectedTags.map((tag) => {
        return <Fragment key={tag.slug}>
          <span className="tag is-primary is-medium mr-1">{getContent(tag.title, lang)}</span>
          <span className="tag is-danger is-medium mr-2 button" onClick={(e) => handleDeleteTag(e, tag)}><FontAwesomeIcon icon={faTrash}/></span>
            </Fragment>
      })}

    </div>
  </>
}

export default DocTagsForm