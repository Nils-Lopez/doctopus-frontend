import React from "react"

const SupportPreviewCard = ({support, editSupportPreview, deleteSupportPreview}) => {
  
  return <>
    <div className="card">
  <header className="card-header">
    <p className="card-header-title">
      {support.title[0].content !== "" ? support.title[0].content : support.title[1].content}
    </p>
    <br/>
    
    <time>{support.date}</time>
  </header>
  <div className="card-content">
    <div className="content">
      {support.description[0].content !== "" ? support.description[0].content : support.description[1].content}
      <br/>
      {support.pages !== "" ? support.pages : support.duration}
    </div>
  </div>
  <footer className="card-footer">
    <button onClick={(e) => {
      e.preventDefault()
      editSupportPreview(support)
    }} className="card-footer-item button is-primary">Edit</button>
    <button onClick={(e) => {
      e.preventDefault()
      deleteSupportPreview(support)
    }} className="card-footer-item button is-danger">Delete</button>
  </footer>
</div>
  </>
}

export default SupportPreviewCard