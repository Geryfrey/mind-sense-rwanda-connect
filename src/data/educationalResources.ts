
// Educational resources for mental health awareness and wellness
// This would ideally be managed through a CMS in a production app

export interface EducationalResource {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  externalLink?: string;
}

export const educationalResources: EducationalResource[] = [
  {
    id: "1",
    title: "Understanding Stress and Anxiety in University",
    category: "Stress Management",
    description: "Learn about common stressors in university life and effective coping mechanisms.",
    content: `
      ## Understanding Stress and Anxiety in University

      University life brings numerous challenges: academic pressure, social adjustments, financial concerns, and future planning. These stressors can manifest as anxiety, affecting your physical and mental wellbeing.

      ### Common Signs of Stress:
      - Difficulty sleeping or concentrating
      - Changes in appetite
      - Feeling overwhelmed or irritable
      - Physical symptoms like headaches or muscle tension
      
      ### Effective Coping Strategies:
      1. **Time Management**: Break large tasks into smaller, manageable steps
      2. **Self-Care**: Prioritize sleep, nutrition, and physical activity
      3. **Social Connection**: Maintain supportive relationships
      4. **Mindfulness**: Practice meditation or deep breathing exercises
      5. **Boundaries**: Learn to say no when necessary

      Remember that experiencing stress is normal, but when it interferes with daily functioning, seeking support is important.
    `,
    tags: ["stress", "anxiety", "coping", "university", "wellness"]
  },
  {
    id: "2",
    title: "Building Resilience for Academic Success",
    category: "Academic Wellness",
    description: "Develop mental strength to overcome academic challenges and thrive in your studies.",
    content: `
      ## Building Resilience for Academic Success

      Resilience—the ability to adapt and recover from difficulties—is essential for academic success and overall wellbeing.

      ### Key Elements of Resilience:
      - Positive mindset and optimism
      - Flexibility in approaching challenges
      - Strong support network
      - Self-awareness and emotional regulation
      
      ### Building Your Resilience:
      1. **Reframe Challenges**: View setbacks as learning opportunities
      2. **Set Realistic Goals**: Break down large tasks into achievable steps
      3. **Practice Self-Compassion**: Treat yourself with the kindness you'd show a friend
      4. **Develop Problem-Solving Skills**: Focus on solutions rather than problems
      5. **Celebrate Small Wins**: Acknowledge progress, not just end results

      Resilience isn't about avoiding stress but developing the tools to manage it effectively.
    `,
    tags: ["resilience", "academic success", "mindset", "self-improvement"]
  },
  {
    id: "3",
    title: "Maintaining Social Connections While Studying",
    category: "Social Wellness",
    description: "Strategies to build and maintain meaningful relationships during your academic journey.",
    content: `
      ## Maintaining Social Connections While Studying

      Strong social connections are vital for mental health, yet academic demands can sometimes lead to isolation.

      ### Benefits of Social Connection:
      - Reduced stress and improved mood
      - Enhanced cognitive function
      - Increased motivation and accountability
      - Support during difficult times
      
      ### Ways to Stay Connected:
      1. **Schedule Social Time**: Set aside dedicated time for friends/family
      2. **Join Campus Groups**: Find communities aligned with your interests
      3. **Study Groups**: Combine academic and social needs
      4. **Quality over Quantity**: Focus on nurturing meaningful connections
      5. **Digital Boundaries**: Use social media mindfully to enhance, not replace, real connections

      Remember that vulnerability—sharing struggles and successes—helps deepen connections and reduce feelings of isolation.
    `,
    tags: ["social connection", "relationships", "community", "belonging"]
  },
  {
    id: "4",
    title: "Recognizing Depression: When to Seek Help",
    category: "Mental Health Awareness",
    description: "Learn to identify signs of depression and understand treatment options.",
    content: `
      ## Recognizing Depression: When to Seek Help

      Depression is more than occasional sadness—it's a persistent condition that affects mood, thoughts, and daily functioning.

      ### Common Signs of Depression:
      - Persistent sadness or emptiness
      - Loss of interest in previously enjoyed activities
      - Changes in sleep or appetite
      - Difficulty concentrating or making decisions
      - Feelings of worthlessness or hopelessness
      - Thoughts of death or suicide
      
      ### When and How to Seek Help:
      1. **Recognize Patterns**: Notice when symptoms persist for more than two weeks
      2. **Start Small**: Talk to a trusted friend, family member, or teacher
      3. **Campus Resources**: Utilize university counseling services
      4. **Professional Support**: Consider therapy, counseling, or medical evaluation
      5. **Crisis Resources**: Know emergency contact numbers for immediate help

      Seeking help is a sign of strength, not weakness. Depression is treatable, and recovery is possible.
      
      **If you're experiencing thoughts of suicide, seek immediate help from emergency services.**
    `,
    tags: ["depression", "mental health", "treatment", "help-seeking"]
  },
  {
    id: "5",
    title: "Mindfulness Techniques for Students",
    category: "Stress Management",
    description: "Simple mindfulness practices to reduce stress and improve focus in academic settings.",
    content: `
      ## Mindfulness Techniques for Students

      Mindfulness—paying attention to the present moment without judgment—can significantly reduce stress and improve academic performance.

      ### Benefits of Mindfulness:
      - Reduced stress and anxiety
      - Improved concentration and memory
      - Better emotional regulation
      - Enhanced creativity and problem-solving
      
      ### Simple Mindfulness Practices:
      1. **Five-Minute Breathing**: Focus on your breath for just five minutes each day
      2. **Mindful Walking**: Pay attention to each step between classes
      3. **Study Bell**: Set a bell to ring every 30 minutes as a reminder to check in with yourself
      4. **Body Scan**: Take quick breaks to notice tension in your body
      5. **Mindful Listening**: Give full attention when others are speaking

      Start with just 5 minutes daily and gradually increase. Consistency matters more than duration.
    `,
    tags: ["mindfulness", "meditation", "focus", "present moment", "attention"]
  },
  {
    id: "6",
    title: "Sleep Hygiene for Better Academic Performance",
    category: "Physical Wellness",
    description: "Improve your sleep quality to enhance learning, memory, and overall health.",
    content: `
      ## Sleep Hygiene for Better Academic Performance

      Quality sleep is essential for learning, memory consolidation, emotional regulation, and overall health.

      ### Impact of Poor Sleep on Students:
      - Reduced attention and concentration
      - Impaired learning and memory
      - Increased stress and emotional reactivity
      - Weakened immune function
      
      ### Effective Sleep Hygiene Practices:
      1. **Consistent Schedule**: Go to bed and wake up at the same time daily
      2. **Create a Sleep Sanctuary**: Keep your bedroom dark, quiet, and cool
      3. **Screen Curfew**: Avoid electronic devices 1 hour before bed
      4. **Limit Stimulants**: Reduce caffeine and alcohol, especially later in the day
      5. **Wind-Down Routine**: Develop relaxing pre-sleep activities

      For students, prioritizing sleep may actually be more effective than extra study time when it comes to academic performance.
    `,
    tags: ["sleep", "rest", "recovery", "health", "academic performance"]
  },
  {
    id: "7",
    title: "Cultural Aspects of Mental Health in Rwanda",
    category: "Cultural Wellness",
    description: "Understanding mental health within Rwanda's cultural context and healing traditions.",
    content: `
      ## Cultural Aspects of Mental Health in Rwanda

      Mental health understanding and treatment approaches vary across cultures. In Rwanda, both traditional perspectives and modern approaches offer valuable insights.

      ### Cultural Considerations:
      - Community-centered healing traditions
      - Post-genocide trauma and resilience
      - The concept of "gusimbuka" (moving forward)
      - The role of faith and spirituality in healing
      
      ### Integrating Cultural Wisdom and Modern Approaches:
      1. **Community Support**: Utilizing family and community structures
      2. **Narrative Approaches**: Storytelling as a healing practice
      3. **Cultural Identity**: Connecting to cultural heritage as a source of strength
      4. **Intergenerational Wisdom**: Learning from elders and traditional knowledge
      5. **Holistic Perspective**: Addressing mind, body, and spirit connections

      Respecting both traditional wisdom and modern psychology can create more effective support systems for mental wellness.
    `,
    tags: ["culture", "Rwanda", "tradition", "healing", "community"]
  },
  {
    id: "8",
    title: "Financial Stress and Student Mental Health",
    category: "Financial Wellness",
    description: "Managing financial anxiety and building resources for students.",
    content: `
      ## Financial Stress and Student Mental Health

      Financial concerns are among the top stressors for university students, affecting both mental health and academic performance.

      ### How Financial Stress Affects Students:
      - Anxiety and worry about meeting basic needs
      - Reduced focus on academics
      - Working excessive hours that impact study time
      - Social isolation due to inability to participate in activities
      
      ### Managing Financial Stress:
      1. **Budget Creation**: Develop a realistic spending plan
      2. **Resource Awareness**: Research available scholarships and assistance programs
      3. **Financial Literacy**: Build skills in money management
      4. **Part-time Work Boundaries**: Balance earning and academic needs
      5. **Open Communication**: Discuss concerns with financial aid offices

      Remember that seeking help for financial concerns is both practical and protective for your mental health.
    `,
    tags: ["financial stress", "money management", "student life", "resources"]
  }
];

// Function to get resources by category
export const getResourcesByCategory = (category: string): EducationalResource[] => {
  return educationalResources.filter(resource => 
    resource.category === category
  );
};

// Function to get all educational resources
export const getAllResources = (): EducationalResource[] => {
  return educationalResources;
};

// Function to get resource by ID
export const getResourceById = (id: string): EducationalResource | undefined => {
  return educationalResources.find(resource => resource.id === id);
};

// Function to get all categories
export const getAllCategories = (): string[] => {
  const categories = new Set(educationalResources.map(resource => resource.category));
  return Array.from(categories);
};

// Function to search resources
export const searchResources = (query: string): EducationalResource[] => {
  const lowerCaseQuery = query.toLowerCase();
  return educationalResources.filter(resource => 
    resource.title.toLowerCase().includes(lowerCaseQuery) || 
    resource.description.toLowerCase().includes(lowerCaseQuery) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};
