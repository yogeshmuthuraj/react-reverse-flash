
import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {
  DialogActions,
  IconButton,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Datastore from 'nedb-promises';

export default function AddChartModal(props) {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [chartDisplayName, setChartDisplayName] = React.useState('');
  const [chartType, setChartType] = React.useState('');
  const [chartQuery, setChartQuery] = React.useState('');

  const dbCharts = Datastore.create('./db/charts.db');

  const { setCharts, appDetails } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setChartDisplayName('');
    setChartType('');
    setChartQuery('');
  };

  const handleChartDisplayNameChange = (value: string) => {
    setError(false);
    setChartDisplayName(value);
  };

  const handleChartTypeChange = (value: string) => {
    setError(false);
    setChartType(value);
  };

  const handleChartQueryChange = (value: string) => {
    setError(false);
    setChartQuery(value);
  };

  const addSuccess = () => {
    handleClose();
    dbCharts
      .find({ appId: appDetails._id })
      .sort({ createdAt: -1 })
      .then((results) => {
        setCharts(results);
      })
      .catch();
  };

  function handleAddChart() {
    if (chartDisplayName === '' || chartType === '' || chartQuery === '') {
      setError(true);
    } else {
      // call AJAX to save chart details
      const date = new Date();
      const chart = {
        appId: appDetails._id,
        chartDisplayName,
        chartType,
        chartQuery,
        createdAt: date.getTime(),
      };

      dbCharts
        .insert({ ...chart })
        .then(addSuccess())
        .catch();
    }
  }

  const chartTypes: any[] = [
    'LINE',
    'AREA',
    'STACKED BAR',
    'BAR',
    'BULLET',
    'BILLBOARD',
    'TABLE',
    'PIE',
    'HISTOGRAM',
    'HEATMAP',
    'FUNNEL',
  ];

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="Add Chart"
        style={{ float: 'right', color: 'green' }}
        onClick={handleClickOpen}
      >
        <AddCircleIcon fontSize="large" />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={open}
        maxWidth="xs"
        fullWidth
      >
        <div className="padding-all-10">
          <DialogTitle id="dialog-title">Add Chart</DialogTitle>
          {error && (
            <Alert severity="error">All fields Mandatory to fill</Alert>
          )}
          <div>
            <TextField
              autoFocus
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Chart Name"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={chartDisplayName}
              onChange={(event) =>
                handleChartDisplayNameChange(event.target.value)
              }
              required
            />
          </div>
          <div>
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Chart Type"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={chartType}
              onChange={(event) => handleChartTypeChange(event.target.value)}
              required
            >
              {chartTypes.map((chartType) => (
                <MenuItem key={chartType} value={chartType}>
                  {chartType}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div>
            <TextField
              multiline
              minRows={3}
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Chart Query"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={chartQuery}
              onChange={(event) => handleChartQueryChange(event.target.value)}
              required
            />
          </div>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddChart()}
            >
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
