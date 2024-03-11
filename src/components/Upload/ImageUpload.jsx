import Box from '@mui/material/Box';
import { useState } from 'react';
import Container from '@mui/material/Container'
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import {Alert} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import './ImageUpload.css'

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('none');
  const [appliedFilter, setAppliedFilter] = useState('No Filter');
  const [filteredPreview, setFilteredPreview] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const image = acceptedFiles[0];

    if (image) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result;
        setSelectedImage(dataUrl);
        setFilteredPreview(dataUrl);
        setAppliedFilter('No Filter');
      };

      reader.readAsDataURL(image);
      setOriginalFile(image);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    if (selectedImage) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;

        if (selectedFilter === 'grayscale') {
          ctx.filter = 'grayscale(100%)';
        } else if (selectedFilter === 'sepia') {
          ctx.filter = 'sepia(100%)';
        } else {
          ctx.filter = 'none';
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const filteredImage = canvas.toDataURL('image/png');

        setFilteredPreview(filteredImage);
        setAppliedFilter(selectedFilter);
      };
      image.src = selectedImage;
    }
  };

  const handleUpload = () => {
    if (!selectedImage) {
      console.error('No image selected.');
      return;
    }

    console.log('Uploading image:', selectedImage);

    const blob = dataURLtoBlob(selectedImage);
    const file = new File([blob], originalFile.name, {
      type: originalFile.type,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filter', filter);

    console.log('FormData:', formData);

    axios
      .post('https://deepakmandal.com/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Upload successful:', response.data);
        setUploadSuccess('Image successfully uploaded!');
        
      })
      .catch((error) => {
        console.error('Upload error:', error);

        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
        } else if (error.request) {
          console.error('No response received from the server.');
        } else {
          console.error('Error setting up the request:', error.message);
        }

        setUploadSuccess('Error uploading image.');
      });
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };
  return (
    <>
      <Box height={100} />
      <Container maxWidth="lg">
        <Typography color="neutral" level="h3" noWrap={false} align="center">
          Upload Image
        </Typography>
        <div>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p className="text-center">Drag & drop an image here, or click to select one</p>
          </div>

          {selectedImage && (
            <div>
              <img src={filteredPreview} alt="Preview" className="preview" />

              <div className='filterBtn'>
                <button onClick={() => applyFilter('none')}>No Filter</button>
                <button onClick={() => applyFilter('grayscale')}>
                  Grayscale
                </button>
                <button onClick={() => applyFilter('sepia')}>Sepia</button>
              </div>

              <p className='applyFilter-msg'>Applied Filter: {appliedFilter}</p>

              <button className='image-upload-btn' onClick={handleUpload}>Upload Image</button>

              {uploadSuccess && 
              <Alert className='upload-success-msg' variant='filled' severity='success'>
                {uploadSuccess}
              </Alert>}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default ImageUpload;
