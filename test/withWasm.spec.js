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

describe('withWasm', () => {
  let wrapper;

  describe('withWasm and url prop', () => {
    beforeEach(() => {
      const Enhanced = withWasm()(Component);

      wrapper = TestRenderer.create(
        <Enhanced
          firstname="James"
          url="/add.wasm"
          bufferSource="some-buffer-data"
          importObject={{ key: 'value' }}
        />
      ).root;
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

  describe('withWasm and a config object', () => {
    beforeEach(() => {
      const mapToChild = ({ loading, error, data }) => ({
        hello: data.hello,
        hasLoaded: !loading,
        hasError: error
      });

      const Enhanced = withWasm(
        {
          url: '/other.wasm',
          bufferSource: 'some-other-buffer-data',
          importObject: { someKey: 'someValue' }
        },
        mapToChild
      )(Component);

      wrapper = TestRenderer.create(<Enhanced firstname="Thomas" />).root;
    });

    it('should create a new component wrapped by the Wasm one', () => {
      expect(wrapper.findByType(Wasm).props).toEqual(
        expect.objectContaining({
          bufferSource: 'some-other-buffer-data',
          importObject: {
            someKey: 'someValue'
          },
          url: '/other.wasm'
        })
      );
    });

    it('should create a new component with its own props and the one injected by the Wasm one', () => {
      expect(wrapper.findByType(Component).props).toEqual({
        firstname: 'Thomas',
        hello: 'world',
        hasLoaded: false,
        hasError: false
      });
    });
  });
});
