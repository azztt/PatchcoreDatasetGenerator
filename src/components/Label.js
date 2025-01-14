// src/components/PromptToggle.js
import React from 'react';
import { FormControl, InputLabel, TextField } from '@mui/material';

const Label = ({ label, onLabelChange, required }) => {
  return (
    <FormControl style={{width: '25%'}} required>
      <TextField
        id="label-input"
        label="Label"
        value={label}
        onChange={onLabelChange}
        variant="outlined"
        required={required}
        disabled={!required}
      />
    </FormControl>
  );
};

export default Label;
