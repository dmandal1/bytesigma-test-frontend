import React from 'react';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import Container from '@mui/material/Container';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';

const ImageCard = () => {
  const [images, setImages] = useState([]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetch('https://deepakmandal.com/api/v1/list-images')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setImages(data.data);
        } else {
          console.error('API request unsuccessful:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  return (
    <>
      <Box height={100} />
      <Container maxWidth="lg">
        <Typography
          color="neutral"
          level="h2"
          noWrap={false}
          align="center"
          style={{ marginTop: '5px' }}
        >
          List of Uploaded Images
        </Typography>
        <Grid container spacing={5} style={{ marginTop: '20px' }}>
          {images.map((result, index) => (
            <Grid item xs={12} sm={4} ms={4} key={index}>
              <Card
                variant="outlined"
                sx={{ maxWidth: 345, maxHeight: 400 }}
                style={{ padding: '10px', marginBottom: '30px' }}
              >
                <CardOverflow>
                  <AspectRatio ratio="1">
                    <img src={result.imageUrl} loading="lazy" alt="" />
                  </AspectRatio>
                </CardOverflow>
                <CardContent>
                  <Typography level="title-md">
                    <Link href={result.imageUrl} overlay underline="none">
                      {result.fileName}
                    </Link>
                  </Typography>
                </CardContent>
                <CardOverflow variant="soft">
                  <Divider inset="context" />
                  <CardContent orientation="horizontal">
                    <Typography level="body-xs">
                      {formatDate(result.uploadedDate)}
                    </Typography>
                    <Divider orientation="vertical" />
                    <Typography level="body-xs">{result.filter}</Typography>
                  </CardContent>
                </CardOverflow>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default ImageCard;
