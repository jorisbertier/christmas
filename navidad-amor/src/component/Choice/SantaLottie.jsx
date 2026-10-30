
import React, { useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

const SANTA_URL =
    "https://lottie.host/4d8226b7-07af-4762-b8be-8b7f4e6fdc36/6YkDtGBNbJ.json";

export default function SantaLottie({ width = 180 }) {
    const containerRef = useRef(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: SANTA_URL,
        });

        let count = 0;

        animation.addEventListener("complete", () => {
        count++;

        if (count === 1) {
            animation.goToAndPlay(0, true);
        } else {
            setHidden(true);
        }
        });

        return () => animation.destroy();
    }, []);

    if (hidden) return null;

    return (
        <div
        ref={containerRef}
        style={{ width, height: width }}
        />
    );
}
