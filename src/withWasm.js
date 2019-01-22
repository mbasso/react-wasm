import React from 'react';
import Wasm from '.';

const withWasm = ComponentDefinition => ({ url, ...otherProps }) => (
  <Wasm url={url}>
    {wasmData => <ComponentDefinition {...otherProps} {...wasmData} />}
  </Wasm>
);

export default withWasm;
