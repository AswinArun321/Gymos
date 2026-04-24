import Particles from "@tsparticles/react";
import { useMemo } from "react";

const BackgroundEffect = () => {
    // memoize options so they don't re-calculate on every render
    const options = useMemo(() => ({
        background: { color: { value: "transparent" } },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
                resize: true,
            },
            modes: {
                grab: { distance: 200, links: { opacity: 0.5 } },
            },
        },
        particles: {
            color: { value: "#2563eb" },
            links: {
                color: "#2563eb",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                outModes: { default: "out" },
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    }), []);

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="fixed inset-0 -z-10"
        />
    );
};

export default BackgroundEffect;