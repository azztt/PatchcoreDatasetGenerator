// src/components/PromptToggle.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const VideoType = ({ type, onVideoTypeChange }) => {
  return (
    <FormControl style={{width: '25%'}} required>
      <InputLabel id="label-select-label">Data Type</InputLabel>
      <Select
        labelId="type-select-type"
        id="type-select"
        value={type}
        onChange={onVideoTypeChange}
        defaultValue={''}
        // fullWidth
      >
        <MenuItem value="train">Train</MenuItem>
        <MenuItem value="test">Test</MenuItem>
        {/* <MenuItem value="gt">Ground Truth</MenuItem> */}
      </Select>
    </FormControl>
  );
};

export default VideoType;
