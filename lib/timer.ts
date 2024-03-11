import { useTimer } from "use-timer";

const useCustomTimer = () => {
  const {
    time: secTime,
    start: secStart,
    reset: secReset,
    pause: secPause,
  } = useTimer();
  const {
    time: msTime,
    start: msStart,
    reset: msReset,
    pause: msPause,
  } = useTimer({ interval: 10 });

  const start = () => {
    secStart();
    msStart();
  };

  const reset = () => {
    secReset();
    msReset();
  };

  const pause = () => {
    secPause();
    msPause();
  };

  const rawMinutes = Math.floor(secTime / 59).toString();
  const minutes = rawMinutes.length != 2 ? `0${rawMinutes}` : rawMinutes;

  const rawSeconds = (secTime % 59).toString();
  const seconds = rawSeconds.length !== 2 ? `0${rawSeconds}` : rawSeconds;
  const rawMiliseconds = (msTime % 99).toString();
  const miliseconds =
    rawMiliseconds.length !== 2 ? `0${rawMiliseconds}` : rawMiliseconds;

  return { start, reset, pause, minutes, seconds, miliseconds };
};

export default useCustomTimer;
