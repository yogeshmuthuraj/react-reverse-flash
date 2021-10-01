
import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import {
  DialogActions,
  IconButton,
  MenuItem,
  TextField,
  FormLabel,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Datastore from 'nedb-promises';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function AddAlertModal(props) {
  const { setAlerts, appDetails, chartDetails, moreChartDetails } = props;

  const classes = useStyles();

  // const sampleAlertQuery = {
  //     condition1: {
  //       left: 'facet',
  //       operator: '=',
  //       right: '500',
  //     },
  //     conditionType: {
  //       type: 'AND',
  //     },
  //     condition2: {
  //       left: 'count',
  //       operator: '>',
  //       right: '0',
  //     },
  //   }
  // };

  const defaultCondition1Left = 'facet';
  const defaultCondition1Operator = '=';
  const defaultCondition1Right = '500';

  const defaultConjunction = 'AND';

  const defaultCondition2Left = 'count';
  const defaultCondition2Operator = '>';
  const defaultCondition2Right = '0';

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [alertDisplayName, setAlertDisplayName] = React.useState('');
  const [alertType, setAlertType] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');

  const [condition1Left, setCondition1Left] = React.useState(
    defaultCondition1Left
  );
  const [condition1Operator, setCondition1Operator] = React.useState(
    defaultCondition1Operator
  );
  const [condition1Right, setCondition1Right] = React.useState(
    defaultCondition1Right
  );
  const [conjunction, setConjunction] = React.useState(defaultConjunction);
  const [condition2Left, setCondition2Left] = React.useState(
    defaultCondition2Left
  );
  const [condition2Operator, setCondition2Operator] = React.useState(
    defaultCondition2Operator
  );
  const [condition2Right, setCondition2Right] = React.useState(
    defaultCondition2Right
  );

  const [alertFrequency, setAlertFrequency] = React.useState('00:00:05');

  const dbAlerts = Datastore.create('./db/alerts.db');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setAlertDisplayName('');
    setAlertType('');
    setAlertMessage('');
  };

  const handleAlertDisplayNameChange = (value: string) => {
    setError(false);
    setAlertDisplayName(value);
  };

  const handleAlertTypeChange = (value: string) => {
    setError(false);
    setAlertType(value);
  };

  const handleAlertMessageChange = (value: string) => {
    setError(false);
    setAlertMessage(value);
  };

  const handleAlertFrequencyChange = (value: string) => {
    setError(false);
    setAlertFrequency(value);
  };

  const handleCondition1Left = (value: string) => {
    setError(false);
    setCondition1Left(value);
  };

  const handleCondition1Operator = (value: string) => {
    setError(false);
    setCondition1Operator(value);
  };

  const handleCondition1Right = (value: string) => {
    setError(false);
    setCondition1Right(value);
  };

  const handleConjunction = (value: string) => {
    setError(false);
    setConjunction(value);
  };

  const handleCondition2Left = (value: string) => {
    setError(false);
    setCondition2Left(value);
  };

  const handleCondition2Operator = (value: string) => {
    setError(false);
    setCondition2Operator(value);
  };

  const handleCondition2Right = (value: string) => {
    setError(false);
    setCondition2Right(value);
  };

  const operators = ['=', '!=', '>', '<', '>=', '<='];

  const chartResultKeys = () => {
    const { results } = moreChartDetails.data.data.actor.account.nrql;
    const arrayOfKeys = [
      ...new Set(results.map((item: {}) => Object.keys(item))),
    ];
    const keys = [...new Set(arrayOfKeys.flat(1))];

    return keys;
  };

  const addSuccess = () => {
    handleClose();
    // Alerts can be displayed next in tab

    // dbAlerts
    //   .find({ appId: appDetails._id })
    //   .sort({ createdAt: -1 })
    //   .then((results) => {
    //     setAlerts(results);
    //   })
    //   .catch();
  };

  function handleAddAlert() {
    if (alertDisplayName === '' || alertType === '' || alertMessage === '') {
      setError(true);
    } else {
      // call AJAX to save alert details
      const date = new Date();
      const alert = {
        appId: appDetails._id,
        chartId: chartDetails._id,
        alertDisplayName,
        alertType,
        alertMessage,
        condition1Left,
        condition1Operator,
        condition1Right,
        conjunction,
        condition2Left,
        condition2Operator,
        condition2Right,
        alertFrequency,
        notificationEnabled: false,
        createdAt: date.getTime(),
      };

      dbAlerts
        .insert({ ...alert })
        .then(addSuccess())
        .catch();
    }
  }

  return (
    <div>
      <IconButton color="primary" onClick={handleClickOpen} size="small">
        <AddAlertIcon />
      </IconButton>
      <Dialog
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <div className="padding-all-10">
          <DialogTitle id="dialog-title">
            Add Alert for Chart: {chartDetails.chartDisplayName}
          </DialogTitle>
          {error && (
            <Alert severity="error">All fields Mandatory to fill</Alert>
          )}
          <div>
            <TextField
              autoFocus
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Alert Name"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={alertDisplayName}
              onChange={(event) =>
                handleAlertDisplayNameChange(event.target.value)
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
              label="Alert Type"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={alertType}
              onChange={(event) => handleAlertTypeChange(event.target.value)}
              required
            >
              <MenuItem key="information" value="information">
                Information
              </MenuItem>
              <MenuItem key="error" value="error">
                Error
              </MenuItem>
            </TextField>
          </div>
          <form className={classes.container} noValidate>
            <FormLabel component="legend">Alert Query</FormLabel>
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Left 1"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition1Left}
              onChange={(event) => handleCondition1Left(event.target.value)}
              required
            >
              {chartResultKeys().map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Operator 1"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition1Operator}
              onChange={(event) => handleCondition1Operator(event.target.value)}
              required
            >
              {operators.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Operator Right 1"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition1Right}
              onChange={(event) => handleCondition1Right(event.target.value)}
              required
            />
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Conjuction"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={conjunction}
              onChange={(event) => handleConjunction(event.target.value)}
              required
            >
              <MenuItem key="AND" value="AND">
                AND
              </MenuItem>
              <MenuItem key="OR" value="OR">
                OR
              </MenuItem>
            </TextField>
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Left 2"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition2Left}
              onChange={(event) => handleCondition2Left(event.target.value)}
              required
            >
              {chartResultKeys().map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Operator 2"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition2Operator}
              onChange={(event) => handleCondition2Operator(event.target.value)}
              required
            >
              {operators.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Operator Right 2"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={condition2Right}
              onChange={(event) => handleCondition2Right(event.target.value)}
              required
            />
          </form>
          <div>
            <TextField
              multiline
              minRows={3}
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Alert Message"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={alertMessage}
              onChange={(event) => handleAlertMessageChange(event.target.value)}
              required
            />
          </div>
          <div>
            <TextField
              style={{ width: '300px' }}
              id="time"
              label="Alert Check Frequency (hh:mm:ss)"
              type="time"
              value={alertFrequency}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1, // 1 sec
              }}
              onChange={(event) =>
                handleAlertFrequencyChange(event.target.value)
              }
            />
          </div>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddAlert()}
            >
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
