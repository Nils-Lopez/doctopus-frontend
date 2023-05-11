import React, {useState, useRef} from "react
import { fileUpload } from "../../../utils/middlewares/fileUpload.js";

// Filepond Plugin imports
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFilePreview from "filepond-plugin-pdf-preview";

// FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins for usage
registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode,
  FilePondPluginFilePreview
);

const FileForm = ({client, setAlert, file, setFile}) => {
  const [pdfFile, setpdfFile] = useState([]);

  const filePondPdfRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const containerName = "container-name";

    const fileString = await fileUpload(pdfFile, containerName);
    console.log("url string:", fileString);
	setFile(fileString)
  };

  return ( 
      <form method="post" onSubmit={handleSubmit}>
        <FilePond
          fileSizeBase={1000}
          checkValidity={true}
          allowFileTypeValidation={true}
          allowFileSizeValidation={true}
          allowFileEncode={true}
          chunkUploads={true}
          acceptedFileTypes={["application/pdf"]}
          files={pdfFile}
          onupdatefiles={setpdfFile}
          allowMultiple={false}
          maxFiles={1}
          name="files"
          ref={filePondPdfRef}
          onaddfile={(error, fileItem) => {
            if (error) {
              console.log(error);
            }

            if (fileItem.file.size > 1000000) {
              console.error("File size is too large");
            }
          }}
          oninit={() => console.log("FilePond instance has initialised")}
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <button
          type="submit"
          style={{
            width: "100%",
            height: "50px",
            backgroundColor: "#225BD8",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginTop: "10px",
            fontSize: "20px",
          }}
        >
          Submit for file
        </button>
      </form>
  );
}