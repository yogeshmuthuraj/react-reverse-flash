
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Datastore from 'nedb-promises';
import { IconButton, Typography } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
// import jsPDF from 'jspdf';
// import $ from 'jquery';
// import html2canvas from 'html2canvas';
import Chart from './Chart';
import AddChartModal from './Modals/AddChartModal';

export default function Charts(props) {
  const { appDetails } = props;
  const dbCharts = Datastore.create('./db/charts.db');
  const [charts, setCharts] = useState([]);

  const loadCharts = () => {
    dbCharts
      .find({ appId: appDetails._id })
      .sort({ createdAt: -1 })
      .then((results) => {
        setCharts(results);
      })
      .catch();
  };

  // To clear all db for testing
  // dbCharts.remove({}, { multi: true }, function (err, numDeleted) {
  //   console.log('Deleted', numDeleted, 'user(s)');
  // });

  useEffect(() => {
    // Run! Like go get some data from an API.
    loadCharts();
  }, []);

  const displayCharts = () => {
    if (charts.length > 0) {
      return charts.map((chart) => {
        return (
          <Grid key={chart._id} item xl={3}>
            <Chart
              appDetails={appDetails}
              chartDetails={chart}
              setCharts={setCharts}
            />
          </Grid>
        );
      });
    }
    return (
      <Typography variant="h4" color="textSecondary">
        No charts yet, click Plus icon to add charts.
      </Typography>
    );
  };

  const uniqueChartsName = `charts-${appDetails._id}`;
  const pdfChartContainer = `pdf-charts-${appDetails._id}`;

  const exportPDF = () => {
    alert('Work in progress');
  };

  return (
    <Container maxWidth={false}>
      <IconButton
        color="primary"
        aria-label="Export PDF"
        style={{ float: 'right', color: 'black' }}
        onClick={exportPDF}
      >
        <PictureAsPdfIcon className="pointer pull-right" fontSize="large" />
      </IconButton>
      <AddChartModal setCharts={setCharts} appDetails={appDetails} />
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          {displayCharts()}
        </Grid>
      </Container>
    </Container>
  );
}
