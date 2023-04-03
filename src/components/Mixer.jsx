import { Icon } from 'solid-heroicons';
import { chatBubbleLeft, musicalNote, pencil } from 'solid-heroicons/solid';
import { createSignal, For } from 'solid-js';
import SliderInput from './SliderInput';
import * as player from '../player';

// TODO: add Lane component

const [voiceGain, setVoiceGain] = createSignal(1);
const [musicGain, setMusicGain] = createSignal(1);
const lanes = () => [
  { icon: musicalNote, gain: musicGain, setGain: setMusicGain },
  { icon: chatBubbleLeft, gain: voiceGain, setGain: setVoiceGain },
];

function Mixer() {
  return (
    <div
      class="px-3 overflow-hidden transition-all duration-500"
      classList={{ 'h-1': !player.showMixer(), 'h-24': player.showMixer() }}
    >
      <For each={lanes()}>
        {(lane) => (
          <div class="flex justify-between items-center space-x-4 py-3">
            <Icon path={lane.icon} class="w-7 h-7" />
            <div class="grow">
              <SliderInput value={lane.gain()} onChange={(value) => lane.setGain(value)} />
            </div>
            <Icon path={pencil} class="w-5 h-5" />
          </div>
        )}
      </For>
    </div>
  );
}

export default Mixer;
