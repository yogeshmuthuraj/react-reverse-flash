
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Datastore from 'nedb-promises';
import { Typography } from '@material-ui/core';
import AppCard from './AppCard';
import AddAppModal from '../AppDetails/Modals/AddAppModal';

export default function Apps() {
  const dbApps = Datastore.create('./db/apps.db');
  const [apps, setApps] = useState([]);

  const loadApps = () => {
    dbApps
      .find({})
      .sort({ createdAt: -1 })
      .then((results) => {
        setApps(results);
      })
      .catch();
  };

  // To clear all db for testing
  // dbApps.remove({}, { multi: true }, function (err, numDeleted) {
  //   console.log('Deleted', numDeleted, 'user(s)');
  // });

  useEffect(() => {
    // Run! Like go get some data from an API.
    loadApps();
  }, []);

  const displayApps = () => {
    if (apps.length > 0) {
      return apps.map((app) => {
        return (
          <Grid key={app._id} item sm={3}>
            <AppCard appDetails={app} setApps={setApps} />
          </Grid>
        );
      });
    }
    return (
      <Typography variant="h4" color="textSecondary">
        No apps yet, click Plus icon to add apps.
      </Typography>
    );
  };

  return (
    <Container maxWidth={false}>
      <AddAppModal setApps={setApps} />
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          {displayApps()}
        </Grid>
      </Container>
    </Container>
  );
}
