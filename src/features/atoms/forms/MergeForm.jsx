import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowRotateLeft, faMagnifyingGlass, faCircleCheck} from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"
import { t } from "i18next"

const MergeForm = ({originItem, searchItem, responseSearchItem, mergeItem}) => {

    const [duplicate, setDuplicate] = useState(false)
    const [selectedDuplicates, selectDuplicates] = useState([])

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

    return <>
         <div className="is-flex is-justify-content-start">
            <h2 className="title is-3">
                {t('merge')}
            </h2>
         </div>
    </>

}