import React from 'react';
import TestRenderer from 'react-test-renderer';
import Wasm from '../src';
import { withWasm } from '../src/withWasm';

describe('withWasm ', () => {
  let Component;

  const buildComponent = ComonentDefinition =>
    TestRenderer.create(withWasm(ComonentDefinition));

  beforeEach(() => {
    Component = props => <div>Hello {props.firstname}</div>;
  });

  it('should create a new component', () => {
    const wrapper = buildComponent(Component);
    expect(wrapper.findByType(Wasm)).toBeTruthy();
  });
});
