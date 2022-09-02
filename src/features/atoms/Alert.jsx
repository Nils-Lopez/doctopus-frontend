import React from 'react'

const Alert = ({alertType, message, setAlert = false}) => {

    var type = alertType === 'error' ? 'is-danger' : alertType === 'success' ? "is-success" : "is-primary"


    return <>
        <div className={"notification has-text-centered " + type}>
            {setAlert ? <button className="delete" onClick={() => setAlert(null)}></button> : null}
            {message['en']}
        </div>
    </>
}

export default Alert