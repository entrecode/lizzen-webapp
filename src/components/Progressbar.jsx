import { createSignal } from 'solid-js';
import SliderInput from './components/SliderInput';
import * as player from './player';
import { formatCurrentTime } from './util';

function Progressbar() {
  const [seeking, setSeeking] = createSignal(-1);
  return (
    <div class="space-y-2">
      <SliderInput
        value={seeking() > 0 ? seeking() : player.progress()}
        onChange={(v) => setSeeking(v)}
        onRelease={(v) => {
          if (player.audio.duration > 0) {
            player.audio.currentTime = v * player.audio.duration;
          }
          player.setCurrentTime(v * player.audio.duration);
          setSeeking(-1);
        }}
      />
      <div class="text-right font-thin text-sm">
        {player.duration() > 0 ? (
          <span>
            {formatCurrentTime(player.currentTime())} / {formatCurrentTime(player.duration())}
          </span>
        ) : (
          <span class="text-transparent">...</span>
        )}
      </div>
    </div>
  );
}

export default Progressbar;
