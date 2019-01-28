import React from 'react';
import Wasm from '.';

const withWasm = (config = {}, mapToChild) => ComponentDefinition => ({
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
    {wasmData => {
      const wasmProps = mapToChild ? mapToChild(wasmData) : wasmData;

      return <ComponentDefinition {...otherProps} {...wasmProps} />;
    }}
  </Wasm>
);

export default withWasm;
