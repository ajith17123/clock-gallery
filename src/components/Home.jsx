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
  {
    name: "Apple",
    img: appleImg,
    advantages: ["High in soluble fiber", "Supports cardiovascular health", "Promotes friendly gut bacteria"],
    disadvantages: ["Seeds contain tiny traces of cyanide", "Can cause bloating in sensitive people", "Relatively high in fructose sugar"]
  },
  {
    name: "Banana",
    img: bananaImg,
    advantages: ["Rich in heart-healthy potassium", "Quick, easily digestible energy", "Gentle on the stomach lining"],
    disadvantages: ["High in quick-release carbohydrates", "Can cause rapid blood sugar rises", "Prone to bruising and ripening fast"]
  },
  {
    name: "Mango",
    img: mangoImg,
    advantages: ["Excellent Vitamin A & C content", "Packed with protective antioxidants", "Contains skin-glowing nutrients"],
    disadvantages: ["Very high natural glycemic index", "Skin and sap can cause irritation", "May lead to weight gain if overeaten"]
  },
  {
    name: "Strawberry",
    img: strawberryImg,
    advantages: ["Very low in calories and sugars", "Rich in Vitamin C and flavonoids", "Supports healthy blood pressure"],
    disadvantages: ["Common allergen for children", "May harbor high pesticide residues", "Perishes and molds very quickly"]
  },
  {
    name: "Kiwi",
    img: kiwiImg,
    advantages: ["Contains sleep-enhancing compounds", "Aids in protein digestion processes", "Extremely dense in Vitamin E & K"],
    disadvantages: ["Can cause tongue or mouth tingling", "High in kidney stone-promoting oxalates", "Acidic profile can irritate gums"]
  },
  {
    name: "Grapes",
    img: grapesImg,
    advantages: ["Rich in youth-promoting resveratrol", "Superb hydration and water content", "Supports brain function and focus"],
    disadvantages: ["High density of simple sugars", "Very easy to overindulge in volume", "Choking hazard for toddlers"]
  },
  {
    name: "Pineapple",
    img: pineappleImg,
    advantages: ["Contains bromelain for digestion", "Strong anti-inflammatory benefits", "Speeds up muscle tissue recovery"],
    disadvantages: ["Active enzymes can sting the mouth", "High acid wears down tooth enamel", "Can trigger allergic oral reactions"]
  },
  {
    name: "Orange",
    img: orangeImg,
    advantages: ["Outstanding daily Vitamin C source", "Supports skin collagen synthesis", "Highly hydrating and refreshing"],
    disadvantages: ["High citric acid triggers acid reflux", "Can weaken tooth enamel over time", "Excess juice can lead to bloating"]
  }
];

const DEFAULT_INFO = {
  name: "Fruit Salad",
  advantages: [
    "Delivers a wide spectrum of essential vitamins",
    "High dietary fiber content aids digestion",
    "Natural source of antioxidants and water"
  ],
  disadvantages: [
    "Concentration of sugars can spike insulin",
    "Acidic fruits may cause mild stomach reflux",
    "Slightly lower protein and healthy fats"
  ]
};

// Reveal from 12 o'clock clockwise: Pineapple(6), Orange(7), Apple(0)…
const REVEAL_ORDER = [6, 7, 0, 1, 2, 3, 4, 5];

const FAST_DURATION   = 1000;  // 2 rounds × 0.5 s
const SLOW_DURATION   = 2500;  // 1 round  × 2.5 s (ease-out)
const REVEAL_INTERVAL = 320;   // ms between each fruit pop-in

export default function Home() {
  const [phase, setPhase]           = useState("idle");   // idle | fast | slow | reveal | open
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);
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
    setHoveredIndex(null);
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

  const activeInfo = hoveredIndex !== null ? FRUITS[hoveredIndex] : DEFAULT_INFO;

  return (
    <div className="home-container">
      <div className="orbit-field" aria-hidden="true" />

      {/* Floating Advantages Panel */}
      <div className={`info-panel info-panel--left ${phase === "open" ? "visible" : ""}`}>
        <div className="info-panel-title">
          <span className="info-icon info-icon--pro">✓</span>
          <h3>Advantages</h3>
        </div>
        <div className="info-panel-subtitle">{activeInfo.name}</div>
        <ul className="info-panel-list">
          {activeInfo.advantages.map((adv, idx) => (
            <li key={idx}>{adv}</li>
          ))}
        </ul>
      </div>

      {/* Floating Disadvantages Panel */}
      <div className={`info-panel info-panel--right ${phase === "open" ? "visible" : ""}`}>
        <div className="info-panel-title">
          <span className="info-icon info-icon--con">✗</span>
          <h3>Disadvantages</h3>
        </div>
        <div className="info-panel-subtitle">{activeInfo.name}</div>
        <ul className="info-panel-list">
          {activeInfo.disadvantages.map((dis, idx) => (
            <li key={idx}>{dis}</li>
          ))}
        </ul>
      </div>

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
              <li
                key={fruit.name}
                className={itemClass}
                style={{ "--i": i }}
                onMouseEnter={() => phase === "open" && setHoveredIndex(i)}
                onMouseLeave={() => phase === "open" && setHoveredIndex(null)}
              >
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
