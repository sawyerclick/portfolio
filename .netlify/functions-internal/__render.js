var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta2 = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta2[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta2.length; i++) {
    if (meta2[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta2[i]}`;
      if (meta2[i].indexOf("charset=") === 0) {
        charset = meta2[i].substring(8);
      }
    }
  }
  if (!meta2[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data2 = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data2, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (let part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        let end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0;
      while (position !== part.size) {
        const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function isFormData(object2) {
  return typeof object2 === "object" && typeof object2.append === "function" && typeof object2.set === "function" && typeof object2.get === "function" && typeof object2.getAll === "function" && typeof object2.delete === "function" && typeof object2.keys === "function" && typeof object2.values === "function" && typeof object2.entries === "function" && typeof object2.constructor === "function" && object2[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    length += isBlob(value) ? value.size : Buffer.byteLength(String(value));
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data2) {
  if (data2[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data2.url}`);
  }
  data2[INTERNALS$2].disturbed = true;
  if (data2[INTERNALS$2].error) {
    throw data2[INTERNALS$2].error;
  }
  let { body } = data2;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = import_stream.default.Readable.from(body.stream());
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data2.size > 0 && accumBytes + chunk.length > data2.size) {
        const error2 = new FetchError(`content size at ${data2.url} over limit: ${data2.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data2.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c2) => typeof c2 === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data2.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data2.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data2 = dataUriToBuffer$1(request.url);
      const response2 = new Response(data2, { headers: { "Content-Type": data2.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              headers.set("Location", locationURL);
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), reject) : (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), reject);
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, commonjsGlobal, src, dataUriToBuffer$1, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop2() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop2;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i !== elements.length || node._next !== void 0) {
              if (i === elements.length) {
                node = node._next;
                elements = node._elements;
                i = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i]);
              ++i;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e) => rejectPromise(e)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src2, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src2, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e) => {
            ReadableByteStreamControllerError(controller, e);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              readIntoRequest._errorSteps(e);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              throw e;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r) => {
            ReadableByteStreamControllerError(controller, r);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e) => rejectPromise(e)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e) => {
            ReadableStreamDefaultControllerError(controller, e);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r) => {
            ReadableStreamDefaultControllerError(controller, r);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r);
              ReadableByteStreamControllerError(branch2._readableStreamController, r);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options2, context) {
          assertDictionary(options2, context);
          const mode = options2 === null || options2 === void 0 ? void 0 : options2.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options2, context) {
          assertDictionary(options2, context);
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options2, context) {
          assertDictionary(options2, context);
          const preventAbort = options2 === null || options2 === void 0 ? void 0 : options2.preventAbort;
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          const preventClose = options2 === null || options2 === void 0 ? void 0 : options2.preventClose;
          const signal = options2 === null || options2 === void 0 ? void 0 : options2.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable2 = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable2, "readable", "ReadableWritablePair");
          assertReadableStream(readable2, `${context} has member 'readable' that`);
          const writable2 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable2, "writable", "ReadableWritablePair");
          assertWritableStream(writable2, `${context} has member 'writable' that`);
          return { readable: readable2, writable: writable2 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options2 = convertReaderOptions(rawOptions, "First parameter");
            if (options2.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options2 = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options2;
            try {
              options2 = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e) {
              return promiseRejectedWith(e);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options2 = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options2.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop2);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e) {
          stream._state = "errored";
          stream._storedError = e;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options2) {
            assertRequiredArgument(options2, 1, "ByteLengthQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options2.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options2) {
            assertRequiredArgument(options2, 1, "CountQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._countQueuingStrategyHighWaterMark = options2.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer2 = convertTransformer(rawTransformer, "First parameter");
            if (transformer2.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer2.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer2);
            if (transformer2.start !== void 0) {
              startPromise_resolve(transformer2.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
          TransformStreamErrorWritableAndUnblockWrite(stream, e);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer2) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer2.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer2.transform(chunk, controller);
          }
          if (transformer2.flush !== void 0) {
            flushAlgorithm = () => transformer2.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e) {
          TransformStreamError(controller._controlledTransformStream, e);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r) => {
            TransformStreamError(controller._controlledTransformStream, r);
            throw r;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable2 = stream._writable;
              const state = writable2._state;
              if (state === "erroring") {
                throw writable2._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable2 = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable2._state === "errored") {
              throw readable2._storedError;
            }
            ReadableStreamDefaultControllerClose(readable2._readableStreamController);
          }, (r) => {
            TransformStreamError(stream, r);
            throw readable2._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        Object.assign(globalThis, require("stream/web"));
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      constructor(blobParts = [], options2 = {}) {
        let size = 0;
        const parts = blobParts.map((element) => {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = new TextEncoder().encode(element);
          }
          size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          return part;
        });
        const type = options2.type === void 0 ? "" : String(options2.type);
        this.#type = /[^\u0020-\u007E]/.test(type) ? "" : type;
        this.#size = size;
        this.#parts = parts;
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (let part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data2 = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data2.set(chunk, offset);
          offset += chunk.length;
        }
        return data2.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object2) {
        return object2 && typeof object2 === "object" && typeof object2.constructor === "function" && (typeof object2.stream === "function" || typeof object2.arrayBuffer === "function") && /^(Blob|File)$/.test(object2[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object2) => {
      return typeof object2 === "object" && typeof object2.append === "function" && typeof object2.delete === "function" && typeof object2.get === "function" && typeof object2.getAll === "function" && typeof object2.has === "function" && typeof object2.set === "function" && typeof object2.sort === "function" && object2[NAME] === "URLSearchParams";
    };
    isBlob = (object2) => {
      return typeof object2 === "object" && typeof object2.arrayBuffer === "function" && typeof object2.type === "string" && typeof object2.stream === "function" && typeof object2.constructor === "function" && /^(Blob|File)$/.test(object2[NAME]);
    };
    isAbortSignal = (object2) => {
      return typeof object2 === "object" && (object2[NAME] === "AbortSignal" || object2[NAME] === "EventTarget");
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        import_stream.default.Readable.from(body.stream()).pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status != null ? options2.status : 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object2) => {
      return typeof object2 === "object" && typeof object2[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-netlify/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-netlify/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/slugify/slugify.js
var require_slugify = __commonJS({
  "node_modules/slugify/slugify.js"(exports, module2) {
    init_shims();
    (function(name, root, factory) {
      if (typeof exports === "object") {
        module2.exports = factory();
        module2.exports["default"] = factory();
      } else if (typeof define === "function" && define.amd) {
        define(factory);
      } else {
        root[name] = factory();
      }
    })("slugify", exports, function() {
      var charMap = JSON.parse(`{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","\xA2":"cent","\xA3":"pound","\xA4":"currency","\xA5":"yen","\xA9":"(c)","\xAA":"a","\xAE":"(r)","\xBA":"o","\xC0":"A","\xC1":"A","\xC2":"A","\xC3":"A","\xC4":"A","\xC5":"A","\xC6":"AE","\xC7":"C","\xC8":"E","\xC9":"E","\xCA":"E","\xCB":"E","\xCC":"I","\xCD":"I","\xCE":"I","\xCF":"I","\xD0":"D","\xD1":"N","\xD2":"O","\xD3":"O","\xD4":"O","\xD5":"O","\xD6":"O","\xD8":"O","\xD9":"U","\xDA":"U","\xDB":"U","\xDC":"U","\xDD":"Y","\xDE":"TH","\xDF":"ss","\xE0":"a","\xE1":"a","\xE2":"a","\xE3":"a","\xE4":"a","\xE5":"a","\xE6":"ae","\xE7":"c","\xE8":"e","\xE9":"e","\xEA":"e","\xEB":"e","\xEC":"i","\xED":"i","\xEE":"i","\xEF":"i","\xF0":"d","\xF1":"n","\xF2":"o","\xF3":"o","\xF4":"o","\xF5":"o","\xF6":"o","\xF8":"o","\xF9":"u","\xFA":"u","\xFB":"u","\xFC":"u","\xFD":"y","\xFE":"th","\xFF":"y","\u0100":"A","\u0101":"a","\u0102":"A","\u0103":"a","\u0104":"A","\u0105":"a","\u0106":"C","\u0107":"c","\u010C":"C","\u010D":"c","\u010E":"D","\u010F":"d","\u0110":"DJ","\u0111":"dj","\u0112":"E","\u0113":"e","\u0116":"E","\u0117":"e","\u0118":"e","\u0119":"e","\u011A":"E","\u011B":"e","\u011E":"G","\u011F":"g","\u0122":"G","\u0123":"g","\u0128":"I","\u0129":"i","\u012A":"i","\u012B":"i","\u012E":"I","\u012F":"i","\u0130":"I","\u0131":"i","\u0136":"k","\u0137":"k","\u013B":"L","\u013C":"l","\u013D":"L","\u013E":"l","\u0141":"L","\u0142":"l","\u0143":"N","\u0144":"n","\u0145":"N","\u0146":"n","\u0147":"N","\u0148":"n","\u014C":"O","\u014D":"o","\u0150":"O","\u0151":"o","\u0152":"OE","\u0153":"oe","\u0154":"R","\u0155":"r","\u0158":"R","\u0159":"r","\u015A":"S","\u015B":"s","\u015E":"S","\u015F":"s","\u0160":"S","\u0161":"s","\u0162":"T","\u0163":"t","\u0164":"T","\u0165":"t","\u0168":"U","\u0169":"u","\u016A":"u","\u016B":"u","\u016E":"U","\u016F":"u","\u0170":"U","\u0171":"u","\u0172":"U","\u0173":"u","\u0174":"W","\u0175":"w","\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017A":"z","\u017B":"Z","\u017C":"z","\u017D":"Z","\u017E":"z","\u018F":"E","\u0192":"f","\u01A0":"O","\u01A1":"o","\u01AF":"U","\u01B0":"u","\u01C8":"LJ","\u01C9":"lj","\u01CB":"NJ","\u01CC":"nj","\u0218":"S","\u0219":"s","\u021A":"T","\u021B":"t","\u0259":"e","\u02DA":"o","\u0386":"A","\u0388":"E","\u0389":"H","\u038A":"I","\u038C":"O","\u038E":"Y","\u038F":"W","\u0390":"i","\u0391":"A","\u0392":"B","\u0393":"G","\u0394":"D","\u0395":"E","\u0396":"Z","\u0397":"H","\u0398":"8","\u0399":"I","\u039A":"K","\u039B":"L","\u039C":"M","\u039D":"N","\u039E":"3","\u039F":"O","\u03A0":"P","\u03A1":"R","\u03A3":"S","\u03A4":"T","\u03A5":"Y","\u03A6":"F","\u03A7":"X","\u03A8":"PS","\u03A9":"W","\u03AA":"I","\u03AB":"Y","\u03AC":"a","\u03AD":"e","\u03AE":"h","\u03AF":"i","\u03B0":"y","\u03B1":"a","\u03B2":"b","\u03B3":"g","\u03B4":"d","\u03B5":"e","\u03B6":"z","\u03B7":"h","\u03B8":"8","\u03B9":"i","\u03BA":"k","\u03BB":"l","\u03BC":"m","\u03BD":"n","\u03BE":"3","\u03BF":"o","\u03C0":"p","\u03C1":"r","\u03C2":"s","\u03C3":"s","\u03C4":"t","\u03C5":"y","\u03C6":"f","\u03C7":"x","\u03C8":"ps","\u03C9":"w","\u03CA":"i","\u03CB":"y","\u03CC":"o","\u03CD":"y","\u03CE":"w","\u0401":"Yo","\u0402":"DJ","\u0404":"Ye","\u0406":"I","\u0407":"Yi","\u0408":"J","\u0409":"LJ","\u040A":"NJ","\u040B":"C","\u040F":"DZ","\u0410":"A","\u0411":"B","\u0412":"V","\u0413":"G","\u0414":"D","\u0415":"E","\u0416":"Zh","\u0417":"Z","\u0418":"I","\u0419":"J","\u041A":"K","\u041B":"L","\u041C":"M","\u041D":"N","\u041E":"O","\u041F":"P","\u0420":"R","\u0421":"S","\u0422":"T","\u0423":"U","\u0424":"F","\u0425":"H","\u0426":"C","\u0427":"Ch","\u0428":"Sh","\u0429":"Sh","\u042A":"U","\u042B":"Y","\u042C":"","\u042D":"E","\u042E":"Yu","\u042F":"Ya","\u0430":"a","\u0431":"b","\u0432":"v","\u0433":"g","\u0434":"d","\u0435":"e","\u0436":"zh","\u0437":"z","\u0438":"i","\u0439":"j","\u043A":"k","\u043B":"l","\u043C":"m","\u043D":"n","\u043E":"o","\u043F":"p","\u0440":"r","\u0441":"s","\u0442":"t","\u0443":"u","\u0444":"f","\u0445":"h","\u0446":"c","\u0447":"ch","\u0448":"sh","\u0449":"sh","\u044A":"u","\u044B":"y","\u044C":"","\u044D":"e","\u044E":"yu","\u044F":"ya","\u0451":"yo","\u0452":"dj","\u0454":"ye","\u0456":"i","\u0457":"yi","\u0458":"j","\u0459":"lj","\u045A":"nj","\u045B":"c","\u045D":"u","\u045F":"dz","\u0490":"G","\u0491":"g","\u0492":"GH","\u0493":"gh","\u049A":"KH","\u049B":"kh","\u04A2":"NG","\u04A3":"ng","\u04AE":"UE","\u04AF":"ue","\u04B0":"U","\u04B1":"u","\u04BA":"H","\u04BB":"h","\u04D8":"AE","\u04D9":"ae","\u04E8":"OE","\u04E9":"oe","\u0531":"A","\u0532":"B","\u0533":"G","\u0534":"D","\u0535":"E","\u0536":"Z","\u0537":"E'","\u0538":"Y'","\u0539":"T'","\u053A":"JH","\u053B":"I","\u053C":"L","\u053D":"X","\u053E":"C'","\u053F":"K","\u0540":"H","\u0541":"D'","\u0542":"GH","\u0543":"TW","\u0544":"M","\u0545":"Y","\u0546":"N","\u0547":"SH","\u0549":"CH","\u054A":"P","\u054B":"J","\u054C":"R'","\u054D":"S","\u054E":"V","\u054F":"T","\u0550":"R","\u0551":"C","\u0553":"P'","\u0554":"Q'","\u0555":"O''","\u0556":"F","\u0587":"EV","\u0621":"a","\u0622":"aa","\u0623":"a","\u0624":"u","\u0625":"i","\u0626":"e","\u0627":"a","\u0628":"b","\u0629":"h","\u062A":"t","\u062B":"th","\u062C":"j","\u062D":"h","\u062E":"kh","\u062F":"d","\u0630":"th","\u0631":"r","\u0632":"z","\u0633":"s","\u0634":"sh","\u0635":"s","\u0636":"dh","\u0637":"t","\u0638":"z","\u0639":"a","\u063A":"gh","\u0641":"f","\u0642":"q","\u0643":"k","\u0644":"l","\u0645":"m","\u0646":"n","\u0647":"h","\u0648":"w","\u0649":"a","\u064A":"y","\u064B":"an","\u064C":"on","\u064D":"en","\u064E":"a","\u064F":"u","\u0650":"e","\u0652":"","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u067E":"p","\u0686":"ch","\u0698":"zh","\u06A9":"k","\u06AF":"g","\u06CC":"y","\u06F0":"0","\u06F1":"1","\u06F2":"2","\u06F3":"3","\u06F4":"4","\u06F5":"5","\u06F6":"6","\u06F7":"7","\u06F8":"8","\u06F9":"9","\u0E3F":"baht","\u10D0":"a","\u10D1":"b","\u10D2":"g","\u10D3":"d","\u10D4":"e","\u10D5":"v","\u10D6":"z","\u10D7":"t","\u10D8":"i","\u10D9":"k","\u10DA":"l","\u10DB":"m","\u10DC":"n","\u10DD":"o","\u10DE":"p","\u10DF":"zh","\u10E0":"r","\u10E1":"s","\u10E2":"t","\u10E3":"u","\u10E4":"f","\u10E5":"k","\u10E6":"gh","\u10E7":"q","\u10E8":"sh","\u10E9":"ch","\u10EA":"ts","\u10EB":"dz","\u10EC":"ts","\u10ED":"ch","\u10EE":"kh","\u10EF":"j","\u10F0":"h","\u1E62":"S","\u1E63":"s","\u1E80":"W","\u1E81":"w","\u1E82":"W","\u1E83":"w","\u1E84":"W","\u1E85":"w","\u1E9E":"SS","\u1EA0":"A","\u1EA1":"a","\u1EA2":"A","\u1EA3":"a","\u1EA4":"A","\u1EA5":"a","\u1EA6":"A","\u1EA7":"a","\u1EA8":"A","\u1EA9":"a","\u1EAA":"A","\u1EAB":"a","\u1EAC":"A","\u1EAD":"a","\u1EAE":"A","\u1EAF":"a","\u1EB0":"A","\u1EB1":"a","\u1EB2":"A","\u1EB3":"a","\u1EB4":"A","\u1EB5":"a","\u1EB6":"A","\u1EB7":"a","\u1EB8":"E","\u1EB9":"e","\u1EBA":"E","\u1EBB":"e","\u1EBC":"E","\u1EBD":"e","\u1EBE":"E","\u1EBF":"e","\u1EC0":"E","\u1EC1":"e","\u1EC2":"E","\u1EC3":"e","\u1EC4":"E","\u1EC5":"e","\u1EC6":"E","\u1EC7":"e","\u1EC8":"I","\u1EC9":"i","\u1ECA":"I","\u1ECB":"i","\u1ECC":"O","\u1ECD":"o","\u1ECE":"O","\u1ECF":"o","\u1ED0":"O","\u1ED1":"o","\u1ED2":"O","\u1ED3":"o","\u1ED4":"O","\u1ED5":"o","\u1ED6":"O","\u1ED7":"o","\u1ED8":"O","\u1ED9":"o","\u1EDA":"O","\u1EDB":"o","\u1EDC":"O","\u1EDD":"o","\u1EDE":"O","\u1EDF":"o","\u1EE0":"O","\u1EE1":"o","\u1EE2":"O","\u1EE3":"o","\u1EE4":"U","\u1EE5":"u","\u1EE6":"U","\u1EE7":"u","\u1EE8":"U","\u1EE9":"u","\u1EEA":"U","\u1EEB":"u","\u1EEC":"U","\u1EED":"u","\u1EEE":"U","\u1EEF":"u","\u1EF0":"U","\u1EF1":"u","\u1EF2":"Y","\u1EF3":"y","\u1EF4":"Y","\u1EF5":"y","\u1EF6":"Y","\u1EF7":"y","\u1EF8":"Y","\u1EF9":"y","\u2013":"-","\u2018":"'","\u2019":"'","\u201C":"\\"","\u201D":"\\"","\u201E":"\\"","\u2020":"+","\u2022":"*","\u2026":"...","\u20A0":"ecu","\u20A2":"cruzeiro","\u20A3":"french franc","\u20A4":"lira","\u20A5":"mill","\u20A6":"naira","\u20A7":"peseta","\u20A8":"rupee","\u20A9":"won","\u20AA":"new shequel","\u20AB":"dong","\u20AC":"euro","\u20AD":"kip","\u20AE":"tugrik","\u20AF":"drachma","\u20B0":"penny","\u20B1":"peso","\u20B2":"guarani","\u20B3":"austral","\u20B4":"hryvnia","\u20B5":"cedi","\u20B8":"kazakhstani tenge","\u20B9":"indian rupee","\u20BA":"turkish lira","\u20BD":"russian ruble","\u20BF":"bitcoin","\u2120":"sm","\u2122":"tm","\u2202":"d","\u2206":"delta","\u2211":"sum","\u221E":"infinity","\u2665":"love","\u5143":"yuan","\u5186":"yen","\uFDFC":"rial","\uFEF5":"laa","\uFEF7":"laa","\uFEF9":"lai","\uFEFB":"la"}`);
      var locales = JSON.parse('{"bg":{"\u0419":"Y","\u0426":"Ts","\u0429":"Sht","\u042A":"A","\u042C":"Y","\u0439":"y","\u0446":"ts","\u0449":"sht","\u044A":"a","\u044C":"y"},"de":{"\xC4":"AE","\xE4":"ae","\xD6":"OE","\xF6":"oe","\xDC":"UE","\xFC":"ue","\xDF":"ss","%":"prozent","&":"und","|":"oder","\u2211":"summe","\u221E":"unendlich","\u2665":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","\xA2":"centavos","\xA3":"libras","\xA4":"moneda","\u20A3":"francos","\u2211":"suma","\u221E":"infinito","\u2665":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","\xA2":"centime","\xA3":"livre","\xA4":"devise","\u20A3":"franc","\u2211":"somme","\u221E":"infini","\u2665":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","\xA2":"centavo","\u2211":"soma","\xA3":"libra","\u221E":"infinito","\u2665":"amor"},"uk":{"\u0418":"Y","\u0438":"y","\u0419":"Y","\u0439":"y","\u0426":"Ts","\u0446":"ts","\u0425":"Kh","\u0445":"kh","\u0429":"Shch","\u0449":"shch","\u0413":"H","\u0433":"h"},"vi":{"\u0110":"D","\u0111":"d"},"da":{"\xD8":"OE","\xF8":"oe","\xC5":"AA","\xE5":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"st\xF8rre end"},"nb":{"&":"og","\xC5":"AA","\xC6":"AE","\xD8":"OE","\xE5":"aa","\xE6":"ae","\xF8":"oe"},"it":{"&":"e"},"nl":{"&":"en"},"sv":{"&":"och","\xC5":"AA","\xC4":"AE","\xD6":"OE","\xE5":"aa","\xE4":"ae","\xF6":"oe"}}');
      function replace(string2, options2) {
        if (typeof string2 !== "string") {
          throw new Error("slugify: string argument expected");
        }
        options2 = typeof options2 === "string" ? { replacement: options2 } : options2 || {};
        var locale2 = locales[options2.locale] || {};
        var replacement = options2.replacement === void 0 ? "-" : options2.replacement;
        var trim = options2.trim === void 0 ? true : options2.trim;
        var slug = string2.normalize().split("").reduce(function(result, ch) {
          var appendChar = locale2[ch] || charMap[ch] || ch;
          if (appendChar === replacement) {
            appendChar = " ";
          }
          return result + appendChar.replace(options2.remove || /[^\w\s$*_+~.()'"!\-:@]+/g, "");
        }, "");
        if (options2.strict) {
          slug = slug.replace(/[^A-Za-z0-9\s]/g, "");
        }
        if (trim) {
          slug = slug.trim();
        }
        slug = slug.replace(/\s+/g, replacement);
        if (options2.lower) {
          slug = slug.toLowerCase();
        }
        return slug;
      }
      replace.extend = function(customMap) {
        Object.assign(charMap, customMap);
      };
      return replace;
    });
  }
});

// node_modules/d3-force-boundary/dist/d3-force-boundary.js
var require_d3_force_boundary = __commonJS({
  "node_modules/d3-force-boundary/dist/d3-force-boundary.js"(exports, module2) {
    init_shims();
    (function(global2, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global2.forceBoundary = factory();
    })(exports, function() {
      "use strict";
      function constant2(x2) {
        return function() {
          return x2;
        };
      }
      function forceBoundary2(x0, y0, x1, y1) {
        var strength = constant2(0.1), hardBoundary = true, border = constant2(Math.min((x1 - x0) / 2, (y1 - y0) / 2)), nodes, strengthsX, strengthsY, x0z, x1z, y0z, y1z, borderz, halfX, halfY;
        if (typeof x0 !== "function")
          x0 = constant2(x0 == null ? -100 : +x0);
        if (typeof x1 !== "function")
          x1 = constant2(x1 == null ? 100 : +x1);
        if (typeof y0 !== "function")
          y0 = constant2(y0 == null ? -100 : +y0);
        if (typeof y1 !== "function")
          y1 = constant2(y1 == null ? 100 : +y1);
        function getVx(halfX2, x2, strengthX, border2, alpha) {
          return (halfX2 - x2) * Math.min(2, Math.abs(halfX2 - x2) / halfX2) * strengthX * alpha;
        }
        function force(alpha) {
          for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i];
            if (node.x < x0z[i] + borderz[i] || node.x > x1z[i] - borderz[i] || (node.y < y0z[i] + borderz[i] || node.y > y1z[i] - borderz[i])) {
              node.vx += getVx(halfX[i], node.x, strengthsX[i], borderz[i], alpha);
              node.vy += getVx(halfY[i], node.y, strengthsY[i], borderz[i], alpha);
            } else {
              node.vx = 0;
              node.vy = 0;
            }
            if (hardBoundary) {
              if (node.x >= x1z[i])
                node.vx += x1z[i] - node.x;
              if (node.x <= x0z[i])
                node.vx += x0z[i] - node.x;
              if (node.y >= y1z[i])
                node.vy += y1z[i] - node.y;
              if (node.y <= y0z[i])
                node.vy += y0z[i] - node.y;
            }
          }
        }
        function initialize() {
          if (!nodes)
            return;
          var i, n = nodes.length;
          strengthsX = new Array(n);
          strengthsY = new Array(n);
          x0z = new Array(n);
          y0z = new Array(n);
          x1z = new Array(n);
          y1z = new Array(n);
          halfY = new Array(n);
          halfX = new Array(n);
          borderz = new Array(n);
          for (i = 0; i < n; ++i) {
            strengthsX[i] = isNaN(x0z[i] = +x0(nodes[i], i, nodes)) || isNaN(x1z[i] = +x1(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
            strengthsY[i] = isNaN(y0z[i] = +y0(nodes[i], i, nodes)) || isNaN(y1z[i] = +y1(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
            halfX[i] = x0z[i] + (x1z[i] - x0z[i]) / 2, halfY[i] = y0z[i] + (y1z[i] - y0z[i]) / 2;
            borderz[i] = +border(nodes[i], i, nodes);
          }
        }
        force.initialize = function(_) {
          nodes = _;
          initialize();
        };
        force.x0 = function(_) {
          return arguments.length ? (x0 = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : x0;
        };
        force.x1 = function(_) {
          return arguments.length ? (x1 = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : x1;
        };
        force.y0 = function(_) {
          return arguments.length ? (y0 = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : y0;
        };
        force.y1 = function(_) {
          return arguments.length ? (y1 = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : y1;
        };
        force.strength = function(_) {
          return arguments.length ? (strength = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : strength;
        };
        force.border = function(_) {
          return arguments.length ? (border = typeof _ === "function" ? _ : constant2(+_), initialize(), force) : border;
        };
        force.hardBoundary = function(_) {
          return arguments.length ? (hardBoundary = _, force) : hardBoundary;
        };
        return force;
      }
      return forceBoundary2;
    });
  }
});

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});
init_shims();

// .svelte-kit/output/server/app.js
init_shims();
var import_slugify = __toModule(require_slugify());
var import_os = __toModule(require("os"));
var import_path = __toModule(require("path"));
var import_d3_force_boundary = __toModule(require_d3_force_boundary());
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
var _errors;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a2, b) {
    return b[1] - a2[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c2) {
  return escaped$1[c2] || c2;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$2() {
}
function safe_not_equal$1(a2, b) {
  return a2 != a2 ? b == b : a2 !== b || (a2 && typeof a2 === "object" || typeof a2 === "function");
}
Promise.resolve();
var subscriber_queue$1 = [];
function writable$1(value, start = noop$2) {
  let stop;
  const subscribers = new Set();
  function set2(new_value) {
    if (safe_not_equal$1(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue$1.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue$1.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue$1.length; i += 2) {
            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
          }
          subscriber_queue$1.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(value));
  }
  function subscribe2(run2, invalidate = noop$2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2) || noop$2;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var escape_json_string_in_html_dict = {
  '"': '\\"',
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape_json_string_in_html(str) {
  return escape$1(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
var escape_html_attr_dict = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function escape_html_attr(str) {
  return '"' + escape$1(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
function escape$1(str, dict, unicode_encoder) {
  let result = "";
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += unicode_encoder(code);
      }
    } else {
      result += char;
    }
  }
  return result;
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable$1($session);
    const props = {
      stores: {
        page: writable$1(null),
        navigating: writable$1(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url)}`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data2, fail) {
  try {
    return devalue(data2);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize$1(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize$1(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map2 = new Map();
  return {
    append(key, value) {
      if (map2.has(key)) {
        (map2.get(key) || []).push(value);
      } else {
        map2.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map2)
  };
}
var ReadOnlyFormData = class {
  constructor(map2) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map2);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data: data2, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data2;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data: data2, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data2;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop$1() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a2, b) {
  return a2 != a2 ? b == b : a2 !== b || (a2 && typeof a2 === "object" || typeof a2 === "function");
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop$1;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true && boolean_attributes.has(name) ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$3 = {
  code: "#svelte-announcer.svelte-1pdgbjn{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>#svelte-announcer{clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);height:1px;left:0;overflow:hidden;position:absolute;top:0;white-space:nowrap;width:1px}</style>"],"names":[],"mappings":"AAqDO,gCAAiB,CAAC,KAAK,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,kBAAkB,MAAM,GAAG,CAAC,CAAC,UAAU,MAAM,GAAG,CAAC,CAAC,OAAO,GAAG,CAAC,KAAK,CAAC,CAAC,SAAS,MAAM,CAAC,SAAS,QAAQ,CAAC,IAAI,CAAC,CAAC,YAAY,MAAM,CAAC,MAAM,GAAG,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$3);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => {
      return `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
        default: () => {
          return `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`;
        }
      })}` : ``}`;
    }
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => `<!DOCTYPE html>
<html
	lang="en"
	class="bg-accent dark:bg-primary overflow-x-hidden text-base scroll-smooth"
>
	<head>
		<meta charset="utf-8" />
		<meta
			name="viewport"
			content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
		/>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="keywords" content="Sawyer Click, Newsroom developer, Data Graphics" />
		<meta name="author" content="Sawyer Click" />
		<link rel="apple-touch-icon" sizes="180x180" href="/images/site/favicon/apple-touch-icon.png" />
		<link rel="icon" type="image/png" sizes="32x32" href="/images/site/favicon/favicon-32x32.png" />
		<link rel="icon" type="image/png" sizes="16x16" href="/images/site/favicon/favicon-16x16.png" />
		<link rel="manifest" href="/images/site/favicon/site.webmanifest" />
		<link rel="canonical" href="https://sawyer.codes" />

		<script
			data-goatcounter="https://sawyer.goatcounter.com/count"
			async
			src="//gc.zgo.at/count.js"
		><\/script>

		<script type="application/ld+json">
			{
				"@context": "https://schema.org/",
				"@type": "Person",
				"name": "Sawyer Click",
				"description": "Sawyer Click is a data viz developer working on data-driven visual and interactive storytelling",
				"image": "https://avatars.githubusercontent.com/u/50996762",
				"email": "sawyer@hey.com",
				"alumniOf": "Columbia University",
				"jobTitle": "Newsroom developer",
			  "worksFor": {
			    "@type": "Organization",
			    "name": "The DataFace"
			  }
				"address": {
					"@type": "PostalAddress",
					"addressLocality": "Dripping Springs",
					"addressRegion": "TX",
					"addressCountry": "United States"
				},
				"url": "http://www.sawyer.codes",
				"sameAs": [
					"https://github.com/SawyerClick",
					"https://www.linkedin.com/in/sawyerclick/",
					"https://twitter.com/sawyerdabear"
				]
			}
		<\/script>

		<script>
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
				localStorage.theme = 'dark';
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.theme = 'light';
			}
		<\/script>

		` + head + '\n	</head>\n	<body class="bg-accent dark:bg-primary min-h-screen antialiased">\n		<div>' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-559d0a83.js",
      css: [assets + "/_app/assets/start-464e9d0a.css"],
      js: [assets + "/_app/start-559d0a83.js", assets + "/_app/chunks/vendor-cee67bc9.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: null,
    template,
    trailing_slash: "never"
  };
}
var d = (s2) => s2.replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
var empty = () => ({});
var manifest = {
  assets: [{ "file": ".DS_Store", "size": 10244, "type": null }, { "file": ".nojekyll", "size": 0, "type": null }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "fonts/.DS_Store", "size": 6148, "type": null }, { "file": "fonts/Inconsolata.ttf", "size": 343368, "type": "font/ttf" }, { "file": "fonts/Monument.ttf", "size": 54828, "type": "font/ttf" }, { "file": "fonts/RecoletaRegular.woff2", "size": 49244, "type": "font/woff2" }, { "file": "images/.DS_Store", "size": 10244, "type": null }, { "file": "images/me.jpeg", "size": 25345, "type": "image/jpeg" }, { "file": "images/portfolio/.DS_Store", "size": 10244, "type": null }, { "file": "images/portfolio/resized/2020-dems/200.png", "size": 30238, "type": "image/png" }, { "file": "images/portfolio/resized/2020-dems/200.webp", "size": 3652, "type": "image/webp" }, { "file": "images/portfolio/resized/2020-dems/400.png", "size": 102595, "type": "image/png" }, { "file": "images/portfolio/resized/2020-dems/400.webp", "size": 10962, "type": "image/webp" }, { "file": "images/portfolio/resized/2020-dems/600.png", "size": 214999, "type": "image/png" }, { "file": "images/portfolio/resized/2020-dems/600.webp", "size": 20398, "type": "image/webp" }, { "file": "images/portfolio/resized/2020-dems/800.png", "size": 372069, "type": "image/png" }, { "file": "images/portfolio/resized/2020-dems/800.webp", "size": 30740, "type": "image/webp" }, { "file": "images/portfolio/resized/2020-dems/blurred.jpeg", "size": 468, "type": "image/jpeg" }, { "file": "images/portfolio/resized/all-time-best/200.png", "size": 41102, "type": "image/png" }, { "file": "images/portfolio/resized/all-time-best/200.webp", "size": 7418, "type": "image/webp" }, { "file": "images/portfolio/resized/all-time-best/400.png", "size": 118311, "type": "image/png" }, { "file": "images/portfolio/resized/all-time-best/400.webp", "size": 17686, "type": "image/webp" }, { "file": "images/portfolio/resized/all-time-best/600.png", "size": 223730, "type": "image/png" }, { "file": "images/portfolio/resized/all-time-best/600.webp", "size": 31924, "type": "image/webp" }, { "file": "images/portfolio/resized/all-time-best/800.png", "size": 357845, "type": "image/png" }, { "file": "images/portfolio/resized/all-time-best/800.webp", "size": 47650, "type": "image/webp" }, { "file": "images/portfolio/resized/all-time-best/blurred.jpeg", "size": 785, "type": "image/jpeg" }, { "file": "images/portfolio/resized/bernie-battered/200.png", "size": 11219, "type": "image/png" }, { "file": "images/portfolio/resized/bernie-battered/200.webp", "size": 1950, "type": "image/webp" }, { "file": "images/portfolio/resized/bernie-battered/400.png", "size": 29432, "type": "image/png" }, { "file": "images/portfolio/resized/bernie-battered/400.webp", "size": 5212, "type": "image/webp" }, { "file": "images/portfolio/resized/bernie-battered/600.png", "size": 49880, "type": "image/png" }, { "file": "images/portfolio/resized/bernie-battered/600.webp", "size": 8882, "type": "image/webp" }, { "file": "images/portfolio/resized/bernie-battered/800.png", "size": 74708, "type": "image/png" }, { "file": "images/portfolio/resized/bernie-battered/800.webp", "size": 12840, "type": "image/webp" }, { "file": "images/portfolio/resized/bernie-battered/blurred.jpeg", "size": 402, "type": "image/jpeg" }, { "file": "images/portfolio/resized/biotech-execs/200.png", "size": 38512, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-execs/200.webp", "size": 8720, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-execs/400.png", "size": 92737, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-execs/400.webp", "size": 21172, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-execs/600.png", "size": 186551, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-execs/600.webp", "size": 34106, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-execs/800.png", "size": 309602, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-execs/800.webp", "size": 47496, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-execs/blurred.jpeg", "size": 849, "type": "image/jpeg" }, { "file": "images/portfolio/resized/biotech-quiz/200.png", "size": 44025, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-quiz/200.webp", "size": 8142, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-quiz/400.png", "size": 134106, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-quiz/400.webp", "size": 22726, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-quiz/600.png", "size": 259655, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-quiz/600.webp", "size": 40110, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-quiz/800.png", "size": 417778, "type": "image/png" }, { "file": "images/portfolio/resized/biotech-quiz/800.webp", "size": 56570, "type": "image/webp" }, { "file": "images/portfolio/resized/biotech-quiz/blurred.jpeg", "size": 694, "type": "image/jpeg" }, { "file": "images/portfolio/resized/board-genders/200.png", "size": 15321, "type": "image/png" }, { "file": "images/portfolio/resized/board-genders/200.webp", "size": 3740, "type": "image/webp" }, { "file": "images/portfolio/resized/board-genders/400.png", "size": 46494, "type": "image/png" }, { "file": "images/portfolio/resized/board-genders/400.webp", "size": 9196, "type": "image/webp" }, { "file": "images/portfolio/resized/board-genders/600.png", "size": 89033, "type": "image/png" }, { "file": "images/portfolio/resized/board-genders/600.webp", "size": 15104, "type": "image/webp" }, { "file": "images/portfolio/resized/board-genders/800.png", "size": 192914, "type": "image/png" }, { "file": "images/portfolio/resized/board-genders/800.webp", "size": 21010, "type": "image/webp" }, { "file": "images/portfolio/resized/board-genders/blurred.jpeg", "size": 504, "type": "image/jpeg" }, { "file": "images/portfolio/resized/cabinet/200.png", "size": 38035, "type": "image/png" }, { "file": "images/portfolio/resized/cabinet/200.webp", "size": 6784, "type": "image/webp" }, { "file": "images/portfolio/resized/cabinet/400.png", "size": 122090, "type": "image/png" }, { "file": "images/portfolio/resized/cabinet/400.webp", "size": 18342, "type": "image/webp" }, { "file": "images/portfolio/resized/cabinet/600.png", "size": 243342, "type": "image/png" }, { "file": "images/portfolio/resized/cabinet/600.webp", "size": 30500, "type": "image/webp" }, { "file": "images/portfolio/resized/cabinet/800.png", "size": 399197, "type": "image/png" }, { "file": "images/portfolio/resized/cabinet/800.webp", "size": 44792, "type": "image/webp" }, { "file": "images/portfolio/resized/cabinet/blurred.jpeg", "size": 783, "type": "image/jpeg" }, { "file": "images/portfolio/resized/cloudkitchens-map/200.png", "size": 19087, "type": "image/png" }, { "file": "images/portfolio/resized/cloudkitchens-map/200.webp", "size": 3652, "type": "image/webp" }, { "file": "images/portfolio/resized/cloudkitchens-map/400.png", "size": 60048, "type": "image/png" }, { "file": "images/portfolio/resized/cloudkitchens-map/400.webp", "size": 10536, "type": "image/webp" }, { "file": "images/portfolio/resized/cloudkitchens-map/600.png", "size": 124067, "type": "image/png" }, { "file": "images/portfolio/resized/cloudkitchens-map/600.webp", "size": 18042, "type": "image/webp" }, { "file": "images/portfolio/resized/cloudkitchens-map/800.png", "size": 256019, "type": "image/png" }, { "file": "images/portfolio/resized/cloudkitchens-map/800.webp", "size": 25904, "type": "image/webp" }, { "file": "images/portfolio/resized/cloudkitchens-map/blurred.jpeg", "size": 527, "type": "image/jpeg" }, { "file": "images/portfolio/resized/condegram/200.png", "size": 16432, "type": "image/png" }, { "file": "images/portfolio/resized/condegram/200.webp", "size": 2968, "type": "image/webp" }, { "file": "images/portfolio/resized/condegram/400.png", "size": 48262, "type": "image/png" }, { "file": "images/portfolio/resized/condegram/400.webp", "size": 8208, "type": "image/webp" }, { "file": "images/portfolio/resized/condegram/600.png", "size": 82041, "type": "image/png" }, { "file": "images/portfolio/resized/condegram/600.webp", "size": 14130, "type": "image/webp" }, { "file": "images/portfolio/resized/condegram/800.png", "size": 121447, "type": "image/png" }, { "file": "images/portfolio/resized/condegram/800.webp", "size": 2e4, "type": "image/webp" }, { "file": "images/portfolio/resized/condegram/blurred.jpeg", "size": 643, "type": "image/jpeg" }, { "file": "images/portfolio/resized/conflicted-congress/200.png", "size": 42129, "type": "image/png" }, { "file": "images/portfolio/resized/conflicted-congress/200.webp", "size": 11522, "type": "image/webp" }, { "file": "images/portfolio/resized/conflicted-congress/400.png", "size": 107748, "type": "image/png" }, { "file": "images/portfolio/resized/conflicted-congress/400.webp", "size": 30098, "type": "image/webp" }, { "file": "images/portfolio/resized/conflicted-congress/600.png", "size": 184392, "type": "image/png" }, { "file": "images/portfolio/resized/conflicted-congress/600.webp", "size": 48324, "type": "image/webp" }, { "file": "images/portfolio/resized/conflicted-congress/800.png", "size": 270742, "type": "image/png" }, { "file": "images/portfolio/resized/conflicted-congress/800.webp", "size": 65760, "type": "image/webp" }, { "file": "images/portfolio/resized/conflicted-congress/blurred.jpeg", "size": 664, "type": "image/jpeg" }, { "file": "images/portfolio/resized/contour-map/200.png", "size": 21174, "type": "image/png" }, { "file": "images/portfolio/resized/contour-map/200.webp", "size": 2e3, "type": "image/webp" }, { "file": "images/portfolio/resized/contour-map/400.png", "size": 56539, "type": "image/png" }, { "file": "images/portfolio/resized/contour-map/400.webp", "size": 5400, "type": "image/webp" }, { "file": "images/portfolio/resized/contour-map/600.png", "size": 98798, "type": "image/png" }, { "file": "images/portfolio/resized/contour-map/600.webp", "size": 10426, "type": "image/webp" }, { "file": "images/portfolio/resized/contour-map/800.png", "size": 148196, "type": "image/png" }, { "file": "images/portfolio/resized/contour-map/800.webp", "size": 16284, "type": "image/webp" }, { "file": "images/portfolio/resized/contour-map/blurred.jpeg", "size": 656, "type": "image/jpeg" }, { "file": "images/portfolio/resized/coro-per-day/200.png", "size": 8658, "type": "image/png" }, { "file": "images/portfolio/resized/coro-per-day/200.webp", "size": 1596, "type": "image/webp" }, { "file": "images/portfolio/resized/coro-per-day/400.png", "size": 20852, "type": "image/png" }, { "file": "images/portfolio/resized/coro-per-day/400.webp", "size": 4780, "type": "image/webp" }, { "file": "images/portfolio/resized/coro-per-day/600.png", "size": 39402, "type": "image/png" }, { "file": "images/portfolio/resized/coro-per-day/600.webp", "size": 8820, "type": "image/webp" }, { "file": "images/portfolio/resized/coro-per-day/800.png", "size": 57891, "type": "image/png" }, { "file": "images/portfolio/resized/coro-per-day/800.webp", "size": 13468, "type": "image/webp" }, { "file": "images/portfolio/resized/coro-per-day/blurred.jpeg", "size": 522, "type": "image/jpeg" }, { "file": "images/portfolio/resized/corona-streaming/200.png", "size": 10582, "type": "image/png" }, { "file": "images/portfolio/resized/corona-streaming/200.webp", "size": 2134, "type": "image/webp" }, { "file": "images/portfolio/resized/corona-streaming/400.png", "size": 26187, "type": "image/png" }, { "file": "images/portfolio/resized/corona-streaming/400.webp", "size": 5848, "type": "image/webp" }, { "file": "images/portfolio/resized/corona-streaming/600.png", "size": 43830, "type": "image/png" }, { "file": "images/portfolio/resized/corona-streaming/600.webp", "size": 10370, "type": "image/webp" }, { "file": "images/portfolio/resized/corona-streaming/800.png", "size": 63826, "type": "image/png" }, { "file": "images/portfolio/resized/corona-streaming/800.webp", "size": 15382, "type": "image/webp" }, { "file": "images/portfolio/resized/corona-streaming/blurred.jpeg", "size": 345, "type": "image/jpeg" }, { "file": "images/portfolio/resized/coronavirus-animated-map/200.png", "size": 28844, "type": "image/png" }, { "file": "images/portfolio/resized/coronavirus-animated-map/200.webp", "size": 4422, "type": "image/webp" }, { "file": "images/portfolio/resized/coronavirus-animated-map/400.png", "size": 91804, "type": "image/png" }, { "file": "images/portfolio/resized/coronavirus-animated-map/400.webp", "size": 11504, "type": "image/webp" }, { "file": "images/portfolio/resized/coronavirus-animated-map/600.png", "size": 70218, "type": "image/png" }, { "file": "images/portfolio/resized/coronavirus-animated-map/600.webp", "size": 19664, "type": "image/webp" }, { "file": "images/portfolio/resized/coronavirus-animated-map/800.png", "size": 267269, "type": "image/png" }, { "file": "images/portfolio/resized/coronavirus-animated-map/800.webp", "size": 25434, "type": "image/webp" }, { "file": "images/portfolio/resized/coronavirus-animated-map/blurred.jpeg", "size": 689, "type": "image/jpeg" }, { "file": "images/portfolio/resized/emissions/200.png", "size": 15112, "type": "image/png" }, { "file": "images/portfolio/resized/emissions/200.webp", "size": 2796, "type": "image/webp" }, { "file": "images/portfolio/resized/emissions/400.png", "size": 41532, "type": "image/png" }, { "file": "images/portfolio/resized/emissions/400.webp", "size": 7326, "type": "image/webp" }, { "file": "images/portfolio/resized/emissions/600.png", "size": 76069, "type": "image/png" }, { "file": "images/portfolio/resized/emissions/600.webp", "size": 12538, "type": "image/webp" }, { "file": "images/portfolio/resized/emissions/800.png", "size": 117935, "type": "image/png" }, { "file": "images/portfolio/resized/emissions/800.webp", "size": 18072, "type": "image/webp" }, { "file": "images/portfolio/resized/emissions/blurred.jpeg", "size": 570, "type": "image/jpeg" }, { "file": "images/portfolio/resized/esports-winners/200.png", "size": 35072, "type": "image/png" }, { "file": "images/portfolio/resized/esports-winners/200.webp", "size": 7832, "type": "image/webp" }, { "file": "images/portfolio/resized/esports-winners/400.png", "size": 90479, "type": "image/png" }, { "file": "images/portfolio/resized/esports-winners/400.webp", "size": 17728, "type": "image/webp" }, { "file": "images/portfolio/resized/esports-winners/600.png", "size": 181204, "type": "image/png" }, { "file": "images/portfolio/resized/esports-winners/600.webp", "size": 27472, "type": "image/webp" }, { "file": "images/portfolio/resized/esports-winners/800.png", "size": 327498, "type": "image/png" }, { "file": "images/portfolio/resized/esports-winners/800.webp", "size": 37732, "type": "image/webp" }, { "file": "images/portfolio/resized/esports-winners/blurred.jpeg", "size": 846, "type": "image/jpeg" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/200.png", "size": 41916, "type": "image/png" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/200.webp", "size": 6724, "type": "image/webp" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/400.png", "size": 140013, "type": "image/png" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/400.webp", "size": 20266, "type": "image/webp" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/600.png", "size": 291561, "type": "image/png" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/600.webp", "size": 33006, "type": "image/webp" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/800.png", "size": 518988, "type": "image/png" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/800.webp", "size": 44792, "type": "image/webp" }, { "file": "images/portfolio/resized/georgia-legislative-roadmap/blurred.jpeg", "size": 600, "type": "image/jpeg" }, { "file": "images/portfolio/resized/gop_love-qanon/200.png", "size": 21263, "type": "image/png" }, { "file": "images/portfolio/resized/gop_love-qanon/200.webp", "size": 4492, "type": "image/webp" }, { "file": "images/portfolio/resized/gop_love-qanon/400.png", "size": 56393, "type": "image/png" }, { "file": "images/portfolio/resized/gop_love-qanon/400.webp", "size": 11594, "type": "image/webp" }, { "file": "images/portfolio/resized/gop_love-qanon/600.png", "size": 96945, "type": "image/png" }, { "file": "images/portfolio/resized/gop_love-qanon/600.webp", "size": 18598, "type": "image/webp" }, { "file": "images/portfolio/resized/gop_love-qanon/800.png", "size": 142634, "type": "image/png" }, { "file": "images/portfolio/resized/gop_love-qanon/800.webp", "size": 26056, "type": "image/webp" }, { "file": "images/portfolio/resized/gop_love-qanon/blurred.jpeg", "size": 669, "type": "image/jpeg" }, { "file": "images/portfolio/resized/green-businesses/200.png", "size": 6581, "type": "image/png" }, { "file": "images/portfolio/resized/green-businesses/200.webp", "size": 1270, "type": "image/webp" }, { "file": "images/portfolio/resized/green-businesses/400.png", "size": 20252, "type": "image/png" }, { "file": "images/portfolio/resized/green-businesses/400.webp", "size": 3678, "type": "image/webp" }, { "file": "images/portfolio/resized/green-businesses/600.png", "size": 37812, "type": "image/png" }, { "file": "images/portfolio/resized/green-businesses/600.webp", "size": 6462, "type": "image/webp" }, { "file": "images/portfolio/resized/green-businesses/800.png", "size": 50370, "type": "image/png" }, { "file": "images/portfolio/resized/green-businesses/800.webp", "size": 9226, "type": "image/webp" }, { "file": "images/portfolio/resized/green-businesses/blurred.jpeg", "size": 378, "type": "image/jpeg" }, { "file": "images/portfolio/resized/homework9/200.png", "size": 16675, "type": "image/png" }, { "file": "images/portfolio/resized/homework9/200.webp", "size": 2454, "type": "image/webp" }, { "file": "images/portfolio/resized/homework9/400.png", "size": 47931, "type": "image/png" }, { "file": "images/portfolio/resized/homework9/400.webp", "size": 7520, "type": "image/webp" }, { "file": "images/portfolio/resized/homework9/600.png", "size": 75666, "type": "image/png" }, { "file": "images/portfolio/resized/homework9/600.webp", "size": 13764, "type": "image/webp" }, { "file": "images/portfolio/resized/homework9/800.png", "size": 123961, "type": "image/png" }, { "file": "images/portfolio/resized/homework9/800.webp", "size": 18976, "type": "image/webp" }, { "file": "images/portfolio/resized/homework9/blurred.jpeg", "size": 791, "type": "image/jpeg" }, { "file": "images/portfolio/resized/immigration-court-hearings/200.png", "size": 15314, "type": "image/png" }, { "file": "images/portfolio/resized/immigration-court-hearings/200.webp", "size": 3224, "type": "image/webp" }, { "file": "images/portfolio/resized/immigration-court-hearings/400.png", "size": 29365, "type": "image/png" }, { "file": "images/portfolio/resized/immigration-court-hearings/400.webp", "size": 7106, "type": "image/webp" }, { "file": "images/portfolio/resized/immigration-court-hearings/600.png", "size": 45205, "type": "image/png" }, { "file": "images/portfolio/resized/immigration-court-hearings/600.webp", "size": 11196, "type": "image/webp" }, { "file": "images/portfolio/resized/immigration-court-hearings/800.png", "size": 54389, "type": "image/png" }, { "file": "images/portfolio/resized/immigration-court-hearings/800.webp", "size": 15298, "type": "image/webp" }, { "file": "images/portfolio/resized/immigration-court-hearings/blurred.jpeg", "size": 746, "type": "image/jpeg" }, { "file": "images/portfolio/resized/influencer-database/200.png", "size": 33871, "type": "image/png" }, { "file": "images/portfolio/resized/influencer-database/200.webp", "size": 4608, "type": "image/webp" }, { "file": "images/portfolio/resized/influencer-database/400.png", "size": 121749, "type": "image/png" }, { "file": "images/portfolio/resized/influencer-database/400.webp", "size": 13990, "type": "image/webp" }, { "file": "images/portfolio/resized/influencer-database/600.png", "size": 92974, "type": "image/png" }, { "file": "images/portfolio/resized/influencer-database/600.webp", "size": 27958, "type": "image/webp" }, { "file": "images/portfolio/resized/influencer-database/800.png", "size": 352708, "type": "image/png" }, { "file": "images/portfolio/resized/influencer-database/800.webp", "size": 34938, "type": "image/webp" }, { "file": "images/portfolio/resized/influencer-database/blurred.jpeg", "size": 525, "type": "image/jpeg" }, { "file": "images/portfolio/resized/izzys-orbit/200.png", "size": 43544, "type": "image/png" }, { "file": "images/portfolio/resized/izzys-orbit/200.webp", "size": 8076, "type": "image/webp" }, { "file": "images/portfolio/resized/izzys-orbit/400.png", "size": 87561, "type": "image/png" }, { "file": "images/portfolio/resized/izzys-orbit/400.webp", "size": 17456, "type": "image/webp" }, { "file": "images/portfolio/resized/izzys-orbit/600.png", "size": 210537, "type": "image/png" }, { "file": "images/portfolio/resized/izzys-orbit/600.webp", "size": 27878, "type": "image/webp" }, { "file": "images/portfolio/resized/izzys-orbit/800.png", "size": 431854, "type": "image/png" }, { "file": "images/portfolio/resized/izzys-orbit/800.webp", "size": 36776, "type": "image/webp" }, { "file": "images/portfolio/resized/izzys-orbit/blurred.jpeg", "size": 773, "type": "image/jpeg" }, { "file": "images/portfolio/resized/joes-cabinet/200.png", "size": 35717, "type": "image/png" }, { "file": "images/portfolio/resized/joes-cabinet/200.webp", "size": 6110, "type": "image/webp" }, { "file": "images/portfolio/resized/joes-cabinet/400.png", "size": 107979, "type": "image/png" }, { "file": "images/portfolio/resized/joes-cabinet/400.webp", "size": 15740, "type": "image/webp" }, { "file": "images/portfolio/resized/joes-cabinet/600.png", "size": 203514, "type": "image/png" }, { "file": "images/portfolio/resized/joes-cabinet/600.webp", "size": 26762, "type": "image/webp" }, { "file": "images/portfolio/resized/joes-cabinet/800.png", "size": 323294, "type": "image/png" }, { "file": "images/portfolio/resized/joes-cabinet/800.webp", "size": 37494, "type": "image/webp" }, { "file": "images/portfolio/resized/joes-cabinet/blurred.jpeg", "size": 718, "type": "image/jpeg" }, { "file": "images/portfolio/resized/lgbtq-cartoons/200.png", "size": 36554, "type": "image/png" }, { "file": "images/portfolio/resized/lgbtq-cartoons/200.webp", "size": 6924, "type": "image/webp" }, { "file": "images/portfolio/resized/lgbtq-cartoons/400.png", "size": 104888, "type": "image/png" }, { "file": "images/portfolio/resized/lgbtq-cartoons/400.webp", "size": 19372, "type": "image/webp" }, { "file": "images/portfolio/resized/lgbtq-cartoons/600.png", "size": 191317, "type": "image/png" }, { "file": "images/portfolio/resized/lgbtq-cartoons/600.webp", "size": 33630, "type": "image/webp" }, { "file": "images/portfolio/resized/lgbtq-cartoons/800.png", "size": 301200, "type": "image/png" }, { "file": "images/portfolio/resized/lgbtq-cartoons/800.webp", "size": 47690, "type": "image/webp" }, { "file": "images/portfolio/resized/lgbtq-cartoons/blurred.jpeg", "size": 593, "type": "image/jpeg" }, { "file": "images/portfolio/resized/like-a-ritual/200.png", "size": 4424, "type": "image/png" }, { "file": "images/portfolio/resized/like-a-ritual/200.webp", "size": 958, "type": "image/webp" }, { "file": "images/portfolio/resized/like-a-ritual/400.png", "size": 10210, "type": "image/png" }, { "file": "images/portfolio/resized/like-a-ritual/400.webp", "size": 2358, "type": "image/webp" }, { "file": "images/portfolio/resized/like-a-ritual/600.png", "size": 17419, "type": "image/png" }, { "file": "images/portfolio/resized/like-a-ritual/600.webp", "size": 3674, "type": "image/webp" }, { "file": "images/portfolio/resized/like-a-ritual/800.png", "size": 26989, "type": "image/png" }, { "file": "images/portfolio/resized/like-a-ritual/800.webp", "size": 5358, "type": "image/webp" }, { "file": "images/portfolio/resized/like-a-ritual/blurred.jpeg", "size": 484, "type": "image/jpeg" }, { "file": "images/portfolio/resized/ninth-dem-debate/200.png", "size": 13257, "type": "image/png" }, { "file": "images/portfolio/resized/ninth-dem-debate/200.webp", "size": 3218, "type": "image/webp" }, { "file": "images/portfolio/resized/ninth-dem-debate/400.png", "size": 35247, "type": "image/png" }, { "file": "images/portfolio/resized/ninth-dem-debate/400.webp", "size": 9060, "type": "image/webp" }, { "file": "images/portfolio/resized/ninth-dem-debate/600.png", "size": 62651, "type": "image/png" }, { "file": "images/portfolio/resized/ninth-dem-debate/600.webp", "size": 15282, "type": "image/webp" }, { "file": "images/portfolio/resized/ninth-dem-debate/800.png", "size": 77789, "type": "image/png" }, { "file": "images/portfolio/resized/ninth-dem-debate/800.webp", "size": 22020, "type": "image/webp" }, { "file": "images/portfolio/resized/ninth-dem-debate/blurred.jpeg", "size": 478, "type": "image/jpeg" }, { "file": "images/portfolio/resized/nyc-recycling/200.png", "size": 20272, "type": "image/png" }, { "file": "images/portfolio/resized/nyc-recycling/200.webp", "size": 2462, "type": "image/webp" }, { "file": "images/portfolio/resized/nyc-recycling/400.png", "size": 70505, "type": "image/png" }, { "file": "images/portfolio/resized/nyc-recycling/400.webp", "size": 5646, "type": "image/webp" }, { "file": "images/portfolio/resized/nyc-recycling/600.png", "size": 134584, "type": "image/png" }, { "file": "images/portfolio/resized/nyc-recycling/600.webp", "size": 8162, "type": "image/webp" }, { "file": "images/portfolio/resized/nyc-recycling/800.png", "size": 250493, "type": "image/png" }, { "file": "images/portfolio/resized/nyc-recycling/800.webp", "size": 11616, "type": "image/webp" }, { "file": "images/portfolio/resized/nyc-recycling/blurred.jpeg", "size": 519, "type": "image/jpeg" }, { "file": "images/portfolio/resized/nyu_impd/200.png", "size": 13800, "type": "image/png" }, { "file": "images/portfolio/resized/nyu_impd/200.webp", "size": 1622, "type": "image/webp" }, { "file": "images/portfolio/resized/nyu_impd/400.png", "size": 37316, "type": "image/png" }, { "file": "images/portfolio/resized/nyu_impd/400.webp", "size": 4606, "type": "image/webp" }, { "file": "images/portfolio/resized/nyu_impd/600.png", "size": 67937, "type": "image/png" }, { "file": "images/portfolio/resized/nyu_impd/600.webp", "size": 8662, "type": "image/webp" }, { "file": "images/portfolio/resized/nyu_impd/800.png", "size": 108151, "type": "image/png" }, { "file": "images/portfolio/resized/nyu_impd/800.webp", "size": 13346, "type": "image/webp" }, { "file": "images/portfolio/resized/nyu_impd/blurred.jpeg", "size": 523, "type": "image/jpeg" }, { "file": "images/portfolio/resized/polls/200.png", "size": 9323, "type": "image/png" }, { "file": "images/portfolio/resized/polls/200.webp", "size": 2208, "type": "image/webp" }, { "file": "images/portfolio/resized/polls/400.png", "size": 22866, "type": "image/png" }, { "file": "images/portfolio/resized/polls/400.webp", "size": 4956, "type": "image/webp" }, { "file": "images/portfolio/resized/polls/600.png", "size": 39259, "type": "image/png" }, { "file": "images/portfolio/resized/polls/600.webp", "size": 8116, "type": "image/webp" }, { "file": "images/portfolio/resized/polls/800.png", "size": 54307, "type": "image/png" }, { "file": "images/portfolio/resized/polls/800.webp", "size": 10464, "type": "image/webp" }, { "file": "images/portfolio/resized/polls/blurred.jpeg", "size": 458, "type": "image/jpeg" }, { "file": "images/portfolio/resized/protestdata/200.png", "size": 20384, "type": "image/png" }, { "file": "images/portfolio/resized/protestdata/200.webp", "size": 3430, "type": "image/webp" }, { "file": "images/portfolio/resized/protestdata/400.png", "size": 56050, "type": "image/png" }, { "file": "images/portfolio/resized/protestdata/400.webp", "size": 10362, "type": "image/webp" }, { "file": "images/portfolio/resized/protestdata/600.png", "size": 98780, "type": "image/png" }, { "file": "images/portfolio/resized/protestdata/600.webp", "size": 18612, "type": "image/webp" }, { "file": "images/portfolio/resized/protestdata/800.png", "size": 135753, "type": "image/png" }, { "file": "images/portfolio/resized/protestdata/800.webp", "size": 26680, "type": "image/webp" }, { "file": "images/portfolio/resized/protestdata/blurred.jpeg", "size": 545, "type": "image/jpeg" }, { "file": "images/portfolio/resized/punk-force-header/200.png", "size": 25292, "type": "image/png" }, { "file": "images/portfolio/resized/punk-force-header/200.webp", "size": 3516, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-force-header/400.png", "size": 76574, "type": "image/png" }, { "file": "images/portfolio/resized/punk-force-header/400.webp", "size": 15618, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-force-header/600.png", "size": 131596, "type": "image/png" }, { "file": "images/portfolio/resized/punk-force-header/600.webp", "size": 30348, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-force-header/800.png", "size": 193694, "type": "image/png" }, { "file": "images/portfolio/resized/punk-force-header/800.webp", "size": 45394, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-force-header/blurred.jpeg", "size": 346, "type": "image/jpeg" }, { "file": "images/portfolio/resized/punk-header/200.png", "size": 10177, "type": "image/png" }, { "file": "images/portfolio/resized/punk-header/200.webp", "size": 1392, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-header/400.png", "size": 28535, "type": "image/png" }, { "file": "images/portfolio/resized/punk-header/400.webp", "size": 3510, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-header/600.png", "size": 32485, "type": "image/png" }, { "file": "images/portfolio/resized/punk-header/600.webp", "size": 6104, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-header/800.png", "size": 84258, "type": "image/png" }, { "file": "images/portfolio/resized/punk-header/800.webp", "size": 7714, "type": "image/webp" }, { "file": "images/portfolio/resized/punk-header/blurred.jpeg", "size": 454, "type": "image/jpeg" }, { "file": "images/portfolio/resized/q-database/200.png", "size": 37415, "type": "image/png" }, { "file": "images/portfolio/resized/q-database/200.webp", "size": 5804, "type": "image/webp" }, { "file": "images/portfolio/resized/q-database/400.png", "size": 118303, "type": "image/png" }, { "file": "images/portfolio/resized/q-database/400.webp", "size": 14002, "type": "image/webp" }, { "file": "images/portfolio/resized/q-database/600.png", "size": 230141, "type": "image/png" }, { "file": "images/portfolio/resized/q-database/600.webp", "size": 21218, "type": "image/webp" }, { "file": "images/portfolio/resized/q-database/800.png", "size": 420398, "type": "image/png" }, { "file": "images/portfolio/resized/q-database/800.webp", "size": 28526, "type": "image/webp" }, { "file": "images/portfolio/resized/q-database/blurred.jpeg", "size": 687, "type": "image/jpeg" }, { "file": "images/portfolio/resized/q-drops/200.png", "size": 35910, "type": "image/png" }, { "file": "images/portfolio/resized/q-drops/200.webp", "size": 6692, "type": "image/webp" }, { "file": "images/portfolio/resized/q-drops/400.png", "size": 109943, "type": "image/png" }, { "file": "images/portfolio/resized/q-drops/400.webp", "size": 18800, "type": "image/webp" }, { "file": "images/portfolio/resized/q-drops/600.png", "size": 102777, "type": "image/png" }, { "file": "images/portfolio/resized/q-drops/600.webp", "size": 38008, "type": "image/webp" }, { "file": "images/portfolio/resized/q-drops/800.png", "size": 337292, "type": "image/png" }, { "file": "images/portfolio/resized/q-drops/800.webp", "size": 44642, "type": "image/webp" }, { "file": "images/portfolio/resized/q-drops/blurred.jpeg", "size": 474, "type": "image/jpeg" }, { "file": "images/portfolio/resized/quakeswarm-map/200.png", "size": 49192, "type": "image/png" }, { "file": "images/portfolio/resized/quakeswarm-map/200.webp", "size": 4416, "type": "image/webp" }, { "file": "images/portfolio/resized/quakeswarm-map/400.png", "size": 192651, "type": "image/png" }, { "file": "images/portfolio/resized/quakeswarm-map/400.webp", "size": 17362, "type": "image/webp" }, { "file": "images/portfolio/resized/quakeswarm-map/600.png", "size": 420369, "type": "image/png" }, { "file": "images/portfolio/resized/quakeswarm-map/600.webp", "size": 39668, "type": "image/webp" }, { "file": "images/portfolio/resized/quakeswarm-map/800.png", "size": 732944, "type": "image/png" }, { "file": "images/portfolio/resized/quakeswarm-map/800.webp", "size": 65824, "type": "image/webp" }, { "file": "images/portfolio/resized/quakeswarm-map/blurred.jpeg", "size": 458, "type": "image/jpeg" }, { "file": "images/portfolio/resized/radial-charts/200.png", "size": 17974, "type": "image/png" }, { "file": "images/portfolio/resized/radial-charts/200.webp", "size": 3124, "type": "image/webp" }, { "file": "images/portfolio/resized/radial-charts/400.png", "size": 42471, "type": "image/png" }, { "file": "images/portfolio/resized/radial-charts/400.webp", "size": 7084, "type": "image/webp" }, { "file": "images/portfolio/resized/radial-charts/600.png", "size": 68021, "type": "image/png" }, { "file": "images/portfolio/resized/radial-charts/600.webp", "size": 10886, "type": "image/webp" }, { "file": "images/portfolio/resized/radial-charts/800.png", "size": 114030, "type": "image/png" }, { "file": "images/portfolio/resized/radial-charts/800.webp", "size": 14494, "type": "image/webp" }, { "file": "images/portfolio/resized/radial-charts/blurred.jpeg", "size": 795, "type": "image/jpeg" }, { "file": "images/portfolio/resized/reckoning_with_joppa/200.png", "size": 11957, "type": "image/png" }, { "file": "images/portfolio/resized/reckoning_with_joppa/200.webp", "size": 2224, "type": "image/webp" }, { "file": "images/portfolio/resized/reckoning_with_joppa/400.png", "size": 31052, "type": "image/png" }, { "file": "images/portfolio/resized/reckoning_with_joppa/400.webp", "size": 6270, "type": "image/webp" }, { "file": "images/portfolio/resized/reckoning_with_joppa/600.png", "size": 54875, "type": "image/png" }, { "file": "images/portfolio/resized/reckoning_with_joppa/600.webp", "size": 11290, "type": "image/webp" }, { "file": "images/portfolio/resized/reckoning_with_joppa/800.png", "size": 80782, "type": "image/png" }, { "file": "images/portfolio/resized/reckoning_with_joppa/800.webp", "size": 16232, "type": "image/webp" }, { "file": "images/portfolio/resized/reckoning_with_joppa/blurred.jpeg", "size": 474, "type": "image/jpeg" }, { "file": "images/portfolio/resized/ring-neighbors/200.png", "size": 13288, "type": "image/png" }, { "file": "images/portfolio/resized/ring-neighbors/200.webp", "size": 1712, "type": "image/webp" }, { "file": "images/portfolio/resized/ring-neighbors/400.png", "size": 37498, "type": "image/png" }, { "file": "images/portfolio/resized/ring-neighbors/400.webp", "size": 5078, "type": "image/webp" }, { "file": "images/portfolio/resized/ring-neighbors/600.png", "size": 69726, "type": "image/png" }, { "file": "images/portfolio/resized/ring-neighbors/600.webp", "size": 9130, "type": "image/webp" }, { "file": "images/portfolio/resized/ring-neighbors/800.png", "size": 111383, "type": "image/png" }, { "file": "images/portfolio/resized/ring-neighbors/800.webp", "size": 13442, "type": "image/webp" }, { "file": "images/portfolio/resized/ring-neighbors/blurred.jpeg", "size": 446, "type": "image/jpeg" }, { "file": "images/portfolio/resized/salary-database/200.png", "size": 49197, "type": "image/png" }, { "file": "images/portfolio/resized/salary-database/200.webp", "size": 7018, "type": "image/webp" }, { "file": "images/portfolio/resized/salary-database/400.png", "size": 172934, "type": "image/png" }, { "file": "images/portfolio/resized/salary-database/400.webp", "size": 18994, "type": "image/webp" }, { "file": "images/portfolio/resized/salary-database/600.png", "size": 366157, "type": "image/png" }, { "file": "images/portfolio/resized/salary-database/600.webp", "size": 33280, "type": "image/webp" }, { "file": "images/portfolio/resized/salary-database/800.png", "size": 632464, "type": "image/png" }, { "file": "images/portfolio/resized/salary-database/800.webp", "size": 52430, "type": "image/webp" }, { "file": "images/portfolio/resized/salary-database/blurred.jpeg", "size": 605, "type": "image/jpeg" }, { "file": "images/portfolio/resized/should-i-buy-a-house/200.png", "size": 14936, "type": "image/png" }, { "file": "images/portfolio/resized/should-i-buy-a-house/200.webp", "size": 2468, "type": "image/webp" }, { "file": "images/portfolio/resized/should-i-buy-a-house/400.png", "size": 34798, "type": "image/png" }, { "file": "images/portfolio/resized/should-i-buy-a-house/400.webp", "size": 6080, "type": "image/webp" }, { "file": "images/portfolio/resized/should-i-buy-a-house/600.png", "size": 84887, "type": "image/png" }, { "file": "images/portfolio/resized/should-i-buy-a-house/600.webp", "size": 10236, "type": "image/webp" }, { "file": "images/portfolio/resized/should-i-buy-a-house/800.png", "size": 196567, "type": "image/png" }, { "file": "images/portfolio/resized/should-i-buy-a-house/800.webp", "size": 14610, "type": "image/webp" }, { "file": "images/portfolio/resized/should-i-buy-a-house/blurred.jpeg", "size": 559, "type": "image/jpeg" }, { "file": "images/portfolio/resized/sotu-2020/200.png", "size": 11280, "type": "image/png" }, { "file": "images/portfolio/resized/sotu-2020/200.webp", "size": 2998, "type": "image/webp" }, { "file": "images/portfolio/resized/sotu-2020/400.png", "size": 26848, "type": "image/png" }, { "file": "images/portfolio/resized/sotu-2020/400.webp", "size": 7334, "type": "image/webp" }, { "file": "images/portfolio/resized/sotu-2020/600.png", "size": 46261, "type": "image/png" }, { "file": "images/portfolio/resized/sotu-2020/600.webp", "size": 11536, "type": "image/webp" }, { "file": "images/portfolio/resized/sotu-2020/800.png", "size": 64231, "type": "image/png" }, { "file": "images/portfolio/resized/sotu-2020/800.webp", "size": 15750, "type": "image/webp" }, { "file": "images/portfolio/resized/sotu-2020/blurred.jpeg", "size": 610, "type": "image/jpeg" }, { "file": "images/portfolio/resized/stepped-up-loophole/200.png", "size": 7293, "type": "image/png" }, { "file": "images/portfolio/resized/stepped-up-loophole/200.webp", "size": 1420, "type": "image/webp" }, { "file": "images/portfolio/resized/stepped-up-loophole/400.png", "size": 15884, "type": "image/png" }, { "file": "images/portfolio/resized/stepped-up-loophole/400.webp", "size": 3830, "type": "image/webp" }, { "file": "images/portfolio/resized/stepped-up-loophole/600.png", "size": 25401, "type": "image/png" }, { "file": "images/portfolio/resized/stepped-up-loophole/600.webp", "size": 6738, "type": "image/webp" }, { "file": "images/portfolio/resized/stepped-up-loophole/800.png", "size": 35243, "type": "image/png" }, { "file": "images/portfolio/resized/stepped-up-loophole/800.webp", "size": 9558, "type": "image/webp" }, { "file": "images/portfolio/resized/stepped-up-loophole/blurred.jpeg", "size": 314, "type": "image/jpeg" }, { "file": "images/portfolio/resized/steves-connections/200.png", "size": 52077, "type": "image/png" }, { "file": "images/portfolio/resized/steves-connections/200.webp", "size": 10186, "type": "image/webp" }, { "file": "images/portfolio/resized/steves-connections/400.png", "size": 136888, "type": "image/png" }, { "file": "images/portfolio/resized/steves-connections/400.webp", "size": 24016, "type": "image/webp" }, { "file": "images/portfolio/resized/steves-connections/600.png", "size": 251643, "type": "image/png" }, { "file": "images/portfolio/resized/steves-connections/600.webp", "size": 37312, "type": "image/webp" }, { "file": "images/portfolio/resized/steves-connections/800.png", "size": 397264, "type": "image/png" }, { "file": "images/portfolio/resized/steves-connections/800.webp", "size": 50556, "type": "image/webp" }, { "file": "images/portfolio/resized/steves-connections/blurred.jpeg", "size": 816, "type": "image/jpeg" }, { "file": "images/portfolio/resized/superyachts-animated-map/200.png", "size": 8112, "type": "image/png" }, { "file": "images/portfolio/resized/superyachts-animated-map/200.webp", "size": 830, "type": "image/webp" }, { "file": "images/portfolio/resized/superyachts-animated-map/400.png", "size": 23499, "type": "image/png" }, { "file": "images/portfolio/resized/superyachts-animated-map/400.webp", "size": 2362, "type": "image/webp" }, { "file": "images/portfolio/resized/superyachts-animated-map/600.png", "size": 43714, "type": "image/png" }, { "file": "images/portfolio/resized/superyachts-animated-map/600.webp", "size": 4408, "type": "image/webp" }, { "file": "images/portfolio/resized/superyachts-animated-map/800.png", "size": 67849, "type": "image/png" }, { "file": "images/portfolio/resized/superyachts-animated-map/800.webp", "size": 6942, "type": "image/webp" }, { "file": "images/portfolio/resized/superyachts-animated-map/blurred.jpeg", "size": 346, "type": "image/jpeg" }, { "file": "images/portfolio/resized/vaxxed-govs/200.png", "size": 19808, "type": "image/png" }, { "file": "images/portfolio/resized/vaxxed-govs/200.webp", "size": 5490, "type": "image/webp" }, { "file": "images/portfolio/resized/vaxxed-govs/400.png", "size": 38628, "type": "image/png" }, { "file": "images/portfolio/resized/vaxxed-govs/400.webp", "size": 12912, "type": "image/webp" }, { "file": "images/portfolio/resized/vaxxed-govs/600.png", "size": 58985, "type": "image/png" }, { "file": "images/portfolio/resized/vaxxed-govs/600.webp", "size": 20750, "type": "image/webp" }, { "file": "images/portfolio/resized/vaxxed-govs/800.png", "size": 82182, "type": "image/png" }, { "file": "images/portfolio/resized/vaxxed-govs/800.webp", "size": 29164, "type": "image/webp" }, { "file": "images/portfolio/resized/vaxxed-govs/blurred.jpeg", "size": 696, "type": "image/jpeg" }, { "file": "images/portfolio/resized/wsj-clocks/200.png", "size": 27187, "type": "image/png" }, { "file": "images/portfolio/resized/wsj-clocks/200.webp", "size": 3078, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj-clocks/400.png", "size": 99743, "type": "image/png" }, { "file": "images/portfolio/resized/wsj-clocks/400.webp", "size": 9004, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj-clocks/600.png", "size": 187525, "type": "image/png" }, { "file": "images/portfolio/resized/wsj-clocks/600.webp", "size": 14132, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj-clocks/800.png", "size": 349112, "type": "image/png" }, { "file": "images/portfolio/resized/wsj-clocks/800.webp", "size": 19258, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj-clocks/blurred.jpeg", "size": 446, "type": "image/jpeg" }, { "file": "images/portfolio/resized/wsj_clocks/200.png", "size": 21628, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_clocks/200.webp", "size": 3642, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_clocks/400.png", "size": 58310, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_clocks/400.webp", "size": 11348, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_clocks/600.png", "size": 107990, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_clocks/600.webp", "size": 20196, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_clocks/800.png", "size": 153442, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_clocks/800.webp", "size": 27476, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_clocks/blurred.jpeg", "size": 474, "type": "image/jpeg" }, { "file": "images/portfolio/resized/wsj_homedepot/200.png", "size": 22013, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_homedepot/200.webp", "size": 4338, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_homedepot/400.png", "size": 61393, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_homedepot/400.webp", "size": 11862, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_homedepot/600.png", "size": 109839, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_homedepot/600.webp", "size": 19094, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_homedepot/800.png", "size": 161518, "type": "image/png" }, { "file": "images/portfolio/resized/wsj_homedepot/800.webp", "size": 24276, "type": "image/webp" }, { "file": "images/portfolio/resized/wsj_homedepot/blurred.jpeg", "size": 555, "type": "image/jpeg" }, { "file": "images/portfolio/resized/zucks-hawaii/200.png", "size": 48539, "type": "image/png" }, { "file": "images/portfolio/resized/zucks-hawaii/200.webp", "size": 4532, "type": "image/webp" }, { "file": "images/portfolio/resized/zucks-hawaii/400.png", "size": 139153, "type": "image/png" }, { "file": "images/portfolio/resized/zucks-hawaii/400.webp", "size": 12072, "type": "image/webp" }, { "file": "images/portfolio/resized/zucks-hawaii/600.png", "size": 263042, "type": "image/png" }, { "file": "images/portfolio/resized/zucks-hawaii/600.webp", "size": 24342, "type": "image/webp" }, { "file": "images/portfolio/resized/zucks-hawaii/800.png", "size": 426948, "type": "image/png" }, { "file": "images/portfolio/resized/zucks-hawaii/800.webp", "size": 41004, "type": "image/webp" }, { "file": "images/portfolio/resized/zucks-hawaii/blurred.jpeg", "size": 659, "type": "image/jpeg" }, { "file": "images/portfolio/unsized/.DS_Store", "size": 6148, "type": null }, { "file": "images/portfolio/unsized/2020-dems.gif", "size": 1251328, "type": "image/gif" }, { "file": "images/portfolio/unsized/all-time-best.png", "size": 5738117, "type": "image/png" }, { "file": "images/portfolio/unsized/bernie-battered.png", "size": 60866, "type": "image/png" }, { "file": "images/portfolio/unsized/biotech-execs.png", "size": 389841, "type": "image/png" }, { "file": "images/portfolio/unsized/biotech-quiz.png", "size": 505720, "type": "image/png" }, { "file": "images/portfolio/unsized/board-genders.png", "size": 336565, "type": "image/png" }, { "file": "images/portfolio/unsized/cabinet.png", "size": 853207, "type": "image/png" }, { "file": "images/portfolio/unsized/cloudkitchens-map.png", "size": 483964, "type": "image/png" }, { "file": "images/portfolio/unsized/condegram.png", "size": 180113, "type": "image/png" }, { "file": "images/portfolio/unsized/condegram.svg", "size": 180113, "type": "image/svg+xml" }, { "file": "images/portfolio/unsized/conflicted-congress.png", "size": 260265, "type": "image/png" }, { "file": "images/portfolio/unsized/contour-map.png", "size": 436501, "type": "image/png" }, { "file": "images/portfolio/unsized/coro-per-day.png", "size": 57531, "type": "image/png" }, { "file": "images/portfolio/unsized/corona-streaming.png", "size": 57239, "type": "image/png" }, { "file": "images/portfolio/unsized/coronavirus-animated-map.png", "size": 49915, "type": "image/png" }, { "file": "images/portfolio/unsized/emissions.png", "size": 96550, "type": "image/png" }, { "file": "images/portfolio/unsized/esports-winners.png", "size": 214710, "type": "image/png" }, { "file": "images/portfolio/unsized/georgia-legislative-roadmap.gif", "size": 162381, "type": "image/gif" }, { "file": "images/portfolio/unsized/gop_love-qanon.png", "size": 133004, "type": "image/png" }, { "file": "images/portfolio/unsized/green-businesses.png", "size": 20106, "type": "image/png" }, { "file": "images/portfolio/unsized/homework9.png", "size": 50221, "type": "image/png" }, { "file": "images/portfolio/unsized/immigration-court-hearings.gif", "size": 96080, "type": "image/gif" }, { "file": "images/portfolio/unsized/immigration-court-hearings.png", "size": 19922, "type": "image/png" }, { "file": "images/portfolio/unsized/influencer-database.gif", "size": 721611, "type": "image/gif" }, { "file": "images/portfolio/unsized/izzys-orbit.png", "size": 381003, "type": "image/png" }, { "file": "images/portfolio/unsized/joes-cabinet.png", "size": 429508, "type": "image/png" }, { "file": "images/portfolio/unsized/lgbtq-cartoons.png", "size": 913601, "type": "image/png" }, { "file": "images/portfolio/unsized/like-a-ritual.png", "size": 89059, "type": "image/png" }, { "file": "images/portfolio/unsized/ninth-dem-debate.png", "size": 42807, "type": "image/png" }, { "file": "images/portfolio/unsized/nyc-recycling.gif", "size": 960141, "type": "image/gif" }, { "file": "images/portfolio/unsized/nyu_impd.png", "size": 87775, "type": "image/png" }, { "file": "images/portfolio/unsized/polls.png", "size": 68220, "type": "image/png" }, { "file": "images/portfolio/unsized/protestdata.png", "size": 87414, "type": "image/png" }, { "file": "images/portfolio/unsized/punk-force-header.gif", "size": 3519845, "type": "image/gif" }, { "file": "images/portfolio/unsized/punk-header.gif", "size": 1699343, "type": "image/gif" }, { "file": "images/portfolio/unsized/q-database.gif", "size": 139817, "type": "image/gif" }, { "file": "images/portfolio/unsized/q-drops.gif", "size": 1217211, "type": "image/gif" }, { "file": "images/portfolio/unsized/quakeswarm-map.png", "size": 972770, "type": "image/png" }, { "file": "images/portfolio/unsized/radial-charts.png", "size": 32457, "type": "image/png" }, { "file": "images/portfolio/unsized/reckoning_with_joppa.png", "size": 53829, "type": "image/png" }, { "file": "images/portfolio/unsized/ring-neighbors.gif", "size": 1939644, "type": "image/gif" }, { "file": "images/portfolio/unsized/salary-database.png", "size": 5783941, "type": "image/png" }, { "file": "images/portfolio/unsized/should-i-buy-a-house.png", "size": 243740, "type": "image/png" }, { "file": "images/portfolio/unsized/sotu-2020.png", "size": 27291, "type": "image/png" }, { "file": "images/portfolio/unsized/stepped-up-loophole.png", "size": 91567, "type": "image/png" }, { "file": "images/portfolio/unsized/steves-connections.png", "size": 487002, "type": "image/png" }, { "file": "images/portfolio/unsized/superyachts-animated-map.gif", "size": 100633, "type": "image/gif" }, { "file": "images/portfolio/unsized/vaxxed-govs.png", "size": 34959, "type": "image/png" }, { "file": "images/portfolio/unsized/wsj-clocks.gif", "size": 312158, "type": "image/gif" }, { "file": "images/portfolio/unsized/wsj_clocks.gif", "size": 3282880, "type": "image/gif" }, { "file": "images/portfolio/unsized/wsj_homedepot.png", "size": 143913, "type": "image/png" }, { "file": "images/portfolio/unsized/zucks-hawaii.png", "size": 2403904, "type": "image/png" }, { "file": "images/rickroll.gif", "size": 2190760, "type": "image/gif" }, { "file": "images/rickroll.webp", "size": 932578, "type": "image/webp" }, { "file": "images/share.png", "size": 501963, "type": "image/png" }, { "file": "images/site/.DS_Store", "size": 6148, "type": null }, { "file": "images/site/chunkie_cursor.png", "size": 3410, "type": "image/png" }, { "file": "images/site/favicon/android-chrome-192x192.png", "size": 57078, "type": "image/png" }, { "file": "images/site/favicon/android-chrome-512x512.png", "size": 244619, "type": "image/png" }, { "file": "images/site/favicon/apple-touch-icon.png", "size": 51048, "type": "image/png" }, { "file": "images/site/favicon/favicon-16x16.png", "size": 1040, "type": "image/png" }, { "file": "images/site/favicon/favicon-32x32.png", "size": 3266, "type": "image/png" }, { "file": "images/site/favicon/favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "images/site/favicon/site.webmanifest", "size": 263, "type": "application/manifest+json" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/awards\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/awards/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/post\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/post/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/api\/lead-graphics\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return leadGraphics_json;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/awards\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return awards_json;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/meta\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return meta_json;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/clips\/([^/]+?)\.json$/,
      params: (m2) => ({ projectType: d(m2[1]) }),
      load: () => Promise.resolve().then(function() {
        return _projectType__json;
      })
    },
    {
      type: "endpoint",
      pattern: /^\/api\/post\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$3;
  }),
  "src/routes/awards/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/about/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/post/index.svelte": () => Promise.resolve().then(function() {
    return index;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-e7ef4e54.js", "css": ["assets/pages/__layout.svelte-c71e2e5c.css"], "js": ["pages/__layout.svelte-e7ef4e54.js", "chunks/vendor-cee67bc9.js", "chunks/Nav-b16348c2.js", "chunks/stores-d263d1dc.js"], "styles": [] }, "src/routes/__error.svelte": { "entry": "pages/__error.svelte-247dcf84.js", "css": [], "js": ["pages/__error.svelte-247dcf84.js", "chunks/vendor-cee67bc9.js", "chunks/Meta-a83311b0.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-b3272b85.js", "css": ["assets/pages/index.svelte-52264b22.css"], "js": ["pages/index.svelte-b3272b85.js", "chunks/vendor-cee67bc9.js", "chunks/Meta-a83311b0.js", "chunks/stores-d263d1dc.js", "chunks/Footer-492750fc.js"], "styles": [] }, "src/routes/awards/index.svelte": { "entry": "pages/awards/index.svelte-00fbd737.js", "css": [], "js": ["pages/awards/index.svelte-00fbd737.js", "chunks/vendor-cee67bc9.js", "chunks/Meta-a83311b0.js", "chunks/Footer-492750fc.js"], "styles": [] }, "src/routes/about/index.svelte": { "entry": "pages/about/index.svelte-50826a9d.js", "css": ["assets/pages/about/index.svelte-da24d5de.css"], "js": ["pages/about/index.svelte-50826a9d.js", "chunks/vendor-cee67bc9.js"], "styles": [] }, "src/routes/post/index.svelte": { "entry": "pages/post/index.svelte-392f5be3.js", "css": ["assets/pages/post/index.svelte-854c52ab.css"], "js": ["pages/post/index.svelte-392f5be3.js", "chunks/vendor-cee67bc9.js", "chunks/Meta-a83311b0.js", "chunks/Footer-492750fc.js", "chunks/Nav-b16348c2.js", "chunks/stores-d263d1dc.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var data = [
  {
    title: "Conflicted Congress",
    description: "Led front-end and back-end development peering into the financial transparency of members of Congress",
    date: "2021-12",
    tags: "SvelteKit,D3,Node",
    link: "https://www.businessinsider.com/financial-conflicts-congress-members-rated-2021-12",
    img: "conflicted-congress",
    alt: "A seating chart of the House of Representatives and the Senate facing each other. The dots are colored green, yellow and red according to the rating of each member of Congress.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "TRUE"
  },
  {
    title: "Zuck's Hawai\u02BBi",
    description: "An investigation featuring drone footage, maps, charts & soundbites",
    date: "2021-11",
    tags: "Svelte,D3,Layercake,Multimedia",
    link: "https://www.businessinsider.com/mark-zuckerberg-kauai-estate-hawaii-land-appropriation-history-2021-11",
    img: "zucks-hawaii",
    alt: "A portrait of Mark Zuckerberg with native foliage behind",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "TRUE"
  },
  {
    title: "Esports Winners",
    description: "Who's winning what in the esports world",
    date: "2021-11",
    tags: "Svelte,D3,Tweens",
    link: "https://www.businessinsider.com/esports-database-top-teams-prize-money-titles-2021-10",
    img: "esports-winners",
    alt: "A bubble chart of top esports teams, sized according to who has won the most awards",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Buy a House",
    description: "Wielding RedFin and Zillow data to ask if you should buy a house",
    date: "2021-10",
    tags: "Svelte,API",
    link: "https://www.businessinsider.com/should-i-buy-a-house-quiz-2021-10",
    img: "should-i-buy-a-house",
    alt: "A screenshot of the quiz with the five questions shown, including credit score, salary, debt, county and desired bedrooms",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Insider Reviews",
    description: "An updating list of Insider Reviews' fav products",
    date: "2021-10",
    tags: "Svelte",
    link: "https://www.businessinsider.com/insider-reviews-all-time-best-products",
    img: "all-time-best",
    alt: "A grid of products included on the site, centered around the name of the site.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Salary database",
    description: "Wrangling 250,000 salaries into a readable database",
    date: "2021-09",
    tags: "Svelte,SPA,Python",
    link: "https://www.businessinsider.com/salary-database-google-goldman-amazon-how-much-top-jobs-pay-2021-7",
    img: "salary-database",
    alt: "A few company names included in the database",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "BioTech Quiz",
    description: "A quirky quiz to highlight pay disparity in the biotech industry",
    date: "2021-08",
    tags: "Svelte,Layercake",
    link: "https://www.businessinsider.com/quiz-salaries-compensation-biotech-and-pharmaceutical-companies-2021-8",
    img: "biotech-quiz",
    alt: "A screenshot of the fifth question of the quiz, asking how many employees it takes to reach the salary of Regeneron CEO Leonard Schleifer",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Vaxxed Govs",
    description: "A cartogram to track which governors are vaccinated and how it stacks up against CDC case data",
    date: "2021-06",
    tags: "Svelte,API",
    link: "https://www.businessinsider.com/governors-vaccinated-vaccine-hesitancy-free-beer-2021-5",
    img: "vaxxed-govs",
    alt: "A small-multiple cartogram showing all states have vaccinated governors",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "LGBTQ+ Cartoons",
    description: "A multi-page site displaying the rise in LGBTQ+ characters in cartoons",
    date: "2021-05",
    tags: "Svelte,DataWrapper",
    link: "https://www.insider.com/lgbtq-cartoon-characters-kids-database-2021-06?page=explore-database",
    img: "lgbtq-cartoons",
    alt: "The hero section of the page featuring a line-up of characters Insider confirmed as LGBTQ+",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Steve's Connections",
    description: "Steve Cohen's sphere of influence",
    date: "2021-05",
    tags: "Svelte,D3",
    link: "https://www.businessinsider.com/steve-cohen-point72-sac-network-alumni-hedge-fund-founders-spinoffs-2021-4",
    img: "steves-connections",
    alt: "A picture of Steve Cohen surrounded by dots indicating hedge funds sprung up around him.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Like a Ritual",
    description: "Why Title Fight deserved better from fans and critics via Spotify data",
    date: "2021-01",
    tags: "D3,API,Audio",
    link: "https://like-a-ritual.netlify.app/",
    img: "like-a-ritual",
    alt: "A partial screencap of a barchart in the site",
    publication: "Side project",
    type: "graphics",
    lead: "TRUE",
    pinned: "TRUE"
  },
  {
    title: "Ghost Kitchens",
    description: "Mapping out CloudKitchens and REEF locations",
    date: "2021-01",
    tags: "D3",
    link: "https://www.businessinsider.com/map-where-travis-kalanicks-cloudkitchen-and-reef-have-ghost-kitchens-2020-12",
    img: "cloudkitchens-map",
    alt: "Mapping out CloudKitchens and REEF locations",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Gender Diversity",
    description: "Gender diversity on the boards of pre-IPO companies",
    date: "2021-01",
    tags: "D3",
    link: "https://www.businessinsider.com/board-diversity-biggest-private-companies-unicorns-ipos-gender-women-2020-12",
    img: "board-genders",
    alt: "A visual database of Joe Biden's cabinet picks",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Georgia's Run-off",
    description: "Legislative issues to be determined by Georgia's Senate race",
    date: "2021-01",
    tags: "D3",
    link: "https://www.businessinsider.com/congress-georgia-runoffs-senate-majority-mcconnell-schumer-legislation2020-12",
    img: "georgia-legislative-roadmap",
    alt: "Legislative issues that will be determined by Georgia's Senate race",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Joe's Cabinet",
    description: "A visual database of Joe Biden's cabinet",
    date: "2021-01",
    tags: "Svelte",
    link: "https://www.businessinsider.com/joe-biden-cabinet-white-house-staff-transition-president-elect-administration-2020-11",
    img: "cabinet",
    alt: "A visual database of Joe Biden's cabinet picks",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Q's Supporters",
    description: "A visual database of QAnon supporters",
    date: "2020-12",
    tags: "D3",
    link: "https://www.businessinsider.com/qanon-searchable-database-people-2020-12",
    img: "q-database",
    alt: "A visual database of QAnon supporters",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Influencer Agents",
    description: "A database of influencer agents and managers",
    date: "2020-11",
    tags: "D3",
    link: "https://www.businessinsider.com/top-influencer-agents-managers-database-youtube-instagram-tiktok-2020-6",
    img: "influencer-database",
    alt: "A database of influencer agents and managers",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Q Drops",
    description: "A timeline of Q's first 5,000 drops",
    date: "2020-11",
    tags: "D3",
    link: "https://www.businessinsider.com/every-qanon-message-q-drop-analyzed-2020-10",
    img: "q-drops",
    alt: "A timeline chart of Q's first 5,000 drops.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "COVID Condegram",
    description: "A radial bar chart with COVID-19 data",
    date: "2020-12",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/condegram",
    img: "condegram",
    alt: "A spiral histogram showing the rise in COVID-19 cases.",
    publication: "Observable",
    type: "graphics",
    lead: "TRUE",
    pinned: "TRUE"
  },
  {
    title: "Biotech Sell Offs",
    description: "Packed bubble chart showing stock sold from biotech executives",
    date: "2020-10",
    tags: "D3",
    link: "https://www.businessinsider.com/pharma-executives-selling-company-stock-amid-covid-19-pandemic-2020-10",
    img: "biotech-execs",
    alt: "A packed bubble chart showing biotech executives who have sold off steck.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Izzy's Orbit",
    description: "A force-directed chart on the influence of hedge-fund behemoth Millennium",
    date: "2020-10",
    tags: "D3",
    link: "https://www.businessinsider.com/millennium-israel-izzy-englander-network-family-tree-alumni-hedge-fund-2020-10",
    img: "izzys-orbit",
    alt: "A force-directed chart on the influence of Millennium",
    publication: "Business Insider",
    type: "graphics",
    lead: "FALSE",
    pinned: "FALSE"
  },
  {
    title: "The GOP & QAnon",
    description: "Visualizing QAnon-related tweets from GOP and conservative personalities",
    date: "2020-10",
    tags: "D3",
    link: "https://www.businessinsider.com/how-qanon-infiltrated-the-gop-2020-10",
    img: "gop_love-qanon",
    alt: "A bubble timeline chart showing tweets sized by the number of retweets around the time of Trump's impeachment.",
    publication: "Business Insider",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Joppa",
    description: "A special on how Dallas has neglected a freedman's town",
    date: "2020-09",
    tags: "Development",
    link: "https://www.dallasnews.com/joppa",
    img: "reckoning_with_joppa",
    alt: "Screengrab of the Reckoning With Joppa home page.",
    publication: "The Dallas Morning News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Police Complaints",
    description: "How Indianapolis Police Department's few bad apples spoil the bunch",
    date: "2020-09",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/impds-complaints-allegations-and-demographics",
    img: "nyu_impd",
    alt: "A Sankey diagram of IMPD officer races and the racial breakdown of the complaints against them.",
    publication: "NYU Criminal Justice Lab",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Internet Usage",
    description: "Scrollytelling radial-chart clocks on how internet usage patterns have been disrupted",
    date: "2020-08",
    tags: "D3",
    link: "https://www.wsj.com/articles/coronavirus-lockdown-tested-internets-backbone-11597503600",
    img: "wsj-clocks",
    alt: "Internet usage skyrocketed during the pandemic.",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Home Economics",
    description: "A small-multiple cartogram that showcases Home Depot's boom in foot traffic",
    date: "2020-08",
    tags: "D3",
    link: "https://www.wsj.com/articles/home-depot-covid-coronavirus-home-improvement-lockdowns-stimulus-check-remodel-11597426959",
    img: "wsj_homedepot",
    alt: "Home Depot had a boom in foot traffic as stay-at-home orders went into effect.",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Quake Swarm",
    description: "How A.I. uncovered secrets about a flurry of earthquakes in California",
    date: "2020-06",
    tags: "QGIS,D3",
    link: "https://www.wsj.com/articles/artificial-intelligence-helps-to-decode-mysterious-earthquake-swarms-11592998200",
    img: "quakeswarm-map",
    alt: "Map of earthquakes in southern California.",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Warming Up",
    description: "Projected CO2 emissions and how the coronavirus could change things",
    date: "2020-07",
    tags: "D3,Illustrator",
    link: "https://www.wsj.com/articles/covid-19s-environmental-benefits-evaporate-as-world-reopens-11594290145",
    img: "emissions",
    alt: "Projected CO2 emissions.",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Small Slice",
    description: "How the world is funding sustainable enterprises amid the pandemic",
    date: "2020-07",
    tags: "Illustrator",
    link: "https://www.wsj.com/articles/governments-eye-a-green-economic-recovery-some-industries-arent-convinced-11594113028",
    img: "green-businesses",
    alt: "How the world's top 50 economies are funding green enterprises",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Protest Data",
    description: "Simplifying how political groups serve protestors ads based on geofencing",
    date: "2020-06",
    tags: "ai2html",
    link: "https://www.wsj.com/articles/how-political-groups-are-harvesting-data-from-protesters-11592156142?mod=mhp",
    img: "protestdata",
    alt: "Flow chart of how political groups serve protestors ads based on geoencing.",
    publication: "The Wall Street Journal",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Superyachts",
    description: "Mapping how superyachts fled back to the U.S. after ports closed",
    date: "2020-05",
    tags: "D3",
    link: "https://www.nbcnews.com/news/us-news/yachting-crowd-was-gearing-booming-2020-sailing-season-then-coronavirus-n1202231",
    img: "superyachts-animated-map",
    alt: "Animated map of boats moving from the Caribbean to mainland USA.",
    publication: "NBC News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Contour Density Maps",
    description: "A walkthrough on how to create a contour density map",
    date: "2020-05",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/contour-density-map-walkthrough",
    img: "contour-map",
    alt: "A walkthrough on how to create a contour density map",
    publication: "Observable",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "COVID's Spread",
    description: "Visualizing the spread of confirmed cases and deaths using a choropleth",
    date: "2020-03",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/coronavirus-cases-per-county",
    img: "coronavirus-animated-map",
    alt: "Gif of a map of the us cases",
    publication: "Observable",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Zero Waste",
    description: "Data on why NYC's dreams to cut its waste to nil by 2030 won't come true",
    date: "2020-03",
    tags: "D3",
    link: "https://nyc-recycling.netlify.com",
    img: "nyc-recycling",
    alt: "Gif of a map of new york",
    publication: "Columbia University",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Domestic Surveillance",
    description: "The spread of law partnerships between law enforcement agency and Amazon Ring",
    date: "2020-02",
    tags: "Leaflet",
    link: "https://www.nbcnews.com/news/all/cute-videos-little-evidence-police-say-amazon-ring-isn-t-n1136026",
    img: "ring-neighbors",
    alt: "Gif of police departmnets partnering with Ring surveillance",
    publication: "NBC News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Coronavirus Tracker",
    description: "Auto-updating histogram tracking new coronavirus cases in the U.S. per day",
    date: "2020-03",
    tags: "D3",
    link: "https://www.nbcnews.com/health/health-news/coronavirus-numbers-new-cases-2020-n1157271",
    img: "coro-per-day",
    alt: "bar chart of new coronavirus cases in the U.S. per day",
    publication: "NBC News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Is Punk Dead?",
    description: "How Spotify's punk playlists forget the genre's forefathers",
    date: "2019-11",
    tags: "D3",
    link: "https://sawyerclick.github.io/punk/",
    img: "punk-header",
    alt: "Gif of my punk project",
    publication: "Columbia University",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Quarantine Streaming",
    description: "Visualizing the coronavirus bump for streaming services",
    date: "2020-03",
    tags: "D3",
    link: "https://www.nbcnews.com/tech/internet/coronavirus-pandemic-drove-life-online-it-may-never-return-n1169956",
    img: "corona-streaming",
    alt: "small multiple of coronavirus bump for streaming services",
    publication: "NBC News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Tax Loophole",
    description: "The projected revenue loss from a century-old tax loophole",
    date: "2020-03",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/stepped-up-loophole-predictions",
    img: "stepped-up-loophole",
    alt: "The projected revenue loss from a century-old tax loophole",
    publication: "Observable",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "2020's Dem. candidates",
    description: "Following some 2020 Dem. candidates around the country via their Facebook events",
    date: "2019-07",
    tags: "Mapbox",
    link: "https://sawyerclick.github.io/2020-dems/",
    img: "2020-dems",
    alt: "Screengrab of the Mapbox portion of the page",
    publication: "Columbia University",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Immigration Court",
    description: "Immigration court hearings by the medium through which they are presided over",
    date: "2020-02",
    tags: "D3",
    link: "https://observablehq.com/@sawyerclick/hearing-types-in-immigration-courts-for-fy2020s-1st-quarte",
    img: "immigration-court-hearings",
    alt: "Gif of my immigration court hearings",
    publication: "Observable",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "State of the Union",
    description: "How long President Trump spent on topics during 2020's State of the Union address",
    date: "2020-02",
    tags: "D3",
    link: "https://www.nbcnews.com/politics/donald-trump/state-union-visualized-graphics-donald-trump-2020-n1130451",
    img: "sotu-2020",
    alt: "Circle force plot of topics trump spoke on",
    publication: "NBC News",
    type: "graphics",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Debate Live Blog",
    description: "Live blogging interesting attack stats from the ninth Dem. debate",
    date: "2020-02",
    tags: "live blog",
    link: "https://www.nbcnews.com/politics/2020-election/live-blog/south-carolina-democratic-debate-live-updates-candidates-face-charleston-n1141666/ncrd1143231#liveBlogHeader",
    img: "images/bernie-battered",
    alt: "chart showing how much bernie was attacked during the ninth dem debate",
    publication: "NBC News",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Fare Court",
    description: "A day spent with those trapped at fare evasion court in Brooklyn",
    date: "2019-08",
    tags: "Investigation",
    link: "https://medium.com/transit-new-york/an-afternoon-at-the-fare-beaters-court-720ee694e757",
    img: "https://miro",
    alt: "Alfonso Washington at fare evasion court",
    publication: "Transit",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Rogue Trains",
    description: "Covering the rogue F train's controversial schedule",
    date: "2019-07",
    tags: "Investigation",
    link: "https://medium.com/transit-new-york/mta-makes-rogue-f-express-official-871c948952f8",
    img: "https://miro",
    alt: "An F train pulls into Smith-9th Street station, which will be skipped during the train\u2019s express route",
    publication: "Transit",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "TPUSA Allegations",
    description: "An investigation I led uncovering TXST student government's ties to Turning Point USA. The president later resigned because of the story",
    date: "2018-08",
    tags: "Investigation",
    link: "https://universitystar.com/25470/news/allegations-against-president-boreing-reveal-student-government-trend-of-tpusa-affiliation/",
    img: "words/tpusa-allegations/tpusa-allegations",
    alt: "Sen. Eli Miller alleging Pres. Brooklyn Boreing's connections.",
    publication: "University Star",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "campus hate",
    description: "An investigation I led uncovering the white supremacist group haunting Texas State University",
    date: "2019-10",
    tags: "d3",
    link: "https://universitystar.com/24796/news/former-student-found-with-ties-to-white-supremacy-flyers-on-campus/",
    img: "words/white-supremacy-on-campus/campusFlyers",
    alt: "Twitter screenshot of a former TXST student posting white supremacist flyers on campus",
    publication: "University Star",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Apartment Fire",
    description: "Covering the deadly Iconic Village fire in San Marcos. Ranked 17th nationally for a breaking news Hearst Award",
    date: "2018-07",
    tags: "Breaking News",
    link: "https://universitystar.com/25269/news/fire-at-iconic-village-apartments/",
    img: "words/san-marcos-fire/fire",
    alt: "San Marcos' Iconic Village apartments burning in July 2018.",
    publication: "University Star",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Service Fees",
    description: "Detailing the ballooning student service fee revenue at Texas State and it's refusal to fund student services",
    date: "2018-10",
    tags: "Financial",
    link: "https://universitystar.com/26231/news/student-service-fee-balloons-to-all-time-high/",
    img: "words/student-service-fee/jck",
    alt: "The J.C. Kellam Administration Building at Texas State University",
    publication: "University Star",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Save the Church",
    description: "Profiling San Marcos' fight to get funding for a historic black church facing destruction and gentrification",
    date: "2018-10",
    tags: "Community",
    link: "https://universitystar.com/26501/news/community-rallies-to-save-historic-old-first-baptist-church/",
    img: "words/church/church",
    alt: "The Old First Baptist Church in San Marcos, Texas",
    publication: "University Star",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  },
  {
    title: "Road to Recovery",
    description: "A freelance feature piece covering a college student's road to recovery after a deadly apartment fire",
    date: "2018-08",
    tags: "Feature",
    link: "https://www.inforney.com/education/north-forney-alum-starts-over-after-deadly-san-marcos-fire/article_361315a0-9e7d-11e8-8a72-4fd307f74c0c.html",
    img: "words/branson-fairbrother/branson_fairbrother",
    alt: "Branson Fairbrother in his new home.",
    publication: "In Forney",
    type: "words",
    lead: "TRUE",
    pinned: "FALSE"
  }
];
var affiliations = new Map([
  ["Business Insider", "bi"],
  ["NBC News", "nbc"],
  ["The Wall Street Journal", "wsj"]
]);
var formatted = data.map((d2) => ({
  slug: (0, import_slugify.default)(d2.title, { lowercase: true }),
  affiliation: affiliations.get(d2.publication) || "side-project",
  ...d2
}));
var projects = formatted;
var get$5 = async () => {
  const pinned = projects.filter(({ pinned: pinned2 }) => pinned2 === "TRUE");
  const recent = projects.filter(({ lead, img, type, pinned: pinned2 }) => pinned2 === "FALSE" && type === "graphics" && lead === "TRUE" && img);
  return { body: { pinned, recent } };
};
var leadGraphics_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$5
});
var awards = [
  {
    awardLink: "https://www.deadlineclub.org/2021-awards-winners/",
    awardName: "The Deadline Club's Newspaper or Digital Enterprise Reporting",
    projectLink: "https://www.nbcnews.com/specials/h2a-visa-program-for-farmworkers-surging-under-trump-and-labor-violations/",
    projectName: "Lured to America \u2013 Then Trapped"
  },
  {
    awardLink: "https://pudding.cool/process/pudding-cup-2020/",
    awardName: "The Pudding's Pudding Cup 2020, Honorable Mention",
    projectLink: "https://sawyerclick.github.io/punk/",
    projectName: "Is Punk Dead?"
  },
  {
    awardLink: "https://www.amazon.com/Storm-Upon-Us-Conspiracy-Everything/dp/1612199291",
    awardName: "Mike Rothschild's The Storm Is Upon Us: How QAnon Became a Movement, Cult, and Conspiracy Theory of Everything",
    projectLink: "https://www.businessinsider.com/every-qanon-message-q-drop-analyzed-2020-10",
    projectName: "We analyzed every message ever posted by 'Q,' the enigmatic persona that started the QAnon conspiracy theory"
  }
];
var get$4 = async () => {
  return { body: awards };
};
var awards_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$4
});
var meta = {
  title: "Sawyer Click",
  description: "A newsroom developer working on data-driven visual and interactive storytelling",
  img: "images/share.png",
  slug: ""
};
var get$3 = async () => {
  return {
    body: meta
  };
};
var meta_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$3
});
var get$2 = async ({ params }) => {
  const { projectType } = params;
  const body = projects.filter(({ type }) => type === projectType);
  return { body };
};
var _projectType__json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$2
});
function indentString(string2, count = 1, options2 = {}) {
  const {
    indent = " ",
    includeEmptyLines = false
  } = options2;
  if (typeof string2 !== "string") {
    throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof string2}\``);
  }
  if (typeof count !== "number") {
    throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
  }
  if (count < 0) {
    throw new RangeError(`Expected \`count\` to be at least 0, got \`${count}\``);
  }
  if (typeof indent !== "string") {
    throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof indent}\``);
  }
  if (count === 0) {
    return string2;
  }
  const regex = includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
  return string2.replace(regex, indent.repeat(count));
}
function escapeStringRegexp(string2) {
  if (typeof string2 !== "string") {
    throw new TypeError("Expected a string");
  }
  return string2.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
var extractPathRegex = /\s+at.*[(\s](.*)\)?/;
var pathRegex = /^(?:(?:(?:node|node:[\w/]+|(?:(?:node:)?internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)(?:\.js)?:\d+:\d+)|native)/;
var homeDir = typeof import_os.default.homedir === "undefined" ? "" : import_os.default.homedir().replace(/\\/g, "/");
function cleanStack(stack, { pretty = false, basePath } = {}) {
  const basePathRegex = basePath && new RegExp(`(at | \\()${escapeStringRegexp(basePath.replace(/\\/g, "/"))}`, "g");
  if (typeof stack !== "string") {
    return void 0;
  }
  return stack.replace(/\\/g, "/").split("\n").filter((line) => {
    const pathMatches = line.match(extractPathRegex);
    if (pathMatches === null || !pathMatches[1]) {
      return true;
    }
    const match = pathMatches[1];
    if (match.includes(".app/Contents/Resources/electron.asar") || match.includes(".app/Contents/Resources/default_app.asar")) {
      return false;
    }
    return !pathRegex.test(match);
  }).filter((line) => line.trim() !== "").map((line) => {
    if (basePathRegex) {
      line = line.replace(basePathRegex, "$1");
    }
    if (pretty) {
      line = line.replace(extractPathRegex, (m2, p1) => m2.replace(p1, p1.replace(homeDir, "~")));
    }
    return line;
  }).join("\n");
}
var cleanInternalStack = (stack) => stack.replace(/\s+at .*aggregate-error\/index.js:\d+:\d+\)?/g, "");
var AggregateError = class extends Error {
  constructor(errors) {
    if (!Array.isArray(errors)) {
      throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
    }
    errors = errors.map((error2) => {
      if (error2 instanceof Error) {
        return error2;
      }
      if (error2 !== null && typeof error2 === "object") {
        return Object.assign(new Error(error2.message), error2);
      }
      return new Error(error2);
    });
    let message = errors.map((error2) => {
      return typeof error2.stack === "string" ? cleanInternalStack(cleanStack(error2.stack)) : String(error2);
    }).join("\n");
    message = "\n" + indentString(message, 4);
    super(message);
    __privateAdd(this, _errors, void 0);
    __publicField(this, "name", "AggregateError");
    __privateSet(this, _errors, errors);
  }
  get errors() {
    return __privateGet(this, _errors).slice();
  }
};
_errors = new WeakMap();
async function pMap(iterable, mapper, {
  concurrency = Number.POSITIVE_INFINITY,
  stopOnError = true
} = {}) {
  return new Promise((resolve2, reject_) => {
    if (iterable[Symbol.iterator] === void 0 && iterable[Symbol.asyncIterator] === void 0) {
      throw new TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof iterable})`);
    }
    if (typeof mapper !== "function") {
      throw new TypeError("Mapper function is required");
    }
    if (!((Number.isSafeInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
    }
    const result = [];
    const errors = [];
    const skippedIndexesMap = new Map();
    let isRejected = false;
    let isResolved = false;
    let isIterableDone = false;
    let resolvingCount = 0;
    let currentIndex = 0;
    const iterator = iterable[Symbol.iterator] === void 0 ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
    const reject = (reason) => {
      isRejected = true;
      isResolved = true;
      reject_(reason);
    };
    const next = async () => {
      if (isResolved) {
        return;
      }
      const nextItem = await iterator.next();
      const index2 = currentIndex;
      currentIndex++;
      if (nextItem.done) {
        isIterableDone = true;
        if (resolvingCount === 0 && !isResolved) {
          if (!stopOnError && errors.length > 0) {
            reject(new AggregateError(errors));
            return;
          }
          isResolved = true;
          if (!skippedIndexesMap.size) {
            resolve2(result);
            return;
          }
          const pureResult = [];
          for (const [index3, value] of result.entries()) {
            if (skippedIndexesMap.get(index3) === pMapSkip) {
              continue;
            }
            pureResult.push(value);
          }
          resolve2(pureResult);
        }
        return;
      }
      resolvingCount++;
      (async () => {
        try {
          const element = await nextItem.value;
          if (isResolved) {
            return;
          }
          const value = await mapper(element, index2);
          if (value === pMapSkip) {
            skippedIndexesMap.set(index2, value);
          }
          result[index2] = value;
          resolvingCount--;
          await next();
        } catch (error2) {
          if (stopOnError) {
            reject(error2);
          } else {
            errors.push(error2);
            resolvingCount--;
            try {
              await next();
            } catch (error3) {
              reject(error3);
            }
          }
        }
      })();
    };
    (async () => {
      for (let index2 = 0; index2 < concurrency; index2++) {
        try {
          await next();
        } catch (error2) {
          reject(error2);
          break;
        }
        if (isIterableDone || isRejected) {
          break;
        }
      }
    })();
  });
}
var pMapSkip = Symbol("skip");
async function get$1() {
  const modules = Object.entries({});
  const posts = await pMap(modules, async ([filename, module2]) => {
    const { metadata } = await module2();
    return {
      ...metadata,
      slug: (0, import_path.basename)(filename, ".svelte.md")
    };
  });
  posts.sort((a2, b) => new Date(a2.date) > new Date(b.date) ? -1 : 1);
  return {
    body: { posts }
  };
}
var index_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set2(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set2(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set2) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set: set2, update, subscribe: subscribe2 };
}
var hasNav = writable(false);
var theme = writable("dark");
theme.subscribe((value) => {
});
var lazyloader = writable(null, (set2) => {
  const lazyLoadCb = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.target.tagName === "IMG") {
        if (entry.isIntersecting && entry.target.srcset !== entry.target.dataset.srcset) {
          entry.target.srcset = entry.target.dataset.srcset;
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      } else if (entry.target.tagName === "VIDEO") {
        if (entry.isIntersecting && entry.target.poster !== entry.target.dataset.poster) {
          const children = [...entry.target.children];
          entry.target.poster = entry.target.dataset.poster;
          children.forEach((child) => {
            child.src = child.dataset.src;
          });
          entry.target.load();
          observer.unobserve(entry.target);
        }
      } else if (entry.target.tagName === "IFRAME") {
        if (entry.isIntersecting && entry.target.src !== entry.target.dataset.src) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      }
    });
  };
  if (typeof window !== "undefined")
    set2(new IntersectionObserver(lazyLoadCb, { rootMargin: "0px 0px 0px 0px" }));
  return () => set2(null);
});
readable(false, (set2) => {
  const query = "(prefers-reduced-motion: no-preference)";
  const mediaQueryList = typeof window !== "undefined" ? window.matchMedia(query) : {};
  const onChange = () => set2(!mediaQueryList.matches);
  if (typeof window !== "undefined") {
    mediaQueryList.addListener(onChange);
    onChange();
  }
  return () => {
    if (typeof window !== "undefined")
      mediaQueryList.removeListener(onChange);
  };
});
var ArrowRightIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-arrow-right " + escape(customClass)}"><line x1="${"5"}" y1="${"12"}" x2="${"19"}" y2="${"12"}"></line><polyline points="${"12 5 19 12 12 19"}"></polyline></svg>`;
});
var ExternalLinkIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-external-link " + escape(customClass)}"><path d="${"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}"></path><polyline points="${"15 3 21 3 21 9"}"></polyline><line x1="${"10"}" y1="${"14"}" x2="${"21"}" y2="${"3"}"></line></svg>`;
});
var GithubIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-github " + escape(customClass)}"><path d="${"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"}"></path></svg>`;
});
var MailIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-mail " + escape(customClass)}"><path d="${"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"}"></path><polyline points="${"22,6 12,13 2,6"}"></polyline></svg>`;
});
var MoonIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-moon " + escape(customClass)}"><path d="${"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"}"></path></svg>`;
});
var SunIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-sun " + escape(customClass)}"><circle cx="${"12"}" cy="${"12"}" r="${"5"}"></circle><line x1="${"12"}" y1="${"1"}" x2="${"12"}" y2="${"3"}"></line><line x1="${"12"}" y1="${"21"}" x2="${"12"}" y2="${"23"}"></line><line x1="${"4.22"}" y1="${"4.22"}" x2="${"5.64"}" y2="${"5.64"}"></line><line x1="${"18.36"}" y1="${"18.36"}" x2="${"19.78"}" y2="${"19.78"}"></line><line x1="${"1"}" y1="${"12"}" x2="${"3"}" y2="${"12"}"></line><line x1="${"21"}" y1="${"12"}" x2="${"23"}" y2="${"12"}"></line><line x1="${"4.22"}" y1="${"19.78"}" x2="${"5.64"}" y2="${"18.36"}"></line><line x1="${"18.36"}" y1="${"5.64"}" x2="${"19.78"}" y2="${"4.22"}"></line></svg>`;
});
var TwitterIcon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "100%" } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { class: customClass = "" } = $$props;
  if (size !== "100%") {
    size = size.slice(-1) === "x" ? size.slice(0, size.length - 1) + "em" : parseInt(size) + "px";
  }
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.strokeWidth === void 0 && $$bindings.strokeWidth && strokeWidth !== void 0)
    $$bindings.strokeWidth(strokeWidth);
  if ($$props.class === void 0 && $$bindings.class && customClass !== void 0)
    $$bindings.class(customClass);
  return `<svg xmlns="${"http://www.w3.org/2000/svg"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} fill="${"none"}" viewBox="${"0 0 24 24"}" stroke="${"currentColor"}"${add_attribute("stroke-width", strokeWidth, 0)} stroke-linecap="${"round"}" stroke-linejoin="${"round"}" class="${"feather feather-twitter " + escape(customClass)}"><path d="${"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"}"></path></svg>`;
});
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showExpanded;
  let $page, $$unsubscribe_page;
  let $theme, $$unsubscribe_theme;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_theme = subscribe(theme, (value) => $theme = value);
  onDestroy(() => {
    hasNav.set(false);
  });
  const links = [
    {
      title: "Github",
      url: "https://www.github.com/SawyerClick",
      icon: GithubIcon
    },
    {
      title: "Twitter",
      url: "https://www.twitter.com/sawyerdabear",
      icon: TwitterIcon
    },
    {
      title: "Email",
      url: "mailto:sawyer@hey.com",
      icon: MailIcon
    }
  ];
  let { size = "26" } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  showExpanded = $page.path === "/";
  $$unsubscribe_page();
  $$unsubscribe_theme();
  return `

<nav class="${"sm:px-4 header pr-2 px-2 w-full fixed bottom-0 z-50"}"><a sveltekit:prefetch href="${"/#home"}" class="${[
    "inline-block uppercase text-shadow py-2 leading-none font-semibold tracking-tighter font-sans text-5xl text-primary -skew-x-12 duration-150 ease-out dark:text-accent hover:transition-all hover:tracking-widest",
    !showExpanded ? "text-xl" : ""
  ].join(" ").trim()}">Sawyer Click
	</a>

	${showExpanded ? `<div><a href="${"https://thedataface.com/"}" target="${"_blank"}" rel="${"external"}" class="${"styled-border inline-block text-base sm:text-lg w-full font-light leading-tight m-0 md:w-2/5"}">develops data viz at The DataFace
				${validate_component(ExternalLinkIcon, "ExternalLinkIcon").$$render($$result, { size: "14" }, {}, {})}</a>

			<div class="${"flex justify-between items-center"}"><ul class="${"inline-block"}">${each(links, ({ title, url, icon }) => {
    return `<li class="${"inline-block mx-1 last-of-type:mr-0 first-of-type:ml-0"}"><a class="${"inline-block styled-border leading-none px-2.5 py-1.5"}"${add_attribute("href", url, 0)}${add_attribute("title", title, 0)}>${validate_component(icon || missing_component, "svelte:component").$$render($$result, { size }, {}, {})}</a>
						</li>`;
  })}</ul>

				<button class="${"styled-border inline-block z-50 text-xl mb-2"}" aria-label="${escape($theme === "dark" ? "light" : "dark") + " mode"}">${$theme === "dark" ? `${validate_component(SunIcon, "SunIcon").$$render($$result, { size: "26" }, {}, {})}` : `${validate_component(MoonIcon, "MoonIcon").$$render($$result, { size: "26" }, {}, {})}`}</button></div></div>` : `
		<button class="${"styled-border block fixed right-4 bottom-2 z-50 text-xl leading-none px-1 py-0.5"}" aria-label="${escape($theme === "dark" ? "light" : "dark") + " mode"}">${$theme === "dark" ? `${validate_component(SunIcon, "SunIcon").$$render($$result, { size: "16" }, {}, {})}` : `${validate_component(MoonIcon, "MoonIcon").$$render($$result, { size: "16" }, {}, {})}`}</button>`}</nav>`;
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}


