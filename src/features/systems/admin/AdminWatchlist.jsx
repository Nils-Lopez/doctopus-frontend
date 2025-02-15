import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUsers } from "../../../utils/hooks/Users"
import SearchItem from "../../atoms/docs/SearchItem"
import Watchlist from "../../atoms/users/Watchlist"
import { useTranslation } from "react-i18next"

const AdminWatchlist = ({ applicationSettings }) => {
  const { user_id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const { findUserById, responseFindUserById } = useUsers()
  const { t } = useTranslation()

  useEffect(() => {
    if (user_id) {
      findUserById(user_id)
    }
  }, [user_id])

  useEffect(() => {
    if (responseFindUserById && responseFindUserById.success) {
      setUserData(responseFindUserById.data)
    }
  }, [responseFindUserById])

  const handleDisplay = (doc) => {
    navigate('/document/' + doc._id)
  }

  if (!userData) {
    return (
      <div className="container pb-6 overflow-auto box has-background-white pb-6">
        <h1 className="title is-4">{t('loading')}...</h1>
      </div>
    )
  }

  return (
    <div className="container overflow-auto box has-background-white pb-6" style={{
        marginTop: 100
    }}>
      <h1 className="title is-3 mb-6">{t('watchlist')} - {userData.email}</h1>
      
      <div className="columns is-multiline mb-6">
        {userData.watchList && userData.watchList.map((doc) => (
          <SearchItem 
            key={doc._id} 
            item={{ doc }} 
            setDisplay={handleDisplay} 
            client={null}
          />
        ))}
      </div>

      {userData.watchList && userData.watchList.length > 0 && (
        <Watchlist 
          docs={userData.watchList} 
          client={{ user: userData }}
          readOnly={true}
          setDisplayDoc={handleDisplay}
        />
      )}
    </div>
  )
}

export default AdminWatchlist
