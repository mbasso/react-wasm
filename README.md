# react-wasm

[![Build Status](https://travis-ci.org/mbasso/react-wasm.svg?branch=master)](https://travis-ci.org/mbasso/react-wasm)
[![npm version](https://img.shields.io/npm/v/react-wasm.svg)](https://www.npmjs.com/package/react-wasm)
[![npm downloads](https://img.shields.io/npm/dm/react-wasm.svg?maxAge=2592000)](https://www.npmjs.com/package/react-wasm)
[![Coverage Status](https://coveralls.io/repos/github/mbasso/react-wasm/badge.svg?branch=master)](https://coveralls.io/github/mbasso/react-wasm?branch=master)
[![MIT](https://img.shields.io/npm/l/react-wasm.svg)](https://github.com/mbasso/react-wasm/blob/master/LICENSE.md)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/BassoMatteo)

> Declarative WebAssembly instantiation for React

## Installation

You can install react-wasm using [npm](https://www.npmjs.com/package/react-wasm):

```bash
npm install --save react-wasm
```

If you aren't using npm in your project, you can include reactWasm using UMD build in the dist folder with `<script>` tag.

## Usage

### Render props

Once you have installed react-wasm, supposing a CommonJS environment, you can import and use it in this way:

```js
import Wasm from "react-wasm";

// supposing an "add.wasm" module that exports a single function "add"
const ExampleComponent = () => (
  <Wasm url="/add.wasm">
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return "An error has occurred";

      const { module, instance } = data;
      return <div>1 + 2 = {instance.exports.add(1, 2)}</div>;
    }}
  </Wasm>
);
```

### Higher Order Component

It's also possible to use the library using the HoC approach by importing the named `withWasm` function:

```js
import { withWasm } from "react-wasm";

// supposing an "add.wasm" module that exports a single function "add"
const ExampleComponent = ({ loading, error, data }) => {
  if (loading) return "Loading...";
  if (error) return "An error has occurred";

  const { module, instance } = data;
  return <div>1 + 2 = {instance.exports.add(1, 2)}</div>;
};

export default withWasm(ExampleComponent);
```

## API

```js
type WasmProps = {
  // you can instantiate modules using a URL
  // or directly a BufferSource (TypedArray or ArrayBuffer)
  url?: string,
  bufferSource?: BufferSource,
  // An optional object containing the values to be imported into the newly-created Instance
  // such as functions or WebAssembly.Memory objects.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate#Syntax
  importObject?: {},
  children: (renderProps: {
    loading: boolean,
    error: ?Error,
    data: ?{
      module: WebAssembly.Module,
      instance: WebAssembly.Instance
    }
  }) => React.Node
};
```

## Browser support

`react-wasm` uses [fetch](https://developer.mozilla.org/it/docs/Web/API/Fetch_API) and obviously [WebAssembly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) APIs, they are broadly supported by major browser engines but you would like to polyfill them to support old versions.

```js
if (!window.fetch || !window.WebAssembly) {
    ...
} else {
    ...
}
```

## Change Log

This project adheres to [Semantic Versioning](http://semver.org/).  
Every release, along with the migration instructions, is documented on the Github [Releases](https://github.com/mbasso/react-wasm/releases) page.

## Authors

**Matteo Basso**

- [github/mbasso](https://github.com/mbasso)
- [@teo_basso](https://twitter.com/teo_basso)

## Copyright and License

Copyright (c) 2019, Matteo Basso.

react-wasm source code is licensed under the [MIT License](https://github.com/mbasso/react-wasm/blob/master/LICENSE.md).