${slots.default ? slots.default({}) : ``}`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
var Meta = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { meta: meta2 } = $$props;
  if ($$props.meta === void 0 && $$bindings.meta && meta2 !== void 0)
    $$bindings.meta(meta2);
  return `${$$result.head += `${$$result.title = `<title>${escape(meta2.title)}</title>`, ""}<meta name="${"description"}"${add_attribute("content", meta2.description, 0)} data-svelte="svelte-1gf6fq3"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-1gf6fq3"><meta property="${"og:url"}" content="${"https://sawyer.codes" + escape(meta2.slug)}" data-svelte="svelte-1gf6fq3"><meta property="${"og:title"}"${add_attribute("content", meta2.title, 0)} data-svelte="svelte-1gf6fq3"><meta property="${"og:description"}"${add_attribute("content", meta2.description, 0)} data-svelte="svelte-1gf6fq3"><meta property="${"og:image"}"${add_attribute("content", meta2.img || "images/share.png", 0)} data-svelte="svelte-1gf6fq3"><meta name="${"twitter:image"}"${add_attribute("content", meta2.img || "images/share.png", 0)} data-svelte="svelte-1gf6fq3"><meta name="${"twitter:card"}" content="${"summary_large_image"}" data-svelte="svelte-1gf6fq3"><meta name="${"twitter:creator"}" content="${"@sawyerdabear"}" data-svelte="svelte-1gf6fq3"><meta name="${"twitter:title"}"${add_attribute("content", meta2.title, 0)} data-svelte="svelte-1gf6fq3"><meta name="${"twitter:description"}"${add_attribute("content", meta2.description, 0)} data-svelte="svelte-1gf6fq3">`, ""}`;
});
function load$3({ error: error2, status }) {
  return {
    props: { err: `${status}: ${error2.message}` }
  };
}
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { err = "Error loading page" } = $$props;
  if ($$props.err === void 0 && $$bindings.err && err !== void 0)
    $$bindings.err(err);
  return `${validate_component(Meta, "Meta").$$render($$result, {
    meta: {
      title: "Whoops...",
      description: "Something went wrong.",
      slug: ""
    }
  }, {}, {})}

