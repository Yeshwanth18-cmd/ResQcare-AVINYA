import type { Assessment, Resource, ThemeName, ThemePalette } from './types';

export const PHQ9_ASSESSMENT: Assessment = {
  id: 'phq-9',
  title: 'Patient Health Questionnaire (PHQ-9)',
  description: 'This is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
  disclaimer: 'This tool is for screening purposes only and is not a substitute for a professional diagnosis. Please consult with a healthcare provider for any health concerns.',
  sourceInfo: 'PHQ-9 was developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues. For research information, contact Dr. Kroenke at kkroenke@regenstrief.org.',
  questions: [
    { text: 'Little interest or pleasure in doing things', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Feeling down, depressed, or hopeless', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Trouble falling or staying asleep, or sleeping too much', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Feeling tired or having little energy', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Poor appetite or overeating', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Trouble concentrating on things, such as reading the newspaper or watching television', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    { text: 'Thoughts that you would be better off dead or of hurting yourself in some way', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
  ],
  scoring: [
    { level: 'None-minimal', range: [0, 4], interpretation: 'No significant depressive symptoms.' },
    { level: 'Mild', range: [5, 9], interpretation: 'Mild depressive symptoms. Monitor symptoms.' },
    { level: 'Moderate', range: [10, 14], interpretation: 'Moderate depressive symptoms. A treatment plan may be helpful.' },
    { level: 'Moderately Severe', range: [15, 19], interpretation: 'Moderately severe depressive symptoms. Active treatment is likely warranted.' },
    { level: 'Severe', range: [20, 27], interpretation: 'Severe depressive symptoms. Immediate intervention is recommended.' },
  ],
};

export const GAD7_ASSESSMENT: Assessment = {
    id: 'gad-7',
    title: 'Generalized Anxiety Disorder (GAD-7)',
    description: 'A tool for screening and measuring the severity of generalized anxiety disorder.',
    disclaimer: 'This tool is for screening purposes only and is not a substitute for a professional diagnosis. Please consult with a healthcare provider for any health concerns.',
    sourceInfo: 'GAD-7 was developed by Drs. Robert L. Spitzer, Kurt Kroenke, Janet B.W. Williams, and colleagues. For research information, contact Dr. Kroenke at kkroenke@regenstrief.org.',
    questions: [
        { text: 'Feeling nervous, anxious, or on edge', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        // FIX: Corrected typo 'aue' to 'value'
        { text: 'Not being able to stop or control worrying', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        { text: 'Worrying too much about different things', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        { text: 'Trouble relaxing', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        { text: 'Being so restless that it is hard to sit still', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        { text: 'Becoming easily annoyed or irritable', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
        { text: 'Feeling afraid, as if something awful might happen', options: [{ text: 'Not at all', value: 0 }, { text: 'Several days', value: 1 }, { text: 'More than half the days', value: 2 }, { text: 'Nearly every day', value: 3 }] },
    ],
    scoring: [
        { level: 'Minimal', range: [0, 4], interpretation: 'Minimal anxiety.' },
        { level: 'Mild', range: [5, 9], interpretation: 'Mild anxiety.' },
        { level: 'Moderate', range: [10, 14], interpretation: 'Moderate anxiety.' },
        { level: 'Severe', range: [15, 21], interpretation: 'Severe anxiety.' },
    ],
};

export const MENTAL_HEALTH_RESOURCES: Resource[] = [
  {
    id: 'who-stress-guide-1',
    title: 'Doing What Matters in Times of Stress',
    description: 'An illustrated guide on practical skills to cope with stress. A WHO guide covering grounding, unhooking from unhelpful thoughts, and acting on your values.',
    contentType: 'Guide',
    category: 'Stress',
    tags: ['stress', 'coping-strategies', 'mindfulness', 'self-help'],
    link: 'https://www.who.int/publications/i/item/9789240003927',
    source: 'WHO',
    audience: 'General',
    difficulty: 'Beginner',
    timeToComplete: 20,
    publish_date: '2020-03-30',
    author: 'World Health Organization',
    key_points: [
        "Learn grounding techniques to manage overwhelming feelings.",
        "Practice unhooking from unhelpful thoughts and emotions.",
        "Identify your personal values to guide your actions.",
        "Develop a step-by-step plan to solve problems effectively."
    ],
    is_ai_generated: true,
    needs_review: true,
    ai_summary: 'This WHO illustrated guide offers practical skills for stress management, such as grounding and unhooking from negative thoughts. It is designed to be accessible and easy to follow.',
    ai_related_links: [
        { title: 'Mindful Breathing Exercise', url: '/resources/who-mindfulness-audio-5' },
        { title: 'Coping with Depression (SAMHSA)', url: '/resources/samhsa-depression-guide-3' }
    ]
  },
  {
    id: 'nimh-anxiety-brochure-2',
    title: 'Anxiety Disorders',
    description: 'A detailed brochure from the National Institute of Mental Health (NIMH) explaining different anxiety disorders, symptoms, and treatment options.',
    contentType: 'Article',
    category: 'Anxiety',
    tags: ['anxiety', 'education', 'treatment', 'symptoms'],
    link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
    source: 'NIMH',
    audience: 'General',
    difficulty: 'Intermediate',
    timeToComplete: 15,
    publish_date: '2023-04-01',
    author: 'National Institute of Mental Health',
    key_points: [
        "Anxiety disorders involve more than temporary worry or fear.",
        "Several major types of anxiety disorders exist, including GAD, Panic Disorder, and Phobias.",
        "Effective treatments include psychotherapy and medication.",
        "Consulting a healthcare provider is the first step to diagnosis."
    ],
    is_ai_generated: true,
    needs_review: false,
    ai_summary: 'An NIMH overview of various anxiety disorders, covering symptoms and potential treatments. It serves as a foundational educational resource for patients and families.',
    ai_related_links: [
        { title: 'Take GAD-7 Anxiety Screener', url: '#/assessments/gad-7' },
        { title: '988 Suicide & Crisis Lifeline', url: '/resources/samhsa-crisis-hotline-7' }
    ]
  },
  {
    id: 'samhsa-depression-guide-3',
    title: 'Coping with Depression',
    description: 'This guide from SAMHSA provides information about depression and offers strategies for coping, including seeking help and building a support network.',
    contentType: 'Guide',
    category: 'Depression',
    tags: ['depression', 'coping-strategies', 'support', 'self-help'],
    link: 'https://store.samhsa.gov/product/coping-depression',
    source: 'SAMHSA',
    audience: 'Adults',
    difficulty: 'Beginner',
    timeToComplete: 10,
    publish_date: '2021-09-15',
    author: 'SAMHSA',
    key_points: [
        "Depression is a treatable medical illness.",
        "Building a support system is crucial for recovery.",
        "Self-care activities like exercise can improve mood.",
        "It's important to seek professional help."
    ],
  },
  {
    id: 'nih-sleep-hygiene-4',
    title: 'Healthy Sleep Habits',
    description: 'From the National Institutes of Health (NIH), this article provides evidence-based tips for improving your sleep hygiene for better mental and physical health.',
    contentType: 'Article',
    category: 'Sleep',
    tags: ['sleep', 'health', 'self-care', 'habits'],
    link: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits',
    source: 'NIH',
    audience: 'General',
    difficulty: 'Beginner',
    timeToComplete: 5,
    publish_date: '2022-07-28',
    author: 'National Institutes of Health',
    key_points: [
        "Stick to a regular sleep schedule.",
        "Create a restful environment.",
        "Avoid large meals, caffeine, and alcohol before bedtime.",
        "Get some exercise during the day."
    ],
  },
  {
    id: 'who-mindfulness-audio-5',
    title: 'Mindful Breathing Exercise',
    description: 'A 5-minute guided audio exercise from the WHO to help you ground yourself in the present moment and calm an anxious mind.',
    contentType: 'Audio',
    category: 'Mindfulness',
    tags: ['mindfulness', 'stress', 'anxiety', 'exercise', 'audio'],
    link: 'https://www.who.int/teams/mental-health-and-substance-use/promotion-prevention/mental-health-in-the-workplace/who-workplace-mental-health-training-resources',
    source: 'WHO',
    audience: 'General',
    difficulty: 'Beginner',
    timeToComplete: 5,
    author: 'World Health Organization',
    key_points: [
        "Find a comfortable and quiet place.",
        "Focus on the sensation of your breath.",
        "Gently return your attention when your mind wanders.",
        "Practice regularly for best results."
    ],
  },
  {
    id: 'nimh-youth-mental-health-6',
    title: 'Mental Health Resources for Adolescents and Young Adults',
    description: 'NIMH offers this resource page specifically for young people, covering various topics and how to get help.',
    contentType: 'Guide',
    category: 'Self-Care',
    tags: ['youth', 'education', 'support', 'help'],
    link: 'https://www.nimh.nih.gov/health/topics/child-and-adolescent-mental-health',
    source: 'NIMH',
    audience: 'Youth',
    difficulty: 'Intermediate',
    timeToComplete: 10,
    author: 'National Institute of Mental Health',
    key_points: [
      "It's common for young people to experience mental health challenges.",
      "Recognize the signs and symptoms of common disorders.",
      "Know where and how to find help.",
      "Explore digital mental health resources and tools."
    ]
  },
  {
    id: 'samhsa-crisis-hotline-7',
    title: '988 Suicide & Crisis Lifeline',
    description: 'Information on the 988 Lifeline, a national network of local crisis centers that provides free and confidential emotional support to people in suicidal crisis or emotional distress 24/7.',
    contentType: 'Guide',
    category: 'Crisis Support',
    tags: ['crisis', 'suicide-prevention', 'emergency', 'support'],
    link: 'https://988lifeline.org/',
    source: 'SAMHSA',
    audience: 'General',
    difficulty: 'Beginner',
    timeToComplete: 2,
    author: 'SAMHSA',
    key_points: [
        "The 988 Lifeline is available 24/7.",
        "Support is free, confidential, and available to everyone.",
        "You can call, text, or chat 988.",
        "It's for anyone in emotional distress or suicidal crisis."
    ],
  },
  {
    id: 'nih-self-care-8',
    title: 'Caring for Your Mental Health',
    description: 'This NIH article provides practical tips for self-care, including physical activity, healthy eating, and connecting with others.',
    contentType: 'Article',
    category: 'Self-Care',
    tags: ['self-care', 'health', 'positivity', 'coping-strategies'],
    link: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
    source: 'NIH',
    audience: 'General',
    difficulty: 'Beginner',
    timeToComplete: 5,
    author: 'National Institutes of Health',
    key_points: [
      "Practice regular physical activity.",
      "Maintain a healthy, balanced diet.",
      "Prioritize getting quality sleep.",
      "Connect with others and build a support system."
    ]
  },
];

export const RESOURCE_CATEGORIES = Array.from(new Set(MENTAL_HEALTH_RESOURCES.map(r => r.category)));
export const RESOURCE_AUDIENCES = Array.from(new Set(MENTAL_HEALTH_RESOURCES.map(r => r.audience)));
export const RESOURCE_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];


export const THEMES: Record<ThemeName, { name: string; palette: ThemePalette }> = {
  clinic: { name: 'Clinic', palette: { '--color-primary': '#007bff', '--color-primary-hover': '#0056b3', '--color-primary-light': '#e6f2ff', '--color-primary-text': '#004085', '--color-ring': '#80bdff', '--color-background': '#f8f9fa' } },
  sky: { name: 'Sky', palette: { '--color-primary': '#3b82f6', '--color-primary-hover': '#2563eb', '--color-primary-light': '#eff6ff', '--color-primary-text': '#1e40af', '--color-ring': '#60a5fa' } },
  coral: { name: 'Coral', palette: { '--color-primary': '#ef4444', '--color-primary-hover': '#dc2626', '--color-primary-light': '#fef2f2', '--color-primary-text': '#991b1b', '--color-ring': '#f87171' } },
  mint: { name: 'Mint', palette: { '--color-primary': '#10b981', '--color-primary-hover': '#059669', '--color-primary-light': '#ecfdf5', '--color-primary-text': '#065f46', '--color-ring': '#34d399' } },
  olive: { name: 'Olive', palette: { '--color-primary': '#84cc16', '--color-primary-hover': '#65a30d', '--color-primary-light': '#f7fee7', '--color-primary-text': '#3f6212', '--color-ring': '#a3e635' } },
  sand: { name: 'Sand', palette: { '--color-primary': '#f59e0b', '--color-primary-hover': '#d97706', '--color-primary-light': '#fffbeb', '--color-primary-text': '#92400e', '--color-ring': '#fbbf24' } },
  cream: { name: 'Cream', palette: { '--color-primary': '#d1d5db', '--color-primary-hover': '#9ca3af', '--color-primary-light': '#f9fafb', '--color-primary-text': '#374151', '--color-ring': '#9ca3af', '--color-background': '#fdfcfb' } },
};

export const MOOD_EMOJIS = ['😞', '😕', '😐', '🙂', '😄', '😊', '😁', '🤩', '🚀', '🔥'];