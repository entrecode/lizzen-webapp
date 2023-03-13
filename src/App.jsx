import {createSignal, createResource, createEffect, For} from 'solid-js';

// audio code

const ac = new AudioContext();

const cache = {}; // string: Promise<ArrayBuffer>
const loadBuffer = url => {
  if (!cache[url]) {
    cache[url] = fetch(url)
      .then(res => res.arrayBuffer())
      .then(res => ac.decodeAudioData(res))
      .catch(err => {
        console.dir(err);
        delete cache[url];
      });
  }
  return cache[url];
};

const playBuffer = (buffer, options) => {
  const {gain, time = ac.currentTime, offset = 0} = options;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.start(time, offset % buffer.duration);
  const g = ac.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(ac.destination);
  return {gainNode: g, sourceNode: src};
};
// const playSample = async url => playBuffer(await loadBuffer(url));

function fetchTracks() {
  return Promise.all([
    loadBuffer('./audio/track1.mp3'),
    loadBuffer('./audio/track2.mp3'),
    loadBuffer('./audio/track3.mp3'),
    loadBuffer('./audio/track4.mp3'),
  ]);
}

// state
const [gains, setGains] = createSignal([100, 100, 100, 100]);
const [trackNodes, setTrackNodes] = createSignal();
const [tracks] = createResource('load', fetchTracks);
const [started, setStarted] = createSignal(false);
const [progress, setProgress] = createSignal(0);

let lastPlayStart,
  interval,
  phase = 0;
createEffect(() => {
  if (started()) {
    interval = setInterval(() => {
      setProgress(ac.currentTime - lastPlayStart + phase);
    }, 100);
  } else if (interval) {
    clearInterval(interval);
  }
});
const handleTogglePlay = () => {
  if (!started()) {
    ac.resume();
    setStarted(true);
    const time = ac.currentTime;
    lastPlayStart = time;
    const _trackNodes = tracks().map((track, i) =>
      playBuffer(track, {
        time,
        gain: gains()[i] / 100,
        offset: phase,
      }),
    );
    setTrackNodes(_trackNodes);
  } else {
    const playPhaseLength = ac.currentTime - lastPlayStart;
    phase += playPhaseLength;
    setStarted(false);
    trackNodes().forEach(({sourceNode}) => sourceNode.stop());
  }
};
const handleUpdateGain = (index, value) => {
  // update frontend
  gains()[index] = value;
  setGains([...gains()]);
  if (trackNodes()) {
    // update audio nodes only if already playing
    const newValue = value / 100;
    const {gainNode} = trackNodes()[index];
    gainNode.gain.value = newValue;
  }
};
// UI

function Slider(props) {
  return (
    <div>
      <label class="flex items-center space-x-2">
        <span>{props.label}</span>
        <input
          class="grow accent-slate-800"
          type="range"
          value={props.value}
          disabled={props.disabled}
          onInput={e => props.onChange(e.target.value)}
        />
        <span class="w-8">{props.value}%</span>
      </label>
    </div>
  );
}

function Button(props) {
  return (
    <button
      class="text-white bg-slate-800 p-2 rounded-md"
      onClick={e => props.onClick(e)}>
      {props.children}
    </button>
  );
}
function App() {
  return (
    <div class="max-w-lg m-auto p-2 space-y-4 select-none">
      <div class="grid grid-cols-2 gap-2">
        <h1 class="text-xl flex items-center">
          Lizzen to this {Math.round(progress())}s
        </h1>
        <Button onClick={handleTogglePlay}>
          {started() ? 'Pause' : 'Play'}
        </Button>
      </div>
      <div class="grid gap-2">
        <For each={tracks()}>
          {(_, i) => (
            <Slider
              label={`Track ${i() + 1}`}
              value={gains()[i()]}
              onChange={value => handleUpdateGain(i(), value)}
            />
          )}
        </For>
      </div>
    </div>
  );
}

export default App;
