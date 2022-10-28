import React, { useState } from "react";

  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'


const SearchBar = () => {
    const [tagDropdown, setTagDropdown] = useState(false)

    return <>
    
    <div className='container landing-container is-flex is-justify-content-center'>
  <div className='columns is-mobile box search-box '>
    <div className='column is-half is-paddingless'>
      <form className='search-block'>
        <label className='search-label label'>
                <span>What</span>
                
        </label>
        <input className='search-input home-input' placeholder='Title, author, projects...' type='/search' value=''/>
      </form>
    </div>
    <div className='column is-3 is-paddingless'>
      <form className='price-block'>
        <label className='price-label label'>
          <span>Where</span>
        </label>
        <a className='button' onClick={() => setTagDropdown(!tagDropdown)} href='#' title='Rent Range'>
          <span>Type, tags...</span>
        </a>
                        <div className={'dropdown-container '} >
          <div className='dropdown'>
            <div className='range-container'>
              <div className='left-input'>
                <input className='minRentInput active' maxlength='6' placeholder='Min Rent' type='tel' />
              </div>
              <div className='right-input'>
                <input className='maxRentInput' maxlength='6' placeholder='Max Rent' type='tel'/>
              </div>
            </div>
            <ul className='min-options'>
              <li>No Min</li>
              <li>$500</li>
              <li>$700</li>
              <li>$900</li>
              <li>$1100</li>
              <li>$1300</li>
              <li>$1500</li>
            </ul>
            <ul className='max-options'>
              <li>$1100</li>
              <li>$1300</li>
              <li>$1500</li>
              <li>$1700</li>
              <li>$1900</li>
              <li>$2100</li>
              <li>No Max</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
    <div className='column is-3 is-paddingless'>
      <div className='price-block'>
        <label className='price-label label'>
          <span>Extra's</span>
        </label>
        <a className='button' href='#' title="Extra's">
          <span>Date, size...</span>
        </a>
        <div className='dropdown-container'>
          <div className='dropdown'>
            <div className='options-container'>
              <p>Beds</p>
              <div className='checkbox'>
                <label for='allBed'>
                  <input id='allBeds' type='checkbox' />
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                All Beds
              </div>
              <div className='checkbox'>
                <label for='studioBed'>
                  <input id='studioBed' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                Studio
              </div>
              <div className='checkbox'>
                <label for='oneBed'>
                  <input id='oneBed' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                1 Bed
              </div>
              <div className='checkbox'>
                <label for='twoBed'>
                  <input id='twoBed' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                2 Beds
              </div>
              <div className='checkbox'>
                <label for='threeBed'>
                  <input id='threeBed' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                3 Beds
              </div>
              <div className='checkbox'>
                <label for='maxBeds'>
                  <input id='maxBeds' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                4+ Beds
              </div>
            </div>
            <div className='options-container'>
              <p>Baths</p>
              <div className='checkbox'>
                <label for='allBath'>
                  <input id='allBath' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                All Baths
              </div>
              <div className='checkbox'>
                <label for='oneBath'>
                  <input id='oneBath' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                1+ Bath
              </div>
              <div className='checkbox'>
                <label for='twoBath'>
                  <input id='twoBath' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                2+ Bath
              </div>
              <div className='checkbox'>
                <label for='threeBath'>
                  <input id='threeBath' type='checkbox'/>
                  <span className='checkbox-material'>
                    <span className='check'></span>
                  </span>
                </label>
                3+ Baths
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='column is-3 is-paddingless'>
                    <a className='button is-primary is-large search-button'><FontAwesomeIcon icon={faMagnifyingGlassPlus} size="xl"/> &nbsp; Search</a>
    </div>
  </div>
</div>
</>
}

export default SearchBar