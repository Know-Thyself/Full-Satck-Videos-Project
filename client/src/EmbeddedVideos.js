import React from "react";

const EmbeddedVideo = ({ id }) => {
  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
  // "27-11-2020"
  console.log(dateString);
  return (
    <iframe
      className="embedded-video"
      width="100%"
      height="215"
      src={"https://www.youtube.com/embed/" + id}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
};

export default EmbeddedVideo;
