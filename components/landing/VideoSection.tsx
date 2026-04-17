'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-white py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">See it in action</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 mb-4">
          How NuroCare works
        </h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto mb-12">
          A 90-second tour of the app — from choosing a plan to submitting your first claim.
        </p>

        {/* Video container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
          {!playing ? (
            <>
              {/* Thumbnail overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-slate-900/70 to-accent-900/60 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-1 bg-white/20 rounded-full mb-2" />
                <button
                  onClick={() => setPlaying(true)}
                  className="group w-20 h-20 rounded-full bg-white/15 border-2 border-white/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow"
                  aria-label="Play video"
                >
                  <Play size={32} className="text-white fill-white ml-1" />
                </button>
                <p className="text-white/70 text-sm font-medium">Watch 90-sec overview</p>
              </div>
              {/* Background grid art */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </>
          ) : (
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="NuroCare overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
