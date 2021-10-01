
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

export default function RemoveChartModal(props) {
  const { chartDetails, setCharts } = props;

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dbCharts = Datastore.create('./db/charts.db');

  const addSuccess = () => {
    handleClose();
    dbCharts
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setCharts(results);
      })
      .catch();
  };

  const removeChart = () => {
    dbCharts.remove({ _id: chartDetails._id }).then(addSuccess()).catch();
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
          Remove Chart {chartDetails.chartDisplayName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the chart{' '}
            <strong>{chartDetails.chartDisplayName}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => removeChart()}
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
