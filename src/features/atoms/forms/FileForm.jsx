
import React, { useState, useEffect } from 'react';
import uploadFileToBlob, { isStorageConfigured } from './azureBlob';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faChevronDown, faChevronUp, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"


const FileUpload = ({setFile, pdf}) => {
  // all blobs in container

  const storageConfigured = isStorageConfigured();

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

  useEffect(() => {
    if (fileUrl ) {
      setFile(fileUrl);
    }
    
  }, [fileUrl]);

  useEffect(() => {
    if (pdf && pdf !== fileUrl ) {
      console.log('iciii : ', pdf)
      setFileUrl(pdf);
    }
    
  }, [pdf]);

  // display form
  const DisplayForm = () => (
    <div className="mb-3">
      
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
      uploadFileToBlob(fileUrl.split("/")[fileUrl.split('/').length - 1], "remove")
      setFileUrl(false)
      setFileSelected(null)
      setDisplayFile(false)
      setFile("")
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
  {displayFile&&     <button className={"button is-danger is-rounded is-small mt-1 ml-2  pointer "} onClick={handleDeleteFile}><FontAwesomeIcon icon={faTrash} className="is-primary "/></button>
}
  
</div>
{displayFile && <div className="mt-3">
      {
        fileUrl.split('.')[fileUrl.split('.').length - 1].toLowerCase() === "pdf" ? <embed src={fileUrl} width="100%" height="300px" /> : 
        ["png" , "jpg" , "jpeg" , "gif" , "ico" , "svg"].includes(fileUrl.split('.')[fileUrl.split('.').length - 1].toLowerCase()) ? <img src={fileUrl} alt="file" className="file-img"/> :
        ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(fileUrl.split('.')[fileUrl.split('.').length - 1].toLowerCase()) ? <video src={fileUrl}  className="file-video" controls/> : 
        ["wav", "mp3", "flac", "m4a"].includes(fileUrl.split('.')[fileUrl.split('.').length - 1].toLowerCase()) ? <audio src={fileUrl} controls/> : fileUrl.includes("books.google") ?
        <img src={fileUrl} alt="file" className="file-img"/>
        : null
      }
      </div>}
    </div> : <>
    {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div className="button is-light is-disabled" disabled>{t('uploading')} <div className="loader baby">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
      </div>}
    </>}
      {!storageConfigured && <div>{t('storage-not-configured')}</div>}
    </div>
  );
};

export default FileUpload;
