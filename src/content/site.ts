/**
 * All copy and placeholder details live here so they're easy to edit.
 * Anything in [brackets] is a placeholder that still needs real information.
 */

export const site = {
  name: "Tane Online Academy",
  tagline: "Where future begins.",
  subTagline: "One Ecosystem. Complete Human Development.",
  description:
    "An online learning experience that nurtures knowledge, strengthens character, and helps every learner progress with purpose.",
  // Used for canonical URLs, Open Graph and the sitemap. Set NEXT_PUBLIC_SITE_URL in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://[your-domain].com",
  nextIntake: {
    day: "[DD]",
    month: "[Month YYYY]",
    label: "Next intake: [date]",
  },
  contact: {
    email: "[hello@your-domain.com]",
    phone: "[+00 000 000 0000]",
    whatsapp: "[WhatsApp number]",
    address: "[Office address, City, Country]",
  },
  social: [
    { label: "Instagram", href: "[https://instagram.com/your-handle]" },
    { label: "YouTube", href: "[https://youtube.com/@your-channel]" },
    { label: "LinkedIn", href: "[https://linkedin.com/company/your-page]" },
  ],
  assessmentHref: "[/request-assessment]",
};

export const statement = {
  eyebrow: "About Tane",
  sentence: "Education should do more than prepare students for examinations.",
  mission:
    "To provide quality education, ethical guidance, practical life skills, and compassionate support that empower every learner.",
  vision:
    "To nurture an empowered, morally grounded, and resilient generation capable of transforming their communities.",
};

export const approach = {
  eyebrow: "Our approach",
  title: "The learner before the label.",
  body: "No two students learn in exactly the same way. We seek to understand where each student stands, identify learning gaps, and guide them towards genuine mastery rather than superficial progress.",
  steps: [
    {
      title: "Understand Before Advancing",
      text: "Identify existing strengths and foundational gaps before deciding the next learning step.",
      icon: "target",
    },
    {
      title: "Master the Fundamentals",
      text: "Build reading, comprehension, numeracy, and subject knowledge before moving forward.",
      icon: "book",
    },
    {
      title: "Progress with Purpose",
      text: "Use assessment and learning guidance to understand progress and what needs attention next.",
      icon: "cap",
    },
  ] as const,
};

export const programmes = {
  eyebrow: "Programmes",
  title: "One ecosystem. Four ways to grow.",
  body: "Every learner arrives with a different story. Choose the path that fits theirs — or combine them.",
  items: [
    {
      name: "Tane Online School",
      line: "Structured primary and secondary schooling through live classes, recorded lessons and ongoing assessment.",
      href: "[/programmes/online-school]",
      image: "programme-school",
      alt: "A learner in headphones follows a live maths lesson on a laptop.",
      tone: "teal",
    },
    {
      name: "Tane Online Madrasa",
      line: "Qur'an, Arabic and Islamic studies taught with care, structure and a clear path of progress.",
      href: "[/programmes/online-madrasa]",
      image: "programme-madrasa",
      alt: "A boy in a prayer cap learns from his teacher over a video call.",
      tone: "lime",
    },
    {
      name: "Tane Remedial Learning",
      line: "Targeted support that rebuilds foundational literacy and numeracy, one clear step at a time.",
      href: "[/programmes/remedial-learning]",
      image: "programme-remedial",
      alt: "A learner works through fractions with a teacher on screen.",
      tone: "teal",
    },
    {
      name: "Tane Life Skills Academy",
      line: "Communication, leadership, critical thinking and wellbeing — skills that last beyond the classroom.",
      href: "[/programmes/life-skills]",
      image: "programme-lifeskills",
      alt: "A laptop showing a life-skills course beside books on leadership and communication.",
      tone: "lime",
    },
  ] as const,
};

export const enrol = {
  eyebrow: "Enroll",
  title: "Where would you like to begin?",
  body: "Every journey starts with a conversation. A short assessment helps us understand where your child stands and which programme will help them grow.",
  cta: "Request an assessment",
};

export const nav = [
  { label: "Approach", href: "#approach" },
  { label: "Programmes", href: "#programmes" },
  { label: "Enroll", href: "#enrol" },
];

