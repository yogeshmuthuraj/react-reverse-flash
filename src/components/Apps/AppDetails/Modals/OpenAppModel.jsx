
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CloseIcon from '@material-ui/icons/Close';
import App from '../../Main/App';

export default function OpenAppModal(props) {
  const { appDetails } = props;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <PlayArrowIcon style={{ color: 'green' }} onClick={handleClickOpen} />
      <Dialog
        onClose={handleClose}
        aria-labelledby="dialog-title"
        open={open}
        maxWidth="xl"
        fullWidth
      >
        <div className="padding-all-10" style={{ minHeight: '850px' }}>
          <DialogTitle id="dialog-title">
            {appDetails.appDisplayName}
            <CloseIcon
              onClick={handleClose}
              aria-label="close"
              className="pull-right pointer"
            />
          </DialogTitle>
          <App appDetails={appDetails} />
        </div>
      </Dialog>
    </>
  );
}
