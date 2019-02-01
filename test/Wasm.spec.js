import React from 'react';
import TestRenderer from 'react-test-renderer';
import Wasm from '../src/Wasm';
import bytes from './bytes';
import bytesWithImport from './bytes-imports';

// mock fetch
const fetchMock = url => new Promise((resolve, reject) => {
	let arrayBuffer = new ArrayBuffer([]);

	if (url.match(/bytes\.wasm/)) {
		arrayBuffer = bytes.buffer;
	} else if (url.match(/bytes-imports\.wasm/)) {
		arrayBuffer = bytesWithImport.buffer;
	} else {
		reject(new Error('404'));
		return;
	}

	resolve({
		arrayBuffer: () => arrayBuffer
	});
});

const delay = (time = 3000) =>
	new Promise(resolve =>
		setTimeout(() => {
			resolve();
		}),
		time
	);

const importObject = {
	imports: {
		add_js: (a, b) => a + b,
	}
};

describe('Wasm', () => {
	beforeEach(() => {
		global.fetch = fetchMock;
	});

	it('should set loading', () => {
		global.fetch = (...params) => delay().then(() => fetchMock(...params));

		let result;
		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		expect(result).toMatchObject({
			loading: true,
			error: null,
			data: null
		});
		expect(testRenderer.toJSON()).toMatchSnapshot();
	});

	it('should set error if no url and bufferSource are provided', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm>
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				data: null
			});
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toEqual(
				'Can\'t instantiate WebAssembly module, invalid parameters.'
			);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should set error if invalid url is provided', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm url="/error_404.wasm">
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				data: null
			});
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toEqual('404');
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should set error if url is provided with wrong type', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm url={5}>
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				data: null
			});
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toEqual(
				'Can\'t instantiate WebAssembly module, invalid parameters.'
			);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should set error if invalid ArrayBuffer is provided', done => {
		const invalidBytes = new Uint8Array(bytes);
		invalidBytes[0] = bytes[0] + 1;
		expect(invalidBytes[0]).not.toEqual(bytes[0]);

		let result;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={invalidBytes}>
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				data: null
			});
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message.match(
				/Wasm decoding failed: expected magic word 00 61 73 6d, found 01 61 73 6d @\+0/
			)).toBeTruthy();
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should set error if bufferSource is provided with wrong type', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={42}>
				{props => {
					result = props;
					return JSON.stringify(props);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				data: null
			});
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toEqual(
				'WebAssembly.compile(): Argument 0 must be a buffer source'
			);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should load module from ArrayBuffer', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={bytes}>
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should load module from url', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should load module from ArrayBuffer with importObject', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={bytesWithImport} importObject={importObject}>
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add_js(1, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should load module from url with importObject', done => {
		let result;

		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes-imports.wasm" importObject={importObject}>
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add_js(1, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();
			done();
		}, 1000);
	});

	it('should instantiate a module from a url using instantiateStreaming', done => {
		const originalInstantiateStreaming = WebAssembly.instantiateStreaming;
		WebAssembly.instantiateStreaming = (fetchCall, importObj) => fetchCall
			.then(response => response.arrayBuffer())
			.then(buff => WebAssembly.compile(buff))
			.then(module =>
				WebAssembly.instantiate(module, importObj).then(instance => ({
					module,
					instance
				}))
			);

		const spy = jest.spyOn(WebAssembly, 'instantiateStreaming');

		let result;

		TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					result = props;
					return null;
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(spy).toHaveBeenCalled();

			WebAssembly.instantiateStreaming = originalInstantiateStreaming;
			spy.mockRestore();

			done();
		}, 1000);
	});

	it('should instantiate a module from a url using instantiate as fallback', done => {
		const spy = jest.spyOn(WebAssembly, 'instantiate');
		const originalInstantiateStreaming = WebAssembly.instantiateStreaming;
		WebAssembly.instantiateStreaming = undefined;

		let result;

		TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					result = props;
					return null;
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(spy).toHaveBeenCalled();

			WebAssembly.instantiateStreaming = originalInstantiateStreaming;
			spy.mockRestore();

			done();
		}, 1000);
	});

	it('should reinstantiate module on url change', done => {
		let result;
		let spy;
		let originalInstantiateStreaming;

		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();

			spy = jest.spyOn(WebAssembly, 'instantiate');
			originalInstantiateStreaming = WebAssembly.instantiateStreaming;
			WebAssembly.instantiateStreaming = undefined;

			testRenderer.update(
				<Wasm url="/bytes-imports.wasm" importObject={importObject}>
					{props => {
						const {
							loading,
							error,
							data
						} = props;
						result = props;

						return !loading && !error && (
							<div>
								loading: {String(loading)}
								error: {String(error)}

								1 + 2 = {data.instance.exports.add_js(1, 2)}
							</div>
						);
					}}
				</Wasm>
			);

			expect(result).toMatchObject({
				loading: true,
				error: null,
				data: null
			});
			expect(testRenderer.toJSON()).toMatchSnapshot();

			setTimeout(() => {
				expect(result).toMatchObject({
					loading: false,
					error: null
				});
				expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
				expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
				expect(result.data.instance.exports.add_js).toBeTruthy();
				expect(result.data.instance.exports.div).toBeFalsy();
				expect(testRenderer.toJSON()).toMatchSnapshot();

				expect(spy).toHaveBeenCalled();
				WebAssembly.instantiateStreaming = originalInstantiateStreaming;
				spy.mockRestore();

				done();
			}, 2000);
		}, 2000);
	});

	it('should reinstantiate module on bufferSource change', done => {
		let result;
		let spy;
		let originalInstantiateStreaming;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={bytes}>
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();

			spy = jest.spyOn(WebAssembly, 'instantiate');
			originalInstantiateStreaming = WebAssembly.instantiateStreaming;
			WebAssembly.instantiateStreaming = undefined;

			testRenderer.update(
				<Wasm bufferSource={bytesWithImport} importObject={importObject}>
					{props => {
						const {
							loading,
							error,
							data
						} = props;
						result = props;

						return !loading && !error && (
							<div>
								loading: {String(loading)}
								error: {String(error)}

								1 + 2 = {data.instance.exports.add_js(1, 2)}
							</div>
						);
					}}
				</Wasm>
			);

			expect(result).toMatchObject({
				loading: true,
				error: null,
				data: null
			});
			expect(testRenderer.toJSON()).toMatchSnapshot();

			setTimeout(() => {
				expect(result).toMatchObject({
					loading: false,
					error: null
				});
				expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
				expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
				expect(result.data.instance.exports.add_js).toBeTruthy();
				expect(result.data.instance.exports.div).toBeFalsy();
				expect(testRenderer.toJSON()).toMatchSnapshot();

				expect(spy).toHaveBeenCalled();
				WebAssembly.instantiateStreaming = originalInstantiateStreaming;
				spy.mockRestore();

				done();
			}, 2000);
		}, 2000);
	});

	it('should not reinstantiate module if url doesn\'t change', done => {
		let result;
		let spy;
		let originalInstantiateStreaming;

		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();

			spy = jest.spyOn(WebAssembly, 'instantiate');
			originalInstantiateStreaming = WebAssembly.instantiateStreaming;
			WebAssembly.instantiateStreaming = undefined;

			testRenderer.update(
				<Wasm url="/bytes.wasm">
					{props => {
						const {
							loading,
							error,
							data
						} = props;
						result = props;

						return !loading && !error && (
							<div>
								loading: {String(loading)}
								error: {String(error)}

								1 + 2 = {data.instance.exports.add(1, 2)}
								20 / 2 = {data.instance.exports.div(20, 2)}
							</div>
						);
					}}
				</Wasm>
			);

			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(testRenderer.toJSON()).toMatchSnapshot();

			setTimeout(() => {
				expect(result).toMatchObject({
					loading: false,
					error: null
				});
				expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
				expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
				expect(result.data.instance.exports.add).toBeTruthy();
				expect(result.data.instance.exports.div).toBeTruthy();
				expect(testRenderer.toJSON()).toMatchSnapshot();

				expect(spy).not.toHaveBeenCalled();
				WebAssembly.instantiateStreaming = originalInstantiateStreaming;
				spy.mockRestore();

				done();
			}, 2000);
		}, 2000);
	});

	it('should not reinstantiate module if bufferSource doesn\'t change', done => {
		let result;
		let spy;
		let originalInstantiateStreaming;

		const testRenderer = TestRenderer.create(
			<Wasm bufferSource={bytes}>
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();

			spy = jest.spyOn(WebAssembly, 'instantiate');
			originalInstantiateStreaming = WebAssembly.instantiateStreaming;
			WebAssembly.instantiateStreaming = undefined;

			testRenderer.update(
				<Wasm bufferSource={bytes}>
					{props => {
						const {
							loading,
							error,
							data
						} = props;
						result = props;

						return !loading && !error && (
							<div>
								loading: {String(loading)}
								error: {String(error)}

								1 + 2 = {data.instance.exports.add(1, 2)}
								20 / 2 = {data.instance.exports.div(20, 2)}
							</div>
						);
					}}
				</Wasm>
			);

			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(testRenderer.toJSON()).toMatchSnapshot();

			setTimeout(() => {
				expect(result).toMatchObject({
					loading: false,
					error: null
				});
				expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
				expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
				expect(result.data.instance.exports.add).toBeTruthy();
				expect(result.data.instance.exports.div).toBeTruthy();
				expect(testRenderer.toJSON()).toMatchSnapshot();

				expect(spy).not.toHaveBeenCalled();
				WebAssembly.instantiateStreaming = originalInstantiateStreaming;
				spy.mockRestore();

				done();
			}, 2000);
		}, 2000);
	});

	it('should not reinstantiate module if bufferSource changes but url is defined', done => {
		let result;
		let spy;
		let originalInstantiateStreaming;

		const testRenderer = TestRenderer.create(
			<Wasm url="/bytes.wasm">
				{props => {
					const {
						loading,
						error,
						data
					} = props;
					result = props;

					return !loading && !error && (
						<div>
							loading: {String(loading)}
							error: {String(error)}

							1 + 2 = {data.instance.exports.add(1, 2)}
							20 / 2 = {data.instance.exports.div(20, 2)}
						</div>
					);
				}}
			</Wasm>
		);

		setTimeout(() => {
			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
			expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
			expect(testRenderer.toJSON()).toMatchSnapshot();

			spy = jest.spyOn(WebAssembly, 'instantiate');
			originalInstantiateStreaming = WebAssembly.instantiateStreaming;
			WebAssembly.instantiateStreaming = undefined;

			testRenderer.update(
				<Wasm url="/bytes.wasm" bufferSource={bytesWithImport}>
					{props => {
						const {
							loading,
							error,
							data
						} = props;
						result = props;

						return !loading && !error && (
							<div>
								loading: {String(loading)}
								error: {String(error)}

								1 + 2 = {data.instance.exports.add(1, 2)}
								20 / 2 = {data.instance.exports.div(20, 2)}
							</div>
						);
					}}
				</Wasm>
			);

			expect(result).toMatchObject({
				loading: false,
				error: null
			});
			expect(testRenderer.toJSON()).toMatchSnapshot();

			setTimeout(() => {
				expect(result).toMatchObject({
					loading: false,
					error: null
				});
				expect(result.data.module).toBeInstanceOf(WebAssembly.Module);
				expect(result.data.instance).toBeInstanceOf(WebAssembly.Instance);
				expect(result.data.instance.exports.add).toBeTruthy();
				expect(result.data.instance.exports.div).toBeTruthy();
				expect(testRenderer.toJSON()).toMatchSnapshot();

				expect(spy).not.toHaveBeenCalled();
				WebAssembly.instantiateStreaming = originalInstantiateStreaming;
				spy.mockRestore();

				done();
			}, 2000);
		}, 2000);
	});
});
