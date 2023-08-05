import React from "react"

import SearchForm from "../SearchForm"

import {useTags} from '../../../../utils/hooks/Tags'
import {useTranslation} from "react-i18next"

const SearchTagsForm = ({selectedTags, selectTag, location}) => {

  const { t, i18n } = useTranslation()

  const {
    searchTags, 
    responseSearchTags,
  } = useTags()

 
  return <>
      {location !== "templates-tags" ? <label className="label has-text-left mb-0 pb-0">{t('tags')}</label> : null}
     <SearchForm selectedItems={selectedTags} selectItem={selectTag}  searchItems={searchTags} responseSearchItems={responseSearchTags} mainField="content" />
  </>
}

export default SearchTagsForm