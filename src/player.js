import { createEffect, createSignal } from 'solid-js';

let currentSrc;

export const [currentTime, setCurrentTime] = createSignal(0);
export const [duration, setDuration] = createSignal(0);
export const [paused, setPaused] = createSignal(true);

// only once, create audio element + add event handlers
// we can reuse audio + the events for the rest of the session
export const audio = new Audio();
audio.addEventListener('loadeddata', () => {
  console.log('loaded!', audio.duration);
  setDuration(audio.duration);
  // The duration variable now holds the duration (in seconds) of the audio clip
});
audio.autoplay = false;
audio.preload = 'auto';
audio.addEventListener('timeupdate', () => {
  setCurrentTime(audio.currentTime);
  setDuration(audio.duration);
});

/*
async function loadAudio(src, audio) {
  return new Promise((resolve, reject) => {
    const event = 'canplay';
    audio.addEventListener(event, function ready() {
      audio.removeEventListener(event, ready);
      resolve(audio);
    });
    audio.src = src;
  });
}*/

// TODO: use loadAudio inside onMount https://www.solidjs.com/tutorial/lifecycles_onmount
// TODO: use onCleanup to pause?
// TODO: find way to use onMount and onCleanup to subscribe to events

/*audio.addEventListener('canplay', () => {
  console.log('can play..');
});*/
audio.addEventListener('ended', handleNext);

function startPlayback() {
  console.log('canplay');
  setPaused(false);
  audio.play();
}

function handlePlay(src) {
  console.log('handleplay', src);
  document.createElement('audio');
  audio.pause();
  audio.muted = false;
  // we need an additional variable currentSrc, because audio.src will edit src, prepending the hostname
  if (currentSrc !== src) {
    console.log('src has changed: go to 0', src);
    audio.src = src;
    audio.currentTime = 0;
  }
  startPlayback();
  currentSrc = src;
}

function handlePause() {
  setPaused(true);
  audio.pause();
}

export function handleTogglePlay(src) {
  if (paused()) {
    handlePlay(src);
  } else {
    handlePause();
  }
}

export function handlePrev() {
  if (!audio) {
    console.log('nothing loaded yet..');
    return;
  }
  if (audio.currentTime < 1) {
    const currentIndex = playlist().indexOf(currentMeditation());
    const prev = playlist()[(currentIndex - 1 + playlist().length) % playlist().length];
    setCurrentMeditation(prev);
    handlePlay(prev.files.sound);
  } else {
    audio.currentTime = 0;
  }
}

export function handleNext() {
  console.log('next..');
  if (audio) {
    console.log('go..');
    const currentIndex = playlist().indexOf(currentMeditation());
    const next = playlist()[(currentIndex + 1) % playlist().length];
    setCurrentMeditation(next);
    handlePlay(next.files.sound);
  }
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
    console.log('currentMeditation', currentMeditation());
    const src = currentMeditation().files.sound;
    console.log('src', src);
    audio.src = src;
    currentSrc = src;
    // audio.pause();
  }
});
