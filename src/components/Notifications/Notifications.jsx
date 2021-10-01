
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Datastore from 'nedb-promises';
import { Typography } from '@material-ui/core';
import Notification from './Notification';

export default function Notifications(props) {
  const { appDetails } = props;
  const dbNotifications = Datastore.create('./db/notifications.db');
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    dbNotifications
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setNotifications(results);
      })
      .catch();
  };

  // To clear all db for testing
  // dbNotifications.remove({}, { multi: true }, function (err, numDeleted) {
  //   console.log('Deleted', numDeleted, 'user(s)');
  // });

  useEffect(() => {
    // Run! Like go get some data from an API.
    loadNotifications();
  }, []);

  const displayNotifications = () => {
    if (notifications.length > 0) {
      return notifications.map((notification) => {
        return (
          <Grid key={notification._id} item xl={3}>
            <Notification
              appDetails={appDetails}
              notificationDetails={notification}
              setNotifications={setNotifications}
            />
          </Grid>
        );
      });
    }
    return (
      <>
        <Typography variant="h4" color="textSecondary" component="div">
          No notifications
        </Typography>
      </>
    );
  };

  return (
    <Container maxWidth={false}>
      <br />
      <br />
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          {displayNotifications()}
        </Grid>
      </Container>
    </Container>
  );
}
