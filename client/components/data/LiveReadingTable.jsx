import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeColumnConfig } from './readingParser';
import Grid from '@material-ui/core/Grid';
import readingFetcher from './services/readingFetcher';
import { READING_TIME_KEY } from './utils';

const debug = require('debug')('client:components:data:table-live');

export default function LiveReadingTable({ fieldName }) {
  const [liveReadingColumns, setLiveReadingColumns] = useState([]);
  const [liveReading, setLiveReading] = useState(null);

  useEffect(() => {
    if (!fieldName) return;

    const intervalId = setInterval(async function() {
      const response = await readingFetcher.fetchLiveUpdate(fieldName);
      if (!response.isSuccess) {
        debug('Failed to fetch reading');
        debug(response.errors);
        return;
      }

      const reading = response.live;
      if (reading && liveReading === null) {
        // Update columns
        setLiveReadingColumns(makeColumnConfig(reading));
      }
      if (!reading) return;
      if (reading[READING_TIME_KEY] === liveReading?.[READING_TIME_KEY]) return;

      setLiveReading(reading);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [fieldName]);

  if (liveReading === undefined ||
    liveReading === null ||
    Object.keys(liveReading).length === 0) {
    return null;
  }

  return (
    <Grid
      id={'live-reading-parent'}
      item container spacing={1}
      direction={'column'}>
      <Grid item container spacing={2}>
        {
          liveReadingColumns.map((c) => (
            <Grid key={c.dataKey} item>
              {c.label} <br/>
              {liveReading[c.dataKey]}
            </Grid>
          ))
        }
      </Grid>
    </Grid>
  );
}

LiveReadingTable.propTypes = {
  fieldName: PropTypes.string.isRequired,
};
