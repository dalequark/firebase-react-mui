import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Input, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";

function FileUploader(props) {
  const { userid, fileUploadedFn } = props;

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadState, setUploadState] = useState("not running");

  const onInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    const storage = getStorage();
    if (!file) {
      return alert("No file selected!");
    }
    if (uploadState != "not running") {
      return alert("Can't upload while upload's already running");
    }
    console.log(`Uploading file ${file.name}`);
    const storageRef = ref(storage, `users/${userid}/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadState(snapshot.state);
      },
      (error) => {
        setUploadState(`error: ${error.code}`);
        setUploadProgress(0);
      },
      () => {
        setUploadState("not running");
        setUploadProgress(0);
        setFile(null);
        fileUploadedFn();
      }
    );
  };

  return (
    <Box>
      <Input
        id="import-button"
        inputProps={{
          accept: ".pptx, image/* , application/vnd.ms-excel",
        }}
        onChange={onInputChange}
        type="file"
      />
      <Button
        variant="outlined"
        onClick={uploadFile}
        sx={{ visibility: file ? "visible" : "hidden", marginLeft: 3 }}
      >
        Upload
      </Button>
      <Typography>
        {uploadState} : {uploadProgress}
      </Typography>
    </Box>
  );
}

function FileList(props) {
  const { userid } = props;
  const [fileList, setFileList] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(true);

  const storage = getStorage();

  useEffect(async () => {
    if (!needsUpdate) return;
    const listRef = ref(storage, `users/${userid}/files`);
    listAll(listRef)
      .then((res) => {
        document.res = res.items;
        setFileList(res.items);
        setNeedsUpdate(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [needsUpdate]);

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  function deleteItem(item) {
    const objRef = ref(storage, item);
    deleteObject(objRef)
      .then(() => {
        setNeedsUpdate(true);
      })
      .catch((error) => {
        console.log(`Error deleting: ${error}`);
      });
  }

  function downloadItem(item) {
    console.log(`Trying to download ${item}`);
    getDownloadURL(ref(storage, item))
    .then((url) => {
      console.log(url); 
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <FileUploader
        userid={userid}
        fileUploadedFn={() => {
          setNeedsUpdate(true);
        }}
      ></FileUploader>
      <Grid item xs={12} md={6}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 4, mb: 2 }}>
          <Typography variant="h6" component="div">
            Files
          </Typography>
          <IconButton
            edge="end"
            aria-label="refresh"
            onClick={() => {
              setNeedsUpdate(true);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        <Demo>
          <List>
            {fileList.map((item, idx) => {
              return (
                <Paper key={item.fullPath} elevation={2}>
                <ListItem
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          downloadItem(item);
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          deleteItem(item);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText primary={item.name} />
                </ListItem>
                </Paper>
              );
            })}
          </List>
        </Demo>
      </Grid>
    </Box>
  );
}

export { FileUploader, FileList };

// const storage = getStorage();

// // Create the file metadata
// /** @type {any} */
// const metadata = {
//   contentType: 'image/jpeg'
// };

// // Upload file and metadata to the object 'images/mountains.jpg'
// const storageRef = ref(storage, 'images/' + file.name);
// const uploadTask = uploadBytesResumable(storageRef, file, metadata);

// // Listen for state changes, errors, and completion of the upload.
// uploadTask.on('state_changed',
//   (snapshot) => {
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case 'paused':
//         console.log('Upload is paused');
//         break;
//       case 'running':
//         console.log('Upload is running');
//         break;
//     }
//   },
//   (error) => {
//     // A full list of error codes is available at
//     // https://firebase.google.com/docs/storage/web/handle-errors
//     switch (error.code) {
//       case 'storage/unauthorized':
//         // User doesn't have permission to access the object
//         break;
//       case 'storage/canceled':
//         // User canceled the upload
//         break;

//       // ...

//       case 'storage/unknown':
//         // Unknown error occurred, inspect error.serverResponse
//         break;
//     }
//   },
//   () => {
//     // Upload completed successfully, now we can get the download URL
//     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//       console.log('File available at', downloadURL);
//     });
//   }
// );
