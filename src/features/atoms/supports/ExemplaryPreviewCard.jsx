import React from "react"

const ExemplaryPreviewCard = ({exemplary, editExemplary, deleteExemplary}) => {
  
  return <>
    <div className="card">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <h4 className="title is-5">exemplary.location</h4>
          </div>
          <div className="column">
            <h4 className="title is-5">exemplary.position</h4>
          </div>
        </div>
        {exemplary.rank}
      </div>
      <div className="card-footer">
        Jsp comment ça marche masi tqt copier coller depuis SupportPreview :)
      </div>
    </div>
  </>
}

export default ExemplaryPreviewCard