<picture class="${"w-screen h-screen fixed pointer-events-none z-10"}"><source srcset="${"/images/rickroll.webp"}" type="${"image/webp"}">
	<source srcset="${"/images/rickroll.gif"}" type="${"image/gif"}">
	<img src="${"/images/rickroll.gif"}" alt="${"Rick Roll gif"}" class="${"w-full h-full object-center object-cover"}"></picture>

<main class="${"absolute flex flex-nowrap flex-col justify-center items-center w-screen h-screen p-12 text-center z-20"}"><h1 class="${"font-sans font-bold mt-8 text-bg text-accent -skew-x-12"}">Whoops...</h1>
	<h2 class="${"font-sans font-bold mt-6 text-5xl text-bg text-accent -skew-x-12"}">something went wrong
	</h2>
	<a sveltekit:prefetch href="${"/"}" class="${"styled-border font-sans mt-8 px-3 py-1 text-2xl -skew-x-12"}">Go home?
	</a></main>

${``}`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error,
  load: load$3
});
var css$2 = {
  code: ".img-blur-up.svelte-qb4ul8{filter:blur(8px)}",
  map: `{"version":3,"file":"Picture.svelte","sources":["Picture.svelte"],"sourcesContent":["<script>\\n\\timport { onMount } from 'svelte';\\n\\timport { lazyloader } from '$lib/stores';\\n\\n\\texport let alt = 'hello world';\\n\\texport let slug = 'cloudkitchens-map';\\n\\n\\tlet imgEl; // img node\\n\\tlet loadingExists; // check if native lazy load exists\\n\\n\\tconst src = \`/images/portfolio/resized/\${slug}/blurred.jpeg\`;\\n\\n\\t// srcset generator\\n\\tconst imgSizes = [200, 400, 600, 800];\\n\\tconst formats = ['webp', 'png'];\\n\\tconst sizes = '(min-width: 1280px) 600px';\\n\\tconst srcsets = formats.map((format) => ({\\n\\t\\tformat,\\n\\t\\tsrcset: imgSizes\\n\\t\\t\\t.map((size) => \`/images/portfolio/resized/\${slug}/\${size}.\${format} \${size}w\`)\\n\\t\\t\\t.join(', ')\\n\\t}));\\n\\n\\t// blurs up image after it's lazy loaded\\n\\tconst imgBlurUp = (e) => {\\n\\t\\tif (e.currentTarget.srcset) e.currentTarget.classList.remove('img-blur-up');\\n\\t};\\n\\n\\tonMount(() => {\\n\\t\\tloadingExists = 'loading' in HTMLImageElement.prototype;\\n\\t\\tif (loadingExists) {\\n\\t\\t\\timgEl.src = imgEl.dataset.src;\\n\\t\\t\\timgEl.srcset = imgEl.dataset.srcset;\\n\\t\\t}\\n\\t});\\n\\n\\t// start observing when node is available\\n\\t$: if (imgEl && !loadingExists) $lazyloader.observe(imgEl);\\n<\/script>\\n\\n<picture class=\\"object-contain object-center w-full m-auto\\">\\n\\t{#each srcsets as { format, srcset }}\\n\\t\\t<source {sizes} {srcset} type=\\"image/{format}\\" />\\n\\t{/each}\\n\\n\\t<img\\n\\t\\tclass=\\"object-cover object-center w-full h-full m-auto img-blur-up\\"\\n\\t\\tsrc=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAAFElEQVR42mPkzP/1n4EIwDgEFAIAueEMO8sSG8UAAAAASUVORK5CYII=\\"\\n\\t\\tdata-src={src}\\n\\t\\tsrcset=\\"\\"\\n\\t\\tdata-srcset={srcsets[1].srcset}\\n\\t\\t{alt}\\n\\t\\theight=\\"100%\\"\\n\\t\\twidth=\\"100%\\"\\n\\t\\tloading=\\"lazy\\"\\n\\t\\tdecoding=\\"async\\"\\n\\t\\tdraggable=\\"false\\"\\n\\t\\tbind:this={imgEl}\\n\\t\\ton:load={imgBlurUp}\\n\\t/>\\n</picture>\\n\\n<style>.img-blur-up{filter:blur(8px)}</style>\\n"],"names":[],"mappings":"AA8DO,0BAAY,CAAC,OAAO,KAAK,GAAG,CAAC,CAAC"}`
};
var sizes = "(min-width: 1280px) 600px";
var Picture = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_lazyloader;
  $$unsubscribe_lazyloader = subscribe(lazyloader, (value) => value);
  let { alt = "hello world" } = $$props;
  let { slug = "cloudkitchens-map" } = $$props;
  let imgEl;
  const src2 = `/images/portfolio/resized/${slug}/blurred.jpeg`;
  const imgSizes = [200, 400, 600, 800];
  const formats = ["webp", "png"];
  const srcsets = formats.map((format22) => ({
    format: format22,
    srcset: imgSizes.map((size) => `/images/portfolio/resized/${slug}/${size}.${format22} ${size}w`).join(", ")
  }));
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css$2);
  $$unsubscribe_lazyloader();
  return `<picture class="${"object-contain object-center w-full m-auto"}">${each(srcsets, ({ format: format22, srcset }) => {
    return `<source${add_attribute("sizes", sizes, 0)}${add_attribute("srcset", srcset, 0)} type="${"image/" + escape(format22)}">`;
  })}

	<img class="${"object-cover object-center w-full h-full m-auto img-blur-up svelte-qb4ul8"}" src="${"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAYAAAB8ZH1oAAAAFElEQVR42mPkzP/1n4EIwDgEFAIAueEMO8sSG8UAAAAASUVORK5CYII="}"${add_attribute("data-src", src2, 0)} srcset="${""}"${add_attribute("data-srcset", srcsets[1].srcset, 0)}${add_attribute("alt", alt, 0)} height="${"100%"}" width="${"100%"}" loading="${"lazy"}" decoding="${"async"}" draggable="${"false"}"${add_attribute("this", imgEl, 0)}>
</picture>`;
});
var Project = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { project } = $$props;
  let { link, img, alt, title, publication, date: date2, description } = project;
  if ($$props.project === void 0 && $$bindings.project && project !== void 0)
    $$bindings.project(project);
  return `<a class="${"group styled-border block h-full text-primary shadow-md relative z-100 p-0 grayscale-[80%] hover:z-40 hover:grayscale-0"}"${add_attribute("href", link, 0)} target="${"_blank"}"${add_attribute("title", description, 0)}><div class="${"flex justify-center items-end flex-row flex-wrap group"}"><div class="${"picture-wrapper h-60 w-full object-center object-cover overflow-hidden z-0 duration-150 group-hover:transition-all group-focus:transition-all"}">${validate_component(Picture, "Picture").$$render($$result, { slug: img, alt }, {}, {})}</div>
		<div class="${"absolute h-full w-full flex justify-start items-end translate-x-2 p-3 opacity-0 will-change-transform transition-all duration-150 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:-skew-x-3 group-focus:opacity-100 group-focus:translate-x-0 group-focus:-skew-x-3 "}"><h3 class="${"antialiased font-semibold tracking-tighter text-sm text-center leading-none bg-accent p-2 border border-primary text-primary shadow-md dark:text-accent dark:bg-primary dark:border-accent"}">${escape(title)}</h3></div>
		
		
		
		</div></a>`;
});
var Grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items = [] } = $$props;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  return `<ul id="${"graphics"}" class="${"w-full mx-auto grid px-6 py-4 gap-4 lg:gap-6 place-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}">${each(items, (project) => {
    return `<li class="${"project relative w-full h-full"}">${validate_component(Project, "Project").$$render($$result, { project }, {}, {})}
		</li>`;
  })}</ul>`;
});
function ascending(a2, b) {
  return a2 == null || b == null ? NaN : a2 < b ? -1 : a2 > b ? 1 : a2 >= b ? 0 : NaN;
}
function bisector(f) {
  let delta = f;
  let compare1 = f;
  let compare2 = f;
  if (f.length === 1) {
    delta = (d2, x2) => f(d2) - x2;
    compare1 = ascending;
    compare2 = (d2, x2) => ascending(f(d2), x2);
  }
  function left(a2, x2, lo = 0, hi = a2.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a2[mid], x2) < 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function right(a2, x2, lo = 0, hi = a2.length) {
    if (lo < hi) {
      if (compare1(x2, x2) !== 0)
        return hi;
      do {
        const mid = lo + hi >>> 1;
        if (compare2(a2[mid], x2) <= 0)
          lo = mid + 1;
        else
          hi = mid;
      } while (lo < hi);
    }
    return lo;
  }
  function center(a2, x2, lo = 0, hi = a2.length) {
    const i = left(a2, x2, lo, hi - 1);
    return i > lo && delta(a2[i - 1], x2) > -delta(a2[i], x2) ? i - 1 : i;
  }
  return { left, center, right };
}
function number$1(x2) {
  return x2 === null ? NaN : +x2;
}
var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;
bisector(number$1).center;
var bisect = bisectRight;
var InternMap = class extends Map {
  constructor(entries, key = keyof) {
    super();
    Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: key } });
    if (entries != null)
      for (const [key2, value] of entries)
        this.set(key2, value);
  }
  get(key) {
    return super.get(intern_get(this, key));
  }
  has(key) {
    return super.has(intern_get(this, key));
  }
  set(key, value) {
    return super.set(intern_set(this, key), value);
  }
  delete(key) {
    return super.delete(intern_delete(this, key));
  }
};
function intern_get({ _intern, _key }, value) {
  const key = _key(value);
  return _intern.has(key) ? _intern.get(key) : value;
}
function intern_set({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key))
    return _intern.get(key);
  _intern.set(key, value);
  return value;
}
function intern_delete({ _intern, _key }, value) {
  const key = _key(value);
  if (_intern.has(key)) {
    value = _intern.get(key);
    _intern.delete(key);
  }
  return value;
}
function keyof(value) {
  return value !== null && typeof value === "object" ? value.valueOf() : value;
}
var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);
function ticks(start, stop, count) {
  var reverse, i = -1, n, ticks2, step;
  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0)
    return [start];
  if (reverse = stop < start)
    n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step))
    return [];
  if (step > 0) {
    let r0 = Math.round(start / step), r1 = Math.round(stop / step);
    if (r0 * step < start)
      ++r0;
    if (r1 * step > stop)
      --r1;
    ticks2 = new Array(n = r1 - r0 + 1);
    while (++i < n)
      ticks2[i] = (r0 + i) * step;
  } else {
    step = -step;
    let r0 = Math.round(start * step), r1 = Math.round(stop * step);
    if (r0 / step < start)
      ++r0;
    if (r1 / step > stop)
      --r1;
    ticks2 = new Array(n = r1 - r0 + 1);
    while (++i < n)
      ticks2[i] = (r0 + i) / step;
  }
  if (reverse)
    ticks2.reverse();
  return ticks2;
}
function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count), power = Math.floor(Math.log(step) / Math.LN10), error2 = step / Math.pow(10, power);
  return power >= 0 ? (error2 >= e10 ? 10 : error2 >= e5 ? 5 : error2 >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error2 >= e10 ? 10 : error2 >= e5 ? 5 : error2 >= e2 ? 2 : 1);
}
function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count), step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)), error2 = step0 / step1;
  if (error2 >= e10)
    step1 *= 10;
  else if (error2 >= e5)
    step1 *= 5;
  else if (error2 >= e2)
    step1 *= 2;
  return stop < start ? -step1 : step1;
}
function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(domain);
      break;
    default:
      this.range(range).domain(domain);
      break;
  }
  return this;
}
var implicit = Symbol("implicit");
function ordinal() {
  var index2 = new InternMap(), domain = [], range = [], unknown = implicit;
  function scale(d2) {
    let i = index2.get(d2);
    if (i === void 0) {
      if (unknown !== implicit)
        return unknown;
      index2.set(d2, i = domain.push(d2) - 1);
    }
    return range[i % range.length];
  }
  scale.domain = function(_) {
    if (!arguments.length)
      return domain.slice();
    domain = [], index2 = new InternMap();
    for (const value of _) {
      if (index2.has(value))
        continue;
      index2.set(value, domain.push(value) - 1);
    }
    return scale;
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), scale) : range.slice();
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  scale.copy = function() {
    return ordinal(domain, range).unknown(unknown);
  };
  initRange.apply(scale, arguments);
  return scale;
}
function define2(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define2(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format22) {
  var m2, l;
  format22 = (format22 + "").trim().toLowerCase();
  return (m2 = reHex.exec(format22)) ? (l = m2[1].length, m2 = parseInt(m2[1], 16), l === 6 ? rgbn(m2) : l === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format22)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format22)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format22)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format22)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format22)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format22)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format22) ? rgbn(named[format22]) : format22 === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a2) {
  if (a2 <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a2);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb$1(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define2(Rgb, rgb$1, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
  var a2 = this.opacity;
  a2 = isNaN(a2) ? 1 : Math.max(0, Math.min(1, a2));
  return (a2 === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a2 === 1 ? ")" : ", " + a2 + ")");
}
function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s2, l, a2) {
  if (a2 <= 0)
    h = s2 = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s2 = NaN;
  else if (s2 <= 0)
    h = NaN;
  return new Hsl(h, s2, l, a2);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s2 = max - min, l = (max + min) / 2;
  if (s2) {
    if (r === max)
      h = (g - b) / s2 + (g < b) * 6;
    else if (g === max)
      h = (b - r) / s2 + 2;
    else
      h = (r - g) / s2 + 4;
    s2 /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s2 = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s2, l, o.opacity);
}
function hsl(h, s2, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s2, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s2, l, opacity) {
  this.h = +h;
  this.s = +s2;
  this.l = +l;
  this.opacity = +opacity;
}
define2(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360, s2 = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s2, m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a2 = this.opacity;
    a2 = isNaN(a2) ? 1 : Math.max(0, Math.min(1, a2));
    return (a2 === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a2 === 1 ? ")" : ", " + a2 + ")");
  }
}));
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
var constant$1 = (x2) => () => x2;
function linear(a2, d2) {
  return function(t) {
    return a2 + t * d2;
  };
}
function exponential(a2, b, y2) {
  return a2 = Math.pow(a2, y2), b = Math.pow(b, y2) - a2, y2 = 1 / y2, function(t) {
    return Math.pow(a2 + t * b, y2);
  };
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a2, b) {
    return b - a2 ? exponential(a2, b, y2) : constant$1(isNaN(a2) ? b : a2);
  };
}
function nogamma(a2, b) {
  var d2 = b - a2;
  return d2 ? linear(a2, d2) : constant$1(isNaN(a2) ? b : a2);
}
var rgb = function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb2(start, end) {
    var r = color2((start = rgb$1(start)).r, (end = rgb$1(end)).r), g = color2(start.g, end.g), b = color2(start.b, end.b), opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function numberArray(a2, b) {
  if (!b)
    b = [];
  var n = a2 ? Math.min(b.length, a2.length) : 0, c2 = b.slice(), i;
  return function(t) {
    for (i = 0; i < n; ++i)
      c2[i] = a2[i] * (1 - t) + b[i] * t;
    return c2;
  };
}
function isNumberArray(x2) {
  return ArrayBuffer.isView(x2) && !(x2 instanceof DataView);
}
function genericArray(a2, b) {
  var nb = b ? b.length : 0, na = a2 ? Math.min(nb, a2.length) : 0, x2 = new Array(na), c2 = new Array(nb), i;
  for (i = 0; i < na; ++i)
    x2[i] = interpolate(a2[i], b[i]);
  for (; i < nb; ++i)
    c2[i] = b[i];
  return function(t) {
    for (i = 0; i < na; ++i)
      c2[i] = x2[i](t);
    return c2;
  };
}
function date(a2, b) {
  var d2 = new Date();
  return a2 = +a2, b = +b, function(t) {
    return d2.setTime(a2 * (1 - t) + b * t), d2;
  };
}
function interpolateNumber(a2, b) {
  return a2 = +a2, b = +b, function(t) {
    return a2 * (1 - t) + b * t;
  };
}
function object(a2, b) {
  var i = {}, c2 = {}, k;
  if (a2 === null || typeof a2 !== "object")
    a2 = {};
  if (b === null || typeof b !== "object")
    b = {};
  for (k in b) {
    if (k in a2) {
      i[k] = interpolate(a2[k], b[k]);
    } else {
      c2[k] = b[k];
    }
  }
  return function(t) {
    for (k in i)
      c2[k] = i[k](t);
    return c2;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string(a2, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s2 = [], q = [];
  a2 = a2 + "", b = b + "";
  while ((am = reA.exec(a2)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s2[i])
        s2[i] += bs;
      else
        s2[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s2[i])
        s2[i] += bm;
      else
        s2[++i] = bm;
    } else {
      s2[++i] = null;
      q.push({ i, x: interpolateNumber(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s2[i])
      s2[i] += bs;
    else
      s2[++i] = bs;
  }
  return s2.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s2[(o = q[i2]).i] = o.x(t);
    return s2.join("");
  });
}
function interpolate(a2, b) {
  var t = typeof b, c2;
  return b == null || t === "boolean" ? constant$1(b) : (t === "number" ? interpolateNumber : t === "string" ? (c2 = color(b)) ? (b = c2, rgb) : string : b instanceof color ? rgb : b instanceof Date ? date : isNumberArray(b) ? numberArray : Array.isArray(b) ? genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object : interpolateNumber)(a2, b);
}
function interpolateRound(a2, b) {
  return a2 = +a2, b = +b, function(t) {
    return Math.round(a2 * (1 - t) + b * t);
  };
}
function constants(x2) {
  return function() {
    return x2;
  };
}
function number(x2) {
  return +x2;
}
var unit = [0, 1];
function identity$1(x2) {
  return x2;
}
function normalize(a2, b) {
  return (b -= a2 = +a2) ? function(x2) {
    return (x2 - a2) / b;
  } : constants(isNaN(b) ? NaN : 0.5);
}
function clamper(a2, b) {
  var t;
  if (a2 > b)
    t = a2, a2 = b, b = t;
  return function(x2) {
    return Math.max(a2, Math.min(b, x2));
  };
}
function bimap(domain, range, interpolate2) {
  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
  if (d1 < d0)
    d0 = normalize(d1, d0), r0 = interpolate2(r1, r0);
  else
    d0 = normalize(d0, d1), r0 = interpolate2(r0, r1);
  return function(x2) {
    return r0(d0(x2));
  };
}
function polymap(domain, range, interpolate2) {
  var j = Math.min(domain.length, range.length) - 1, d2 = new Array(j), r = new Array(j), i = -1;
  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }
  while (++i < j) {
    d2[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate2(range[i], range[i + 1]);
  }
  return function(x2) {
    var i2 = bisect(domain, x2, 1, j) - 1;
    return r[i2](d2[i2](x2));
  };
}
function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}
function transformer() {
  var domain = unit, range = unit, interpolate$1 = interpolate, transform, untransform, unknown, clamp = identity$1, piecewise, output, input;
  function rescale() {
    var n = Math.min(domain.length, range.length);
    if (clamp !== identity$1)
      clamp = clamper(domain[0], domain[n - 1]);
    piecewise = n > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }
  function scale(x2) {
    return x2 == null || isNaN(x2 = +x2) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x2)));
  }
  scale.invert = function(y2) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y2)));
  };
  scale.domain = function(_) {
    return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
  };
  scale.range = function(_) {
    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
  };
  scale.rangeRound = function(_) {
    return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
  };
  scale.clamp = function(_) {
    return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
  };
  scale.interpolate = function(_) {
    return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
  };
  scale.unknown = function(_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };
  return function(t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}
