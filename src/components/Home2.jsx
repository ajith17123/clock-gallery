import React, { useState, useEffect, useRef } from "react";
import "../assets/style/Home2.css";

import coffeeCenterImg from "../assets/images/coffee_center.jpg";
import espressoImg     from "../assets/images/espresso.jpg";
import cappuccinoImg   from "../assets/images/cappuccino.jpg";
import latteImg        from "../assets/images/latte.jpg";
import mochaImg        from "../assets/images/mocha.jpg";
import americanoImg    from "../assets/images/americano.jpg";
import macchiatoImg    from "../assets/images/macchiato.jpg";
import coldBrewImg     from "../assets/images/cold_brew.jpg";
import flatWhiteImg    from "../assets/images/flat_white.jpg";

const COFFEES = [
  { name: "Espresso",   img: espressoImg   },  // i=0 → 0°   (3 o'clock)
  { name: "Cappuccino", img: cappuccinoImg  },  // i=1 → 45°
  { name: "Latte",      img: latteImg       },  // i=2 → 90°  (6 o'clock)
  { name: "Mocha",      img: mochaImg       },  // i=3 → 135°
  { name: "Americano",  img: americanoImg   },  // i=4 → 180° (9 o'clock)
  { name: "Macchiato",  img: macchiatoImg   },  // i=5 → 225°
  { name: "Cold Brew",  img: coldBrewImg    },  // i=6 → 270° (12 o'clock)
  { name: "Flat White", img: flatWhiteImg   },  // i=7 → 315°
];

// Reveal from 12 o'clock clockwise: Cold Brew(6), Flat White(7), Espresso(0)…
const REVEAL_ORDER    = [6, 7, 0, 1, 2, 3, 4, 5];
const FAST_DURATION   = 1000;   // 2 rounds × 0.5 s
const SLOW_DURATION   = 2500;   // 1 round  × 2.5 s ease-out
const REVEAL_INTERVAL = 320;    // ms between each coffee pop-in

export default function Home2() {
  const [phase, setPhase]             = useState("idle");
  const [revealedSet, setRevealedSet] = useState(new Set());
  const timers = useRef([]);

  const addTimer = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const openMenu = () => {
    setRevealedSet(new Set());

    // Phase 1 – fast spin
    setPhase("fast");

    addTimer(() => {
      // Phase 2 – slow down
      setPhase("slow");

      addTimer(() => {
        // Phase 3 – reveal one-by-one
        setPhase("reveal");

        REVEAL_ORDER.forEach((coffeeIdx, step) => {
          addTimer(() => {
            setRevealedSet((prev) => new Set([...prev, coffeeIdx]));
          }, step * REVEAL_INTERVAL);
        });

        // Phase 4 – fully open
        addTimer(() => {
          setPhase("open");
        }, REVEAL_ORDER.length * REVEAL_INTERVAL + 400);

      }, SLOW_DURATION);
    }, FAST_DURATION);
  };

  const closeMenu = () => {
    clearTimers();
    setPhase("idle");
    setRevealedSet(new Set());
  };

  const handleBowlClick = () => {
    if (phase === "idle") openMenu();
    else if (phase === "open") closeMenu();
  };

  useEffect(() => () => clearTimers(), []);

  const isMenuVisible = phase !== "idle";

  const wrapClass = [
    "radial-wrap2",
    isMenuVisible ? "active" : "",
    `phase-${phase}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="home2-container">
      <div className="orbit-field2" aria-hidden="true" />

      {/* Pre-open tagline */}
      <div className={`bowl-tagline2 ${isMenuVisible ? "hidden" : ""}`}>
        <p className="tagline-title2">Coffee Creations</p>
        <p className="tagline-sub2">Touch to explore the brews</p>
      </div>

      <div className={wrapClass}>
        <ul className="radial-menu2">
          {COFFEES.map((coffee, i) => {
            const isRevealPhase = phase === "reveal";
            const isRevealed    = revealedSet.has(i);

            const itemClass = [
              "fruit-item2",
              isRevealPhase && !isRevealed ? "pre-reveal"    : "",
              isRevealPhase &&  isRevealed ? "just-revealed" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={coffee.name} className={itemClass} style={{ "--i": i }}>
                <div className="fruit-content2">
                  <div className="fruit-circle2" tabIndex={phase === "open" ? 0 : -1}>
                    <img src={coffee.img} alt={coffee.name} draggable="false" />
                  </div>
                  <span className="fruit-label2">{coffee.name}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className={`bowl-button2 ${isMenuVisible ? "active" : ""}`}
          onClick={handleBowlClick}
          aria-expanded={isMenuVisible}
          aria-label={isMenuVisible ? "Close coffee menu" : "Open coffee menu"}
        >
          <img src={coffeeCenterImg} alt="" className="bowl-image2" />
          <span className="bowl-ring2" />
        </button>
      </div>
    </div>
  );
}
