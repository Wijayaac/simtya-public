import React from "react";
import ContentLoader from "react-content-loader";

export default function ImagePlaceholder() {
  return (
    <ContentLoader
      id="image-placeholder"
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb">
      <rect x="2" y="2" rx="0" ry="0" width="100%" height="100%" />
    </ContentLoader>
  );
}
