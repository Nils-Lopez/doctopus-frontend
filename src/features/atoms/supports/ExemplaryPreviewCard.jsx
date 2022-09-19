import React from "react"

const ExemplaryPreviewCard = ({exemplary, editExemplary, deleteExemplary}) => {
  
  return <>
    <div className="card">
      <div className="card-content">
        <div className="columns">
          <div className="column">
            <h4 className="title is-5">{exemplary.location}</h4>
          </div>
          <div className="column">
            <h4 className="title is-5">{exemplary.position}</h4>
          </div>
        </div>
        {exemplary.rank}
      </div>
      <footer className="card-footer">
    <button onClick={(e) => {
      e.preventDefault()
      editExemplary(exemplary)
    }} className="card-footer-item button is-primary">Edit</button>
    <button onClick={(e) => {
      e.preventDefault()
      deleteExemplary(exemplary)
    }} className="card-footer-item button is-danger">Delete</button>
  </footer>
    </div>
  </>
}

export default ExemplaryPreviewCard