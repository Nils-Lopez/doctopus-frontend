import React, { useState, useEffect, Fragment } from "react";

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const SearchBar = ({searchValue, setSearchValue}) => {
    const [tagDropdown, setTagDropdown] = useState(false)
    const [extraDropdown, setExtraDropdown] = useState(false)
    const { t, i18n } = useTranslation()

    // const [tags, setTags] = useState([])

    const handleSearchChange = (e) => {
      e.preventDefault()
      setSearchValue(e.target.value)
    }
    
    // const getContent = (value, lang) => {
    //   if (value) {
    //     return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
    //   } else {
    //     return "Error"
    //   }
    // }
  
    // const {
    //   findAllTags, 
    //   responseFindAllTags
    // } = useTags()
  
    // if (!tags[0] && !tagsLoading) {
    //   findAllTags()
    //   setTagsLoading(true)
    // }
      
    // useEffect(() => {
    //   if (responseFindAllTags && responseFindAllTags.success) {
    //     setTags(responseFindAllTags.data)
    //     setTagsLoading(false)
    //   }
    // }, [responseFindAllTags])
    
    // console.log('tags : ', tags)

 

    return <>
    
      <div className='container landing-container is-flex is-justify-content-center'>
        
  <div className='columns is-mobile box search-box '>
    <div className='column is-three-quarters is-paddingless'>
      <div className='search-block' id="searchBlock">
        <label className='search-label label'>
          <span>{t('what')}</span>
        </label>
        <input className='search-input home-input' placeholder='Title, author, tags ...' type='/search' value={searchValue} onChange={handleSearchChange} />
      </div>
    </div>
    {/* <div className='column  is-paddingless'>
      <div className='price-block'>
        <label className='price-label label'>
          <span>Where</span>
        </label>
        <a className='button' onClick={() => setTagDropdown(!tagDropdown)} href='#' title='Rent Range'>
          <span>Type, tags...</span>
        </a>
        {tagDropdown ? <div className={"dropdown-container is-open"} >
          <div className="dropdown p-2">
                  <div className="field">
                    <label htmlFor="type" className="label">Type</label>
                    <input type="text" className="input is-small" />
                  </div>
                  <div className="field">
                    <label htmlFor="type" className="label">Tags</label>
                    <input type="text" className="input is-small"list="tags"/>
                  </div>
                  <datalist id="tags">
                    {tags.map((tag) => {
                      return <Fragment key={tag._id}>
                        <option>{getContent(tag.title, "en")}</option>
                      </Fragment>
                    })}
                  </datalist>
          </div>
        </div> :  null}
      </div>
    </div> */}
    <div className='column is-paddingless'>
        {searchValue.length > 0 ? <button className='button is-primary is-large search-button' type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; {t('what')}</button> :
        <button className='button is-primary is-large search-button'><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button>}
    </div>
        </div>
        
      </div>
      
</>
}

export default SearchBar