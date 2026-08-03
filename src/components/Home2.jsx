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
  {
    name: "Espresso",
    img: espressoImg,
    advantages: ["Extremely rich in health antioxidants", "Enhances memory recall and focus", "Very low in calories (nearly zero)"],
    disadvantages: ["High caffeine spike can trigger jitteriness", "Can increase heart rate temporarily", "May irritate empty stomach lining"]
  },
  {
    name: "Cappuccino",
    img: cappuccinoImg,
    advantages: ["Balanced flavor profile", "Milk foam provides protein & calcium", "Helps prevent cellular oxidation"],
    disadvantages: ["Higher in calories than black coffee", "Can trigger dairy/lactose sensitivity", "Foam goes flat if not consumed quickly"]
  },
  {
    name: "Latte",
    img: latteImg,
    advantages: ["Very smooth, mild coffee flavor", "Provides calcium and essential vitamins", "Highly customizable with syrups"],
    disadvantages: ["Highest calorie option due to milk volume", "Dilutes the direct strength of espresso", "Can lead to bloating for some"]
  },
  {
    name: "Mocha",
    img: mochaImg,
    advantages: ["Rich, comforting chocolate flavor", "Boosts mood and neurotransmitters", "Great dessert-coffee alternative"],
    disadvantages: ["Very high in sugar and fats", "Easy to consume excess calories", "Can cause sugar crashes later"]
  },
  {
    name: "Americano",
    img: americanoImg,
    advantages: ["Low calorie and sugar-free", "Retains deep, complex coffee notes", "More hydrating due to added hot water"],
    disadvantages: ["Can taste overly bitter if over-extracted", "High acidity levels", "Lacks the creamy texture of milk coffees"]
  },
  {
    name: "Macchiato",
    img: macchiatoImg,
    advantages: ["Strong espresso taste with a milk touch", "Very low in calories and sugars", "Perfect afternoon pick-me-up size"],
    disadvantages: ["Can be too intense for sweet-coffee fans", "Very small serving volume", "Cooler temperature due to cold milk dot"]
  },
  {
    name: "Cold Brew",
    img: coldBrewImg,
    advantages: ["67% less acidic than hot coffee", "Naturally sweeter, smoother taste", "Higher caffeine content for focus"],
    disadvantages: ["High caffeine can disrupt sleep schedules", "Requires 12+ hours to brew at home", "Can be easy to over-consume cold"]
  },
  {
    name: "Flat White",
    img: flatWhiteImg,
    advantages: ["Velvety microfoam texture", "Stronger espresso kick than a latte", "Consistent rich flavor throughout"],
    disadvantages: ["High milk content adds calories", "Lactose issues for milk-sensitive folks", "Requires high barista skill to make"]
  }
];

const DEFAULT_COFFEE_INFO = {
  name: "Coffee Creations",
  advantages: [
    "Boosts metabolic rate and fat burning",
    "Contains essential nutrients like B-vitamins",
    "Improves physical and cognitive performance"
  ],
  disadvantages: [
    "Excess caffeine can disrupt sleep quality",
    "Can lead to mild physical dependency",
    "Stains tooth enamel with frequent drinking"
  ]
};

// Reveal from 12 o'clock clockwise: Cold Brew(6), Flat White(7), Espresso(0)…
const REVEAL_ORDER    = [6, 7, 0, 1, 2, 3, 4, 5];
const FAST_DURATION   = 1000;   // 2 rounds × 0.5 s
const SLOW_DURATION   = 2500;   // 1 round  × 2.5 s ease-out
const REVEAL_INTERVAL = 320;    // ms between each coffee pop-in

export default function Home2() {
  const [phase, setPhase]             = useState("idle");
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
    setHoveredIndex(null);
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

  const activeInfo = hoveredIndex !== null ? COFFEES[hoveredIndex] : DEFAULT_COFFEE_INFO;

  return (
    <div className="home2-container">
      <div className="orbit-field2" aria-hidden="true" />

      {/* Floating Advantages Panel */}
      <div className={`info-panel2 info-panel2--left ${phase === "open" ? "visible" : ""}`}>
        <div className="info-panel2-title">
          <span className="info-icon2 info-icon2--pro">✓</span>
          <h3>Advantages</h3>
        </div>
        <div className="info-panel2-subtitle">{activeInfo.name}</div>
        <ul className="info-panel2-list">
          {activeInfo.advantages.map((adv, idx) => (
            <li key={idx}>{adv}</li>
          ))}
        </ul>
      </div>

      {/* Floating Disadvantages Panel */}
      <div className={`info-panel2 info-panel2--right ${phase === "open" ? "visible" : ""}`}>
        <div className="info-panel2-title">
          <span className="info-icon2 info-icon2--con">✗</span>
          <h3>Disadvantages</h3>
        </div>
        <div className="info-panel2-subtitle">{activeInfo.name}</div>
        <ul className="info-panel2-list">
          {activeInfo.disadvantages.map((dis, idx) => (
            <li key={idx}>{dis}</li>
          ))}
        </ul>
      </div>

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
              <li
                key={coffee.name}
                className={itemClass}
                style={{ "--i": i }}
                onMouseEnter={() => phase === "open" && setHoveredIndex(i)}
                onMouseLeave={() => phase === "open" && setHoveredIndex(null)}
              >
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
