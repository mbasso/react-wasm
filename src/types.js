// @flow

import type { Node } from 'react';

export type ResultObject = {
  module: WebAssembly.Module,
  instance: WebAssembly.Instance
};

type RenderProps = {
  loading: boolean,
  error: ?any,
  data: ?ResultObject
};

export type WasmParams = {
  url?: ?string,
  bufferSource?: ?BufferSource,
  importObject?: ?{}
};

export type WasmProps = {
  ...$Exact<WasmParams>,
  children: (RenderProps: RenderProps) => Node
};

export type WasmState = {
  ...$Exact<RenderProps>,
  prevProps: {
    url?: ?string,
    bufferSource?: ?BufferSource,
  }
};
