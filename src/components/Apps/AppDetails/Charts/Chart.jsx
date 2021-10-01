
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ButtonGroup, IconButton, Typography } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import moment from 'moment';
import RefreshIcon from '@material-ui/icons/Refresh';
import RemoveChartModal from './Modals/RemoveChartModal';
import AddAlertModal from '../Alerts/Modals/AddAlertModal';

export default function Chart(props) {
  const { appDetails, chartDetails, setCharts } = props;
  const [chart, setChart] = useState('');
  const [moreChartDetails, setMoreChartDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');

  const fetchChart = () => {
    setLoading(true);
    setError(false);

    const { chartType, chartQuery } = chartDetails;

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
                staticChartUrl(chartType: ${chartType})
                embeddedChartUrl
                results
              }
            }
          }
        }`,
      },
    })
      .then((response) => {
        setLastRefreshed(moment().format('MMM Do YYYY, h:mm:ss a'));
        setChart(response.data.data.actor.account.nrql.staticChartUrl);
        setMoreChartDetails(response);
      })
      .catch(() => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Run! Like go get some data from an API.
    fetchChart();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Typography variant="overline" display="block" component="div">
            Loading...
          </Typography>
          <Skeleton variant="rect" width={500} height={370} />
        </>
      ) : (
        <>
          <Typography variant="overline" component="div">
            {chartDetails.chartDisplayName}
            <span className="pull-right pointer">
              <RemoveChartModal
                chartDetails={chartDetails}
                setCharts={setCharts}
              />
            </span>
          </Typography>
          {error && (
            <>
              <Alert severity="error">Error while loading</Alert>
              <Skeleton variant="rect" width={500} height={310} />
            </>
          )}
          <img src={chart} style={{ width: '500px' }} />
          <br />
          <Typography
            variant="overline"
            style={{ marginRight: '10px', marginTop: '5px' }}
          >
            Last Refresh: {lastRefreshed}
          </Typography>
          <ButtonGroup
            color="primary"
            aria-label="outlined primary button group"
            className="pull-right"
          >
            <AddAlertModal
              appDetails={appDetails}
              chartDetails={chartDetails}
              moreChartDetails={moreChartDetails}
              loading={loading}
            />
            <IconButton color="primary" onClick={fetchChart} size="small">
              <RefreshIcon />
            </IconButton>
          </ButtonGroup>
        </>
      )}
    </>
  );
}