function formatDecimal(x2) {
  return Math.abs(x2 = Math.round(x2)) >= 1e21 ? x2.toLocaleString("en").replace(/,/g, "") : x2.toString(10);
}
function formatDecimalParts(x2, p) {
  if ((i = (x2 = p ? x2.toExponential(p - 1) : x2.toExponential()).indexOf("e")) < 0)
    return null;
  var i, coefficient = x2.slice(0, i);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x2.slice(i + 1)
  ];
}
function exponent(x2) {
  return x2 = formatDecimalParts(Math.abs(x2)), x2 ? x2[1] : NaN;
}
function formatGroup(grouping, thousands) {
  return function(value, width) {
    var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
    while (i > 0 && g > 0) {
      if (length + g + 1 > width)
        g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width)
        break;
      g = grouping[j = (j + 1) % grouping.length];
    }
    return t.reverse().join(thousands);
  };
}
function formatNumerals(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i) {
      return numerals[+i];
    });
  };
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier)))
    throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function formatTrim(s2) {
  out:
    for (var n = s2.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (s2[i]) {
        case ".":
          i0 = i1 = i;
          break;
        case "0":
          if (i0 === 0)
            i0 = i;
          i1 = i;
          break;
        default:
          if (!+s2[i])
            break out;
          if (i0 > 0)
            i0 = 0;
          break;
      }
    }
  return i0 > 0 ? s2.slice(0, i0) + s2.slice(i1 + 1) : s2;
}
var prefixExponent;
function formatPrefixAuto(x2, p) {
  var d2 = formatDecimalParts(x2, p);
  if (!d2)
    return x2 + "";
  var coefficient = d2[0], exponent2 = d2[1], i = exponent2 - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent2 / 3))) * 3) + 1, n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x2, Math.max(0, p + i - 1))[0];
}
function formatRounded(x2, p) {
  var d2 = formatDecimalParts(x2, p);
  if (!d2)
    return x2 + "";
  var coefficient = d2[0], exponent2 = d2[1];
  return exponent2 < 0 ? "0." + new Array(-exponent2).join("0") + coefficient : coefficient.length > exponent2 + 1 ? coefficient.slice(0, exponent2 + 1) + "." + coefficient.slice(exponent2 + 1) : coefficient + new Array(exponent2 - coefficient.length + 2).join("0");
}
var formatTypes = {
  "%": (x2, p) => (x2 * 100).toFixed(p),
  "b": (x2) => Math.round(x2).toString(2),
  "c": (x2) => x2 + "",
  "d": formatDecimal,
  "e": (x2, p) => x2.toExponential(p),
  "f": (x2, p) => x2.toFixed(p),
  "g": (x2, p) => x2.toPrecision(p),
  "o": (x2) => Math.round(x2).toString(8),
  "p": (x2, p) => formatRounded(x2 * 100, p),
  "r": formatRounded,
  "s": formatPrefixAuto,
  "X": (x2) => Math.round(x2).toString(16).toUpperCase(),
  "x": (x2) => Math.round(x2).toString(16)
};
function identity(x2) {
  return x2;
}
var map = Array.prototype.map;
var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function formatLocale(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity : formatGroup(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity : formatNumerals(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero2 = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n")
      comma = true, type = "g";
    else if (!formatTypes[type])
      precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero2 || fill === "0" && align === "=")
      zero2 = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format22(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i, n, c2;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim)
          value = formatTrim(value);
        if (valueNegative && +value === 0 && sign !== "+")
          valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i = -1, n = value.length;
          while (++i < n) {
            if (c2 = value.charCodeAt(i), 48 > c2 || c2 > 57) {
              valueSuffix = (c2 === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      }
      if (comma && !zero2)
        value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero2)
        value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format22.toString = function() {
      return specifier + "";
    };
    return format22;
  }
  function formatPrefix2(specifier, value) {
    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
    return function(value2) {
      return f(k * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}
var locale;
var format2;
var formatPrefix;
defaultLocale({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function defaultLocale(definition) {
  locale = formatLocale(definition);
  format2 = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}
function precisionFixed(step) {
  return Math.max(0, -exponent(Math.abs(step)));
}
function precisionPrefix(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
}
function precisionRound(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
}
function tickFormat(start, stop, count, specifier) {
  var step = tickStep(start, stop, count), precision;
  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
  switch (specifier.type) {
    case "s": {
      var value = Math.max(Math.abs(start), Math.abs(stop));
      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value)))
        specifier.precision = precision;
      return formatPrefix(specifier, value);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop)))))
        specifier.precision = precision - (specifier.type === "e");
      break;
    }
    case "f":
    case "%": {
      if (specifier.precision == null && !isNaN(precision = precisionFixed(step)))
        specifier.precision = precision - (specifier.type === "%") * 2;
      break;
    }
  }
  return format2(specifier);
}
function linearish(scale) {
  var domain = scale.domain;
  scale.ticks = function(count) {
    var d2 = domain();
    return ticks(d2[0], d2[d2.length - 1], count == null ? 10 : count);
  };
  scale.tickFormat = function(count, specifier) {
    var d2 = domain();
    return tickFormat(d2[0], d2[d2.length - 1], count == null ? 10 : count, specifier);
  };
  scale.nice = function(count) {
    if (count == null)
      count = 10;
    var d2 = domain();
    var i0 = 0;
    var i1 = d2.length - 1;
    var start = d2[i0];
    var stop = d2[i1];
    var prestep;
    var step;
    var maxIter = 10;
    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        d2[i0] = start;
        d2[i1] = stop;
        return domain(d2);
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }
    return scale;
  };
  return scale;
}
function transformPow(exponent2) {
  return function(x2) {
    return x2 < 0 ? -Math.pow(-x2, exponent2) : Math.pow(x2, exponent2);
  };
}
function transformSqrt(x2) {
  return x2 < 0 ? -Math.sqrt(-x2) : Math.sqrt(x2);
}
function transformSquare(x2) {
  return x2 < 0 ? -x2 * x2 : x2 * x2;
}
function powish(transform) {
  var scale = transform(identity$1, identity$1), exponent2 = 1;
  function rescale() {
    return exponent2 === 1 ? transform(identity$1, identity$1) : exponent2 === 0.5 ? transform(transformSqrt, transformSquare) : transform(transformPow(exponent2), transformPow(1 / exponent2));
  }
  scale.exponent = function(_) {
    return arguments.length ? (exponent2 = +_, rescale()) : exponent2;
  };
  return linearish(scale);
}
function pow() {
  var scale = powish(transformer());
  scale.copy = function() {
    return copy(scale, pow()).exponent(scale.exponent());
  };
  initRange.apply(scale, arguments);
  return scale;
}
var defaultSource = Math.random;
var randomUniform = function sourceRandomUniform(source) {
  function randomUniform2(min, max) {
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1)
      max = min, min = 0;
    else
      max -= min;
    return function() {
      return source() * max + min;
    };
  }
  randomUniform2.source = sourceRandomUniform;
  return randomUniform2;
}(defaultSource);
function forceCenter(x2, y2) {
  var nodes, strength = 1;
  if (x2 == null)
    x2 = 0;
  if (y2 == null)
    y2 = 0;
  function force() {
    var i, n = nodes.length, node, sx = 0, sy = 0;
    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }
    for (sx = (sx / n - x2) * strength, sy = (sy / n - y2) * strength, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }
  force.initialize = function(_) {
    nodes = _;
  };
  force.x = function(_) {
    return arguments.length ? (x2 = +_, force) : x2;
  };
  force.y = function(_) {
    return arguments.length ? (y2 = +_, force) : y2;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  return force;
}
function tree_add(d2) {
  const x2 = +this._x.call(null, d2), y2 = +this._y.call(null, d2);
  return add(this.cover(x2, y2), x2, y2, d2);
}
function add(tree, x2, y2, d2) {
  if (isNaN(x2) || isNaN(y2))
    return tree;
  var parent, node = tree._root, leaf = { data: d2 }, x0 = tree._x0, y0 = tree._y0, x1 = tree._x1, y1 = tree._y1, xm, ym, xp, yp, right, bottom, i, j;
  if (!node)
    return tree._root = leaf, tree;
  while (node.length) {
    if (right = x2 >= (xm = (x0 + x1) / 2))
      x0 = xm;
    else
      x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2))
      y0 = ym;
    else
      y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right]))
      return parent[i] = leaf, tree;
  }
  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x2 === xp && y2 === yp)
    return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;
  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x2 >= (xm = (x0 + x1) / 2))
      x0 = xm;
    else
      x1 = xm;
    if (bottom = y2 >= (ym = (y0 + y1) / 2))
      y0 = ym;
    else
      y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));
  return parent[j] = node, parent[i] = leaf, tree;
}
function addAll(data2) {
  var d2, i, n = data2.length, x2, y2, xz = new Array(n), yz = new Array(n), x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (i = 0; i < n; ++i) {
    if (isNaN(x2 = +this._x.call(null, d2 = data2[i])) || isNaN(y2 = +this._y.call(null, d2)))
      continue;
    xz[i] = x2;
    yz[i] = y2;
    if (x2 < x0)
      x0 = x2;
    if (x2 > x1)
      x1 = x2;
    if (y2 < y0)
      y0 = y2;
    if (y2 > y1)
      y1 = y2;
  }
  if (x0 > x1 || y0 > y1)
    return this;
  this.cover(x0, y0).cover(x1, y1);
  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data2[i]);
  }
  return this;
}
function tree_cover(x2, y2) {
  if (isNaN(x2 = +x2) || isNaN(y2 = +y2))
    return this;
  var x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1;
  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x2)) + 1;
    y1 = (y0 = Math.floor(y2)) + 1;
  } else {
    var z = x1 - x0 || 1, node = this._root, parent, i;
    while (x0 > x2 || x2 >= x1 || y0 > y2 || y2 >= y1) {
      i = (y2 < y0) << 1 | x2 < x0;
      parent = new Array(4), parent[i] = node, node = parent, z *= 2;
      switch (i) {
        case 0:
          x1 = x0 + z, y1 = y0 + z;
          break;
        case 1:
          x0 = x1 - z, y1 = y0 + z;
          break;
        case 2:
          x1 = x0 + z, y0 = y1 - z;
          break;
        case 3:
          x0 = x1 - z, y0 = y1 - z;
          break;
      }
    }
    if (this._root && this._root.length)
      this._root = node;
  }
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}
function tree_data() {
  var data2 = [];
  this.visit(function(node) {
    if (!node.length)
      do
        data2.push(node.data);
      while (node = node.next);
  });
  return data2;
}
function tree_extent(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function Quad(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}
function tree_find(x2, y2, radius) {
  var data2, x0 = this._x0, y0 = this._y0, x1, y1, x22, y22, x3 = this._x1, y3 = this._y1, quads = [], node = this._root, q, i;
  if (node)
    quads.push(new Quad(node, x0, y0, x3, y3));
  if (radius == null)
    radius = Infinity;
  else {
    x0 = x2 - radius, y0 = y2 - radius;
    x3 = x2 + radius, y3 = y2 + radius;
    radius *= radius;
  }
  while (q = quads.pop()) {
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x22 = q.x1) < x0 || (y22 = q.y1) < y0)
      continue;
    if (node.length) {
      var xm = (x1 + x22) / 2, ym = (y1 + y22) / 2;
      quads.push(new Quad(node[3], xm, ym, x22, y22), new Quad(node[2], x1, ym, xm, y22), new Quad(node[1], xm, y1, x22, ym), new Quad(node[0], x1, y1, xm, ym));
      if (i = (y2 >= ym) << 1 | x2 >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } else {
      var dx = x2 - +this._x.call(null, node.data), dy = y2 - +this._y.call(null, node.data), d2 = dx * dx + dy * dy;
      if (d2 < radius) {
        var d3 = Math.sqrt(radius = d2);
        x0 = x2 - d3, y0 = y2 - d3;
        x3 = x2 + d3, y3 = y2 + d3;
        data2 = node.data;
      }
    }
  }
  return data2;
}
function tree_remove(d2) {
  if (isNaN(x2 = +this._x.call(null, d2)) || isNaN(y2 = +this._y.call(null, d2)))
    return this;
  var parent, node = this._root, retainer, previous, next, x0 = this._x0, y0 = this._y0, x1 = this._x1, y1 = this._y1, x2, y2, xm, ym, right, bottom, i, j;
  if (!node)
    return this;
  if (node.length)
    while (true) {
      if (right = x2 >= (xm = (x0 + x1) / 2))
        x0 = xm;
      else
        x1 = xm;
      if (bottom = y2 >= (ym = (y0 + y1) / 2))
        y0 = ym;
      else
        y1 = ym;
      if (!(parent = node, node = node[i = bottom << 1 | right]))
        return this;
      if (!node.length)
        break;
      if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3])
        retainer = parent, j = i;
    }
  while (node.data !== d2)
    if (!(previous = node, node = node.next))
      return this;
  if (next = node.next)
    delete node.next;
  if (previous)
    return next ? previous.next = next : delete previous.next, this;
  if (!parent)
    return this._root = next, this;
  next ? parent[i] = next : delete parent[i];
  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer)
      retainer[j] = node;
    else
      this._root = node;
  }
  return this;
}
function removeAll(data2) {
  for (var i = 0, n = data2.length; i < n; ++i)
    this.remove(data2[i]);
  return this;
}
function tree_root() {
  return this._root;
}
function tree_size() {
  var size = 0;
  this.visit(function(node) {
    if (!node.length)
      do
        ++size;
      while (node = node.next);
  });
  return size;
}
function tree_visit(callback) {
  var quads = [], q, node = this._root, child, x0, y0, x1, y1;
  if (node)
    quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[3])
        quads.push(new Quad(child, xm, ym, x1, y1));
      if (child = node[2])
        quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[1])
        quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[0])
        quads.push(new Quad(child, x0, y0, xm, ym));
    }
  }
  return this;
}
function tree_visitAfter(callback) {
  var quads = [], next = [], q;
  if (this._root)
    quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
  while (q = quads.pop()) {
    var node = q.node;
    if (node.length) {
      var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      if (child = node[0])
        quads.push(new Quad(child, x0, y0, xm, ym));
      if (child = node[1])
        quads.push(new Quad(child, xm, y0, x1, ym));
      if (child = node[2])
        quads.push(new Quad(child, x0, ym, xm, y1));
      if (child = node[3])
        quads.push(new Quad(child, xm, ym, x1, y1));
    }
    next.push(q);
  }
  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }
  return this;
}
function defaultX(d2) {
  return d2[0];
}
function tree_x(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}
function defaultY(d2) {
  return d2[1];
}
function tree_y(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}
function quadtree(nodes, x2, y2) {
  var tree = new Quadtree(x2 == null ? defaultX : x2, y2 == null ? defaultY : y2, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}
function Quadtree(x2, y2, x0, y0, x1, y1) {
  this._x = x2;
  this._y = y2;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = void 0;
}
function leaf_copy(leaf) {
  var copy2 = { data: leaf.data }, next = copy2;
  while (leaf = leaf.next)
    next = next.next = { data: leaf.data };
  return copy2;
}
var treeProto = quadtree.prototype = Quadtree.prototype;
treeProto.copy = function() {
  var copy2 = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1), node = this._root, nodes, child;
  if (!node)
    return copy2;
  if (!node.length)
    return copy2._root = leaf_copy(node), copy2;
  nodes = [{ source: node, target: copy2._root = new Array(4) }];
  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length)
          nodes.push({ source: child, target: node.target[i] = new Array(4) });
        else
          node.target[i] = leaf_copy(child);
      }
    }
  }
  return copy2;
};
treeProto.add = tree_add;
treeProto.addAll = addAll;
treeProto.cover = tree_cover;
treeProto.data = tree_data;
treeProto.extent = tree_extent;
treeProto.find = tree_find;
treeProto.remove = tree_remove;
treeProto.removeAll = removeAll;
treeProto.root = tree_root;
treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;
function constant(x2) {
  return function() {
    return x2;
  };
}
function jiggle(random) {
  return (random() - 0.5) * 1e-6;
}
function x$1(d2) {
  return d2.x + d2.vx;
}
function y$1(d2) {
  return d2.y + d2.vy;
}
function forceCollide(radius) {
  var nodes, radii, random, strength = 1, iterations = 1;
  if (typeof radius !== "function")
    radius = constant(radius == null ? 1 : +radius);
  function force() {
    var i, n = nodes.length, tree, node, xi, yi, ri, ri2;
    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x$1, y$1).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }
    function apply(quad, x0, y0, x1, y1) {
      var data2 = quad.data, rj = quad.r, r = ri + rj;
      if (data2) {
        if (data2.index > node.index) {
          var x2 = xi - data2.x - data2.vx, y2 = yi - data2.y - data2.vy, l = x2 * x2 + y2 * y2;
          if (l < r * r) {
            if (x2 === 0)
              x2 = jiggle(random), l += x2 * x2;
            if (y2 === 0)
              y2 = jiggle(random), l += y2 * y2;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x2 *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y2 *= l) * r;
            data2.vx -= x2 * (r = 1 - r);
            data2.vy -= y2 * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }
  function prepare(quad) {
    if (quad.data)
      return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i)
      node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };
  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };
  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };
  return force;
}
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types2) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types2.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n)
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback !== "function")
      throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type)
        _[t] = set(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy2 = {}, _ = this._;
    for (var t in _)
      copy2[t] = _[t].slice();
    return new Dispatch(copy2);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t; i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  }
};
function get(type, name) {
  for (var i = 0, n = type.length, c2; i < n; ++i) {
    if ((c2 = type[i]).name === name) {
      return c2.value;
    }
  }
}
function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null)
    type.push({ name, value: callback });
  return type;
}
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail)
        taskTail._next = this;
      else
        taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0)
      t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay)
    clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time)
        time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame)
    return;
  if (timeout)
    timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity)
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval)
      interval = clearInterval(interval);
  } else {
    if (!interval)
      clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
var a = 1664525;
var c = 1013904223;
var m = 4294967296;
function lcg() {
  let s2 = 1;
  return () => (s2 = (a * s2 + c) % m) / m;
}
function x(d2) {
  return d2.x;
}
function y(d2) {
  return d2.y;
}
var initialRadius = 10;
var initialAngle = Math.PI * (3 - Math.sqrt(5));
function forceSimulation(nodes) {
  var simulation, alpha = 1, alphaMin = 1e-3, alphaDecay = 1 - Math.pow(alphaMin, 1 / 300), alphaTarget = 0, velocityDecay = 0.6, forces = new Map(), stepper = timer(step), event = dispatch("tick", "end"), random = lcg();
  if (nodes == null)
    nodes = [];
  function step() {
    tick();
    event.call("tick", simulation);
    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }
  function tick(iterations) {
    var i, n = nodes.length, node;
    if (iterations === void 0)
      iterations = 1;
    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.forEach(function(force) {
        force(alpha);
      });
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null)
          node.x += node.vx *= velocityDecay;
        else
          node.x = node.fx, node.vx = 0;
        if (node.fy == null)
          node.y += node.vy *= velocityDecay;
        else
          node.y = node.fy, node.vy = 0;
      }
    }
    return simulation;
  }
  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null)
        node.x = node.fx;
      if (node.fy != null)
        node.y = node.fy;
      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(0.5 + i), angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }
      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }
  function initializeForce(force) {
    if (force.initialize)
      force.initialize(nodes, random);
    return force;
  }
  initializeNodes();
  return simulation = {
    tick,
    restart: function() {
      return stepper.restart(step), simulation;
    },
    stop: function() {
      return stepper.stop(), simulation;
    },
    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.forEach(initializeForce), simulation) : nodes;
    },
    alpha: function(_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },
    alphaTarget: function(_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },
    velocityDecay: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },
    randomSource: function(_) {
      return arguments.length ? (random = _, forces.forEach(initializeForce), simulation) : random;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (_ == null ? forces.delete(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
    },
    find: function(x2, y2, radius) {
      var i = 0, n = nodes.length, dx, dy, d2, node, closest;
      if (radius == null)
        radius = Infinity;
      else
        radius *= radius;
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x2 - node.x;
        dy = y2 - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius)
          closest = node, radius = d2;
      }
      return closest;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}
