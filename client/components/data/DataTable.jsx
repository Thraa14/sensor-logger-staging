import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'typeface-roboto';
import { makeColumnConfig } from './readingParser';
import ReactVirtualizedTable from '../common/ReactVirtualizedTable';
import Grid from '@material-ui/core/Grid';
import LastReading from './LastReading';
import readingFetcher from './services/readingFetcher';
import Chart from 'react-google-charts';
import { parseDateString } from '../utils';
import { READING_COUNT, READING_TIME_KEY } from './utils';

const debug = require('debug')('client:components:data:table');


const lastUpdateLabel = (lastReadingTime) => {
  if (lastReadingTime === null) return null;
  return (
    <LastReading lastReadingTime={lastReadingTime}/>
  );
};


const defaultChartMetadata = {
  hAxis: { title: 'Time' },
  vAxis: { title: 'Readings' },
  curveType: 'function',
  legend: { position: 'top', textStyle: 'bold' },
};
export default function FieldData({ fieldName }) {
  const [rows, setRows] = useState([]);
  const [lineRows, setLineRows] = useState([['Time', 'GasRate', 'WaterRate', 'OrificeId', 'SpecificGravity' ,'SepPressure', 
  'ReadingTime','GasTemprature','DiffPressure'], ['', 0, 0, 0, 0, 0 , 0 , 0 , 0 ]]);
  const [columns, setColumns] = useState([]);
  const [lastReadingTime, setLastReadingTime] = useState(null);

  function resetData() {
    setRows([]);
    setLineRows([['Time', 'GasRate', 'WaterRate', 'OrificeId', 'SpecificGravity' ,'SepPressure', 
    'ReadingTime','GasTemprature','DiffPressure'], ['', 0, 0, 0, 0, 0 , 0 , 0 , 0]]);
    setColumns([]);
    setLastReadingTime(null);
  }

  function updateReadings(readings) {
    if (!readings || !readings.length) {
      return;
    }

    const reversedReadings = [].concat(readings).reverse();
    const mostRecent = reversedReadings[0];
    if (!columns.length) {
      const column = makeColumnConfig(mostRecent);
      setColumns(column);
    }

    setRows((r) => {
      const updated = [...reversedReadings, ...r];
      setLastReadingTime(updated[0][READING_TIME_KEY]);
      return updated;
    });

    const newLineRows = readings.map((r, i) => {
      const parsed = parseDateString(r[READING_TIME_KEY])
        .toFormat('hh:mm MM/dd/yy');
      return [
        parsed,
        parseFloat(r['GasRate', 'WaterRate', 'OrificeId','SpecificGravity' ,'SepPressure', 
        'ReadingTime','GasTemprature','DiffPressure']),
      ];
    });
    
    setLineRows((old) => {
      const header = old.shift();
      const rowInfo = [...old, ...newLineRows];
      // Sliding window over 200 elements
      const sliceIndex = Math.max(rowInfo.length - READING_COUNT, 0);
      const updated = rowInfo.slice(sliceIndex);
      updated.unshift(header);
      return updated;
    });
  }

  useEffect(() => {
    if (!fieldName) return;
    resetData();

    async function fetch() {
      const response = await readingFetcher.fetchTableData(fieldName);
      if (!response.isSuccess) {
        debug('Failed to fetch table data');
        debug(response.errors);
        return;
      }
      debug('response.readings');
      // debug(response.readings);
      updateReadings(response.readings);
    }

    fetch();
  }, [fieldName]);


  useEffect(() => {
    if (!fieldName) return;

    const intervalId = setInterval(async function() {
      const response = await readingFetcher.fetchTickUpdate(
        fieldName, lastReadingTime,
      );
      if (!response.isSuccess) {
        debug('Failed to fetch tick updates');
        debug(response.errors);
        return;
      }

      const readings = response.readings;
      updateReadings(readings);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [fieldName, lastReadingTime]);

  return (
    <div style={{ padding: '1rem' }}>
      <Grid container direction={'column'} spacing={2}>
        <Grid item>
          <ReactVirtualizedTable columns={columns} rows={rows}/>
        </Grid>
        <Grid item>
          <Chart
            legendToggle
            width={'100%'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={lineRows}
            options={defaultChartMetadata}
          />
        </Grid>
        <Grid item>
          {lastUpdateLabel(lastReadingTime)}
        </Grid>
      </Grid>
    </div>
  );
}
FieldData.propTypes = {
  fieldName: PropTypes.string.isRequired,
};
