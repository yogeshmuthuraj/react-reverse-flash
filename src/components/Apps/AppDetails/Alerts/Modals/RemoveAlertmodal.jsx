
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Datastore from 'nedb-promises';

export default function RemoveAlertModal(props) {
  const { alertDetails, setAlerts } = props;

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dbAlerts = Datastore.create('./db/alerts.db');

  const addSuccess = () => {
    handleClose();
    dbAlerts
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setAlerts(results);
      })
      .catch();
  };

  const removeAlert = () => {
    dbAlerts.remove({ _id: alertDetails._id }).then(addSuccess()).catch();
  };

  return (
    <>
      <DeleteIcon color="error" onClick={handleClickOpen} />
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Remove Alert {alertDetails.alertDisplayName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the alert{' '}
            <strong>{alertDetails.alertDisplayName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => removeAlert()}
            color="secondary"
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