function forceManyBody() {
  var nodes, node, random, alpha, strength = constant(-30), strengths, distanceMin2 = 1, distanceMax2 = Infinity, theta2 = 0.81;
  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate);
    for (alpha = _, i = 0; i < n; ++i)
      node = nodes[i], tree.visit(apply);
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length, node2;
    strengths = new Array(n);
    for (i = 0; i < n; ++i)
      node2 = nodes[i], strengths[node2.index] = +strength(node2, i, nodes);
  }
  function accumulate(quad) {
    var strength2 = 0, q, c2, weight = 0, x2, y2, i;
    if (quad.length) {
      for (x2 = y2 = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c2 = Math.abs(q.value))) {
          strength2 += q.value, weight += c2, x2 += c2 * q.x, y2 += c2 * q.y;
        }
      }
      quad.x = x2 / weight;
      quad.y = y2 / weight;
    } else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do
        strength2 += strengths[q.data.index];
      while (q = q.next);
    }
    quad.value = strength2;
  }
  function apply(quad, x1, _, x2) {
    if (!quad.value)
      return true;
    var x3 = quad.x - node.x, y2 = quad.y - node.y, w = x2 - x1, l = x3 * x3 + y2 * y2;
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x3 === 0)
          x3 = jiggle(random), l += x3 * x3;
        if (y2 === 0)
          y2 = jiggle(random), l += y2 * y2;
        if (l < distanceMin2)
          l = Math.sqrt(distanceMin2 * l);
        node.vx += x3 * quad.value * alpha / l;
        node.vy += y2 * quad.value * alpha / l;
      }
      return true;
    } else if (quad.length || l >= distanceMax2)
      return;
    if (quad.data !== node || quad.next) {
      if (x3 === 0)
        x3 = jiggle(random), l += x3 * x3;
      if (y2 === 0)
        y2 = jiggle(random), l += y2 * y2;
      if (l < distanceMin2)
        l = Math.sqrt(distanceMin2 * l);
    }
    do
      if (quad.data !== node) {
        w = strengths[quad.data.index] * alpha / l;
        node.vx += x3 * w;
        node.vy += y2 * w;
      }
    while (quad = quad.next);
  }
  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };
  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };
  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };
  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };
  return force;
}
function forceX(x2) {
  var strength = constant(0.1), nodes, strengths, xz;
  if (typeof x2 !== "function")
    x2 = constant(x2 == null ? 0 : +x2);
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    }
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(xz[i] = +x2(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }
  force.initialize = function(_) {
    nodes = _;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };
  force.x = function(_) {
    return arguments.length ? (x2 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x2;
  };
  return force;
}
function forceY(y2) {
  var strength = constant(0.1), nodes, strengths, yz;
  if (typeof y2 !== "function")
    y2 = constant(y2 == null ? 0 : +y2);
  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    }
  }
  function initialize() {
    if (!nodes)
      return;
    var i, n = nodes.length;
    strengths = new Array(n);
    yz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(yz[i] = +y2(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }
  force.initialize = function(_) {
    nodes = _;
    initialize();
  };
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };
  force.y = function(_) {
    return arguments.length ? (y2 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y2;
  };
  return force;
}
var Canvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = 0 } = $$props;
  let { height = 0 } = $$props;
  let { center = false } = $$props;
  let { contextName = "canvas" } = $$props;
  let canvas;
  let pendingInvalidation = false;
  onDestroy(() => {
  });
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.center === void 0 && $$bindings.center && center !== void 0)
    $$bindings.center(center);
  if ($$props.contextName === void 0 && $$bindings.contextName && contextName !== void 0)
    $$bindings.contextName(contextName);
  {
    setContext(contextName, {
      register(fn) {
      },
      deregister(fn) {
      },
      invalidate() {
        if (pendingInvalidation)
          return;
        pendingInvalidation = true;
      }
    });
  }
  return `<canvas${add_attribute("this", canvas, 0)}></canvas>
${slots.default ? slots.default({}) : ``}`;
});
var CanvasWrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let gravityStrengthScale;
  let centerPosition;
  let activeForceX;
  let activeForceY;
  let activeForceCenter;
  let activeForceCollide;
  let activeForceManyBody;
  let forces;
  let simulation;
  let width = 0;
  let height = 0;
  const graphics = getContext("graphics");
  graphics.forEach((d2) => d2.r = Math.floor(randomUniform(40, 70)()));
  const dots = [
    ...graphics,
    {
      r: 200,
      publication: "myself",
      img: "me.jpeg"
    }
  ];
  const uniquePublications = [...new Set(dots.map((d2) => d2.publication))];
  let usedForceNames = [];
  ordinal().domain(uniquePublications).range(["indianred", "dodgerblue", "pink", "thistle"]);
  gravityStrengthScale = pow().exponent(2).range([0, 1]).domain([0, 250]);
  centerPosition = [width / 2, height / 2];
  activeForceX = forceX(centerPosition[0]).strength((d2) => gravityStrengthScale(d2.r));
  activeForceY = forceY(centerPosition[1]).strength((d2) => gravityStrengthScale(d2.r));
  activeForceCenter = forceCenter(...centerPosition);
  activeForceCollide = forceCollide().radius((d2) => d2.r + 10);
  activeForceManyBody = forceManyBody().strength(-200);
  (0, import_d3_force_boundary.default)(0, 0, width, height).strength(1);
  forces = [
    ["center", activeForceCenter],
    ["x", activeForceX],
    ["y", activeForceY],
    ["charge", activeForceManyBody],
    ["boundary", null],
    ["collide", activeForceCollide]
  ];
  simulation = forceSimulation().nodes(dots).on("tick", () => [...dots]);
  {
    {
      forces.forEach(([name, force]) => simulation.force(name, force));
      const newForceNames = forces.map(([name]) => name);
      let oldForceNames = usedForceNames.filter((force) => !newForceNames.includes(force));
      oldForceNames.forEach((name) => simulation.force(name, null));
      usedForceNames = newForceNames;
      simulation.alpha(1).velocityDecay(0.85);
      simulation.restart();
    }
  }
  return `<div class="${"wrapper z-0 opacity-40 flex flex-col w-full h-full dark:mix-blend-lighten"}"><figure class="${"flex-1"}">${validate_component(Canvas, "Canvas").$$render($$result, { width, height }, {}, {
    default: () => {
      return `${``}`;
    }
  })}</figure></div>`;
});
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="${"text-center mt-12 mb-0 mx-auto max-w-xs"}"><p class="${"font-sans text-xs -skew-x-12"}">Made with \u2661 by <a href="${"https://www.twitter.com/sawyerdabear"}">Sawyer Click\u2197</a> in Dripping
		Springs, Texas
	</p></footer>`;
});
var css$1 = {
  code: "ul.svelte-12nif11::-webkit-scrollbar{height:.5rem}ul.svelte-12nif11::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity));border-radius:.75rem}.dark ul.svelte-12nif11::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(248 248 248/var(--tw-bg-opacity))}ul.svelte-12nif11::-webkit-scrollbar-track{background-color:initial;margin-left:.5rem;margin-right:.5rem}@media(min-width:640px){ul.svelte-12nif11::-webkit-scrollbar-track{margin-left:1.5rem;margin-right:1.5rem}}",
  map: `{"version":3,"file":"Carousel.svelte","sources":["Carousel.svelte"],"sourcesContent":["<script>\\n\\timport { flip } from 'svelte/animate';\\n\\timport Project from '$lib/components/Project.svelte';\\n\\texport let items = [];\\n<\/script>\\n\\n<div class=\\"w-full text-center overflow-x-hidden\\">\\n\\t<ul\\n\\t\\tid=\\"graphics\\"\\n\\t\\tclass=\\"w-full mx-auto flex px-6 py-4 gap-4 place-items-start overflow-x-auto scroll-smooth snap-mandatory snap-x scroll-pl-2 sm:scroll-pl-6 [-webkit-overflow-scrolling:touch]\\"\\n\\t>\\n\\t\\t{#each items as project (project.title)}\\n\\t\\t\\t<li\\n\\t\\t\\t\\tclass=\\"project snap-center shrink-0 max-w-[88vw] min-w-[150px] sm:snap-start\\"\\n\\t\\t\\t\\tanimate:flip\\n\\t\\t\\t>\\n\\t\\t\\t\\t<Project {project} />\\n\\t\\t\\t</li>\\n\\t\\t{/each}\\n\\t</ul>\\n</div>\\n\\n<style lang=\\"postcss\\">ul::-webkit-scrollbar{height:.5rem}ul::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity));border-radius:.75rem}.dark ul::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(248 248 248/var(--tw-bg-opacity))}:global(.dark) ul::-webkit-scrollbar-thumb{--tw-bg-opacity:1;background-color:rgb(248 248 248/var(--tw-bg-opacity))}ul::-webkit-scrollbar-track{background-color:initial;margin-left:.5rem;margin-right:.5rem}@media (min-width:640px){ul::-webkit-scrollbar-track{margin-left:1.5rem;margin-right:1.5rem}}</style>\\n"],"names":[],"mappings":"AAsBsB,iBAAE,mBAAmB,CAAC,OAAO,KAAK,CAAC,iBAAE,yBAAyB,CAAC,gBAAgB,CAAC,CAAC,iBAAiB,IAAI,EAAE,CAAC,EAAE,CAAC,EAAE,CAAC,IAAI,eAAe,CAAC,CAAC,CAAC,cAAc,MAAM,CAAC,AAAmH,KAAK,AAAC,CAAC,iBAAE,yBAAyB,CAAC,gBAAgB,CAAC,CAAC,iBAAiB,IAAI,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,IAAI,eAAe,CAAC,CAAC,CAAC,iBAAE,yBAAyB,CAAC,iBAAiB,OAAO,CAAC,YAAY,KAAK,CAAC,aAAa,KAAK,CAAC,MAAM,AAAC,WAAW,KAAK,CAAC,CAAC,iBAAE,yBAAyB,CAAC,YAAY,MAAM,CAAC,aAAa,MAAM,CAAC,CAAC"}`
};
var Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { items = [] } = $$props;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  $$result.css.add(css$1);
  return `<div class="${"w-full text-center overflow-x-hidden"}"><ul id="${"graphics"}" class="${"w-full mx-auto flex px-6 py-4 gap-4 place-items-start overflow-x-auto scroll-smooth snap-mandatory snap-x scroll-pl-2 sm:scroll-pl-6 [-webkit-overflow-scrolling:touch] svelte-12nif11"}">${each(items, (project) => {
    return `<li class="${"project snap-center shrink-0 max-w-[88vw] min-w-[150px] sm:snap-start"}">${validate_component(Project, "Project").$$render($$result, { project }, {}, {})}
			</li>`;
  })}</ul>
