import React from "react";

function ExampleCarouselImage({ text, image }) {
    return (
        <img src={image} alt={text} style={{ width: "100%", height: "auto" }} />
    );
}

export default ExampleCarouselImage;
