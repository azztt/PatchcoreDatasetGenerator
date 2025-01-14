// src/components/PromptToggle.js
import React from 'react';
import { FormControl, FormControlLabel, Switch } from '@mui/material';

const IsDefect = ({ isDefect, onIsDefectChange }) => {
  return (
    <FormControl style={{width: '25%'}}>
      {/* <InputLabel id="defect-type-label">Defect Type</InputLabel> */}
      <FormControlLabel
        control={
          <Switch
            checked={isDefect}
            onChange={onIsDefectChange}
            name="isDefect"
            color="primary"
          />
        }
        label="Is Defect"
      />
    </FormControl>
  );
};

export default IsDefect;
