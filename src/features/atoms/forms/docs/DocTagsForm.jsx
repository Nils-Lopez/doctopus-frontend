import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

import {useTags} from '../../../../utils/hooks/Tags'
import {useTranslation} from "react-i18next"
import { use } from "i18next"

const DocTagsForm = ({selectedTags, handleSearchTag, selectTag, scope, lang, location, tag, setUpdateTag, merge, setMergeTag, setAlert}) => {
  const [tagFrValue, setTagFrValue] = useState("")
  const [tagEnValue, setTagEnValue] = useState("")
  const [tagForm, setTagForm] = useState(false)
  const [tagDescFr, setTagDescFr] = useState("")
  const [tagDescEn, setTagDescEn] = useState("")
  const [tags, setTags] = useState([])
  const [tagsLoading, setTagsLoading] = useState(false)
  const [pending, setPending] = useState("")
  const { t, i18n } = useTranslation()

  const getContent = (value, lang) => {
    if (value) {
      return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    } else {
      return "Error"
    }
  }
 
  useEffect(() => {
    if (tag) {
      if (tag.title&& tag.title[0]) {
        setTagEnValue(getContent(tag.title, "en"))
      setTagFrValue(getContent(tag.title, "fr"))
      }
      setTagForm(true)
      if (tag.description && tag.description[0]) {
        setTagDescEn(getContent(tag.description, "en"))
      setTagDescFr(getContent(tag.description, "fr"))
      }
    }
  }, [tag])

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
    if (!merge) {
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
    } else if (tagDoc) {
      mergeTags({origin: merge, duplicate: tagDoc})
      setMergeTag("loading")
      setTimeout(() => {
        setMergeTag(false)
        setAlert({type: "success", message: {en: t('tag-merged'), fr: t('tag-merged')}})
        handleSearchTag(merge)
      } , 500)
    } 
  }
  
  const handleCreateTag = (e) => {
    e.preventDefault()
    const newTag = { slug: tagEnValue.replaceAll(' ', '-').toLowerCase(), title: [{ lang: "en", content: tagEnValue }, { lang: "fr", content: tagFrValue }], description: [{ lang: "en", content: tagDescEn }, { lang: "fr", content: tagDescFr}], scope: scope}
    if (!tag) { 
      selectTag([...selectedTags, newTag])
    setTagFrValue("")
    setTagEnValue("")
    setTagDescEn("")
    setTagDescFr("")
    setTagForm(false)
    } else {
      newTag.slug = tag.slug
      updateTag(newTag, tag._id)
      setUpdateTag("loading")
      setTimeout(() => {
        setUpdateTag(false)
        setAlert({type: "success", message: {en: t('tag-updated'), fr: t('tag-updated')}})
        handleSearchTag(tag)
      }, 500)
    }
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
    responseSearchTags,
    updateTag,
    responseUpdateTag,
    mergeTags, 
    responseMergeTags
  } = useTags()

  const searchTagValue = (e) => {
    e.preventDefault()
   if (tagEnValue !== "") {
      setTagsLoading(true)
      console.log("ici en : ", tagEnValue)

      searchTags(tagEnValue)
    } else if (tagFrValue !== "") {
      setTagsLoading(true)
      console.log("ici : ", tagFrValue)
      searchTags(tagFrValue)
    }
  }

  useEffect(() => {
    if (responseSearchTags && responseSearchTags.success && responseSearchTags.data[0] && tagsLoading) {
        setTagsLoading(false)
        if (!merge) {
          setTags([...responseSearchTags.data])
          responseSearchTags.data.map((tag) => {
          
              
            console.log(tag, tagFrValue, tagEnValue)
            if (getContent(tag.title, lang) === tagFrValue || getContent(tag.title, lang) === tagEnValue) {
              setPending("existing")
              console.log('eh jsuis la')
              selectTag([...selectedTags, tag])
              setTagFrValue("")
              setTagEnValue("")
              setTagDescEn("")
              setTagDescFr("")
              setTagForm(false)
              setTags([])
            }
            
          })
          if (pending !== "existing") {
            setPending(lang === "en" ? tagEnValue : tagFrValue)
          } else {
            setPending("")
          }
      } else {
        responseSearchTags.data.map((tag) => {
          if (tag._id !== merge._id) {
            setTags([...tags, tag])
          }
        })
      }
    } else if (responseSearchTags && tagsLoading) {
      console.log('eh jsuis la aussi ', responseSearchTags, tagsLoading)
      setTagsLoading(false)
      if (!merge) setTagForm(true)
      else {
        setAlert({type: "error", message: {en: t('tag-not-found'), fr: t('tag-not-found')}})
      }
    }
  }, [responseSearchTags])


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

  // useEffect(() => {
  //   console.log('tag : ', tag, responseUpdateTag)
  //   if (tag === "loading") {
  //     if (responseUpdateTag && responseUpdateTag.success) {
  //       setUpdateTag(false)
        // conlert({type: "success", message: {en: t('tag-updated'), fr: t('tag-updated')}})
  
  //     } else {
  //       setUpdateTag(false)
  //       conlert({type: "error", message: {en: t('tag-not-updated'), fr: t('tag-not-updated')}})
  //     }
  //   }
  // }, [responseUpdateTag, tag])
  
  // useEffect(() => {
  //   console.log('responseUpdateTag : ', responseUpdateTag)
  // }, [responseUpdateTag])

  return <>
    <div className="field">
      {location !== "templates-tags" ? <label className="label has-text-left">{t('tags')}</label> : null}
      <div className="columns">
        <div className="column is-three-quarter">
          {(!tags || !tags[0]) ? <>
            <input type="text" className="input" value={lang === "en" ? tagEnValue : tagFrValue} onChange={handleTagChange} />
          </> : <>
             <div className="select is-fullwidth is-multiple">
             <select value={currentTag} onChange={changeCurrentTag} name={"tags"} id={"tags"}>

                {tags.map((t, i) => {
                  if (i === 0 && currentTag !== t.slug) setCurrentTag(t.slug)
                  if (i < 7) {
                      return <Fragment key={t.slug}>
                      <option value={t.slug}>{getContent(t.title, lang)}</option>
                  </Fragment>
                    }
                })}
                 {pending !== "" && isNotIncluded(pending, tags) ? <>
                  <option value={pending} className="has-text-info">{pending} ({t('draft')})</option>
                </> : null}
            </select>
             </div>
          </>}
        </div>
        <div className="column is-one-quarter">
          {(!tags || !tags[0]) && !tagForm ? <>
            {(tagEnValue !== "" || tagFrValue !== "") && !tagsLoading ? <button className="button is-primary is-medium tag" onClick={searchTagValue}>{t('search')}</button> : <button className="button is-primary is-disabled" onClick={searchTagValue} disabled>{t('search')}</button>}
          </> : <div className="is-flex pr-2">
             {!tagForm ? <>{tagFrValue !== "" || tagEnValue !== "" ? <button className="button is-primary is-medium tag " onClick={handleTagBtn}>
              {!merge ? isTagExisting() ? t('add') : t('create') : t('merge')}
            </button> : <button className="button is-primary is-disabledis-medium tag" disabled>{t('add')}</button>}</> : <button className="button is-primary is-medium tag" onClick={handleCreateTag}>{t('confirm')}</button>}
            {!tag ? <i className="has-text-light ml-3 pointer has-text-danger " onClick={(e) => {
                setTags([])
                setTagForm(false)
                setTagFrValue("")
                setTagEnValue("") 
                setTagDescEn("")
                setTagDescFr("")
                setPending("")
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>   : null}
              
          </div>}
         
        </div>
      </div>
      {tagForm ? <div className="field">
        <label className="label has-text-left is-flex is-justify-content-start">{t('tags-desc')}</label>
        <textarea className="textarea" onChange={handleTagDescChange} value={lang === "en" ? tagDescEn : tagDescFr}/>
      </div> : null}
      
      {selectedTags ? selectedTags.map((tag) => {
        return <Fragment key={tag.slug}>
          <span className="tag is-info is-medium mr-1 mb-1">{getContent(tag.title, lang)}         <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteTag(e, tag)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
            </Fragment>
      }) : null}

    </div>
  </>
}

export default DocTagsForm