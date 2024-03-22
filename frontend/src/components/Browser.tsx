import React from "react";
import "./Browser.css";
import { useAtomValue } from "jotai";
import { browserState } from "../store";

function UrlBar({ url }: { url: string }): JSX.Element {
  return <div className="url">{url}</div>;
}

function Screenshot({ src }: { src: string }): JSX.Element {
  return <img className="screenshot" src={src} alt="screenshot" />;
}

function Browser(): JSX.Element {
  const { url, screenshotSrc } = useAtomValue(browserState);
  return (
    <div className="browser">
      <UrlBar url={url} />
      <Screenshot src={screenshotSrc} />
    </div>
  );
}

export default Browser;
