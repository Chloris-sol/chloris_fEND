import React, { useRef } from "react";
import { motion, type Variants, useInView } from "framer-motion";

/* ---------------- Icons ---------------- */

const TotalApyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-emerald-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const CtnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-emerald-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserApyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-blue-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProtocolFeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-purple-400">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

/* ---------------- Component ---------------- */

const NetworkingCard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const animationState = isInView ? "visible" : "hidden";

  /* -------- Line drawing -------- */

  const drawLine: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration: 0.8, ease: "easeInOut" },
        opacity: { delay, duration: 0.1 },
      },
    }),
  };

  /* -------- Dot travel -------- */

  const travelDot: Variants = {
    hidden: { opacity: 0 },
    visible: (params: { delay: number; to: number }) => ({
      opacity: 1,
      cy: params.to,
      transition: {
        delay: params.delay,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  /* -------- Bubble -------- */

  const bubble: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay, duration: 0.3, ease: "easeOut" },
    }),
  };

  const stemDelay = 0.1;
  const branchDelay = stemDelay + 0.4;
  const topBubbleDelay = stemDelay + 0.3;
  const dotDelay = branchDelay + 0.3;
  const bottomBubbleDelay = dotDelay + 0.3;

  const DOT_END_Y = 110;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
      <div className="relative w-full max-w-3xl rounded-[2.5rem] bg-[#050a0c] border border-gray-800/50 p-6 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(20,241,149,0.15),_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Rearchitect Yield for Impact
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            A single APY, precisely allocated across user returns, protocol sustainability, and verifiable real-world impact.
          </p>

          {/* Diagram + added bottom margin */}
          <div
            ref={ref}
            className="relative w-full max-w-[600px] mx-auto h-[220px] md:h-[260px] mt-6 mb-6 md:mb-10 aspect-[600/200]"
          >
            <svg
              viewBox="0 0 600 200"
              className="absolute inset-0 w-full h-full text-gray-500/30"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Main stem */}
              <motion.path
                d="M300 0 V 60"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={drawLine}
                initial="hidden"
                animate={animationState}
                custom={stemDelay}
              />

              {/* Left branch */}
              <motion.path
                d="M300 60 H 130 Q 100 60 100 90 V 150"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={drawLine}
                initial="hidden"
                animate={animationState}
                custom={branchDelay}
              />

              {/* Middle branch */}
              <motion.path
                d="M300 60 V 150"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={drawLine}
                initial="hidden"
                animate={animationState}
                custom={branchDelay}
              />

              {/* Right branch */}
              <motion.path
                d="M300 60 H 470 Q 500 60 500 90 V 150"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={drawLine}
                initial="hidden"
                animate={animationState}
                custom={branchDelay}
              />

              {/* Traveling dots */}
              <motion.circle
                cx="100"
                cy="90"
                r="4"
                fill="white"
                variants={travelDot}
                initial="hidden"
                animate={animationState}
                custom={{ delay: dotDelay, to: DOT_END_Y }}
              />
              <motion.circle
                cx="300"
                cy="60"
                r="4"
                fill="white"
                variants={travelDot}
                initial="hidden"
                animate={animationState}
                custom={{ delay: dotDelay, to: DOT_END_Y }}
              />
              <motion.circle
                cx="500"
                cy="90"
                r="4"
                fill="white"
                variants={travelDot}
                initial="hidden"
                animate={animationState}
                custom={{ delay: dotDelay, to: DOT_END_Y }}
              />
            </svg>

            {/* Top bubble */}
            <div className="w-full flex justify-center h-fit absolute top-0 left-0">
              <motion.div
                className="w-fit bg-[#131C1E] border border-gray-700/50 rounded-full px-4 py-1.5 md:px-5 md:py-2 text-gray-200 text-sm md:text-base flex items-center gap-2 md:gap-3"
                variants={bubble}
                initial="hidden"
                animate={animationState}
                custom={topBubbleDelay}
              >
                <TotalApyIcon />
                Total APY
              </motion.div>
            </div>

            {/* Bottom bubbles */}
            <div className="absolute top-[175px] md:top-[175px] left-0 w-full flex flex-wrap justify-around px-2 md:px-4 gap-2 md:gap-0">
              <motion.div
                className="flex items-center gap-2 bg-[#131C1E] border border-gray-700/50 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-gray-200 text-xs md:text-sm"
                variants={bubble}
                initial="hidden"
                animate={animationState}
                custom={bottomBubbleDelay}
              >
                <CtnIcon />
                <span>CTN (Impact)</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 bg-[#131C1E] border border-gray-700/50 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-gray-200 text-xs md:text-sm"
                variants={bubble}
                initial="hidden"
                animate={animationState}
                custom={bottomBubbleDelay + 0.1}
              >
                <UserApyIcon />
                <span>User APY</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 bg-[#131C1E] border border-gray-700/50 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-gray-200 text-xs md:text-sm"
                variants={bubble}
                initial="hidden"
                animate={animationState}
                custom={bottomBubbleDelay + 0.2}
              >
                <ProtocolFeeIcon />
                <span>Protocol Fee</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingCard;