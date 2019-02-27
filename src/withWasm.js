import React from 'react';
import useWasm from './useWasm';

const withWasm = (config = {}, mapToChild = x => x) => ComponentDefinition => ({
  url,
  bufferSource,
  importObject,
  ...otherProps
}) => {
  const state = useWasm({
    url,
    bufferSource,
    importObject,
    ...config
  });

  return (
    <ComponentDefinition
      {...otherProps}
      {...mapToChild(state)}
    />
  );
};

export default withWasm;
