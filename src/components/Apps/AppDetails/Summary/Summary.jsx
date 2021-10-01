
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert } from '@material-ui/lab';
import moment from 'moment';

export default function Summary(props) {
  const { appDetails } = props;
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');

  const fetchSummary = () => {
    setLoading(true);
    setError(false);

    const { newRelicAccountId, newRelicAppId, newRelicAppKey } = appDetails;

    const query =
      "SELECT count(*) FROM Transaction WHERE appName='AnalyticsQueryTool_AnalyticsQueryTool_US' AND (name LIKE 'Controller/%') FACET httpResponseCode ";

    const chartType = 'PIE';

    axios({
      method: 'POST',
      baseURL:
        'https://api.newrelic.com/v2/applications/' +
        `${newRelicAppId}` +
        '.json',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'API-Key': newRelicAppKey,
      },
    })
      .then((response) => {
        setLastRefreshed(moment().format('MMM Do YYYY, h:mm:ss a'));
        setSummary(response.data.application);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Run! Like go get some data from an API.
    fetchSummary();
  }, []);

  const displaySummary = () => {
    const applicationSummary = summary.application_summary;

    if (loading) {
      return null;
    }

    return (
      <>
        <Typography variant="body1">
          <strong>Name: </strong>
          {summary.name}
        </Typography>
        <Typography variant="body1">
          <strong>
            Health Status: &nbsp;
            <span style={{ color: summary.health_status }}>
              {summary.health_status}
            </span>
          </strong>
        </Typography>
        <Typography variant="body1">
          <strong>Id: </strong>
          {summary.id}
        </Typography>
        <Typography variant="body1">
          <strong>Language: </strong>
          {summary.language}
        </Typography>
        <br />
        <Typography variant="body1">
          <strong>Apdex Score: </strong>
          {applicationSummary.apdex_score}
        </Typography>
        <Typography variant="body1">
          <strong>Apdex Score Target: </strong>
          {applicationSummary.apdex_target}
        </Typography>
        <Typography variant="body1">
          <strong>Error Rate: </strong>
          {applicationSummary.error_rate}
        </Typography>
        <Typography variant="body1">
          <strong>Host Count: </strong>
          {applicationSummary.host_count}
        </Typography>
        <Typography variant="body1">
          <strong>Instance Count: </strong>
          {applicationSummary.instance_count}
        </Typography>
        <Typography variant="body1">
          <strong>Response Time: </strong>
          {applicationSummary.response_time}
        </Typography>
        <Typography variant="body1">
          <strong>Throughput: </strong>
          {applicationSummary.throughput}
        </Typography>
      </>
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchSummary}
        className="pull-right"
      >
        Refresh
      </Button>
      {loading ? (
        <div className="center">
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <>
          <Typography
            className="pull-right"
            style={{ marginRight: '10px', marginTop: '5px' }}
          >
            Last Refresh: {lastRefreshed}
          </Typography>
          <Typography variant="h6" display="block">
            Application summary
          </Typography>
          <br />
          {displaySummary()}
        </>
      )}
      {error && <Alert severity="error">Error while loading</Alert>}
    </>
  );
}
