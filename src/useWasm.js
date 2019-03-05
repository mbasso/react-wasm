// @flow

import { useState, useEffect } from 'react';
import compileWasm from './compileWasm';
import type { WasmParams } from './types';

const useWasm = ({
  url,
  bufferSource,
  importObject
}: WasmParams) => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null
  });

  const [prevProps, setPrevProps] = useState({
    url: null,
    bufferSource: null
  });

  let newState = state;

  if (
    (url && url !== prevProps.url) ||
    (!url && bufferSource !== prevProps.bufferSource)
  ) {
    newState = {
      loading: true,
      error: null,
      data: null
    };

    setState(newState);
    setPrevProps({
      url,
      bufferSource
    });
  }

  useEffect(() => {
    compileWasm({
      url,
      bufferSource,
      importObject
    })
      .then(({ module, instance }) => {
        setState({
          loading: false,
          error: null,
          data: {
            module,
            instance
          }
        });
      })
      .catch(ex => {
        setState({
          loading: false,
          error: ex,
          data: null
        });
      });
  }, [
    url,
    !url && bufferSource,
    importObject,
    setState
  ]);

  return newState;
}

export default useWasm;
