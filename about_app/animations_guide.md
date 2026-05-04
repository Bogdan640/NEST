# Angular Animations & Styling Guide

During the migration from React (Figma prototype) to Angular 21, we needed to translate animations and styles that were originally built using **Framer Motion** and **Tailwind CSS** into native Angular constructs and SCSS. 

This document explains how these design elements are now implemented.

## 1. Tailwind CSS to SCSS Translation

Instead of utility classes, we are now using a structured SCSS architecture based on Design Tokens (Variables) and Mixins.

| Tailwind (Figma) | SCSS Implementation in Angular | File Location |
|-------------------|--------------------------------|---------------|
| `bg-emerald-50`, `text-emerald-900` | Variables like `$color-surface` and `$color-text-primary` | `styles/_variables.scss` |
| `rounded-[2rem]` | `border-radius: $radius-card` | `styles/_variables.scss` |
| `shadow-xl shadow-emerald-200` | `box-shadow: $shadow-card` | `styles/_variables.scss` |
| `backdrop-blur-2xl bg-white/80` | `@include glassmorphism` | `styles/_mixins.scss` |

Components no longer have inline classes for spacing and colors. Instead, they use semantic class names (e.g., `.event-card`, `.btn-primary`) which apply styles from our global mixins and variables.

## 2. Framer Motion to Angular Animations

Framer Motion relies heavily on React's render cycle. In Angular, we use a combination of **SCSS Keyframes** for continuous/micro-interactions and **Angular's `@angular/animations`** module for complex state transitions.

### Micro-Interactions (Hover, Tap)
Framer Motion's `whileHover` and `whileTap` are replaced with native CSS pseudo-classes combined with CSS transitions. This provides better performance as it runs entirely on the GPU without JS overhead.

| Framer Motion | SCSS Equivalent |
|---------------|-----------------|
| `whileHover={{ scale: 1.02, y: -2 }}` | `&:hover { transform: scale(1.02) translateY(-2px); }` |
| `whileTap={{ scale: 0.98 }}` | `&:active { transform: scale(0.98); }` |
| `transition={{ type: 'spring' }}` | `transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);` |

### Keyframe Animations (Floating Elements, Spinners)
Continuous animations like the floating leaf in the splash screen are implemented using `@keyframes`.

```scss
/* styles/_animations.scss */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}
```

### Route & Enter/Leave Animations
Framer's `<AnimatePresence>` for enter/leave animations maps directly to Angular's `:enter` and `:leave` transition aliases, which can be applied to elements conditionally rendered with `@if`.

For page transitions, we use Angular's router animations:

```typescript
import { trigger, transition, style, animate } from '@angular/animations';

export const fadeSlideIn = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
```

## 3. Icons

We migrated from `lucide-react` to `lucide-angular`. The icon names and visual appearance remain exactly the same, but the implementation is now Angular-native.

## Summary

By moving to standard SCSS and native Angular animations, the application will:
1. Bundle smaller (no Framer Motion overhead).
2. Render faster (relying on browser-native CSS transitions).
3. Maintain a clean, readable DOM without hundreds of inline utility classes.
