import React, {useState, Fragment} from "react"

import ExemplaryPreviewCard from "../../supports/ExemplaryPreviewCard"

const ExemplariesForm= ({setPendingExemplaries, pendingExemplaries}) => {
  const [locationValue, setLocationValue] = useState("")
  const [positionValue, setPositionValue] = useState("")
  const [rankValue, setRankValue] = useState("")
  
  const handleLocationChange = (e) => {
    e.preventDefault()
    setLocationValue(e.target.value)
  }
  
  const handlePositionChange = (e) => {
    e.preventDefault()
    setPositionValue(e.target.value)
  }
  
  const handleRankChange = (e) => {
    e.preventDefault()
    setRankValue(e.target.value)
  }
  
  const handleExBtn = (e) => {
    e.preventDefault()
    const newEx = {
      location: locationValue,
      position: positionValue,
      rank: rankValue
    }
    setPendingExemplaries([...pendingExemplaries, newEx])
  }
  
  const editExemplary = (ex) => {
    deleteExemplary(ex)
    setLocationValue(ex.location)
    setPositionValue(ex.position)
    setRankValue(ex.rank)
  }
  
  const deleteExemplary = (ex) => {
    let filtered = [...pendingExemplaries].filter((exemplary) => {
      return exemplary !== ex
    })
    setPendingExemplaries(filtered)
  }
  
  return <>  
    <div className="box">
      <label className="label title is-5">
        Exemplaries
      </label>
      {pendingExemplaries.map((ex) => {
        return <Fragment key={ex.location}>
          <ExemplaryPreviewCard exemplary={ex} editExemplary={editExemplary} deleteExemplary={deleteExemplary}/>
        </Fragment>
      })}
      <div className="field">
        <label className="label">
          Location
        </label>
        <input type="text" className="input" value={locationValue} onChange={handleLocationChange} />
      </div>
      <div className="field">
        <label className="label">
          Position
        </label>
        <input type="text" className="input" value={positionValue} onChange={handlePositionChange} />
      </div>
      <div className="field">
        <label className="label">
          Rank
        </label>
        <input type="text" className="input" value={rankValue} onChange={handleRankChange} />
      </div>
      <button className="button is-primary" onClick={handleExBtn}>Add</button>
    </div>
    
  </>
}

export default ExemplariesForm