
import axios from 'axios';
import React, { useState } from 'react';
import Datastore from 'nedb-promises';

export default function CheckAlertCondition(props) {
  const { appDetails, alertDetails } = props;
  const [chartDetails, setChartDetails] = useState({ chartQuery: null });
  const [chartResults, setChartResults] = useState({ chartQuery: null });
  let alertConditionMet = false;

  const dbCharts = Datastore.create('./db/charts.db');

  dbCharts
    .find({ _id: alertDetails.chartId })
    .sort({ createdAt: -1 })
    .then((results) => {
      setChartDetails(results);
    })
    .catch();

  const { chartQuery } = chartDetails;

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
        setChartResults(response.data.data.actor.account.nrql.results);
      })
      .catch(() => {})
      .then(() => {});

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
      console.log('condition1Operator :', condition1Operator);
      console.log('condition2Operator :', condition2Operator);
      console.log('conjunction :', conjunction);
      console.log('chartResult[condition1Left] :', chartResult[condition1Left]);
      console.log(
        'chartResult[condition1Right] :',
        chartResult[condition1Right]
      );
      console.log('chartResult[condition2Left] :', chartResult[condition2Left]);
      console.log(
        'chartResult[condition2Right] :',
        chartResult[condition2Right]
      );
      switch (condition1Operator) {
        case '=':
          if (condition2Operator == '>') {
            if (conjunction == 'AND') {
              if (
                chartResult[condition1Left] == chartResult[condition1Right] &&
                chartResult[condition2Left] > chartResult[condition2Right]
              ) {
                alertConditionMet = true;
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
  }

  return alertConditionMet;
}
