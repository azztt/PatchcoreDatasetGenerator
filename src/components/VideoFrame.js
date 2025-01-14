// src/components/VideoFrame.js
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PromptToggle from './PromptToggle';
import CatToggle from './VideoType';
import VideoType from './VideoType';
import Label from './Label';
import Desc from './Desc';
import NFrame from './NFrame';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import IsDefect from './IsDefect';

const VIDEO_WIDTH = 3840;
const VIDEO_HEIGHT = 2160;

const VideoFrame = ({ 
  frame, 
  index, 
  onImageClick, 
  promptType, 
  onPromptChange, 
  points, 
  label,
  onLabelChange,
  onVideoTypeChange,
  desc,
  onDescChange,
  defectTypes,
  nthFrame,
  onNthFrameChange,
  onDelete,
  type,
  onTypeChange,
  isDefect,
  onIsDefectChange,
  onPointsDelete
}) => {
  const handleClick = (e, gt = false) => {

    // const rect = e.target.getBoundingClientRect();

    // // Calculate scaled coordinates relative to the displayed image
    // const x = ((e.clientX - rect.left) / rect.width) * imageDimensions.width;
    // const y = ((e.clientY - rect.top) / rect.height) * imageDimensions.height;
    const img = e.target;
    const rect = img.getBoundingClientRect();
    
    // Click position relative to the image element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('clientHeight', rect.height);
    console.log('clientWidth', rect.width);
    // Calculate scaling factors based on the image's displayed size
    const scaleX = VIDEO_WIDTH / rect.width;
    const scaleY = VIDEO_HEIGHT / rect.height;

    // Convert click position to image coordinates
    const imgX = x * scaleX;
    const imgY = y * scaleY;

    console.log(`Click position (client): (${e.clientX}, ${e.clientY})`);
    console.log(`Click position (image): (${imgX}, ${imgY})`);

    // Check if the calculated coordinates are within bounds
    if (imgX >= 0 && imgX <= VIDEO_WIDTH && imgY >= 0 && imgY <= VIDEO_HEIGHT) {
      // debugger
      onImageClick(index, { x: imgX, y: imgY, cx: x, cy: y }, gt);
    }
  };

  useEffect(() => {
    // debugger
    if (!nthFrame) {
      onNthFrameChange(index, 3);
    }
  }, [nthFrame, onNthFrameChange, index]);

  return (
    <div>
      {/* <Typography variant="h6" gutterBottom>
        {frame.name}
        <IconButton
          aria-label="delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </Typography> */}
      <br />
      {/* {
        (label !== '' && label !== 'clean') && (
          <Desc defectTypes={defectTypes} desc={desc} onDescChange={(e) => onDescChange(index, e.target.value)} />
        )
      } */}
      <VideoType type={type} onVideoTypeChange={(e) => onTypeChange(index, e.target.value)} />
      <Label required={type === 'test'} label={label} onLabelChange={(e) => onLabelChange(index, e.target.value)} />
      <NFrame nthFrame={nthFrame} onNthFrameChange={(e) => onNthFrameChange(index, e.target.value)} />
      {
        type === 'test' && (
          <>
            <br />
            <IsDefect isDefect={isDefect} onIsDefectChange={(e) => onIsDefectChange(index, e.target.checked)} />
          </>
        )
      }
      <br />
      <PromptToggle
        promptType={promptType[0]}
        onPromptChange={(e, newType) => onPromptChange(index, newType)}
      />
      <IconButton
        aria-label="delete"
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>
      {frame[0].name}
      <IconButton
        aria-label="reset points"
        onClick={(_) => onPointsDelete(index)}
      >
        <RefreshIcon />
        Reset Points
      </IconButton>
      <Box component="div" style={{ position: 'relative', marginBottom: '16px' }}>
        <img
          src={frame[0].src}
          alt={`Frame ${index}`}
          style={{ width: '100%', height: 'auto', cursor: 'crosshair' }}
          onClick={handleClick}
        />
        {(points[index]?.[0] || []).map((point, pointIndex) => (
          <Box
            key={pointIndex}
            style={{
              position: 'absolute',
              left: `${point.cx}px`,
              top: `${point.cy}px`,
              // left: 0,
              // top: 0,
              width: '5px',
              height: '5px',
              backgroundColor: point.type === 1 ? 'green' : 'red',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </Box>
      {
        isDefect && type === 'test' && (
          <>
            <PromptToggle
              promptType={promptType[1]}
              onPromptChange={(e, newType) => onPromptChange(index, newType, true)}
            />
            Ground Truth for {frame[1].name}
            <IconButton
              aria-label="reset points"
              onClick={(_) => onPointsDelete(index, true)}
            >
              <RefreshIcon />
              Reset Points
            </IconButton>
            <Box component="div" style={{ position: 'relative', marginBottom: '16px' }}>
              <img
                src={frame[1].src}
                alt={`Frame ${index}`}
                style={{ width: '100%', height: 'auto', cursor: 'crosshair' }}
                onClick={(e) => handleClick(e, true)}
              />
              {(points[index]?.[1] || []).map((point, pointIndex) => (
                <Box
                  key={pointIndex}
                  style={{
                    position: 'absolute',
                    left: `${point.cx}px`,
                    top: `${point.cy}px`,
                    // left: 0,
                    // top: 0,
                    width: '5px',
                    height: '5px',
                    backgroundColor: point.type === 1 ? 'green' : 'red',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </Box>
          </>
          
        )
      }
    </div>
  );
};

export default VideoFrame;
