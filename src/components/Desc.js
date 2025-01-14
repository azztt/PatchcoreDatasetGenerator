// src/components/PromptToggle.js
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Desc = ({ desc, onDescChange, defectTypes=[] }) => {
  return (
    <FormControl style={{width: '25%'}}>
      <InputLabel id="label-select-label">Description</InputLabel>
      <Select
        labelId="label-select-label"
        id="label-select"
        value={desc}
        onChange={onDescChange}
        defaultValue={''}
        // fullWidth
      >
        {
          defectTypes.map((defectType) => (
            <MenuItem key={defectType} value={defectType}>{defectType}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default Desc;
