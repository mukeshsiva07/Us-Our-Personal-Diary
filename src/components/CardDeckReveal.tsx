import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { JourneyCard } from './JourneyCard';
import { diaryService } from '../api/diaryService';
import { SectionType } from '../types/diary';

interface CardDeckRevealProps {
  counts: Record<SectionType, number>;
}

export const CardDeckReveal: React.FC<CardDeckRevealProps> = ({ counts }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const session = diaryService.getCurrentSession();
    if (session?.justLoggedIn) {
      setShouldAnimate(true);
      // Consume the flag so refreshing or returning doesn't replay the deal animation
      diaryService.clearJustLoggedInFlag();
    }
  }, []);

  const cardsData = [
    {
      section: 'mukesh' as SectionType,
      title: "Mukesh's Journey",
      subtitle: 'Milo · Visuals & Thought',
      tagline: 'Frames of life through the lens, quiet reflections, and mechanical cameras.',
      count: counts.mukesh,
      initialOffset: -20, // initial rotation/offset in the physical deck
      isMiddle: false,
    },
    {
      section: 'combined' as SectionType,
      title: "Copiko & Milo's Soul",
      subtitle: 'Our Shared World · Dual POV',
      tagline: 'Where two perspectives intertwine — mutual vows, journeys, and quiet moments.',
      count: counts.combined,
      initialOffset: 0,
      isMiddle: true,
    },
    {
      section: 'anne' as SectionType,
      title: "Anne's Journey",
      subtitle: 'Copiko · Wander & Heart',
      tagline: 'Wanderlust journals, windswept horizons, memories, and handwritten dreams.',
      count: counts.anne,
      initialOffset: 20,
      isMiddle: false,
    },
  ];

  // Natural spring transition replicating a physical card deal
  const springTransition = (index: number) => ({
    type: 'spring',
    damping: 18,
    stiffness: 110,
    mass: 0.9,
    delay: index * 0.12, // 120ms stagger
  });

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch justify-center">
        {cardsData.map((item, index) => {
          if (!shouldAnimate) {
            // Instant in-place render for subsequent visits
            return (
              <div key={item.section} className="h-full">
                <JourneyCard
                  section={item.section}
                  title={item.title}
                  subtitle={item.subtitle}
                  tagline={item.tagline}
                  entryCount={item.count}
                  isMiddle={item.isMiddle}
                />
              </div>
            );
          }

          // Dealt-card animation when just logged in
          return (
            <motion.div
              key={item.section}
              layout
              initial={{
                opacity: 0,
                scale: 0.88,
                y: 60,
                rotate: item.initialOffset * 0.35,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: 0,
              }}
              transition={springTransition(index)}
              className="h-full"
            >
              <JourneyCard
                section={item.section}
                title={item.title}
                subtitle={item.subtitle}
                tagline={item.tagline}
                entryCount={item.count}
                isMiddle={item.isMiddle}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

