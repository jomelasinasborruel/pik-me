"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useEffect } from "react";
import { delay } from "lodash";
import clsx from "clsx";

import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { useMediaQuery } from "usehooks-ts";
import useCustomTimer from "@/lib/timer";
import Frame from "@/components/Frame";
import cx from "./Home.module.scss";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

export default function Home() {
  const [opaque, setOpaque] = React.useState<boolean>();
  const [bgMusic, setBgMusic] = React.useState<HTMLAudioElement>();
  const [frameSize, setFrameSize] = React.useState<FrameSize>();
  const [soundApplause, setSoundApplause] = React.useState<HTMLAudioElement>();
  const isDesktop = useMediaQuery("(min-width: 800px)");

  const [pieces, setPieces] = React.useState<DEFAULT_PIECES_PROPS[]>();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [numberOfMoves, setNumberOfMoves] = React.useState(0);
  const [bgMusicOn, setBgMusicOn] = React.useState(true);

  const { start, pause, reset, seconds, miliseconds, minutes } =
    useCustomTimer();
  const [isFirstTime, setIsFirstTime] = React.useState(true);

  const handleStart = () => {
    setOpaque(false);
    setNumberOfMoves(0);
    setIsSuccess(false);
    reset();
    let jumbledSet: number[] = [];

    // if (searchParams.get("unbeatable") == "true") {
    //   jumbledSet = [0, 1, 2, 3, 4, 5, 7, 6, 8];
    // } else {
    // }
    jumbledSet = [7, 6, 3, 8, 2, 4, 5, 1, 0];
    // jumbledSet = [0, 1, 2, 3, 4, 8, 6, 7, 5];

    const initPieces = pieces;

    let initIndex = 0;
    const myInterval = setInterval(() => {
      initPieces![initIndex] = {
        ...initPieces![initIndex],
        ...POSITION_SET[jumbledSet[initIndex]],
      };

      setPieces([...initPieces!]);
      initIndex++;
      if (initIndex > jumbledSet.length - 1) {
        clearInterval(myInterval);
        delay(() => {
          setOpaque(true);
          start();
        }, 500);
      }
    }, 200);
  };

  const handleResetGame = () => {
    const size = isDesktop
      ? { width: 500, height: 625 }
      : { width: 320, height: 400 };
    setFrameSize(size);

    setPieces(DEFAULT_PIECES(size.width, size.height));
    setOpaque(undefined);
    setNumberOfMoves(0);
    setIsSuccess(false);
    reset();
  };

  const handleAudio = () => {
    if (bgMusicOn) {
      setBgMusicOn(false);
      bgMusic?.pause();
    } else {
      setBgMusicOn(true);
      bgMusic?.play();
    }
  };

  useEffect(() => {
    if (!pieces) return;
    const isSame = pieces.filter((pc, index) => pc.position !== index);
    if (isSame.length === 0 && opaque) {
      soundApplause?.play();
      setIsSuccess(true);
      pause();
    }
  }, [pieces]);

  useEffect(() => {
    if (!isSuccess) return;
    delay(() => {
      setOpaque(undefined);
      setIsSuccess(false);
    }, 6000);
  }, [isSuccess]);

  useEffect(() => {
    handleResetGame();
  }, [isDesktop]);

  useEffect(() => {
    setSoundApplause(new Audio("/sounds/effects/applause.wav"));
    setBgMusic(new Audio("/sounds/music/run-amok.mp3"));
  }, []);

  return (
    <main className={cx["main"]}>
      <button
        className="absolute z-50 right-2 top-2 text-white"
        onClick={handleAudio}
      >
        {bgMusicOn ? (
          <BiVolumeFull className="text-[2rem]" />
        ) : (
          <BiVolumeMute className="text-[2rem]" />
        )}
      </button>
      <div
        className={clsx(cx["cover"], {
          "!opacity-0 !pointer-events-none": !isFirstTime,
        })}
      >
        <Image
          width={500}
          height={190}
          className={cx["cover__logo"]}
          alt={""}
          src={"/images/svgs/logo.svg"}
        />
        <button
          className={clsx(cx["cover__button"], {
            hidden: opaque !== undefined,
          })}
          onClick={() => {
            setIsFirstTime(false);
            Cookies.set("pm-isFirstTime", "false");
            bgMusic?.play();
            bgMusic!.volume = 0.3;
            bgMusic!.loop = true;
          }}
        >
          CONTINUE
        </button>
      </div>

      <div className={cx["main__bg"]}>
        <Image
          fill
          draggable={false}
          className="w-full h-full object-cover"
          alt="background"
          src="/images/backgrounds/desert.jpg"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000079]" />
      </div>
      <div className={cx["main__logo-container"]}>
        <Image
          width={500}
          height={190}
          className={cx["main__logo"]}
          alt={""}
          src={"/images/svgs/logo.svg"}
        />
      </div>
      <div className={cx["frame-container"]}>
        <div
          className={clsx(cx["infos"], {
            "!border-green-900 ": isSuccess,
          })}
        >
          <Image
            fill
            draggable={false}
            className={cx["original-photo"]}
            alt="original"
            src={"/images/puzzles/pikachu.jpg"}
          />

          <div className={cx["game-details"]}>
            <p>
              Elapse time: <br />
            </p>

            <p className={cx["score--time"]}>
              {minutes}:{seconds}:{miliseconds}
            </p>

            <p>Moves:</p>
            <p className={cx["score--move"]}> {numberOfMoves}</p>
          </div>
        </div>
        <div
          style={{ width: frameSize?.width, height: frameSize?.height }}
          className={clsx(cx["frame"], {
            "!border-green-900 !bg-green-900 ": isSuccess,
          })}
        >
          <div
            className={clsx(cx["frame-overlay"], {
              hidden: opaque && !isSuccess,
            })}
          />
          <button
            className={clsx(cx["frame__button"], {
              hidden: opaque !== undefined,
            })}
            onClick={handleStart}
          >
            START
          </button>
          {pieces && (
            <Frame
              width={frameSize?.width ?? 0}
              height={frameSize?.height ?? 0}
              pieces={pieces}
              opaque={opaque}
              setPieces={setPieces}
              onMove={() => {
                setNumberOfMoves((prev) => prev + 1);
              }}
            />
          )}
        </div>
      </div>
      {isSuccess && opaque && (
        <div className={cx["win-effect"]}>
          <Fireworks autorun={{ speed: 1, duration: 5000 }} />
        </div>
      )}
    </main>
  );
}

const ARR = Array.from(Array(9).keys());

const DEFAULT_PIECES = (width: number, height: number) => {
  const val: DEFAULT_PIECES_PROPS[] = ARR.map((index) => {
    return {
      position: index,
      type: index,
      style: {
        transform: `translate(${100 * (index % 3)}%,${
          100 * Math.floor(index / 3)
        }%)`,
      },
      imageClassName: clsx("object-cover absolute", {
        "!w-[500px] !h-[625px]": width === 500,
        "!w-[320px] !h-[400px]": width !== 500,
      }),
      imageStyle: {
        objectPosition: `-${(width / 3) * (index % 3)}px ${
          -(height / 3) * Math.floor(index / 3)
        }px`,
      },
    };
  });
  return val;
};

const POSITION_SET: POSITION_SET[] = ARR.map((index) => {
  return {
    position: index,
    style: {
      transform: `translate(${100 * (index % 3)}%,${
        100 * Math.floor(index / 3)
      }%)`,
    },
  };
});
