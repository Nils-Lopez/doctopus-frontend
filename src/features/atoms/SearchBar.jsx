import React, { useState, useEffect, Fragment } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleXmark, faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';
import Slider from '@mui/material/Slider';

import Select from "react-select"
import SelectForm from "./forms/SelectForm";

import magnifyingIcon from '../../styles/magnifying-glass.svg'

const SearchBar = ({searchValue, setSearchValue, filtersData, setFiltersValue, applicationSettings}) => {
    const [tagDropdown, setTagDropdown] = useState(false)
    const [extraDropdown, setExtraDropdown] = useState(false)
    const { t, i18n } = useTranslation()
    const [selectedTypes, selectTypes] = useState([])

    // const [tags, setTags] = useState([])

    const handleSearchChange = (e) => {
      e.preventDefault()
      setSearchValue(e.target.value)
    }

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

    const handleChooseType = (value) => {
      setTypeValue(value)
      console.log('val: ', value)
      filtersData.types.map((type) => {
        if (type.slug === value.value) {
          selectTypes([...selectedTypes, type])
        }
      })
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
      <div className='  is-flex is-justify-content-center  w-100'>
     <div className="landing-container">

  <div className='columns is-mobile box search-box '>
    <div className='column  is-9 is-paddingless'>
      <div className='search-block' id="searchBlock">
        <label className='search-label label'>
          <span>{t('what-are-you-looking-for')}</span>
        </label>
        <label className='mobile-search-label label'>
          <span>{t('what')}</span>
        </label>
        <input className='search-input home-input is-family-monospace' placeholder={t('title') + ", " + t('author') + ", " + t('tags') + "..."} type='/search' value={searchValue} onChange={handleSearchChange} />
      </div>
      <div className="column">
        
      </div>
    </div>
   
   
    <div className='column  is-paddingless desktop-only has-text-monospace'>
        {searchValue.length > 0 ? <button className='button is-primary is-large search-button' type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button> :
        <button className='button is-primary is-large search-button' onClick={(e) => e.preventDefault()}><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong >{t('search')}</strong></button>}
    </div>
        {searchValue.length > 0 ?<button className="is-large search-button button is-primary nodesk-only is-hidden-tablet"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/></button> : <button className="search-button button subtitle is-4 is-primary nodesk-only is-hidden-tablet" onClick={e => e.preventDefault()}><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/></button>}
        </div>
        
      </div>
      <div className="search-box is-flex is-justify-content-center selected-types-search  mb-2">
      {selectedTypes ? selectedTypes.map((role) => {
        return <Fragment key={role.slug}>
          <span className="tag is-primary mb-1 is-medium mr-1">{getContent(role.title, i18n.language)}        <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteType(e, role)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
        </Fragment>
      }) : null}
      {value[0] !== oldest || value[1] !== newest ? <span className="tag is-light has-text-primary mb-1 is-medium mr-1">{value[0]} - {value[1]}</span> : null}
      </div>

      {/* <div className="mt-5  pt-5 has-text-center mr-1 landing-container">
        testsdsdsdsdsdsdsdsdsddsdsdsd
      </div> */}
           </div>

</>
}

export default SearchBar