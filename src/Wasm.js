// @flow

import useWasm from './useWasm';
import type { WasmProps } from './types';

const Wasm = ({ url, bufferSource, importObject, children }: WasmProps) => {
  const state = useWasm({
    url,
    bufferSource,
    importObject
  });

  return children(state);
};

Wasm.defaultProps = {
  url: null,
  bufferSource: null,
  importObject: {}
};

export default Wasm;
