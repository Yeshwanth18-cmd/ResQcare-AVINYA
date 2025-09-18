import type { Assessment, Resource } from './types';

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

export const RESOURCES_DATA: Resource[] = [
    { title: 'Understanding Blood Pressure', description: 'An article explaining the basics of blood pressure and its importance.', type: 'article', tags: ['health', 'education'], link: '#' },
    { title: 'Healthy Eating Guide', description: 'A guide to balanced nutrition and healthy eating habits.', type: 'guide', tags: ['nutrition', 'health'], link: '#' },
    { title: 'When to See a Doctor for a Fever', description: 'Learn when a fever is a sign of something more serious.', type: 'article', tags: ['symptoms', 'fever'], link: '#' },
    { title: 'Stretching for Desk Workers', description: 'Simple stretches to relieve tension from sitting.', type: 'exercise', tags: ['fitness', 'office'], link: '#' },
    { title: 'The Importance of Hydration', description: 'Discover why drinking enough water is crucial for your health.', type: 'guide', tags: ['health', 'hydration'], link: '#' },
    { title: 'Recognizing Signs of a Stroke', description: 'Tips on how to identify stroke symptoms quickly using the F.A.S.T. method.', type: 'article', tags: ['emergency', 'stroke'], link: '#' }
];