
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Tag } from "lucide-react";
import { getAllResources, getAllCategories, searchResources, EducationalResource } from "@/data/educationalResources";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const ResourcesList: React.FC = () => {
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  useEffect(() => {
    // Load resources and categories
    setResources(getAllResources());
    setCategories(getAllCategories());
  }, []);
  
  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Educational Resources</CardTitle>
        <CardDescription>
          Browse articles and resources to help you understand and improve your mental health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="w-full h-auto flex flex-wrap justify-start mb-4 bg-transparent p-0 space-x-2 space-y-2">
              <TabsTrigger 
                value="all" 
                className={`mt-2 ${activeCategory === 'all' ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
              >
                All
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className={`mt-2 ${activeCategory === category ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <ResourcesGrid resources={filteredResources} />
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <ResourcesGrid resources={filteredResources} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

// Grid component for displaying resources
const ResourcesGrid: React.FC<{ resources: EducationalResource[] }> = ({ resources }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No resources found matching your search.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

// Resource card component
const ResourceCard: React.FC<{ resource: EducationalResource }> = ({ resource }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription className="mt-1">{resource.description}</CardDescription>
          </div>
          {resource.imageUrl && (
            <img 
              src={resource.imageUrl} 
              alt={resource.title} 
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.tags.slice(0, 3).map(tag => (
            <div 
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </div>
          ))}
          {resource.tags.length > 3 && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              +{resource.tags.length - 3}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        {expanded ? (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdownToHtml(resource.content) }} />
          </div>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-3">
            {stripMarkdown(resource.content)}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Read Less' : 'Read More'}
          </Button>
          
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">{resource.category}</span>
          </div>
          
          {resource.externalLink && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={resource.externalLink} target="_blank" rel="noopener noreferrer">
                External Link
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Simple function to convert markdown to HTML
const markdownToHtml = (markdown: string): string => {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';
  
  // Fix lists
  html = html.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
  html = html.replace(/<\/ul><ul>/g, '');
  
  return html;
};

// Function to strip markdown for preview
const stripMarkdown = (markdown: string): string => {
  let text = markdown;
  
  // Remove headers
  text = text.replace(/^### (.*$)/gm, '$1');
  text = text.replace(/^## (.*$)/gm, '$1');
  text = text.replace(/^# (.*$)/gm, '$1');
  
  // Remove bold and italic
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // Remove lists
  text = text.replace(/^\d+\. (.*$)/gm, '$1');
  text = text.replace(/^- (.*$)/gm, '$1');
  
  // Clean up extra whitespace
  text = text.replace(/\n\n/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
};

export default ResourcesList;
