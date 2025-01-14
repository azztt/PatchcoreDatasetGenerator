// src/components/VideoFrameSelector.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Grid2 as Grid, Typography } from '@mui/material';
import VideoFrame from './VideoFrame';
import PromptToggle from './PromptToggle';

const VideoFrameSelector = () => {
  const [videos, setVideos] = useState([]);
  const [frames, setFrames] = useState([]);
  const [points, setPoints] = useState({});
  const [promptType, setPromptType] = useState(1);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
    setFrames([]);
    setPoints({});
    files.forEach(file => {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadeddata = () => {
        videoElement.currentTime = 0;
        videoElement.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          setFrames(prevFrames => [...prevFrames, { src: canvas.toDataURL(), name: file.name }]);
        };
      };
    });
  };

  const handleImageClick = (e) => {
    const index = e.currentTarget.dataset.index;
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * e.target.width;
    const y = (e.clientY - rect.top) / rect.height * e.target.height;

    setPoints(prevPoints => ({
      ...prevPoints,
      [index]: [{ x, y, type: promptType }]
    }));
  };

  const handlePromptChange = (event, newType) => {
    setPromptType(newType);
  };

  const handleSubmit = async () => {
    try {
      const videoPaths = videos.map(file => file.name);
      const videoData = frames.map((frame, index) => ({
        filePath: videos[index].name,
        prompts: points[index] || []
      }));
      await axios.post('http://localhost:5000/api/videos', { paths: videoPaths, data: videoData });
      alert('Videos and prompts sent to backend successfully!');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <input
        accept="video/*"
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="upload-video"
      />
      <label htmlFor="upload-video">
        <Button variant="contained" color="primary" component="span">
          Upload Videos
        </Button>
      </label>
      <PromptToggle promptType={promptType} onPromptChange={handlePromptChange} />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
        style={{ marginTop: '16px' }}
      >
        Submit Data
      </Button>
      <Grid container spacing={2} style={{ marginTop: '16px' }}>
        {frames.map((frame, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Typography variant="h6" gutterBottom>
              {frame.name}
            </Typography>
            <img
              src={frame.src}
              alt={`Frame ${index}`}
              style={{ width: '100%', height: 'auto', cursor: 'crosshair' }}
              data-index={index}
              onClick={handleImageClick}
            />
            {points[index] && points[index].map((point, pointIndex) => (
              <div
                key={pointIndex}
                style={{
                  position: 'absolute',
                  left: `${point.x}px`,
                  top: `${point.y}px`,
                  width: '10px',
                  height: '10px',
                  backgroundColor: point.type === 1 ? 'green' : 'red',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VideoFrameSelector;
