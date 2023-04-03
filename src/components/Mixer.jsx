import { Icon } from 'solid-heroicons';
import { chatBubbleLeft, musicalNote, pencil } from 'solid-heroicons/solid';
import { For } from 'solid-js';
import SliderInput from './SliderInput';
import * as player from '../player';

const {
  music: { volume: musicVolume, setVolume: setMusicVolume },
  voice: { volume: voiceVolume, setVolume: setVoiceVolume },
} = player;

const lanes = () => [
  { icon: musicalNote, gain: musicVolume, setGain: setMusicVolume },
  { icon: chatBubbleLeft, gain: voiceVolume, setGain: setVoiceVolume },
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
