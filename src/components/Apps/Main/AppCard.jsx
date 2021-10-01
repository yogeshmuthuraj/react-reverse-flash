/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import EditAppModal from '../AppDetails/Modals/EditAppModal';
import RemoveAppModal from '../AppDetails/Modals/RemoveAppModal';
import OpenAppModal from '../AppDetails/Modals/OpenAppModel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      // height: 345,
    },
    media: {
      height: 0,
      paddingTop: '16.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export default function AppCard(props: { appDetails: any }) {
  const classes = useStyles();
  const { appDetails, setApps } = props;

  const createdAt = new Date(appDetails.createdAt).toDateString();

  return (
    <div>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {appDetails.appDisplayName.substring(0, 2)}
            </Avatar>
          }
          title={
            <Typography
              style={{ width: '250px' }}
              noWrap
              variant="h6"
              color="textSecondary"
              component="p"
            >
              {appDetails.appDisplayName}
            </Typography>
          }
          subheader={createdAt}
        />
        <CardContent style={{ overflowY: 'scroll', height: '100px' }}>
          <Typography
            noWrap
            variant="body2"
            color="textSecondary"
            component="p"
          >
            <strong>Description: </strong>
            {appDetails.appDescription}
          </Typography>
        </CardContent>
        <CardActions className="pull-right">
          <IconButton aria-label="Open App">
            <OpenAppModal appDetails={appDetails} />
          </IconButton>
          <IconButton aria-label="Edit App">
            <EditAppModal appDetails={appDetails} setApps={setApps} />
          </IconButton>
          <IconButton aria-label="Delete App">
            <RemoveAppModal appDetails={appDetails} setApps={setApps} />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}
