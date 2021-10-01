
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { FormControlLabel } from '@material-ui/core';
import Datastore from 'nedb-promises';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';
import MuiAlert from '@material-ui/lab/Alert';
import RemoveAlertModal from './Modals/RemoveAlertmodal';

const useStyles = makeStyles({
  root: {
    minWidth: 300,
    width: 300,
    // height: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  pos: {
    marginBottom: 12,
  },
});
let intervalFunction;

export default function CustomAlert(props) {
  const { appDetails, alertDetails, setAlerts } = props;
  const [notificationEnabled, setNotificationEnabled] = useState(
    alertDetails.notificationEnabled
  );
  const [displayNotification, setDisplayNotification] = useState(false);

  const dbAlerts = Datastore.create('./db/alerts.db');
  let chartResults;

  const classes = useStyles();

  const triggerNotification = () => {
    const timeStamp = new Date();

    const utterThis = new SpeechSynthesisUtterance(alertDetails.alertMessage);
    const voices = window.speechSynthesis.getVoices();
    utterThis.voice = voices[40];
    window.speechSynthesis.speak(utterThis);

    console.log('Notification: ', timeStamp);
    setDisplayNotification(true);
  };

  const CheckAlertCondition = () => {
    let alertConditionMet = false;

    const dbCharts = Datastore.create('./db/charts.db');
    dbCharts
      .findOne({ _id: alertDetails.chartId })
      .sort({ createdAt: -1 })
      .then((results) => {
        const { chartQuery } = results;

        if (chartQuery != null) {
          axios({
            method: 'POST',
            baseURL: 'https://api.newrelic.com/graphql',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'API-Key': appDetails.newRelicAppKey,
            },
            data: {
              query: `${
                `{
              actor {
                account(id: ` +
                `${appDetails.newRelicAccountId}` +
                `) {
                  name
                  nrql(
                    query: "`
              }${chartQuery}")
                  {
                    results
                  }
                }
              }
            }`,
            },
          })
            .then((response) => {
              console.log('response :', response);
              chartResults = response.data.data.actor.account.nrql.results;
              const {
                condition1Left,
                condition1Operator,
                condition1Right,
                conjunction,
                condition2Left,
                condition2Operator,
                condition2Right,
              } = alertDetails;

              // Sample results
              // "results": [
              //   {
              //     "facet": "200",
              //     "count": 884,
              //     "httpResponseCode": "200"
              //   },
              //   {
              //     "facet": "204",
              //     "count": 5,
              //     "httpResponseCode": "204"
              //   },
              //   {
              //     "facet": "404",
              //     "count": 2,
              //     "httpResponseCode": "404"
              //   },
              //   {
              //     "facet": "304",
              //     "count": 1,
              //     "httpResponseCode": "304"
              //   }
              // ],

              chartResults.map((chartResult) => {
                switch (condition1Operator) {
                  case '=':
                    if (condition2Operator == '>') {
                      if (conjunction == 'AND') {
                        if (
                          condition1Right == chartResult[condition1Left] &&
                          chartResult[condition2Left] > condition2Right
                        ) {
                          alertConditionMet = true;
                          console.log(' :in true oif: ', alertConditionMet);
                          console.log('in last leg');
                          triggerNotification();
                        }
                      }
                    }
                    break;
                  case '!=':
                    break;
                  case '>=':
                    break;
                  case '<=':
                    break;
                  case '>':
                    break;
                  case '<':
                    break;

                  default:
                    break;
                }
              });
            })
            .catch(() => {})
            .then(() => {});
        }
      })
      .catch();
  };

  const checkForAlert = () => {
    // frequency to seconds
    const seconds = moment.duration(alertDetails.alertFrequency).asSeconds();
    console.log(seconds);
    console.log('In NE');
    intervalFunction = setInterval(() => {
      CheckAlertCondition();
    }, seconds * 1000);
  };

  const disableNotifications = () => {
    clearInterval(intervalFunction);
  };

  const notificationEnabledPersisted = () => {
    dbAlerts
      .update(
        { _id: alertDetails._id },
        { $set: { notificationEnabled: true } }
      )
      .then()
      .catch();
  };

  const notificationDisabledPersisted = () => {
    dbAlerts
      .update(
        { _id: alertDetails._id },
        { $set: { notificationEnabled: false } }
      )
      .then()
      .catch();
  };

  const handleNotificationToggle = () => {
    const checkAlert = !notificationEnabled;

    if (checkAlert) {
      notificationEnabledPersisted();
      checkForAlert();
    } else {
      notificationDisabledPersisted();
      disableNotifications();
    }
    setNotificationEnabled(!notificationEnabled);
  };

  const closeNotification = () => {
    setDisplayNotification(false);
  };

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  return (
    <Card className={classes.root} variant="outlined">
      <span className="pull-right pointer padding-all-10">
        <RemoveAlertModal alertDetails={alertDetails} setAlerts={setAlerts} />
      </span>
      <CardContent>
        <Typography color="textSecondary" variant="body1">
          <strong>Name:</strong> {alertDetails.alertDisplayName}
        </Typography>
        <Typography color="textSecondary" variant="body1">
          <strong>Message:</strong> {alertDetails.alertMessage}
        </Typography>
        <Typography color="textSecondary" variant="body1" component="span">
          <strong>Frequency check:</strong>
          <div>Every {alertDetails.alertFrequency} (hh:mm:ss)</div>
        </Typography>
        <Typography color="textSecondary" variant="body1" component="span">
          <strong>Query:</strong>{' '}
          <div>
            When {alertDetails.condition1Left} {alertDetails.condition1Operator}{' '}
            {alertDetails.condition1Right} {alertDetails.conjunction}{' '}
            {alertDetails.condition2Left} {alertDetails.condition2Operator}{' '}
            {alertDetails.condition2Right}
          </div>
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={notificationEnabled}
              onChange={() => handleNotificationToggle()}
              name="notificationEnabled"
            />
          }
          label="Enable Notification"
        />
      </CardContent>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={8000}
        open={displayNotification}
        onClose={closeNotification}
      >
        <Alert severity="error">{alertDetails.alertMessage}</Alert>
      </Snackbar>
    </Card>
  );
}
