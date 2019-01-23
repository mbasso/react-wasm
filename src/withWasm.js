import React from 'react';
import Wasm from '.';

const withWasm = (config = {}) => ComponentDefinition => ({
  url,
  bufferSource,
  importObject,
  ...otherProps
}) => (
  <Wasm
    url={url}
    {...config}
    bufferSource={bufferSource}
    importObject={importObject}
  >
    {wasmData => <ComponentDefinition {...otherProps} {...wasmData} />}
  </Wasm>
);

export default withWasm;
