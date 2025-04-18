
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Lightbulb, Info, ExternalLink } from "lucide-react";

// Define resource types
type ResourceCategory = 'article' | 'selfcare' | 'awareness';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  content?: string;
  externalUrl?: string;
  imageUrl?: string;
}

// Sample resources for demonstration
const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety in University Students',
    description: 'Learn about common anxiety triggers and coping strategies for academic settings.',
    category: 'article',
    content: `
      <p>Anxiety is a common experience for university students, especially during exam periods or when facing new social situations. Symptoms can include racing thoughts, difficulty concentrating, sleep problems, and physical symptoms like a racing heart.</p>
      <h3>Common Triggers</h3>
      <ul>
        <li>Academic pressure and deadlines</li>
        <li>New social environments</li>
        <li>Financial stress</li>
        <li>Future career uncertainty</li>
        <li>Being away from home and support networks</li>
      </ul>
      <h3>Healthy Coping Strategies</h3>
      <ul>
        <li>Break large tasks into smaller, manageable steps</li>
        <li>Practice deep breathing or progressive muscle relaxation</li>
        <li>Maintain a regular sleep schedule</li>
        <li>Connect with others - don't isolate yourself</li>
        <li>Seek professional help when needed</li>
      </ul>
      <p>Remember that experiencing anxiety doesn't mean you're failing - it's a normal response to stress. Learning to manage it effectively is a valuable life skill.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '2',
    title: '5-Minute Mindfulness Practices for Busy Students',
    description: 'Quick mindfulness exercises you can do between classes or study sessions.',
    category: 'selfcare',
    content: `
      <p>Mindfulness involves paying attention to the present moment without judgment. Even brief mindfulness practices can help reduce stress and improve focus. Here are five exercises that take just 5 minutes:</p>
      
      <h3>1. Mindful Breathing</h3>
      <p>Sit comfortably and focus on your breath. Notice the sensation of air moving in and out of your body. When your mind wanders, gently bring your attention back to your breath.</p>
      
      <h3>2. Body Scan</h3>
      <p>Starting from your toes and moving upward, pay attention to each part of your body. Notice any sensations without trying to change them.</p>
      
      <h3>3. Five Senses Check-in</h3>
      <p>Notice five things you can see, four things you can touch, three things you can hear, two things you can smell, and one thing you can taste.</p>
      
      <h3>4. Mindful Walking</h3>
      <p>As you walk between classes, pay attention to the sensation of your feet touching the ground. Notice the movement of your body and the environment around you.</p>
      
      <h3>5. Gratitude Moment</h3>
      <p>Take a moment to think of three things you're grateful for right now, no matter how small.</p>
      
      <p>Regular practice of these exercises can help build resilience against stress and improve your overall wellbeing.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '3',
    title: 'Recognizing Depression in Yourself and Others',
    description: 'Important signs and symptoms that may indicate depression.',
    category: 'awareness',
    content: `
      <p>Depression is more than just feeling sad - it's a serious mental health condition that affects how you feel, think, and handle daily activities.</p>
      
      <h3>Common Signs of Depression</h3>
      <ul>
        <li>Persistent sad, anxious, or "empty" mood</li>
        <li>Loss of interest in activities once enjoyed</li>
        <li>Fatigue or decreased energy</li>
        <li>Difficulty concentrating, remembering, or making decisions</li>
        <li>Insomnia or oversleeping</li>
        <li>Changes in appetite or weight</li>
        <li>Thoughts of death or suicide</li>
      </ul>
      
      <h3>How to Help a Friend</h3>
      <ul>
        <li>Express your concern without judgment</li>
        <li>Listen actively without trying to "fix" their problems</li>
        <li>Encourage them to seek professional help</li>
        <li>Offer to accompany them to their first appointment if needed</li>
        <li>Continue checking in regularly</li>
      </ul>
      
      <p><strong>Important:</strong> If someone is expressing thoughts of suicide, take it seriously. Stay with them and help them contact a crisis helpline or emergency services.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '4',
    title: 'Sleep Hygiene for Academic Success',
    description: 'How good sleep habits can improve your mental health and academic performance.',
    category: 'selfcare',
    content: `
      <p>Quality sleep is essential for learning, memory consolidation, and emotional regulation. Here's how to improve your sleep:</p>
      
      <h3>Sleep Hygiene Tips</h3>
      <ul>
        <li><strong>Consistent schedule:</strong> Try to go to bed and wake up at the same time every day, even on weekends.</li>
        <li><strong>Create a bedtime routine:</strong> Signal to your body that it's time to wind down with relaxing activities like reading or gentle stretching.</li>
        <li><strong>Limit screen time:</strong> The blue light from screens can interfere with melatonin production. Try to avoid screens for at least 30 minutes before bed.</li>
        <li><strong>Watch your caffeine:</strong> Avoid caffeine in the afternoon and evening.</li>
        <li><strong>Create a sleep-friendly environment:</strong> Keep your room cool, dark, and quiet.</li>
      </ul>
      
      <h3>When Studying Late is Unavoidable</h3>
      <p>If you must study late occasionally, try to:</p>
      <ul>
        <li>Take a 20-minute power nap earlier in the day</li>
        <li>Use blue light blocking glasses when looking at screens</li>
        <li>Plan for a recovery night the next day</li>
      </ul>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '5',
    title: 'Mental Health Resources in Rwanda',
    description: 'National and university-specific resources available to students.',
    category: 'awareness',
    externalUrl: 'https://iecmentalhealth.co/support-resources-for-people-in-rwanda/',
    imageUrl: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '6',
    title: 'Healthy Eating on a Student Budget',
    description: 'Nutritious food choices that support mental wellbeing without breaking the bank.',
    category: 'selfcare',
    externalUrl: 'https://rwandanrecipes.com/budget-friendly-meals/',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const ResourcesPage: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | ResourceCategory>('all');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter resources based on active category and search query
  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Handle resource selection
  const handleResourceClick = (resource: Resource) => {
    if (resource.externalUrl) {
      window.open(resource.externalUrl, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };
  
  // Return to resource list
  const handleBackToList = () => {
    setSelectedResource(null);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {!selectedResource ? (
        // Resource list view
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Mental Health Resources</CardTitle>
            <CardDescription>
              Educational materials and self-care tips to support your mental wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as any)}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="article">Articles</TabsTrigger>
                  <TabsTrigger value="selfcare">Self-Care</TabsTrigger>
                  <TabsTrigger value="awareness">Awareness</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <ResourceList 
                    resources={filteredResources} 
                    onResourceClick={handleResourceClick}
                  />
                </TabsContent>
                
                <TabsContent value="article" className="mt-0">
                  <ResourceList 
                    resources={filteredResources} 
                    onResourceClick={handleResourceClick}
                  />
                </TabsContent>
                
                <TabsContent value="selfcare" className="mt-0">
                  <ResourceList 
                    resources={filteredResources} 
                    onResourceClick={handleResourceClick}
                  />
                </TabsContent>
                
                <TabsContent value="awareness" className="mt-0">
                  <ResourceList 
                    resources={filteredResources} 
                    onResourceClick={handleResourceClick}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Single resource view
        <Card className="shadow-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="mb-2 -ml-2"
            >
              ← Back to resources
            </Button>
            <CardTitle>{selectedResource.title}</CardTitle>
            <CardDescription>{selectedResource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedResource.imageUrl && (
              <div className="mb-6">
                <img 
                  src={selectedResource.imageUrl} 
                  alt={selectedResource.title} 
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
            
            {selectedResource.content && (
              <div 
                className="prose max-w-full"
                dangerouslySetInnerHTML={{ __html: selectedResource.content }}
              />
            )}
            
            {selectedResource.externalUrl && (
              <div className="mt-4">
                <a 
                  href={selectedResource.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span>Visit external resource</span>
                  <ExternalLink size={16} className="ml-1" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Resource list component
interface ResourceListProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onResourceClick }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No resources match your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onResourceClick(resource)}
        >
          {resource.imageUrl && (
            <div className="h-32 w-full overflow-hidden">
              <img
                src={resource.imageUrl}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center mb-2">
              {resource.category === 'article' && (
                <BookOpen size={16} className="mr-2 text-blue-500" />
              )}
              {resource.category === 'selfcare' && (
                <Lightbulb size={16} className="mr-2 text-yellow-500" />
              )}
              {resource.category === 'awareness' && (
                <Info size={16} className="mr-2 text-purple-500" />
              )}
              <span className="text-sm text-gray-500 capitalize">
                {resource.category}
              </span>
              {resource.externalUrl && (
                <ExternalLink size={14} className="ml-2 text-gray-400" />
              )}
            </div>
            <h3 className="font-medium text-base">{resource.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {resource.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesPage;
