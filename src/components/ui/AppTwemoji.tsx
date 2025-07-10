import React from "react";
import Twemoji from "react-twemoji";

interface AppTwemojiProps {
  children: React.ReactNode;
  options?: {
    folder?: string;
    ext?: string;
    className?: string;
    size?: string | number;
  };
}

const AppTwemoji: React.FC<AppTwemojiProps> = ({ children, options = {} }) => {
  const defaultOptions = {
    folder: "svg",
    ext: ".svg",
    className: "twemoji",
    size: "1em",
    ...options,
  };

  return (
    <>
      <style jsx global>{`
        .twemoji {
          height: 1em !important;
          width: 1em !important;
          margin: 0 0.05em 0 0.1em !important;
          vertical-align: -0.1em !important;
          display: inline !important;
        }
      `}</style>
      <Twemoji options={defaultOptions}>{children}</Twemoji>
    </>
  );
};

export default AppTwemoji;
