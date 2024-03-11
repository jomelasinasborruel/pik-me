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

export default function Home() {
  const [opaque, setOpaque] = React.useState<boolean>();
  const [bgMusic, setBgMusic] = React.useState<HTMLAudioElement>();
  const [frameSize, setFrameSize] = React.useState<FrameSize>();
  const [soundApplause, setSoundApplause] = React.useState<HTMLAudioElement>();
  const isDesktop = useMediaQuery("(min-width: 800px)");

  const [pieces, setPieces] = React.useState<DEFAULT_PIECES_PROPS[]>();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [numberOfMoves, setNumberOfMoves] = React.useState(0);

  const { start, pause, reset, seconds, miliseconds, minutes } =
    useCustomTimer();
  const [isFirstTime, setIsFirstTime] = React.useState(true);

  const handleStart = () => {
    setOpaque(false);
    // const jumbledSet = [7, 6, 3, 8, 2, 4, 5, 1, 0];
    const jumbledSet = [0, 1, 2, 3, 4, 5, 7, 6, 8];
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
    const size = isDesktop
      ? { width: 500, height: 625 }
      : { width: 320, height: 400 };
    setFrameSize(size);

    setPieces(DEFAULT_PIECES(size.width, size.height));
    setOpaque(undefined);
    setNumberOfMoves(0);
    reset();
  }, [isDesktop]);

  useEffect(() => {
    setSoundApplause(new Audio("/sounds/effects/applause.wav"));
    setBgMusic(new Audio("/sounds/music/run-amok.mp3"));
  }, []);

  return (
    <main className="flex relative min-h-screen flex-col items-center justify-center select-none">
      <div
        className={clsx(
          "transition-all opacity-100 duration-500 absolute w-full h-screen flex-col gap-4 z-50 left-0 top-0 bg-[#202020] flex justify-center items-center",
          {
            "!opacity-0 !pointer-events-none": !isFirstTime,
          }
        )}
      >
        <Image
          width={500}
          height={190}
          className="!w-[300px] !h-auto transition-all duration-500"
          alt={""}
          src={"/images/svgs/logo.svg"}
        />
        <button
          className={clsx(
            " font-runcort text-[#dbdbdb] text-3xl transition-color duration-500 rounded-md py-2 px-4 bg-[#204311] z-20 hover:bg-[#284c19] hover:text-white",
            {
              hidden: opaque !== undefined,
            }
          )}
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

      <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          fill
          draggable={false}
          className="w-full h-full object-cover"
          alt="background"
          src="/images/backgrounds/desert.jpg"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[#00000079]" />
      </div>
      <div className="relative tracking-widest drop-shadow-2xl mt-4">
        <Image
          width={500}
          height={190}
          className="!w-[300px] !h-auto"
          alt={""}
          src={"/images/svgs/logo.svg"}
        />
      </div>
      <div className="flex p-4 min-[515px]:h-full max-[514px]:flex-col max-w-[1080px] w-full justify-center items-center gap-4">
        <div
          className={clsx(
            "w-[320px] transition-all flex max-[514px]:flex-row flex-col min-[515px]:gap-4 min-[515px]:w-[150px] min-[515px]:h-[400px] min-[800px]:w-[250px] min-[800px]:h-[625px] duration-300 h-[200px] relative border-[0.3125rem] bg-[#202020] border-[#202020] rounded-lg  overflow-hidden",
            {
              "!border-green-900 ": isSuccess,
            }
          )}
        >
          <div>
            <Image
              fill
              draggable={false}
              className="object-cover !w-full max-[514px]:!min-w-[152px] max-[514px]:!h-[190px] !h-auto !relative"
              alt="original"
              src={"/images/puzzles/pikachu.jpg"}
            />
          </div>
          <div className="h-full font-runcort tracking-wider text-[#ffffffb1] w-full flex flex-col gap-2 min-[800px]:gap-4 p-2">
            <p>
              Elapse time: <br />
            </p>

            <p className="text-center text-2xl min-[800px]:text-3xl">
              {minutes}:{seconds}:{miliseconds}
            </p>

            <p>Moves:</p>
            <p className="text-center text-2xl min-[800px]:text-3xl">
              {" "}
              {numberOfMoves}
            </p>
          </div>
        </div>
        <div
          style={{ width: frameSize?.width, height: frameSize?.height }}
          className={clsx(
            "flex relative transition-all duration-300 border-[0.3125rem] border-[#202020] bg-[#202020] rounded-lg overflow-hidden",
            {
              "!border-green-900 !bg-green-900 !pointer-events-none": isSuccess,
            }
          )}
        >
          <div
            className={clsx(
              "absolute top-0 left-0 w-full h-full bg-[#00000079] z-10",
              {
                hidden: opaque,
              }
            )}
          />
          <button
            className={clsx(
              "absolute top-1/2 left-1/2 font-runcort text-[#dbdbdb] -translate-x-1/2 text-3xl transition-color duration-500 -translate-y-1/2 rounded-md py-2 px-4 bg-[#204311] z-20 hover:bg-[#284c19] hover:text-white",
              {
                hidden: opaque !== undefined,
              }
            )}
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
      {isSuccess && (
        <div className="absolute top-0 left-0 w-full h-full">
          <Fireworks autorun={{ speed: 1, duration: 6000 }} />
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
