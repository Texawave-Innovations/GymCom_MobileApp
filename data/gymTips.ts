import type { ImageSourcePropType } from 'react-native';

export type GymTip = {
  id: string;
  category: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
};

export const GYM_TIPS: GymTip[] = [
  {
    id: 'progressive-overload',
    category: 'Programming',
    title: 'Progressive Overload',
    body: 'Muscle grows when you ask it to do more than last time. Add a little weight, an extra rep, or a cleaner set each week. Small increments compound into big results over months.',
    image: require('../assets/new-img.webp'),
  },
  {
    id: 'form-before-load',
    category: 'Technique',
    title: 'Master Form Before Load',
    body: 'Ego lifting builds injuries, not physiques. Own a weight with strict, controlled technique through a full range before you add plates. Perfect reps at 80% beat sloppy reps at 100%.',
    image: require('../assets/arnold.webp'),
  },
  {
    id: 'compounds-first',
    category: 'Programming',
    title: 'Prioritise Compound Lifts',
    body: 'Squats, deadlifts, presses and rows recruit the most muscle and drive the most growth. Do them first while you are fresh, then finish with isolation work for detail.',
    image: require('../assets/splitarnold.jpg'),
  },
  {
    id: 'protein-every-meal',
    category: 'Nutrition',
    title: 'Protein at Every Meal',
    body: 'Aim for roughly 1.6-2.2 g of protein per kg of bodyweight per day, spread across 3-5 meals. Consistent daily intake matters far more than any single post-workout shake.',
    image: require('../assets/franco-img.webp'),
  },
  {
    id: 'sleep',
    category: 'Recovery',
    title: 'Sleep Is Anabolic',
    body: 'You do not grow in the gym, you grow while you recover. Seven to nine hours of quality sleep drives hormone production, strength gains and appetite control. Guard it like a training session.',
    image: require('../assets/yates-img.webp'),
  },
  {
    id: 'warm-up',
    category: 'Technique',
    title: 'Warm Up With Intent',
    body: 'A few light ramp-up sets raise core temperature, prime the nervous system and groove the movement pattern. Two or three progressively heavier sets before your working weight is enough.',
    image: require('../assets/tom-platz.webp'),
  },
  {
    id: 'mind-muscle',
    category: 'Technique',
    title: 'Mind-Muscle Connection',
    body: 'Focus on the target muscle contracting and lengthening through each rep. Slowing the lowering phase and squeezing at peak contraction turns a movement into a muscle-building stimulus.',
    image: require('../assets/zane-img.webp'),
  },
  {
    id: 'rest-periods',
    category: 'Programming',
    title: 'Control Your Rest Periods',
    body: 'Rest 2-3 minutes on heavy compounds so strength stays high, and 45-90 seconds on isolation work to keep intensity up. Timing your rest keeps sessions honest and repeatable.',
    image: require('../assets/kevin-levroni.webp'),
  },
  {
    id: 'full-rom',
    category: 'Technique',
    title: 'Train Full Range of Motion',
    body: 'Partial reps leave growth on the table. Loading a muscle in a deep stretch is one of the strongest hypertrophy signals we know of, so take each rep through its complete range.',
    image: require('../assets/olivia-img.webp'),
  },
  {
    id: 'consistency',
    category: 'Mindset',
    title: 'Consistency Beats Intensity',
    body: 'One brutal session you cannot repeat is worth less than years of solid, sustainable training. Show up, hit your numbers, recover, and let the calendar do the heavy lifting.',
    image: require('../assets/mike mentzer.webp'),
  },
];
