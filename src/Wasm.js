// @flow

import React from 'react';
import compileWasm from './compileWasm';
import type { WasmProps, WasmState, WasmParams } from './types';

export default class Wasm extends React.Component<WasmProps, WasmState> {
	static defaultProps = {
		url: null,
		bufferSource: null,
		importObject: {}
	};

	state = {
		loading: true,
		error: null,
		data: null,
		// eslint-disable-next-line
		prevProps: {
			url: null,
			bufferSource: null
		}
	};

	static getDerivedStateFromProps(props: WasmProps, state: WasmState) {
		const { url, bufferSource } = props;

		if (
			url && url !== state.prevProps.url ||
			!url && bufferSource !== state.prevProps.bufferSource
		) {
			return {
				loading: true,
				error: null,
				data: null,
				prevProps: {
					url,
					bufferSource
				}
			};
		}

		return null;
	}

	componentDidMount() {
		const { url, bufferSource, importObject } = this.props;

		this.loadModule({ url, bufferSource, importObject });
	}

	componentDidUpdate(prevProps: WasmProps) {
		const { url, bufferSource, importObject } = this.props;

		if (
			url && url !== prevProps.url ||
			!url && bufferSource !== prevProps.bufferSource
		) {
			this.loadModule({ url, bufferSource, importObject });
		}
	}

	loadModule = ({
		url,
		bufferSource,
		importObject
	}: WasmParams) =>
		compileWasm({
			url,
			bufferSource,
			importObject
		})
			.then(({ module, instance }) => {
				this.setState({
					loading: false,
					error: null,
					data: {
						module,
						instance
					}
				});
			})
			.catch(error => {
				this.setState({
					loading: false,
					error,
					data: null
				});
			});

	render() {
		const { children } = this.props;
		const { loading, error, data } = this.state;

		return children({ loading, error, data });
	}
}