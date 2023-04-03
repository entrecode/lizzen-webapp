import { onCleanup } from 'solid-js';

// thanks chatGPT
export function formatCurrentTime(currentTime) {
  // Get the hours, minutes, and seconds
  var hours = Math.floor(currentTime / 3600);
  var minutes = Math.floor((currentTime - hours * 3600) / 60);
  var seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);

  // Add leading zeros if necessary
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    if (hours > 0) {
      minutes = '0' + minutes;
    } else {
      minutes = minutes.toString();
    }
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  // Format the time as hh:mm:ss or mm:ss, depending on whether there are hours
  if (hours == 0) {
    return minutes + ':' + seconds;
  } else {
    return hours + ':' + minutes + ':' + seconds;
  }
}

export const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

export function tbd() {
  console.log('tbd!');
}

export function clickOutside(el, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener('click', onClick);

  onCleanup(() => document.body.removeEventListener('click', onClick));
}
