import React, {useState, Fragment} from "react"

import {useTranslation} from "react-i18next"

const History = ({client, setAlert, handleSearch, setDisplayHistory}) => {
	
   	const { t, i18n } = useTranslation()

	return <>
	<nav className="panel">
  <p className="panel-heading">
    {t('history')}
  </p> 
  {client && client.user && client.user.history.map((query) => {
		<Fragment key={JSON.stringify(query)}>
			<a className="panel-block" onClick={(e) => {
		e.preventDefault()
		setDisplayHistory(false)
		handleSearch(query)

	}}>
    <span className="panel-icon">
      <i className="fas fa-book" aria-hidden="true"></i>
    </span>
    <p>{query.query}</p>
	<p className="has-text-right text-muted has-text-light is-6">{query.createdAt}</p>
  </a>
		</Fragment>
	})}
 
</nav>
	</>
}

export default History