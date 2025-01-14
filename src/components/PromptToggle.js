// src/components/PromptToggle.js
import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const PromptToggle = ({ promptType, onPromptChange }) => {
  return (
    <ToggleButtonGroup
      value={promptType}
      exclusive
      onChange={onPromptChange}
      aria-label="prompt type"
      style={{ marginTop: '16px' }}
    >
      <ToggleButton value={1} aria-label="positive prompt">
        Positive Prompt
      </ToggleButton>
      <ToggleButton value={0} aria-label="negative prompt">
        Negative Prompt
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default PromptToggle;
