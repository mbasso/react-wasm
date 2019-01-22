// @flow

import React from 'react';
import withWasmDefinition from './withWasm';
import compileWasm from './compileWasm';
import type { WasmProps, WasmState } from './types';

export default class Wasm extends React.Component<WasmProps, WasmState> {
  static defaultProps = {
    url: null,
    bufferSource: null,
    importObject: {}
  };

  state = {
    loading: true,
    error: null,
    data: null
  };

  componentDidMount() {
    const { url, bufferSource, importObject } = this.props;

    compileWasm({
      url,
      bufferSource,
      importObject
    })
      .then(({ module, instance }) => {
        this.setState({
          loading: false,
          error: null,
          data: {
            module,
            instance
          }
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error,
          data: null
        });
      });
  }

  render() {
    const { children } = this.props;

    return children(this.state);
  }
}

export const withWasm = withWasmDefinition;
