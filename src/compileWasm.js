// @flow

import type { WasmParams, ResultObject } from './types';

const compileWasm = ({
  url,
  bufferSource,
  importObject
}: WasmParams): Promise<ResultObject> =>
  Promise.resolve().then(() => {
    let res;

    if (typeof url === 'string') {
      res = fetch(url);
      if (WebAssembly.instantiateStreaming !== undefined) {
        return WebAssembly.instantiateStreaming(res, importObject);
      }
      res = res.then(response => response.arrayBuffer());
    } else if (bufferSource) {
      res = Promise.resolve(bufferSource);
    } else {
      throw new Error(
        'Can\'t instantiate WebAssembly module, invalid parameters.'
      );
    }

    return res
      .then(buff => WebAssembly.compile(buff))
      .then(module =>
        WebAssembly.instantiate(module, importObject).then(instance => ({
          module,
          instance
        }))
      );
  });

export default compileWasm;
