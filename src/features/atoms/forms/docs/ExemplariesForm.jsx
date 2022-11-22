import React, {useState, Fragment} from "react"

import ExemplaryPreviewCard from "../../supports/ExemplaryPreviewCard"

const ExemplariesForm= ({setPendingExemplaries, pendingExemplaries, template}) => {
  const [locationValue, setLocationValue] = useState("")
  const [positionValue, setPositionValue] = useState("")
  const [rankValue, setRankValue] = useState("")
  const [qualityValue, setQualityValue] = useState("")

  const handleLocationChange = (e) => {
    e.preventDefault()
    setLocationValue(e.target.value)
  }
  
  const handleQualityChange = (e) => {
    e.preventDefault()
    setQualityValue(e.target.value)
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
      rank: rankValue,
      quality: qualityValue
    }
    setPendingExemplaries([...pendingExemplaries, newEx])
    setLocationValue("")
    setPositionValue("")
    setQualityValue('')
    setRankValue("")
  }
  
  const editExemplary = (ex) => {
    deleteExemplary(ex)
    setLocationValue(ex.location)
    setQualityValue(ex.quality)
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
        Samples
      </label>
      <div className="columns">
        {pendingExemplaries.map((ex) => {
        return <Fragment key={ex.location}>
          <div className="column">
            <ExemplaryPreviewCard exemplary={ex} editExemplary={editExemplary} deleteExemplary={deleteExemplary}/>
          </div>
        </Fragment>
      })}
      </div>
      {template && template.copies_location ? <div className="field mt-5">
        <label className="label">
          Location
        </label>
        <input type="text" className="input" value={locationValue} onChange={handleLocationChange} />
      </div> : null}
      {template && template.copies_position ? <div className="field">
        <label className="label">
          Position
        </label>
        <input type="text" className="input" value={positionValue} onChange={handlePositionChange} />
      </div> : null}
      {template && template.copies_rank ? <div className="field">
        <label className="label">
          Rank
        </label>
        <input type="text" className="input" value={rankValue} onChange={handleRankChange} />
      </div> : null}
      {template && template.copies_quality ? <div className="field">
        <label className="label">
          Quality
        </label>
        <input type="text" className="input" value={qualityValue} onChange={handleQualityChange} />
      </div> : null}
      <button className="button is-primary" onClick={handleExBtn}>Add</button>
    </div>
    
  </>
}

export default ExemplariesForm