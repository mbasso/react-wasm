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
    bufferSource={bufferSource}
    importObject={importObject}
    {...config}
  >
    {wasmData => <ComponentDefinition {...otherProps} {...wasmData} />}
  </Wasm>
);

export default withWasm;
