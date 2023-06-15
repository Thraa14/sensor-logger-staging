import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextModal } from './TextModal';
import Box from '@material-ui/core/Box';

const debug = require('debug')('client:components:common:modal-message');

const modalStates = Object.freeze({
  ok: {
    open: true,
    title: 'Confirm',
    text: 'Request succeeded.',
    willGoBack: true,
  },
  error: (errors) => ({
    open: true,
    title: 'Error',
    text: errors.join('\n'),
    willGoBack: false,
  }),

  initial: {
    open: false,
    title: '',
    text: '',
    willGoBack: false,
  },
});

function modalStateByName(state, errors = null) {
  if (state === 'error') {
    return modalStates.error(errors);
  } else if (state === 'ok') {
    return modalStates.ok;
  }
  return modalStates.initial;
}

/**
 *
 * @param state
 * @param errors
 * @param onCloseModal At least sets the modal state back to `initial`
 * after the form is closed.
 * @return {JSX.Element}
 * @constructor
 */
export default function ModalMessage({ state, errors, onCloseModal }) {
  const modalState = modalStateByName(state, errors);
  return (
    <TextModal
      title={modalState.title}
      text={modalState.text}
      open={modalState.open}
      onConfirm={onCloseModal}/>
  );
}

ModalMessage.propTypes = {
  state: PropTypes.oneOf(['ok', 'error', 'initial']).isRequired,
  onCloseModal: PropTypes.func.isRequired,
  errors: PropTypes.array,
};
