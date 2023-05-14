
import React, { useState, Fragment } from 'react';
import uploadFileToBlob, { isStorageConfigured } from './azureBlob';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faChevronDown, faChevronUp, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"

const storageConfigured = isStorageConfigured();

const FileUpload = () => {
  // all blobs in container
  const [blobList, setBlobList] = useState([]);

  const {t, i18n} = useTranslation()

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);
  const [fileUrl, setFileUrl] = useState(false)

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const [displayFile, setDisplayFile] = useState(false)

  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    blobsInContainer.map((blob) => {
      console.log('blob : ', blob, fileSelected.name, blob.includes(fileSelected.name))
      if (blob.includes(fileSelected.name)) {
        setFileUrl(blob)
        console.log("url:" , fileUrl)
      }
    })
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  

  // display form
  const DisplayForm = () => (
    <div className="is-flex is-justify-content-center mb-3">
      
      <div className="file has-name is-primary">
  <label className="file-label">
    <input className="file-input" type="file" name="resume" onChange={onFileChange} key={inputKey || ''}/>
    <span className="file-cta">
      <span className="file-icon">
      <FontAwesomeIcon icon={faUpload} className="is-primary"/>
      </span>
      <span className="file-label">
        {t('choose-file')}
      </span>
    </span>
    {fileSelected ? <span className="file-name">
      {fileSelected.name}
    </span> : null}
    
  </label>
  {fileSelected ? <button type="submit" className="button is-primary ml-3 is-rounded" onClick={onFileUpload}>
  <FontAwesomeIcon icon={faCircleCheck} className="is-primary"/>
      </button> : null}
</div>

    </div>
    
  );

    const handleDisplayFile = (e) => {
      e.preventDefault()
      setDisplayFile(!displayFile)
    }
    
    const handleDeleteFile = (e) => {
      e.preventDefault()
    }
    
    

  return (
    <div className="container">
     
      {fileUrl ? <div className="mb-3">
      
      <div className="file has-name is-primary">
  <label className="file-label">
    <span className="file-cta">
  
      <span className="file-label" onClick={handleDisplayFile}>
        {!displayFile ? <>{t('show-file')}<FontAwesomeIcon icon={faChevronDown} className="is-primary mt-1 ml-2"/></> : <>{t('hide-file')} <FontAwesomeIcon icon={faChevronUp} className="is-primary mt-1 ml-2"/></>}
      </span>
    </span>
  <span className="file-name">
      {fileUrl.split("/")[fileUrl.split('/').length - 1]}
    </span> 
    
  </label>

  
</div>
<div className="mt-3">
      <button className="button is-danger delete-img-btn" onClick={handleDeleteFile}><FontAwesomeIcon icon={faTrash} className="is-primary mt-1 ml-2"/></button>
      {displayFile && <img src={fileUrl} alt={fileUrl} className="image is-preview is-flex is-justify-content-center" />}
      </div>
    </div> : <>
    {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div>{t('uploading')}</div>}
    </>}
      {!storageConfigured && <div>{t('storage-not-configured')}</div>}
    </div>
  );
};

export default FileUpload;
