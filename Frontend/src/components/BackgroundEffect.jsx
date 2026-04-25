import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const BackgroundEffect = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => ({
        // Forces the background color onto the canvas itself so it can't be covered
        background: { color: { value: "#f8fafc" } }, 
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { 
                    enable: true, 
                    mode: "bubble" // Copied from your TrackNova config
                },
                resize: true,
            },
            modes: {
                bubble: {
                    distance: 200,
                    size: 6,
                    duration: 2,
                    opacity: 0.8,
                },
            },
        },
        particles: {
            color: { value: "#3b82f6" }, // GymOS Blue
            links: {
                color: "#60a5fa",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                enable: true,
                speed: 0.5, // Slow anti-gravity speed from TrackNova
                direction: "none",
                random: true,
                outModes: { default: "out" },
            },
            number: { 
                density: { enable: true, area: 800 }, 
                value: 100 // TrackNova density
            },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    }), []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className="fixed inset-0 -z-10"
        />
    );
};

export default BackgroundEffect;