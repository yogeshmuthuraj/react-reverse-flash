
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable new-cap */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Datastore from 'nedb-promises';
import { Typography } from '@material-ui/core';
import CustomAlert from './CustomAlert';

export default function Alerts(props) {
  const { appDetails } = props;
  const dbAlerts = Datastore.create('./db/alerts.db');
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = () => {
    dbAlerts
      .find({ appId: appDetails._id })
      .sort({ createdAt: -1 })
      .then((results) => {
        setAlerts(results);
      })
      .catch();
  };

  // To clear all db for testing
  // dbAlerts.remove({}, { multi: true }, function (err, numDeleted) {
  //   console.log('Deleted', numDeleted, 'user(s)');
  // });

  useEffect(() => {
    // Run! Like go get some data from an API.
    loadAlerts();
  }, []);

  const displayAlerts = () => {
    if (alerts.length > 0) {
      return alerts.map((alert) => {
        return (
          <Grid key={alert._id} item xl={3}>
            <CustomAlert
              appDetails={appDetails}
              alertDetails={alert}
              setAlerts={setAlerts}
            />
          </Grid>
        );
      });
    }
    return (
      <>
        <Typography variant="h4" color="textSecondary" component="div">
          No alerts yet, add from Charts Tab by clicking on Bell icon on Chart.
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
          {displayAlerts()}
        </Grid>
      </Container>
    </Container>
  );
}
