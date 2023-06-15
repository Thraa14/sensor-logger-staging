import { Api } from './scripts/api.js';
import { makePoller, makeColumnConfig, sanitizeObject } from './utils.mjs';

const api = new Api(localStorage.getItem('token'));
const discardedColumns = ['readingid', 'fieldid', 'pipeid', 'islivefeed'];
const TICK_POLL_DURATION_MS = 6000;
const LIVE_POLL_DURATION_MS = 1000;

function updateTickTableColumns(data) {
  const columns = makeColumnConfig(data);
  $intervalTable.bootstrapTable('refreshOptions', { columns });
}

async function updateTickTable() {
  const currentIndex = $intervalTable.bootstrapTable('getData').length;
  const response = await api.getTickData({ currentIndex });
  /** @type {Array} */
  const data = response.data;

  if (Array.isArray(data)) {
    console.debug(`[updateTickTable] fetched ${data.length} items.`);
  }

  if (!Array.isArray(data) || data.length === 0) {
    return;
  }

  $intervalTable.bootstrapTable('hideLoading');
  if (currentIndex === 0) {
    const columnObject = Object.assign({}, data[0]);
    sanitizeObject(columnObject, discardedColumns);
    updateTickTableColumns(columnObject);
  }

  data.reverse();
  const processedData = data.map((item) => {
    sanitizeObject(item, discardedColumns);
    return item;
  });

  $intervalTable.bootstrapTable('prepend', processedData);
}


async function updateLiveTable() {
  const { data } = await api.getLiveData();
  if (!data) {
    return;
  }

  if (Object.keys(data).length === 0) {
    $liveTable.bootstrapTable('showLoading');
    return;
  }
  sanitizeObject(data, discardedColumns);
  const columns = makeColumnConfig(data);
  $liveTable.bootstrapTable('refreshOptions', { columns, data: [data] });
  $liveTable.bootstrapTable('updateRow', {
    index: 0,
    row: data,
  });
}

async function clearLogs() {
  const { status, statusText } = await api.clearLogs();
  if (status != 200) {
    console.error(`Failed to CLEAR LOGS ${status}:${statusText}`);
  }
  $intervalTable.bootstrapTable('removeAll');
  $intervalTable.bootstrapTable('showLoading');
}

if (!api.hasAuthToken()) {
  window.location.replace('/');
}

/** @type {HTMLButtonElement} */
const button = document.getElementById('clearButton');
button.addEventListener('click', (e) => clearLogs());

const $intervalTable = $('#dataTable');
$intervalTable.bootstrapTable();
$intervalTable.bootstrapTable('showLoading');

const $liveTable = $('#liveTable');
$liveTable.bootstrapTable();
$liveTable.bootstrapTable('showLoading');

const pollTickUpdates = makePoller(TICK_POLL_DURATION_MS, updateTickTable);
const pollLiveUpdates = makePoller(LIVE_POLL_DURATION_MS, updateLiveTable);

pollTickUpdates();
pollLiveUpdates();
