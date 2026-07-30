import React, { useState, useEffect, useRef } from "react";
import "../assets/style/Home.css";

import bowlImg from "../assets/images/bowl.jpg";
import appleImg from "../assets/images/apple.jpg";
import bananaImg from "../assets/images/banana.jpg";
import mangoImg from "../assets/images/mango.jpg";
import strawberryImg from "../assets/images/strawberry.jpg";
import kiwiImg from "../assets/images/kiwi.jpg";
import orangeImg from "../assets/images/orange.jpg";
import pineappleImg from "../assets/images/pineapple.jpg";
import grapesImg from "../assets/images/grapes.jpg";

const FRUITS = [
  { name: "Apple",      img: appleImg },      // i=0 → 0°  (3 o'clock)
  { name: "Banana",     img: bananaImg },     // i=1 → 45°
  { name: "Mango",      img: mangoImg },      // i=2 → 90° (6 o'clock)
  { name: "Strawberry", img: strawberryImg }, // i=3 → 135°
  { name: "Kiwi",       img: kiwiImg },       // i=4 → 180° (9 o'clock)
  { name: "Grapes",     img: grapesImg },     // i=5 → 225°
  { name: "Pineapple",  img: pineappleImg },  // i=6 → 270° (12 o'clock)
  { name: "Orange",     img: orangeImg },     // i=7 → 315°
];

// Reveal from 12 o'clock clockwise: Pineapple(6), Orange(7), Apple(0)…
const REVEAL_ORDER = [6, 7, 0, 1, 2, 3, 4, 5];

const FAST_DURATION   = 1000;  // 2 rounds × 0.5 s
const SLOW_DURATION   = 2500;  // 1 round  × 2.5 s (ease-out)
const REVEAL_INTERVAL = 320;   // ms between each fruit pop-in

export default function Home() {
  const [phase, setPhase]           = useState("idle");   // idle | fast | slow | reveal | open
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

    // ── Phase 1: fast spin ──
    setPhase("fast");

    addTimer(() => {
      // ── Phase 2: slow down ──
      setPhase("slow");

      addTimer(() => {
        // ── Phase 3: reveal one-by-one ──
        setPhase("reveal");

        REVEAL_ORDER.forEach((fruitIdx, step) => {
          addTimer(() => {
            setRevealedSet((prev) => new Set([...prev, fruitIdx]));
          }, step * REVEAL_INTERVAL);
        });

        // ── Phase 4: fully open ──
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
    // ignore during animation
  };

  useEffect(() => () => clearTimers(), []);

  const isMenuVisible = phase !== "idle";

  const wrapClass = [
    "radial-wrap",
    isMenuVisible ? "active" : "",
    `phase-${phase}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="home-container">
      <div className="orbit-field" aria-hidden="true" />

      {/* Pre-open tagline */}
      <div className={`bowl-tagline ${isMenuVisible ? "hidden" : ""}`}>
        <p className="tagline-title">Fruit Salad</p>
        <p className="tagline-sub">Touch to view the ingredients in it</p>
      </div>

      <div className={wrapClass}>
        <ul className="radial-menu">
          {FRUITS.map((fruit, i) => {
            const isRevealPhase = phase === "reveal";
            const isRevealed    = revealedSet.has(i);

            const itemClass = [
              "fruit-item",
              isRevealPhase && !isRevealed ? "pre-reveal"   : "",
              isRevealPhase &&  isRevealed ? "just-revealed" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <li key={fruit.name} className={itemClass} style={{ "--i": i }}>
                {/* fruit-content counter-rotates so circle + label stay upright */}
                <div className="fruit-content">
                  <div className="fruit-circle" tabIndex={phase === "open" ? 0 : -1}>
                    <img src={fruit.img} alt={fruit.name} draggable="false" />
                  </div>
                  <span className="fruit-label">{fruit.name}</span>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className={`bowl-button ${isMenuVisible ? "active" : ""}`}
          onClick={handleBowlClick}
          aria-expanded={isMenuVisible}
          aria-label={isMenuVisible ? "Close fruit menu" : "Open fruit menu"}
        >
          <img src={bowlImg} alt="" className="bowl-image" />
          <span className="bowl-ring" />
        </button>
      </div>
    </div>
  );
}