</div>`;
});
async function load$2({ page: page2, fetch: fetch2 }) {
  const urls = ["/api/meta.json", "/api/lead-graphics.json"];
  const [meta2, projects2] = await Promise.all(urls.map(async (url) => {
    const apiRes = await fetch2(url);
    if (apiRes.ok)
      return apiRes.json();
    else
      throw new Error(apiRes);
  }));
  return {
    props: { meta: meta2, ...projects2, slug: page2.path }
  };
}
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { meta: meta2 } = $$props;
  let { pinned } = $$props;
  let { recent } = $$props;
  let { slug } = $$props;
  setContext("graphics", [...pinned, ...recent]);
  if ($$props.meta === void 0 && $$bindings.meta && meta2 !== void 0)
    $$bindings.meta(meta2);
  if ($$props.pinned === void 0 && $$bindings.pinned && pinned !== void 0)
    $$bindings.pinned(pinned);
  if ($$props.recent === void 0 && $$bindings.recent && recent !== void 0)
    $$bindings.recent(recent);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  return `${validate_component(Meta, "Meta").$$render($$result, { meta: { ...meta2, slug } }, {}, {})}

<main class="${"z-10 min-h-screen"}"><div id="${"home"}" class="${"h-screen min-h-screen flex justify-start items-end relative"}" style="${"height:100vh;"}"><div class="${"absolute all-0 h-full min-h-screen w-full after:absolute after:z-1 after:right-0 after:bottom-0 after:left-0 after:h-24 after:w-full after:bg-gradient-to-b after:from-transparent after:to-accent dark:after:to-primary"}">${validate_component(CanvasWrapper, "CanvasWrapper").$$render($$result, {}, {}, {})}</div></div>

	<section id="${"pinned"}" class="${"my-24"}"><div class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h1 class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Selected works
			</h1></div>
		${validate_component(Grid, "Grid").$$render($$result, { items: pinned }, {}, {})}</section>

	<section id="${"recent"}" class="${"my-24"}"><div class="${"sm:flex justify-between items-end px-6 pb-2 pt-4 mt-16 mb-8 border-b-1 border-primary dark:border-accent text-center md:text-left"}"><h1 class="${"text-2xl normal-case leading-none font-sans font-bold md:text-left md:text-6xl"}">Recent works
			</h1>
			<span class="${"sm:w-50 font-light text-right italic text-xs leading-none -skew-x-12"}">scroll for more
				${validate_component(ArrowRightIcon, "ArrowRightIcon").$$render($$result, { size: "14" }, {}, {})}</span></div>
		${validate_component(Carousel, "Carousel").$$render($$result, { items: recent }, {}, {})}</section></main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var index$3 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$2
});
async function load$1({ fetch: fetch2 }) {
  const res = await fetch2("/api/awards.json");
  const awards2 = await res.json();
  return { props: { awards: awards2 } };
}
var Awards = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { awards: awards2 = [] } = $$props;
  if ($$props.awards === void 0 && $$bindings.awards && awards2 !== void 0)
    $$bindings.awards(awards2);
  return `${validate_component(Meta, "Meta").$$render($$result, {
    meta: {
      title: "Awards & such",
      slug: "awards",
      description: "Awards and other notable accomplishments"
    }
  }, {}, {})}

<main class="${"min-h-screen pt-12"}"><section id="${"awards-and-such"}"><nav class="${"block text-center"}"><a class="${"styled-border text-lg inline-block"}" href="${"/"}">home</a></nav>

		<header class="${"mt-8"}"><figure class="${"text-center text-3xl"}">\u{1F3C6}</figure>
			<h1 class="${"text-center font-sans mt-2 mb-4 px-2 text-5xl"}">Awards &amp; such</h1></header>

		<ul class="${"w-full mx-auto px-6"}">${each(awards2, ({ awardLink, awardName, projectLink, projectName }) => {
    return `<li class="${"block align-middle text-center max-w-md mx-auto my-6 styled-border"}"><a${add_attribute("href", awardLink, 0)} class="${"block font-mono leading-tight py-1 max-w-sm mx-auto"}"><b>${escape(awardName)}</b></a>
					<hr class="${"my-2 border-primary opacity-40"}">
					<a${add_attribute("href", projectLink, 0)} class="${"block font-sans leading-tight py-1 max-w-sm mx-auto"}">${escape(projectName)}</a>
				</li>`;
  })}</ul></section></main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Awards,
  load: load$1
});
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main id="${"post"}" class="${"post p-8 mt-0 max-w-2xl m-auto min-h-screen"}"><a href="${"/"}" class="${"inline-block font-light leading-none styled-border px-2 py-2 text-sm hover:-skew-x-12 hover:transition-all focus:transition-all focus:-skew-x-12"}">\u2190 home
	</a>

	<h1 class="${"font-semibold tracking-tight mt-8 text-5xl"}">Hi! I&#39;m Sawyer.</h1>

	<p class="${"body"}">I&#39;m a data and graphics journalist living in Dripping Springs, Texas. My speciality is weaving
		narratives into data-driven graphics and front-end development.
	</p>

	<p class="${"body"}">I&#39;ve worked at Business Insider, The Wall Street Journal and NBC News. I&#39;ve briefly freelanced
		for <a class="${"text-link"}" href="${"https://www.dallasnews.com/joppa"}" rel="${"external"}">The Dallas Morning News</a>
		and
		<a class="${"text-link"}" href="${"https://observablehq.com/@sawyerclick/impds-complaints-allegations-and-demographics"}" rel="${"external"}">NYU&#39;s Criminal Justice Lab</a>.
	</p>

	<p></p></main>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About
});
var css = {
  code: "a.svelte-qj49d7:hover .svelte-qj49d7{color:var(--secondary)}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport async function load({ page, fetch }) {\\n\\t\\tconst res = await fetch('/api/post.json');\\n\\t\\tconst { posts } = await res.json();\\n\\t\\tconst slug = page.path;\\n\\t\\treturn {\\n\\t\\t\\tprops: {\\n\\t\\t\\t\\tposts,\\n\\t\\t\\t\\tslug\\n\\t\\t\\t}\\n\\t\\t};\\n\\t}\\n<\/script>\\n\\n<script>\\n\\timport Meta from '$lib/components/furniture/Meta.svelte';\\n\\timport Footer from '$lib/components/furniture/Footer.svelte';\\n\\timport Nav from '$lib/components/Nav.svelte';\\n\\texport let posts = [];\\n\\texport let slug;\\n<\/script>\\n\\n<Meta\\n\\tmeta={{\\n\\t\\ttitle: 'Post',\\n\\t\\tdescription: \\"Thoughts, musings and otherwise dumb ideas I've had.\\",\\n\\t\\tslug\\n\\t}}\\n/>\\n\\n<Nav />\\n\\n<main class=\\"max-w-lg mx-auto px-6 pt-12 min-h-screen\\">\\n\\t<article>\\n\\t\\t<header class=\\"mb-8\\">\\n\\t\\t\\t<h1 class=\\"text-xl font-semibold font-sans m-0 text-center text-shadow sm:text-6xl\\">\\n\\t\\t\\t\\tmusings\\n\\t\\t\\t</h1>\\n\\t\\t</header>\\n\\n\\t\\t<ul class=\\"font-mono w-full flex flex-wrap gap-4\\">\\n\\t\\t\\t{#each posts as { slug, date }}\\n\\t\\t\\t\\t<li class=\\"text-lg w-full font-light\\">\\n\\t\\t\\t\\t\\t<a href=\\"/post/{slug}\\" class=\\"styled-border w-full flex justify-between\\">\\n\\t\\t\\t\\t\\t\\t<span>&gt;&nbsp;<b>{slug}</b></span>\\n\\t\\t\\t\\t\\t\\t<time datetime={date}>\\n\\t\\t\\t\\t\\t\\t\\t{date.slice(0, 10)}\\n\\t\\t\\t\\t\\t\\t</time>\\n\\t\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t</li>\\n\\t\\t\\t{/each}\\n\\t\\t</ul>\\n\\t</article>\\n</main>\\n\\n<Footer />\\n\\n<style lang=\\"postcss\\">a:hover *{color:var(--secondary)}</style>\\n"],"names":[],"mappings":"AAyDsB,eAAC,MAAM,CAAC,cAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC"}`
};
async function load({ page: page2, fetch: fetch2 }) {
  const res = await fetch2("/api/post.json");
  const { posts } = await res.json();
  const slug = page2.path;
  return { props: { posts, slug } };
}
var Post = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts = [] } = $$props;
  let { slug } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
    $$bindings.posts(posts);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  $$result.css.add(css);
  return `${validate_component(Meta, "Meta").$$render($$result, {
    meta: {
      title: "Post",
      description: "Thoughts, musings and otherwise dumb ideas I've had.",
      slug
    }
  }, {}, {})}

${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}

<main class="${"max-w-lg mx-auto px-6 pt-12 min-h-screen"}"><article><header class="${"mb-8"}"><h1 class="${"text-xl font-semibold font-sans m-0 text-center text-shadow sm:text-6xl"}">musings
			</h1></header>

		<ul class="${"font-mono w-full flex flex-wrap gap-4"}">${each(posts, ({ slug: slug2, date: date2 }) => {
    return `<li class="${"text-lg w-full font-light"}"><a href="${"/post/" + escape(slug2)}" class="${"styled-border w-full flex justify-between svelte-qj49d7"}"><span class="${"svelte-qj49d7"}">&gt;\xA0<b class="${"svelte-qj49d7"}">${escape(slug2)}</b></span>
						<time${add_attribute("datetime", date2, 0)} class="${"svelte-qj49d7"}">${escape(date2.slice(0, 10))}
						</time></a>
				</li>`;
  })}</ul></article></main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Post,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (!rendered) {
    return {
      statusCode: 404,
      body: "Not found"
    };
  }
  const partial_response = {
    statusCode: rendered.status,
    ...split_headers(rendered.headers)
  };
  if (rendered.body instanceof Uint8Array) {
    return {
      ...partial_response,
      isBase64Encoded: true,
      body: Buffer.from(rendered.body).toString("base64")
    };
  }
  return {
    ...partial_response,
    body: rendered.body
  };
}
function split_headers(headers) {
  const h = {};
  const m2 = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m2 : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m2
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
