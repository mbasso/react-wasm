import Wasm, { useWasm, withWasm } from '../src/index';
/* eslint-disable */
import { default as useWasmHook } from '../src/useWasm';
import { default as WasmComponent } from '../src/Wasm';
import { default as withWasmHoC } from '../src/withWasm';
/* eslint-enable */

describe('react-wasm', () => {
  it('should export useWasm', () => {
    expect(useWasm).toBeTruthy();
    expect(useWasm).toEqual(useWasmHook);
  });

  it('should export Wasm', () => {
    expect(Wasm).toBeTruthy();
    expect(Wasm).toEqual(WasmComponent);
  });

  it('should export withWasm', () => {
    expect(withWasm).toBeTruthy();
    expect(withWasm).toEqual(withWasmHoC);
  });
});
