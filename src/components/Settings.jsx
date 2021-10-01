import {
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@material-ui/core';
import React from 'react';

export default function Settings() {
  return (
    <div>
      <Typography variant="h6">Notification settings:</Typography>
      <br />
      <FormGroup>
        <FormControlLabel
          className="pull-left"
          control={<Switch name="checkedA" />}
          label="Desktop notifications"
          labelPlacement="end"
        />
        <FormControlLabel
          control={<Switch checked name="checkedA" />}
          label="Speech notifications"
          labelPlacement="end"
        />
        <FormControlLabel
          control={<Switch checked name="checkedA" />}
          label="Speech source"
          labelPlacement="end"
        />
      </FormGroup>
    </div>
  );
}
