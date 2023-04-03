import { createEffect, createSignal } from 'solid-js';

let currentSrc;

export const [currentTime, setCurrentTime] = createSignal(0);
export const [duration, setDuration] = createSignal(0);
export const [paused, setPaused] = createSignal(true);

// only once, create audio element + add event handlers
// we can reuse audio + the events for the rest of the session
export const music = new Audio();
music.addEventListener('loadeddata', () => {
  console.log('loaded!', music.duration);
  setDuration(music.duration);
  // The duration variable now holds the duration (in seconds) of the audio clip
});
music.autoplay = false;
music.preload = 'auto';
music.addEventListener('timeupdate', () => {
  setCurrentTime(music.currentTime);
  setDuration(music.duration);
});

/*
async function loadAudio(src, audio) {
  return new Promise((resolve, reject) => {
    const event = 'canplay';
    music.addEventListener(event, function ready() {
      music.removeEventListener(event, ready);
      resolve(audio);
    });
    music.src = src;
  });
}*/

// TODO: use loadAudio inside onMount https://www.solidjs.com/tutorial/lifecycles_onmount
// TODO: use onCleanup to pause?
// TODO: find way to use onMount and onCleanup to subscribe to events

/*music.addEventListener('canplay', () => {
  console.log('can play..');
});*/
music.addEventListener('ended', handleNext);

function startPlayback() {
  console.log('canplay');
  setPaused(false);
  music.play();
}

function handlePlay(src) {
  console.log('handleplay', src, currentSrc);
  music.pause();
  music.muted = false;
  // we need an additional variable currentSrc, because music.src will edit src, prepending the hostname
  if (currentSrc !== src) {
    console.log('src has changed: go to 0', src);
    music.src = src;
    music.currentTime = 0;
  }
  startPlayback();
  currentSrc = src;
}

function handlePause() {
  setPaused(true);
  music.pause();
}

export function handleTogglePlay(src) {
  if (paused()) {
    handlePlay(src);
  } else {
    handlePause();
  }
}

export function handlePrev() {
  if (!music) {
    console.log('nothing loaded yet..');
    return;
  }
  if (music.currentTime < 1) {
    const currentIndex = playlist().indexOf(currentMeditation());
    const prev = playlist()[(currentIndex - 1 + playlist().length) % playlist().length];
    setCurrentMeditation(prev);
    handlePlay(prev.files.sound);
  } else {
    music.currentTime = 0;
  }
}

export function handleNext() {
  if (!music) {
    console.log('nothing loaded yet..');
    return;
  }
  const currentIndex = playlist().indexOf(currentMeditation());
  const next = playlist()[(currentIndex + 1) % playlist().length];
  setCurrentMeditation(next);
  handlePlay(next.files.sound);
}

const meditations = [
  {
    title: 'Windy day with natural sound',
    subtitle: 'From Gretchen Baptista',
    files: {
      sound: './audio/Sound.mp3',
      voice: './audio/Voice.mp3',
    },
  },
  {
    title: 'Just Intonation',
    subtitle: 'From Felix',
    files: {
      sound: './audio/track1.mp3',
      voice: './audio/track2.mp3',
    },
  },
];

export const [playlist] = createSignal(meditations);
export const [currentMeditation, setCurrentMeditation] = createSignal();
export const progress = () => (duration() > 0 ? currentTime() / duration() : 0);
export const [showMixer, setShowMixer] = createSignal(false);

createEffect(() => {
  if (playlist()?.length) {
    setCurrentMeditation(playlist()[0]);
  }
});

createEffect(() => {
  if (currentMeditation()) {
    console.log('change currentMeditation', currentMeditation());
    const src = currentMeditation().files.sound;
    music.src = src;
    currentSrc = src;
    // music.pause();
  }
});
