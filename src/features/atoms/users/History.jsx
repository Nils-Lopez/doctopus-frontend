import React, {useState, Fragment} from "react"

import {useTranslation} from "react-i18next"

const History = ({client, setAlert, handleSearch, setHideHistory}) => {
	
   	const { t, i18n } = useTranslation()
	console.log(client)
	return <>
	<nav className="panel mt-4 pT-0 pb-2">
  <p className="panel-heading mb-0">
    {t('history')}
  </p> 
  {client && client.user && client.user.history.map((query) => {
		return <Fragment key={query}>
			<a className="panel-block pointer pb-4 pt-4 mt-0" onClick={(e) => {
		e.preventDefault()
		setHideHistory(true)
		handleSearch(query.query)

	}}>
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    <p><strong>{query.query}</strong> <small className="ml-4 has-text-grey">{query.createdAt ? "(" + query.createdAt + ")" : null}</small></p>
	
  </a>
		</Fragment>
	})}
</nav>
	</>
}

export default History