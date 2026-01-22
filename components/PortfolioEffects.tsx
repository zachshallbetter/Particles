'use client';

import React, { useRef, useEffect } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import {
  BUTTON_PRESET_ENERGETIC,
  BUTTON_PRESET_SUBTLE,
  BUTTON_PRESET_MYSTICAL,
  BUTTON_PRESET_SUBMIT,
  BUTTON_PRESET_DANGER,
  INPUT_PRESET_FOCUS,
  CARD_PRESET_HOVER,
  LINK_PRESET_DIRECTIONAL,
  mergeEffects,
  createRandomEffect,
} from '@/utils/element-effects-presets';

/**
 * Example: Interactive Portfolio Navigation
 */
export function PortfolioNavigation() {
  const projectsRef = useRef<HTMLAnchorElement>(null);
  const sandboxRef = useRef<HTMLAnchorElement>(null);
  const experimentsRef = useRef<HTMLAnchorElement>(null);
  const blogRef = useRef<HTMLAnchorElement>(null);
  const resumeRef = useRef<HTMLAnchorElement>(null);

  const { registerElement } = useElementEffects();

  useEffect(() => {
    [projectsRef, sandboxRef, experimentsRef, blogRef].forEach((ref) => {
      registerElement(ref, LINK_PRESET_DIRECTIONAL);
    });

    registerElement(
      resumeRef,
      mergeEffects(LINK_PRESET_DIRECTIONAL, {
        particleHue: 60,
        glowIntensity: 0.9,
      })
    );
  }, [registerElement]);

  return (
    <nav className="flex gap-8 text-sm font-medium">
      <a ref={projectsRef} href="#projects" className="text-slate-300 hover:text-white transition-colors">
        Projects
      </a>
      <a ref={sandboxRef} href="/sandbox" className="text-slate-300 hover:text-white transition-colors">
        Sandbox
      </a>
      <a
        ref={experimentsRef}
        href="#experiments"
        className="text-slate-300 hover:text-white transition-colors"
      >
        Experiments
      </a>
      <a ref={blogRef} href="#blog" className="text-slate-300 hover:text-white transition-colors">
        Blog
      </a>
      <a ref={resumeRef} href="/resume" className="text-slate-300 hover:text-white transition-colors">
        📄 Resume
      </a>
    </nav>
  );
}

/**
 * Example: Interactive Project Card
 */
export function ProjectCard({
  title,
  description,
  tags,
  href,
}: {
  title: string;
  description: string;
  tags: string[];
  href: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(cardRef, CARD_PRESET_HOVER);
  }, [registerElement]);

  return (
    <a href={href} className="block">
      <div
        ref={cardRef}
        className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer"
      >
        <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
        <p className="text-sm text-slate-400 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-slate-700/50 text-xs text-slate-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

/**
 * Example: Interactive CTA Button Section
 */
export function CallToActionSection() {
  const primaryRef = useRef<HTMLButtonElement>(null);
  const secondaryRef = useRef<HTMLButtonElement>(null);

  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(primaryRef, BUTTON_PRESET_ENERGETIC);
    registerElement(secondaryRef, BUTTON_PRESET_SUBTLE);
  }, [registerElement]);

  return (
    <div className="flex gap-4">
      <button
        ref={primaryRef}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
      >
        Get In Touch
      </button>
      <button
        ref={secondaryRef}
        className="px-8 py-3 border border-slate-600 text-slate-300 rounded-lg font-bold hover:border-slate-400 transition-colors"
      >
        View Work
      </button>
    </div>
  );
}

/**
 * Example: Skill Tags with Varied Effects
 */
export function SkillTags({ skills }: { skills: string[] }) {
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    tagRefs.current.forEach((ref, index) => {
      if (!ref) return;

      // Create random effect for each tag with different hues
      const hueVariations = [0, 60, 120, 180, 240, 300];
      const hue = hueVariations[index % hueVariations.length];

      registerElement(
        { current: ref },
        mergeEffects(BUTTON_PRESET_SUBTLE, {
          particleHue: hue,
          scaleOnInteract: 1.1,
        })
      );
    });
  }, [registerElement]);

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <span
          key={skill}
          ref={(el) => {
            tagRefs.current[index] = el;
          }}
          className="px-4 py-2 bg-slate-700/50 text-sm text-slate-300 rounded-full border border-slate-600/50 hover:border-slate-500 transition-colors cursor-pointer"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

/**
 * Example: Form Input with Interactive Focus
 */
export function InteractiveFormField({
  label,
  type = 'text',
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(inputRef, INPUT_PRESET_FOCUS);
  }, [registerElement]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
      />
    </div>
  );
}

/**
 * Example: Mystical Button (both hover and click)
 */
export function MysticalButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(buttonRef, BUTTON_PRESET_MYSTICAL);
  }, [registerElement]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
    >
      {children}
    </button>
  );
}

/**
 * Example: Action Button with Success Effect
 */
export function SubmitButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(buttonRef, BUTTON_PRESET_SUBMIT);
  }, [registerElement]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
    >
      {children}
    </button>
  );
}

/**
 * Example: Dangerous Action Button
 */
export function DangerButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(buttonRef, BUTTON_PRESET_DANGER);
  }, [registerElement]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
    >
      {children}
    </button>
  );
}

/**
 * Example: Tag Grid with Varying Effects
 */
export function SkillGrid({ title, skills }: { title: string; skills: string[] }) {
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    tagRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const randomEffect = createRandomEffect(BUTTON_PRESET_SUBTLE, 0.15);
      registerElement({ current: ref }, randomEffect);
    });
  }, [registerElement]);

  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={skill}
            ref={(el) => {
              tagRefs.current[index] = el;
            }}
            className="px-3 py-1 bg-slate-700/50 text-xs text-slate-300 rounded border border-slate-600/50 hover:border-slate-500 transition-colors cursor-pointer"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
