import FaustAudioProcessorNode from "./FaustAudioProcessorNode";

function heap2Str(buf: Uint8Array) {
  let str = "";
  let i = 0;
  while (buf[i] !== 0) {
    str += String.fromCharCode(buf[i++]);
  }
  return str;
}

const processorModules: Record<string, Promise<void>> = {};
async function loadProcessorModule(context: AudioContext, url: string) {
  if (!context.audioWorklet) {
    console.error(
      "Error loading FaustAudioProcessorNode: audio worklet isn't supported."
    );
    return null;
  }

  const existing = processorModules[url];

  if (existing) {
    return existing;
  }

  processorModules[url] = context.audioWorklet.addModule(url);
  return processorModules[url];
}

const wasmModules: Record<string, Promise<WebAssembly.Module>> = {};
async function getWasmModule(url: string) {
  const existing = wasmModules[url];

  if (existing) {
    return existing;
  }

  wasmModules[url] = fetch(url)
    .then((response) => response.arrayBuffer())
    .then((dspBuffer) => WebAssembly.compile(dspBuffer));
  return wasmModules[url];
}

const importObject = {
  env: {
    memoryBase: 0,
    tableBase: 0,
    _abs: Math.abs,

    // Float version
    _acosf: Math.acos,
    _asinf: Math.asin,
    _atanf: Math.atan,
    _atan2f: Math.atan2,
    _ceilf: Math.ceil,
    _cosf: Math.cos,
    _expf: Math.exp,
    _floorf: Math.floor,
    _fmodf: (x: number, y: number) => x % y,
    _logf: Math.log,
    _log10f: Math.log10,
    _max_f: Math.max,
    _min_f: Math.min,
    _remainderf: (x: number, y: number) => x - Math.round(x / y) * y,
    _powf: Math.pow,
    _roundf: Math.fround,
    _sinf: Math.sin,
    _sqrtf: Math.sqrt,
    _tanf: Math.tan,
    _acoshf: Math.acosh,
    _asinhf: Math.asinh,
    _atanhf: Math.atanh,
    _coshf: Math.cosh,
    _sinhf: Math.sinh,
    _tanhf: Math.tanh,

    // Double version
    _acos: Math.acos,
    _asin: Math.asin,
    _atan: Math.atan,
    _atan2: Math.atan2,
    _ceil: Math.ceil,
    _cos: Math.cos,
    _exp: Math.exp,
    _floor: Math.floor,
    _fmod: (x: number, y: number) => x % y,
    _log: Math.log,
    _log10: Math.log10,
    _max_: Math.max,
    _min_: Math.min,
    _remainder: (x: number, y: number) => x - Math.round(x / y) * y,
    _pow: Math.pow,
    _round: Math.fround,
    _sin: Math.sin,
    _sqrt: Math.sqrt,
    _tan: Math.tan,
    _acosh: Math.acosh,
    _asinh: Math.asinh,
    _atanh: Math.atanh,
    _cosh: Math.cosh,
    _sinh: Math.sinh,
    _tanh: Math.tanh,

    table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
  },
};

export default async function loadProcessor(
  context: AudioContext,
  name: string,
  baseURL: string
) {
  const cleanedBaseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;

  const [dspModule] = await Promise.all([
    getWasmModule(`${cleanedBaseURL}${name}.wasm`),
    loadProcessorModule(context, `${cleanedBaseURL}${name}-processor.js`),
  ]);

  const dspInstance = await WebAssembly.instantiate(dspModule, importObject);

  const HEAPU8 = new Uint8Array((dspInstance.exports.memory as WebAssembly.Memory).buffer);
  const json = heap2Str(HEAPU8);
  const json_object = JSON.parse(json);
  const processorOptions = { wasm_module: dspModule, json: json };

  const nodeOptions = {
    numberOfInputs: parseInt(json_object.inputs) > 0 ? 1 : 0,
    numberOfOutputs: parseInt(json_object.outputs) > 0 ? 1 : 0,
    channelCount: Math.max(1, parseInt(json_object.inputs)),
    outputChannelCount: [parseInt(json_object.outputs)],
    channelCountMode: "explicit" as const,
    channelInterpretation: "speakers" as const,
    processorOptions,
  };

  try {
    const node = new FaustAudioProcessorNode(context, name, nodeOptions);
    node.onprocessorerror = () => {
      console.log(`An error from ${name}-processor was detected.`);
    };

    return node;
  } catch (e) {
    console.error(
      "FaustAudioProcessorNode initialization failed."
    );
    console.error(e);
  }
}
