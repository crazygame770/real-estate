
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFilters, SortOption } from "@/types/propertyTypes";
import { parseCoordinates } from "@/utils/propertyUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const extractFilters = (message: string): PropertyFilters | null => {
  // Default filters
  const filters: PropertyFilters = {
    propertyType: null,
    floorNumbers: [],
    priceRange: [0, 1000000],
    yearBuilt: [1950, 2024],
    energyClasses: [],
    regions: [],
    hasParking: null,
    heatingType: null,
    hasSolarWaterHeater: null,
    walkabilityScore: [0, 10],
    safetyScore: [0, 10],
    educationScore: [0, 10],
    entertainmentScore: [0, 10],
    retailScore: [0, 10],
    greenSpacesScore: [0, 10],
    areaRange: [0, 500],
    bedroomRange: [0, 6],
    bathroomRange: [0, 4],
    selectedRegions: [],
    sortBy: '' as SortOption,
  };

  // Extract price range
  const priceMatches = message.match(/(\d+)[kK]\+/) || message.match(/more than (\d+)[kK]/) || message.match(/above (\d+)[kK]/) || 
                      message.match(/over (\d+)[kK]/) || message.match(/exceeding (\d+)[kK]/) || 
                      message.match(/(\d+),000\+/) || message.match(/(\d+)\.000\+/);
  if (priceMatches) {
    const price = parseInt(priceMatches[1]) * 1000;
    filters.priceRange = [price, 1000000];
  }

  const priceLessThanMatches = message.match(/less than (\d+)[kK]/) || message.match(/below (\d+)[kK]/) || 
                              message.match(/under (\d+)[kK]/) || message.match(/cheaper than (\d+)[kK]/) ||
                              message.match(/less than (\d+),000/) || message.match(/below (\d+)\.000/);
  if (priceLessThanMatches) {
    const price = parseInt(priceLessThanMatches[1]) * 1000;
    filters.priceRange = [0, price];
  }

  const priceRangeMatches = message.match(/between (\d+)[kK] and (\d+)[kK]/) || 
                           message.match(/from (\d+)[kK] to (\d+)[kK]/) ||
                           message.match(/between (\d+),000 and (\d+),000/) || 
                           message.match(/between (\d+)\.000 and (\d+)\.000/);
  if (priceRangeMatches) {
    const minPrice = parseInt(priceRangeMatches[1]) * 1000;
    const maxPrice = parseInt(priceRangeMatches[2]) * 1000;
    filters.priceRange = [minPrice, maxPrice];
  }

  // Extract property type
  if (message.toLowerCase().includes('apartment') || message.toLowerCase().includes('flat')) {
    filters.propertyType = 'apartment';
  } else if (message.toLowerCase().includes('house') || message.toLowerCase().includes('villa')) {
    filters.propertyType = 'house';
  }

  // Extract bedrooms
  const bedroomMatches = message.match(/(\d+) bedroom/) || message.match(/(\d+) bed/) || 
                        message.match(/(\d+)-bedroom/) || message.match(/(\d+) br/);
  if (bedroomMatches) {
    const bedrooms = parseInt(bedroomMatches[1]);
    filters.bedroomRange = [bedrooms, 6];
  }

  // Extract bathrooms
  const bathroomMatches = message.match(/(\d+) bathroom/) || message.match(/(\d+) bath/) || 
                         message.match(/(\d+)-bathroom/) || message.match(/(\d+) ba/);
  if (bathroomMatches) {
    const bathrooms = parseInt(bathroomMatches[1]);
    filters.bathroomRange = [bathrooms, 4];
  }

  // Extract area
  const areaMatches = message.match(/(\d+) square meters/) || message.match(/(\d+) m2/) || 
                     message.match(/(\d+) sqm/) || message.match(/(\d+)m2/);
  if (areaMatches) {
    const area = parseInt(areaMatches[1]);
    filters.areaRange = [area, 500];
  }

  // Check for parking
  if (message.toLowerCase().includes('parking') || message.toLowerCase().includes('garage')) {
    filters.hasParking = true;
  }

  // Check for solar water heater
  if (message.toLowerCase().includes('solar') || message.toLowerCase().includes('water heater')) {
    filters.hasSolarWaterHeater = true;
  }

  // Extract heating type
  if (message.toLowerCase().includes('central heating')) {
    filters.heatingType = 'central';
  } else if (message.toLowerCase().includes('independent heating')) {
    filters.heatingType = 'independent';
  }

  // Extract regions/neighborhoods
  const regions = [
    'Athens', 'Piraeus', 'Glyfada', 'Kifissia', 'Voula',
    'Maroussi', 'Nea Smirni', 'Kallithea', 'Chalandri', 'Palaio Faliro',
    'Kolonaki', 'Plaka', 'Monastiraki', 'Psiri', 'Exarchia', 
    'Omonia', 'Thisio', 'Pagrati', 'Mets', 'Kastella'
  ];
  
  regions.forEach(region => {
    if (message.toLowerCase().includes(region.toLowerCase())) {
      filters.selectedRegions.push({
        name: region,
        region: region,
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
      });
    }
  });

  // Determine if we have any actual filters
  const defaultFilters = {
    propertyType: null,
    floorNumbers: [],
    priceRange: [0, 1000000],
    yearBuilt: [1950, 2024],
    energyClasses: [],
    regions: [],
    hasParking: null,
    heatingType: null,
    hasSolarWaterHeater: null,
    walkabilityScore: [0, 10],
    safetyScore: [0, 10],
    educationScore: [0, 10],
    entertainmentScore: [0, 10],
    retailScore: [0, 10],
    greenSpacesScore: [0, 10],
    areaRange: [0, 500],
    bedroomRange: [0, 6],
    bathroomRange: [0, 4],
    selectedRegions: [],
    sortBy: '',
  };

  // Check if we have any actual filters set
  const hasFilters = 
    filters.propertyType !== defaultFilters.propertyType ||
    filters.priceRange[0] !== defaultFilters.priceRange[0] ||
    filters.priceRange[1] !== defaultFilters.priceRange[1] ||
    filters.areaRange[0] !== defaultFilters.areaRange[0] ||
    filters.bedroomRange[0] !== defaultFilters.bedroomRange[0] ||
    filters.bathroomRange[0] !== defaultFilters.bathroomRange[0] ||
    filters.hasParking !== defaultFilters.hasParking ||
    filters.heatingType !== defaultFilters.heatingType ||
    filters.hasSolarWaterHeater !== defaultFilters.hasSolarWaterHeater ||
    filters.selectedRegions.length > 0;

  return hasFilters ? filters : null;
};

