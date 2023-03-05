import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import {useTags} from '../../../../utils/hooks/Tags'

const DocTagsForm = ({selectedTags, selectTag, scope, lang}) => {
  const [tagFrValue, setTagFrValue] = useState("")
  const [tagEnValue, setTagEnValue] = useState("")
  const [tagForm, setTagForm] = useState(false)
  const [tagDescFr, setTagDescFr] = useState("")
  const [tagDescEn, setTagDescEn] = useState("")
  const [tags, setTags] = useState([])
  const [tagsLoading, setTagsLoading] = useState(false)
  const [pending, setPending] = useState("")

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
      if (t.slug === currentTag) {
        retrievedTag = t
      }
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
    setTags([])
  }
  
  const {
    searchTags, 
    responseSearchTags
  } = useTags()

  const searchTagValue = (e) => {
    e.preventDefault()
    if (tagEnValue !== "" && tagEnValue !== "") {
      setTagsLoading(true)
      searchTags(tagEnValue + " " + tagFrValue)
    } else if (tagEnValue !== "") {
      setTagsLoading(true)
      searchTags(tagEnValue)
    } else if (tagFrValue !== "") {
      setTagsLoading(true)
      searchTags(tagFrValue)
    }
  }

  useEffect(() => {
    if (responseSearchTags && responseSearchTags.success && responseSearchTags.data[0] && tagsLoading) {
        setTagsLoading(false)
        setTags([...responseSearchTags.data])
    } else if (responseSearchTags && tagsLoading) {
      setTagsLoading(false)
      setTagForm(true)
    }
  }, [responseSearchTags])

  useEffect(() => {
    if (tags && tags[0]) {
       tags.map((tag) => {
        if (getContent(tag.title, lang) === tagEnValue || getContent(tag.title, lang) === tagEnValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(lang === "en" ? tagEnValue : tagFrValue)
      } else {
        setPending("")
      }
    }
  }, [tags])

  const changeCurrentTag = (e) => {
    e.preventDefault()
    setCurrentTag(e.target.value)
    setTagEnValue(e.target.value)
    setTagFrValue(e.target.value)
  }

  const [currentTag, setCurrentTag] = useState({})

  const isNotIncluded = (query, array) => {
    let included = false
    array.map((a) => {
      if (a.title[0] && a.title[0].content.toLowerCase() === query.toLowerCase()) {
        included = true
      } else if (a.title[1] && a.title[1].content.toLowerCase() === query.toLowerCase()) {
        included = true 
      }
    })
    return !included
  }
  
  return <>
    <div className="field">
      <label className="label title is-5">Tags</label>
      <div className="columns">
        <div className="column is-four-fifth">
          {(!tags || !tags[0]) ? <>
            <input type="text" className="input" value={lang === "en" ? tagEnValue : tagFrValue} onChange={handleTagChange} />
          </> : <>
             <div className="select is-fullwidth is-multiple">
             <select value={currentTag} onChange={changeCurrentTag} name={"tags"} id={"tags"}>

                {tags.map((t, i) => {
                  if (i < 7) {
                      return <Fragment key={t.slug}>
                      <option value={t.slug}>{getContent(t.title, lang)}</option>
                  </Fragment>
                    }
                })}
                 {pending !== "" && isNotIncluded(pending, tags) ? <>
                  <option value={pending} className="has-text-info">{pending}</option>
                </> : null}
            </select>
             </div>
          </>}
        </div>
        <div className="column is-one-fifth">
          {(!tags || !tags[0]) && !tagForm ? <>
            {(tagEnValue !== "" || tagFrValue !== "") && !tagsLoading ? <button className="button is-primary" onClick={searchTagValue}>Search</button> : <button className="button is-primary is-disabled" onClick={searchTagValue} disabled>Search</button>}
          </> : <>
             {!tagForm ? <>{tagFrValue !== "" || tagEnValue !== "" ? <button className="button is-primary " onClick={handleTagBtn}>
              {isTagExisting() ? "Add" : "Create"}
            </button> : <button className="button is-primary is-disabled" disabled>Add</button>}</> : <button className="button is-primary" onClick={handleCreateTag}>Confirm</button>}
            <span className="tag is-danger is-medium ml-2 mt-1 button" onClick={() => {
                setTags([]);
                setTagForm(false)
              }}><FontAwesomeIcon icon={faTrash}/></span>
          </>}
         
        </div>
      </div>
      {tagForm ? <div className="field">
        <label className="label subtitle is-6 is-flex is-justify-content-start">Tag description</label>
        <textarea className="textarea" onChange={handleTagDescChange} value={lang === "en" ? tagDescEn : tagDescFr}/>
      </div> : null}
      
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