
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

export default function RemoveAppModal(props) {
  const { appDetails, setApps } = props;

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dbApps = Datastore.create('./db/apps.db');

  const addSuccess = () => {
    handleClose();
    dbApps
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setApps(results);
      })
      .catch();
  };

  const removeApp = () => {
    dbApps.remove({ _id: appDetails._id }).then(addSuccess()).catch();
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
          Remove App {appDetails.appDisplayName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the app{' '}
            <strong>{appDetails.appDisplayName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => removeApp()}
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
