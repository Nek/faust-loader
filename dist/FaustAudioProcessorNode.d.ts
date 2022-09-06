export default function getClass(): {
    new (context: AudioContext, name: string, nodeOptions: any): {
        json: string;
        json_object: Record<string, any>;
        parse_ui: (ui: any, obj: any) => void;
        parse_group: (group: any, obj: any) => void;
        parse_items: (items: any, obj: any) => void;
        output_handler: any;
        inputs_items: any[];
        outputs_items: any[];
        descriptor: any[];
        fPitchwheelLabel: any[];
        fCtrlLabel: any[];
        baseURL: string;
        gui: any;
        presets: any;
        handleMessage(event: any): void;
        /**
         * Destroy the node, deallocate resources.
         */
        destroy(): void;
        /**
         *  Returns a full JSON description of the DSP.
         */
        getJSON(): string;
        getMetadata(): Promise<unknown>;
        /**
         *  Set the control value at a given path.
         *
         * @param path - a path to the control
         * @param val - the value to be set
         */
        setParamValue(path: any, val: any): void;
        setParam(path: any, val: any): void;
        /**
         *  Get the control value at a given path.
         *
         * @return the current control value
         */
        getParamValue(path: string): number;
        getParam(path: string): number;
        /**
         * Setup a control output handler with a function of type (path, value)
         * to be used on each generated output value. This handler will be called
         * each audio cycle at the end of the 'compute' method.
         *
         * @param handler - a function of type function(path, value)
         */
        setOutputParamHandler(handler: any): void;
        /**
         * Get the current output handler.
         */
        getOutputParamHandler(): any;
        getNumInputs(): number;
        getNumOutputs(): number;
        inputChannelCount(): number;
        outputChannelCount(): number;
        /**
         * Returns an array of all input paths (to be used with setParamValue/getParamValue)
         */
        getParams(): any[];
        getDescriptor(): {};
        /**
         * Control change
         *
         * @param channel - the MIDI channel (0..15, not used for now)
         * @param ctrl - the MIDI controller number (0..127)
         * @param value - the MIDI controller value (0..127)
         */
        ctrlChange(channel: any, ctrl: any, value: any): void;
        /**
         * PitchWeel
         *
         * @param channel - the MIDI channel (0..15, not used for now)
         * @param value - the MIDI controller value (0..16383)
         */
        pitchWheel(channel: any, wheel: any): void;
        /**
         * Generic MIDI message handler.
         */
        midiMessage(data: any): void;
        onMidi(data: any): void;
        /**
         * @returns {Object} describes the path for each available param and its current value
         */
        getState(): Promise<unknown>;
        /**
         * Sets each params with the value indicated in the state object
         * @param {Object} state
         */
        setState(state: any): Promise<unknown>;
        /**
         * A different call closer to the preset management
         * @param {Object} patch to assign as a preset to the node
         */
        setPatch(patch: any): void;
        onprocessorerror: (this: AudioWorkletNode, ev: Event) => any;
        readonly parameters: AudioParamMap;
        readonly port: MessagePort;
        addEventListener<K extends "processorerror">(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K_1 extends "processorerror">(type: K_1, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K_1]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
        channelCount: number;
        channelCountMode: ChannelCountMode;
        channelInterpretation: ChannelInterpretation;
        readonly context: BaseAudioContext;
        readonly numberOfInputs: number;
        readonly numberOfOutputs: number;
        connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;
        connect(destinationParam: AudioParam, output?: number): void;
        disconnect(): void;
        disconnect(output: number): void;
        disconnect(destinationNode: AudioNode): void;
        disconnect(destinationNode: AudioNode, output: number): void;
        disconnect(destinationNode: AudioNode, output: number, input: number): void;
        disconnect(destinationParam: AudioParam): void;
        disconnect(destinationParam: AudioParam, output: number): void;
        dispatchEvent(event: Event): boolean;
    };
    remap(v: any, mn0: any, mx0: any, mn1: any, mx1: any): any;
};
