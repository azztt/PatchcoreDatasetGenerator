// src/components/PromptToggle.js
import React from 'react';
import { FormControl, InputLabel } from '@mui/material';

const NFrame = ({ nthFrame, onNthFrameChange }) => {
  return (
    <FormControl style={{width: '25%'}} required>
      {/* <InputLabel id="label-select-label">Nth Frame to extract</InputLabel> */}
      <label htmlFor="nthFrame">
        Nth Frame to extract
        <input
          type="number"
          value={nthFrame}
          onChange={onNthFrameChange}
          placeholder="Enter nth frame to extract (empty will extract every 3rd frame by default)"
          required
        />
      </label>
    </FormControl>
  );
};

export default NFrame;
