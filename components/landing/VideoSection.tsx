'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Overline, Heading, Text, RevealOnScroll, springs } from '@/components/ui';

export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const videoId = process.env.NEXT_PUBLIC_DEMO_VIDEO_ID;

  return (
    <section className="bg-white py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <RevealOnScroll>
          <Overline className="mb-3">See it in action</Overline>
          <Heading as="h2" size="h2" color="primary" className="mb-4">
            How NuroCare works
          </Heading>
          <Text size="lg" color="secondary" className="max-w-xl mx-auto mb-12">
            A 90-second tour of the app — from choosing a plan to submitting your first claim.
          </Text>
        </RevealOnScroll>

        {/* Video container */}
        <RevealOnScroll delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-neutral-150 aspect-video bg-primary-900">
            {playing && videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="NuroCare overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {videoId ? (
                  <motion.button
                    onClick={() => setPlaying(true)}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.08, transition: springs.snappy }}
                    whileTap={{ scale: 0.95, transition: springs.snappy }}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
                    aria-label="Play video"
                  >
                    <Play size={30} className="text-primary-800 fill-primary-800 ml-1" />
                  </motion.button>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                    <Play size={30} className="text-white/40 ml-1" />
                  </div>
                )}
                <Text size="sm" weight="medium" color="inverse" className="opacity-70">
                  {videoId ? 'Watch 90-sec overview' : 'Demo video coming soon'}
                </Text>
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
