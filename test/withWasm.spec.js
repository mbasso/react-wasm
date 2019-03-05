/* eslint-disable react/prop-types */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import useWasm from '../src/useWasm';
import withWasm from '../src/withWasm';

jest.mock('../src/useWasm', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    loading: true,
    error: false,
    data: { hello: 'world' }
  }))
}));

const Component = ({ firstName }) => <div>Hello {firstName}</div>;

describe('withWasm', () => {
  let wrapper;

  describe('withWasm and url prop', () => {
    beforeEach(() => {
      const Enhanced = withWasm()(Component);

      wrapper = TestRenderer.create(
        <Enhanced
          firstName="James"
          url="/add.wasm"
          bufferSource="some-buffer-data"
          importObject={{ key: 'value' }}
        />
      ).root;
    });

    afterEach(() => {
      useWasm.mockClear();
    });

    it('should create a new component that uses useWasm', () => {
      expect(useWasm).toHaveBeenCalledWith(
        expect.objectContaining({
          bufferSource: 'some-buffer-data',
          importObject: {
            key: 'value'
          },
          url: '/add.wasm'
        })
      );
    });

    it('should create a new component with its own props and the one injected by useWasm', () => {
      expect(wrapper.findByType(Component).props).toEqual({
        firstName: 'James',
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

      wrapper = TestRenderer.create(<Enhanced firstName="Thomas" />).root;
    });

    afterEach(() => {
      useWasm.mockClear();
    });

    it('should create a new component that uses useWasm', () => {
      expect(useWasm).toHaveBeenCalledWith(
        expect.objectContaining({
          bufferSource: 'some-other-buffer-data',
          importObject: {
            someKey: 'someValue'
          },
          url: '/other.wasm'
        })
      );
    });

    it('should create a new component with its own props and the one injected by useWasm', () => {
      expect(wrapper.findByType(Component).props).toEqual({
        firstName: 'Thomas',
        hello: 'world',
        hasLoaded: false,
        hasError: false
      });
    });
  });
});
