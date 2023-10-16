import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowsLeftRight, faMagnifyingGlass, faCircleCheck} from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"
import { t } from "i18next"
import SearchItem from "../parents/SearchItem"
import SearchForm from "./SearchForm"

const MergeForm = ({originItem, searchItem, responseSearchItem, mergeItem, displayItem}) => {

    const [duplicate, setDuplicate] = useState(false)
    const [selectedDuplicates, selectDuplicate] = useState([])

    const handleSendMerge = (e) => {
        e.preventDefault()
        if (duplicate && duplicate._id) {
            const reqData = {
                origin: originItem,
                duplicate: duplicate
            }
            mergeItem(reqData)
        }
    }

    useEffect(() => {
        if (selectedDuplicates[0] && selectedDuplicates[0]._id) {
            setDuplicate(selectedDuplicates[0])
        }
    }, [selectedDuplicates])

    return <>
         <div className="is-flex is-justify-content-center">
            <h2 className="title is-3 ">
                {t('merge')}
            </h2>
           
         </div>
         <div className="columns is-fullwidth">
                <div className="column is-two-fifth is-flex is-justify-content-end">
                    <SearchItem item={{person: originItem}} width="full" handleSearchParent={() => {}}/>
                </div>
                <div className="column is-one-fifth">
                    <h1 className="title is-1 has-text-primary mt-6">                <FontAwesomeIcon icon={faArrowsLeftRight} />                
</h1>
                </div>
                <div className="column is-two-fifth ">
                    {!duplicate ? <>
                        <SearchForm selectedItems={selectedDuplicates} originItem={originItem} selectItem={selectDuplicate} searchItems={searchItem} responseSearchItems={responseSearchItem} mainField={"name"}/>
                    </> : <SearchItem item={{person: duplicate}} width="full" handleSearchParent={() => {}}/>}
                </div>
            </div>
            {duplicate ? <>
                <button className="button is-primary" onClick={handleSendMerge}>{t('confirm')}</button>
            </> : null}
    </>

}

export default MergeForm