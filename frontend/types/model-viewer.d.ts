declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref?: React.RefObject<any>;
        src?: string;
        alt?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "animation-name"?: string;
        style?: React.CSSProperties;
        "camera-orbit"?: string;
        "camera-target"?: string;
        "field-of-view"?: string;
        "min-camera-orbit"?: string;
        "max-camera-orbit"?: string;
        morphTargetInfluences?: number[];
        morphTargetDictionary?: { [key: string]: number };
      },
      HTMLElement
    >;
  }
}
