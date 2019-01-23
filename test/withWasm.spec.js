/* eslint-disable react/prop-types */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Wasm from '../src';
import withWasm from '../src/withWasm';

jest.mock('../src', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <div>
      {children({
        loading: true,
        error: false,
        data: { hello: 'world' }
      })}
    </div>
  ))
}));

function Component({ firstname }) {
  return <div>Hello {firstname}</div>;
}

describe('withWasm and url prop', () => {
  let wrapper;

  beforeEach(() => {
    const Enhanced = withWasm()(Component);

    const instance = TestRenderer.create(
      <Enhanced
        firstname="James"
        url="/add.wasm"
        bufferSource="some-buffer-data"
        importObject={{ key: 'value' }}
      />
    );

    wrapper = instance.root;
  });

  it('should create a new component wrapped by the Wasm one', () => {
    expect(wrapper.findByType(Wasm).props).toEqual(
      expect.objectContaining({
        bufferSource: 'some-buffer-data',
        importObject: {
          key: 'value'
        },
        url: '/add.wasm'
      })
    );
  });

  it('should create a new component with its own props and the one injected by the Wasm one', () => {
    expect(wrapper.findByType(Component).props).toEqual({
      firstname: 'James',
      loading: true,
      error: false,
      data: { hello: 'world' }
    });
  });
});
