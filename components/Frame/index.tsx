import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Frame = React.memo(
  ({ pieces, opaque, width, height, setPieces, onMove }: FrameProps) => {
    const [moveSound, setMoveSound] = useState<HTMLAudioElement>();
    const handleClick = (
      piece: FrameProps["pieces"][0],
      blankPosition: number
    ) => {
      if (!opaque) return;
      if (!isMovable(piece.position, blankPosition)) return;
      moveSound?.play();
      onMove?.();
      const pcs = pieces;
      const empty = pcs.findIndex((pc) => pc.type === 8);
      const filled = pcs.findIndex((pc) => pc.type === piece.type);

      const temp = pieces[empty];
      pcs[filled] = {
        ...pieces[empty],
        imageStyle: pcs[filled].imageStyle,
        imageClassName: pcs[filled].imageClassName,
        type: pcs[filled].type,
      };
      pcs[empty] = {
        ...piece,
        imageStyle: temp.imageStyle,
        imageClassName: temp.imageClassName,
        type: temp.type,
      };

      setPieces([...pcs]);
    };

    useEffect(() => {
      setMoveSound(new Audio("/sounds/effects/pop.wav"));
    }, []);

    return pieces.map((piece, index) => {
      const blankPosition = pieces.find((pc) => pc.type === 8)?.position!;
      return (
        <div
          key={index}
          role={"button"}
          style={piece.style}
          className={clsx(
            "absolute transition-transform duration-200 ease-out",
            {
              "pointer-events-none": !isMovable(piece.position, blankPosition),
            }
          )}
          onClick={() => handleClick(piece, blankPosition)}
        >
          <div
            className={clsx(
              "overflow-hidden relative opacity-50 transition-opacity duration-300",
              {
                "!opacity-100": opaque == undefined || opaque,
                "!opacity-0 hidden": opaque && index === pieces.length - 1,
              }
            )}
            style={{ width: width / 3, height: height / 3 }}
          >
            <Image
              fill
              style={piece.imageStyle}
              draggable={false}
              className={piece.imageClassName}
              alt="original"
              src={"/images/puzzles/pikachu.jpg"}
            />
          </div>
        </div>
      );
    });
  }
);

export default Frame;

const isMovable = (piecePosition: number, blankPosition: number) => {
  if (blankPosition === 0 && [1, 3].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 1 && [0, 2, 4].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 2 && [1, 5].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 3 && [0, 4, 6].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 4 && [1, 3, 5, 7].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 5 && [2, 4, 8].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 6 && [3, 7].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 7 && [4, 6, 8].includes(piecePosition)) {
    return true;
  } else if (blankPosition === 8 && [5, 7].includes(piecePosition)) {
    return true;
  } else {
    return false;
  }
};
