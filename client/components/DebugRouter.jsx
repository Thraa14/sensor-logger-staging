import { BrowserRouter } from 'react-router-dom';

const debug = require('debug')('client:components:router');
export default class DebugRouter extends BrowserRouter {
  constructor(props) {
    super(props);
    debug('initial history is: ', JSON.stringify(this.history, null, 2));
    this.history.listen((location, action) => {
      debug(
        `The current URL is ${location.pathname}${location.search}${location.hash}`,
      );
      debug(`The last navigation action was ${action}`, JSON.stringify(this.history, null, 2));
    });
  }
}
