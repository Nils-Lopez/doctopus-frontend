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
      <div className='container landing-container is-flex is-justify-content-center  w-100'>
     
  <div className='columns is-mobile box search-box '>
    <div className='column is-10 is-paddingless'>
      <div className='search-block' id="searchBlock">
        <label className='search-label label'>
          <span>{t('what-are-you-looking-for')}</span>
        </label>
        <input className='search-input home-input is-family-monospace' placeholder={t('title') + ", " + t('author') + ", " + t('tags') + "..."} type='/search' value={searchValue} onChange={handleSearchChange} />
      </div>
      <div className="column">
        
      </div>
    </div>
   
    {/* <div className='column options-searchbar is-paddingless desktop-only' onMouseEnter={() => setTagDropdown(true)} onMouseLeave={() => setTagDropdown(false)}>
      <div className='price-block'>
        <label className='price-label label'>
          <span>{t('Filters')}</span>
        </label>
        <a className='button' onClick={() => setTagDropdown(!tagDropdown)} href='#' title='Rent Range'>
          <span className="has-text-lightgrey has-text-muted  has-text-left  pb-3 filters-label">{tagDropdown ? <FontAwesomeIcon icon={faChevronCircleUp}/> : <FontAwesomeIcon icon={faChevronCircleDown}/>}&nbsp;Date, types &nbsp;</span>
        </a>
        {tagDropdown ? <div className={"dropdown-container is-open is-rounded"} >
          <div className="dropdown p-2 pt-4 pb-4 is-rounded">
          <div className="field mb-5">
                  <div className="control"> 
                    <label htmlFor="type" className="label has-text-left">{t('types')}</label>
                    {filtersData && filtersData.types ? <SelectForm
                      selected={typeValue}
                      select={handleChooseType}
                      options={filtersData.types.map((type) => {
                        return {
                          value: type.slug,
                          label: getContent(type.title, i18n.language)
                        }
                      })}
                      applicationSettings={applicationSettings}
                    /> : null}

                  </div>
                  </div>
          <div className="field mr-3 ml-3">
            <div className="control">
              <label className="label has-text-left">{t('published-btwn')}</label>
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
    </div> */}
    <div className='column is-paddingless desktop-only'>
        {searchValue.length > 0 ? <button className='button is-primary is-large search-button' type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button> :
        <button className='button is-primary is-large search-button' onClick={(e) => e.preventDefault()}><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/> &nbsp; <strong>{t('search')}</strong></button>}
    </div>
        {searchValue.length > 0 ?<button className=" title has-text-primary is-4 mt-1 ml-1 nodesk-only has-background-transparent border-0"><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/></button> : <button className=" title has-text-primary is-4 mt-1 ml-1 pointer is-mobile has-background-transparent nodesk-only border-0" onClick={e => e.preventDefault()}><FontAwesomeIcon icon={faMagnifyingGlass} size="xl"/></button>}
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
</>
}

export default SearchBar