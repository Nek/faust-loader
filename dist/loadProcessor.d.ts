import FaustAudioProcessorNode from "./FaustAudioProcessorNode";
export default function loadProcessor(context: AudioContext, name: string, baseURL: string): Promise<FaustAudioProcessorNode>;
