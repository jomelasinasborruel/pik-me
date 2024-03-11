interface FrameProps {
  opaque: boolean | undefined;
  width: number;
  height: number;
  pieces: {
    type: number;
    position: number;
    style: {
      transform: string;
    };
    imageClassName: string;
    imageStyle: React.CSSProperties | undefined;
  }[];
  setPieces: React.Dispatch<
    React.SetStateAction<DEFAULT_PIECES_PROPS[] | undefined>
  >;
  onMove?: () => void;
}

interface FrameSize {
  width: number;
  height: number;
}

interface DEFAULT_PIECES_PROPS {
  position: number;
  type: number;
  style: {
    transform: string;
  };
  imageClassName: string;
  imageStyle: React.CSSProperties | undefined;
}
[];

interface POSITION_SET {
  position: number;
  style: {
    transform: string;
  };
}
[];
