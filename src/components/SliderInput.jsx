import { createSignal, onCleanup } from 'solid-js';
import * as player from '../player';
import { clamp } from '../util';

function SliderInput(props) {
  let progressbar;
  const getValue = (clientX) => (clientX - progressbar.offsetLeft) / progressbar.clientWidth;
  const [scrubbing, setScrubbing] = createSignal();
  document.addEventListener('mouseup', () => {
    if (scrubbing()) {
      setScrubbing(false);
      props.onRelease?.(props.value);
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (scrubbing()) {
      const offset = getValue(e.clientX);
      const value = clamp(offset, 0, 1);
      props.onChange(value);
    }
  });

  onCleanup(() => {
    player.pause(); // just for hot reloading
  });
  return (
    <div
      class="cursor-pointer py-2"
      onMouseDown={(e) => {
        setScrubbing(true);
        props.onChange(getValue(e.clientX));
      }}
    >
      <div class="w-full bg-slate-200 h-1 rounded-md relative flex items-center" ref={progressbar}>
        <div class="bg-indigo-500 h-full rounded-md" style={{ width: `${props.value * 100}%` }} />
        <div
          class="w-4 h-4 rounded-full bg-indigo-500 -ml-1"
          onMouseDown={() => {
            setScrubbing(true);
          }}
        />
      </div>
    </div>
  );
}

export default SliderInput;
