import React, { useState, useEffect, Fragment } from "react";

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';

const SearchBar = ({searchValue, setSearchValue, filtersData, setFiltersValue}) => {
    const [tagDropdown, setTagDropdown] = useState(false)
    const [extraDropdown, setExtraDropdown] = useState(false)
    const { t, i18n } = useTranslation()
  const [selectedTypes, selectTypes] = useState([])

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

    const oldest = 1948
    const newest = 2023

    const [value, setValue] = useState([oldest, newest]);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function valuetext(value) {
      return `${value}°C`;
    }
    const getContent = (value, lang) => {
      if (value) {
        return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
      } else {
        return "Error"
      }
    }

    const [typeValue, setTypeValue] = useState("none")

    const handleChooseType = (e) => {
      e.preventDefault()
      // setTypeValue(e.target.value)
      filtersData.types.map((type) => {
        if (type.slug === e.target.value) {
          selectTypes([...selectedTypes, type])
        }
      })
      setTagDropdown(false)
    }

    const handleDeleteType = (e, role) => {
      e.preventDefault()
      const filtered = selectedTypes.filter((r) => {
        return r.slug !== role.slug
      })
      selectTypes(filtered)
    }

    useEffect(() => {
      // if (selectedTypes.length > 0) {
      //   setFiltersValue({types: selectedTypes})
      // } else {
      //   setFiltersValue({types: []})
      // }
      // let initialVal = [1948, 2023]
      // if (value !== initialVal) {
      //   setFiltersValue({oldest: value[0], newest: value[1]})
      // }
      setFiltersValue({types: selectedTypes, oldest: value[0], newest: value[1]})
      
    }, [selectedTypes, value])

    return <>
    
      <div className='container landing-container is-flex is-justify-content-center  w-100'>
        
  <div className='columns is-mobile box search-box '>
    <div className='column is-three-quarters is-paddingless'>
      <div className='search-block' id="searchBlock">
        <label className='search-label label'>
          <span>{t('what')}</span>
        </label>
        <input className='search-input home-input is-family-monospace' placeholder='Title, author, tags ...' type='/search' value={searchValue} onChange={handleSearchChange} />
      </div>
    </div>
    <button type="submit" className="button has-background-transparent no-desktop is-borderless mt-1 pl-1 ml-auto mr-auto is-flex is-justify-content-center pl-3 mt-2 " onClick={(e) => {
      if (searchValue.length === 0) {
        e.preventDefault()
      }
    }}>    <span className="has-text-primary pointer ml-auto mr-auto title is-4  mt-2 ml-3"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/></span>
</button>
    <div className='column options-searchbar is-paddingless desktop-only'>
      <div className='price-block'>
        <label className='price-label label'>
          <span>{t('Filters')}</span>
        </label>
        <a className='button' onClick={() => setTagDropdown(!tagDropdown)} href='#' title='Rent Range'>
          <span className="has-text-grey has-text-muted is-family-monospace pb-3 filters-label">{t('type')}, {t('date')}...</span>
        </a>
        {tagDropdown ? <div className={"dropdown-container is-open is-rounded"} >
          <div className="dropdown p-2 pt-4 pb-4">
          <div className="field mb-5">
                   <div className="control"> 
                    <label htmlFor="type" className="label">{t('types')}</label>
                  
                    <select id="tags" className="input select" onChange={handleChooseType} value={typeValue}>
                      <option value="none">All</option>
                    {filtersData && filtersData.types && filtersData.types.map((tag, index) => {
                      if (!selectedTypes.includes(tag)) {
                        return <option key={index} value={tag.slug}>{getContent(tag.title, i18n.language)}</option>
                      }
                    })}
                  </select>
                  </div>
                  </div>
          <div className="field mr-3 ml-3">
            <div className="control">
              <label className="label">{t('published-btwn')}</label>
                <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  min={oldest}
                  max={newest}
                />
        </div>
      </div>
                        
                 
                  
          </div>
        </div> :  null}
      </div>
    </div>
    <div className='column is-paddingless desktop-only'>
        {searchValue.length > 0 ? <button className='button is-primary is-large search-button' type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button> :
        <button className='button is-primary is-large search-button' onClick={(e) => e.preventDefault()}><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button>}
    </div>
        </div>
        
      </div>
      <div className="is-flex is-justify-content-start selected-types-search ml-5 pl-3">
      {selectedTypes ? selectedTypes.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-primary mb-1 is-medium mr-1">{getContent(role.title, i18n.language)}        <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteType(e, role)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
        </Fragment>
      }) : null}
      {value[0] !== oldest || value[1] !== newest ? <span className="tag is-light has-text-primary mb-1 is-medium mr-1">{value[0]} - {value[1]}</span> : null}
      </div>
</>
}

export default SearchBar