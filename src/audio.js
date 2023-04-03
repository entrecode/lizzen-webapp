import { createSignal } from 'solid-js';

export function createAudio(props) {
  const audio = new Audio();
  let currentSrc;
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [paused, setPaused] = createSignal(true);

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
  audio.addEventListener('ended', () => props.onEnded?.());

  function startPlayback() {
    console.log('canplay');
    setPaused(false);
    audio.play();
  }
  function load(src) {
    console.log('load', src);
    audio.pause();
    audio.muted = false;
    if (currentSrc !== src) {
      console.log('src has changed: go to 0', src);
      audio.src = src;
      audio.currentTime = 0;
    }
    currentSrc = src;
  }
  function play(src) {
    load(src);
    startPlayback();
  }

  function pause() {
    setPaused(true);
    audio.pause();
  }

  function toggle(src) {
    if (paused()) {
      play(src);
    } else {
      pause();
    }
  }

  function seekToProgress(normalized) {
    if (audio.duration) {
      audio.currentTime = audio.duration * normalized;
    }
    setCurrentTime(audio.duration * normalized);
  }
  return { audio, currentTime, duration, paused, toggle, pause, play, load, seekToProgress };
}
