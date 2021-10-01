
import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import EditIcon from '@material-ui/icons/Edit';
import { DialogActions, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Datastore from 'nedb-promises';

export default function EditAppModal(props) {
  const { appDetails, setApps } = props;

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [appDisplayName, setAppDisplayName] = React.useState(
    appDetails.appDisplayName
  );
  const [newRelicAccountId, setNewRelicAccountId] = React.useState(
    appDetails.newRelicAccountId
  );
  const [newRelicAppId, setNewRelicAppId] = React.useState(
    appDetails.newRelicAppId
  );
  const [newRelicAppKey, setNewRelicAppKey] = React.useState(
    appDetails.newRelicAppKey
  );
  const [appDescription, setAppDescription] = React.useState(
    appDetails.appDescription
  );

  const dbApps = Datastore.create('./db/apps.db');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (status) => {
    setOpen(false);
    setError(false);
    if (status === 'success') {
      setAppDisplayName(appDisplayName);
      setNewRelicAppId(newRelicAccountId);
      setNewRelicAppId(newRelicAppId);
      setNewRelicAppKey(newRelicAppKey);
      setAppDescription(appDescription);
    } else {
      setAppDisplayName(appDetails.appDisplayName);
      setNewRelicAppId(appDetails.newRelicAccountId);
      setNewRelicAppId(appDetails.newRelicAppId);
      setNewRelicAppKey(appDetails.newRelicAppKey);
      setAppDescription(appDetails.appDescription);
    }
  };

  const handleappDisplayNameChange = (value: string) => {
    setError(false);
    setAppDisplayName(value);
  };

  const handleNewRelicAccountIdChange = (value: string) => {
    setError(false);
    setNewRelicAccountId(value);
  };

  const handleNewRelicAppIdChange = (value: string) => {
    setError(false);
    setNewRelicAppId(value);
  };

  const handleNewRelicAppKeyChange = (value: string) => {
    setError(false);
    setNewRelicAppKey(value);
  };

  const handleAppDescriptionChange = (value: string) => {
    setError(false);
    setAppDescription(value);
  };

  const addSuccess = () => {
    handleClose('success');
    dbApps
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setApps(results);
      })
      .catch();
  };

  function handleAddApp() {
    if (
      appDisplayName === '' ||
      newRelicAccountId === '' ||
      newRelicAppId === '' ||
      newRelicAppKey === '' ||
      appDescription === ''
    ) {
      setError(true);
    } else {
      // call AJAX to save app details
      const date = new Date();
      const app = {
        appDisplayName,
        newRelicAccountId,
        newRelicAppId,
        newRelicAppKey,
        appDescription,
        createdAt: date.getTime(),
      };

      dbApps
        .update({ _id: appDetails._id }, { ...app })
        .then(addSuccess())
        .catch();
    }
  }

  return (
    <>
      <EditIcon color="primary" onClick={handleClickOpen} />
      <Dialog
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={open}
        maxWidth="xs"
        fullWidth
      >
        <div className="padding-all-10">
          <DialogTitle id="dialog-title">Edit App</DialogTitle>
          {error && (
            <Alert severity="error">All fields Mandatory to fill</Alert>
          )}
          <div>
            <TextField
              autoFocus
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="App Name"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={appDisplayName}
              onChange={(event) =>
                handleappDisplayNameChange(event.target.value)
              }
              required
            />
          </div>
          <div>
            <TextField
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="Account ID"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={newRelicAccountId}
              onChange={(event) =>
                handleNewRelicAccountIdChange(event.target.value)
              }
              required
            />
          </div>
          <div>
            <TextField
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="App ID"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={newRelicAppId}
              onChange={(event) =>
                handleNewRelicAppIdChange(event.target.value)
              }
              required
            />
          </div>
          <div>
            <TextField
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="App Key"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={newRelicAppKey}
              onChange={(event) =>
                handleNewRelicAppKeyChange(event.target.value)
              }
              required
              type="password"
            />
          </div>
          <div>
            <TextField
              multiline
              minRows={3}
              className="padding-right-15"
              id="outlined-full-width"
              fullWidth
              label="App Description"
              style={{ margin: 8 }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={appDescription}
              onChange={(event) =>
                handleAppDescriptionChange(event.target.value)
              }
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
              onClick={() => handleAddApp()}
            >
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