const ChatbotDialog: React.FC<ChatbotDialogProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', content: 'Hello! I am AthensHousing property assistant, how can I help you? Try asking me something like "find me apartments above 300k" or "show houses with 3 bedrooms in Kolonaki with parking".' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Focus the input when the dialog opens
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    try {
      // Process the message to extract filters
      const filters = extractFilters(userMessage);
      
      if (!filters) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: "I'm not sure what you're looking for. Try asking for properties with specific price ranges, bedrooms, locations, or features like parking." 
        }]);
        setIsProcessing(false);
        return;
      }
      
      // Build the query
      let query = supabase.from('properties').select('*');
      
      // Apply price range filter
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
        
      // Apply property type filter if specified
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      
      // Apply parking filter if specified
      if (filters.hasParking) {
        query = query.eq('parking', true);
      }
      
      // Apply heating type filter if specified
      if (filters.heatingType) {
        query = query.eq('heating_type', filters.heatingType);
      }
      
      // Apply solar water heater filter if specified
      if (filters.hasSolarWaterHeater) {
        query = query.eq('solar_water_heater', true);
      }
      
      // Execute the query
      const { data: properties, error } = await query;
      
      if (error) throw error;
      
      // Filter properties client-side for more complex filters
      let filteredProperties = properties.filter(property => {
        // Bedroom filter
        if (property.bedrooms < filters.bedroomRange[0]) return false;
        
        // Bathroom filter
        if (property.bathrooms < filters.bathroomRange[0]) return false;
        
        // Area filter
        if (property.area < filters.areaRange[0]) return false;
        
        // Region/neighborhood filter
        if (filters.selectedRegions.length > 0 && 
            !filters.selectedRegions.some(region => 
              property.neighborhood === region.name || property.region === region.region
            )) return false;
        
        return true;
      });

      // Sort properties if needed
      if (filters.sortBy) {
        filteredProperties.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price-high-low': return b.price - a.price;
            case 'price-low-high': return a.price - b.price;
            case 'area-high-low': return b.area - a.area;
            case 'area-low-high': return a.area - b.area;
            case 'recent-listed': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest-listed': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            default: return 0;
          }
        });
      }
      
      // Create response message
      let responseContent = '';
      
      if (filteredProperties.length === 0) {
        responseContent = "I couldn't find any properties matching your criteria. Would you like to try a different search?";
      } else {
        // Convert the property coordinates for map display
        const mapProperties = filteredProperties.map(property => ({
          id: property.id,
          title: property.title,
          price: property.price,
          coordinates: parseCoordinates(property.coordinates),
          image: property.image_url || "/placeholder.svg"
        }));
        
        responseContent = `I found ${filteredProperties.length} properties matching your criteria! Would you like to see them?`;
        
        // Add bot response
        setMessages(prev => [...prev, { type: 'bot', content: responseContent }]);
        
        // Navigate to results
        setTimeout(() => {
          navigate('/search-results', { 
            state: { 
              filters, 
              filteredProperties,
              mapProperties
            } 
          });
          onOpenChange(false);
        }, 1500);
        
        setIsProcessing(false);
        return;
      }
      
      // Add bot response
      setMessages(prev => [...prev, { type: 'bot', content: responseContent }]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, I encountered an error while processing your request. Please try again." 
      }]);
    }
    
    setIsProcessing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            {t("Property Search Assistant")}
          </DialogTitle>
          {/* Removed the duplicate X button here */}
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden flex flex-col">
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[80%] items-start gap-2 ${
                      message.type === 'user'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t flex space-x-2">
            <Input
              ref={inputRef}
              placeholder={t("Ask about properties...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotDialog;
