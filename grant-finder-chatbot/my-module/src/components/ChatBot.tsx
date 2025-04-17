import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, MessageType, ButtonOption } from "./ChatMessage";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define our bot conversation flow
const CONVERSATION_FLOW = {
  welcome: {
    content: "👋 Welcome to the Grant Finder! I can help you discover grant opportunities that match your needs. What type of grants are you interested in?",
    buttons: [
      { 
        id: "edu", 
        label: "Education", 
        value: "education", 
        description: "Grants supporting learning, research, and educational development across all levels."
      },
      { 
        id: "health", 
        label: "Healthcare", 
        value: "healthcare", 
        description: "Funding for medical research, healthcare access, and innovative health technologies."
      },
      { 
        id: "env", 
        label: "Environment", 
        value: "environment", 
        description: "Grants focused on conservation, renewable energy, and climate change initiatives."
      },
      { 
        id: "arts", 
        label: "Arts & Culture", 
        value: "arts", 
        description: "Support for performing arts, visual arts, and cultural heritage preservation."
      },
      { 
        id: "comm", 
        label: "Community Development", 
        value: "community", 
        description: "Funding for housing, economic development, and social service programs."
      }
    ]
  },
  education: {
    content: "Great! What level of education are you seeking funding for?",
    buttons: [
      { id: "k12", label: "K-12", value: "k12" },
      { id: "higher", label: "Higher Education", value: "higher_ed" },
      { id: "research", label: "Research", value: "research" },
      { id: "back", label: "Back", value: "welcome", action: "back" }
    ]
  },
  healthcare: {
    content: "What area of healthcare are you seeking grants for?",
    buttons: [
      { id: "medical", label: "Medical Research", value: "medical_research" },
      { id: "access", label: "Healthcare Access", value: "healthcare_access" },
      { id: "tech", label: "Healthcare Technology", value: "healthcare_tech" },
      { id: "back", label: "Back", value: "welcome", action: "back" }
    ]
  },
  environment: {
    content: "Which environmental area are you interested in?",
    buttons: [
      { id: "conservation", label: "Conservation", value: "conservation" },
      { id: "renewable", label: "Renewable Energy", value: "renewable" },
      { id: "climate", label: "Climate Change", value: "climate" },
      { id: "back", label: "Back", value: "welcome", action: "back" }
    ]
  },
  arts: {
    content: "What type of arts & culture grants are you looking for?",
    buttons: [
      { id: "performing", label: "Performing Arts", value: "performing_arts" },
      { id: "visual", label: "Visual Arts", value: "visual_arts" },
      { id: "heritage", label: "Cultural Heritage", value: "cultural_heritage" },
      { id: "back", label: "Back", value: "welcome", action: "back" }
    ]
  },
  community: {
    content: "What type of community development are you focusing on?",
    buttons: [
      { id: "housing", label: "Housing", value: "housing" },
      { id: "economic", label: "Economic Development", value: "economic" },
      { id: "social", label: "Social Services", value: "social_services" },
      { id: "back", label: "Back", value: "welcome", action: "back" }
    ]
  },
  k12: {
    content: "Select a K-12 education grant objective:",
    buttons: [
      { id: "classroom", label: "Innovative Classroom Projects", value: "k12_classroom" },
      { id: "resources", label: "Classroom Resources", value: "k12_resources" },
      { id: "library", label: "School Library Improvements", value: "k12_library" },
      { id: "stem", label: "STEM Education Programs", value: "k12_stem" },
      { id: "digital", label: "Digital Learning Integration", value: "k12_digital" },
      { id: "back", label: "Back", value: "education", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  higher_ed: {
    content: "Select a higher education grant objective:",
    buttons: [
      { id: "exchange", label: "International Exchange Programs", value: "higher_exchange" },
      { id: "need_based", label: "Need-Based Student Support", value: "higher_needbased" },
      { id: "stem_research", label: "STEM Research Fellowships", value: "higher_stem" },
      { id: "diversity", label: "Faculty Diversity Programs", value: "higher_diversity" },
      { id: "women", label: "Women in Academia Support", value: "higher_women" },
      { id: "back", label: "Back", value: "education", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  research: {
    content: "Select a research grant objective:",
    buttons: [
      { id: "nsf", label: "Science & Engineering Research", value: "research_nsf" },
      { id: "nih", label: "Biomedical Research", value: "research_nih" },
      { id: "humanities", label: "Humanities & Arts Research", value: "research_humanities" },
      { id: "education", label: "Education Research", value: "research_education" },
      { id: "global", label: "Global Health & Development", value: "research_global" },
      { id: "back", label: "Back", value: "education", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  medical_research: {
    content: "Select a medical research grant objective:",
    buttons: [
      { id: "specific", label: "Specific Research Projects", value: "medical_specific" },
      { id: "clinical", label: "Clinical Effectiveness Studies", value: "medical_clinical" },
      { id: "health_equity", label: "Health Equity Research", value: "medical_equity" },
      { id: "heart", label: "Cardiovascular & Stroke Research", value: "medical_heart" },
      { id: "alzheimers", label: "Alzheimer's Research", value: "medical_alzheimers" },
      { id: "back", label: "Back", value: "healthcare", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  healthcare_access: {
    content: "Select a healthcare access grant objective:",
    buttons: [
      { id: "rural", label: "Rural Healthcare Services", value: "access_rural" },
      { id: "facilities", label: "Healthcare Facility Development", value: "access_facilities" },
      { id: "vulnerable", label: "Support for Vulnerable Populations", value: "access_vulnerable" },
      { id: "community", label: "Community Health Initiatives", value: "access_community" },
      { id: "innovative", label: "Innovative Access Solutions", value: "access_innovative" },
      { id: "back", label: "Back", value: "healthcare", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  healthcare_tech: {
    content: "Select a healthcare technology grant objective:",
    buttons: [
      { id: "innovation", label: "Small Business Innovation", value: "tech_innovation" },
      { id: "devices", label: "Medical Device Development", value: "tech_devices" },
      { id: "healthit", label: "Healthcare IT Implementation", value: "tech_healthit" },
      { id: "smart", label: "Intelligent Health Systems", value: "tech_smart" },
      { id: "digital", label: "Digital Health Solutions", value: "tech_digital" },
      { id: "back", label: "Back", value: "healthcare", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  conservation: {
    content: "Select a conservation grant objective:",
    buttons: [
      { id: "wildlife", label: "Fish & Wildlife Conservation", value: "conservation_wildlife" },
      { id: "wetlands", label: "Wetland Protection", value: "conservation_wetlands" },
      { id: "wild_places", label: "Wild Places Protection", value: "conservation_wild" },
      { id: "global", label: "Global Conservation Initiatives", value: "conservation_global" },
      { id: "science", label: "Science-Based Conservation", value: "conservation_science" },
      { id: "back", label: "Back", value: "environment", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  renewable: {
    content: "Select a renewable energy grant objective:",
    buttons: [
      { id: "solar", label: "Solar Energy Technology", value: "renewable_solar" },
      { id: "rural", label: "Rural Renewable Energy Systems", value: "renewable_rural" },
      { id: "policy", label: "Clean Energy Policy", value: "renewable_policy" },
      { id: "community", label: "Community Solar Projects", value: "renewable_community" },
      { id: "state", label: "State-Specific Incentives", value: "renewable_state" },
      { id: "back", label: "Back", value: "environment", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  climate: {
    content: "Select a climate change grant objective:",
    buttons: [
      { id: "research", label: "Climate Process Research", value: "climate_research" },
      { id: "monitoring", label: "Climate Monitoring & Modeling", value: "climate_monitoring" },
      { id: "earth", label: "Earth Observation Projects", value: "climate_earth" },
      { id: "resilience", label: "Climate Resilience & Adaptation", value: "climate_resilience" },
      { id: "emissions", label: "Greenhouse Gas Reduction", value: "climate_emissions" },
      { id: "back", label: "Back", value: "environment", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  performing_arts: {
    content: "Select a performing arts grant objective:",
    buttons: [
      { id: "nonprofit", label: "Nonprofit Arts Organizations", value: "performing_nonprofit" },
      { id: "excellence", label: "Artistic Excellence & Innovation", value: "performing_excellence" },
      { id: "theater", label: "Theater Company Support", value: "performing_theater" },
      { id: "music", label: "New Music Creation & Performance", value: "performing_music" },
      { id: "dance", label: "Dance Artist Fellowships", value: "performing_dance" },
      { id: "back", label: "Back", value: "arts", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  visual_arts: {
    content: "Select a visual arts grant objective:",
    buttons: [
      { id: "innovative", label: "Innovative & Risk-Taking Projects", value: "visual_innovative" },
      { id: "financial", label: "Financial Assistance for Artists", value: "visual_financial" },
      { id: "photography", label: "Photography Fellowships", value: "visual_photography" },
      { id: "creation", label: "Artwork Creation & Presentation", value: "visual_creation" },
      { id: "mature", label: "Support for Established Artists", value: "visual_mature" },
      { id: "back", label: "Back", value: "arts", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  cultural_heritage: {
    content: "Select a cultural heritage grant objective:",
    buttons: [
      { id: "humanities", label: "Humanities Research & Education", value: "cultural_humanities" },
      { id: "museums", label: "Museum & Library Support", value: "cultural_museums" },
      { id: "world", label: "World Heritage Conservation", value: "cultural_world" },
      { id: "historic", label: "Historic Preservation", value: "cultural_historic" },
      { id: "art", label: "Art & Architecture Conservation", value: "cultural_art" },
      { id: "back", label: "Back", value: "arts", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  housing: {
    content: "Select a housing development grant objective:",
    buttons: [
      { id: "community", label: "Community Development Block Grants", value: "housing_community" },
      { id: "affordable", label: "Affordable Housing Investment", value: "housing_affordable" },
      { id: "bank", label: "Federal Home Loan Bank Programs", value: "housing_bank" },
      { id: "tax", label: "Low-Income Housing Tax Credits", value: "housing_tax" },
      { id: "trust", label: "National Housing Trust Fund", value: "housing_trust" },
      { id: "back", label: "Back", value: "community", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  economic: {
    content: "Select an economic development grant objective:",
    buttons: [
      { id: "regional", label: "Regional Economic Development", value: "economic_regional" },
      { id: "rural", label: "Rural Business Development", value: "economic_rural" },
      { id: "distressed", label: "Support for Distressed Communities", value: "economic_distressed" },
      { id: "entrepreneur", label: "Entrepreneurship Support", value: "economic_entrepreneur" },
      { id: "regional_specific", label: "Region-Specific Development", value: "economic_regional_specific" },
      { id: "back", label: "Back", value: "community", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  social_services: {
    content: "Select a social services grant objective:",
    buttons: [
      { id: "family", label: "Family Economic Security", value: "social_family" },
      { id: "block", label: "Social Services Block Grants", value: "social_block" },
      { id: "community", label: "Community Service Programs", value: "social_community" },
      { id: "health", label: "Culture of Health Initiatives", value: "social_health" },
      { id: "mobility", label: "Social & Economic Mobility", value: "social_mobility" },
      { id: "back", label: "Back", value: "community", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  // Grant objective response screens
  k12_classroom: {
    content: "NEA Foundation Grants: Provides funding for innovative classroom projects supporting public school educators in PreK-12th grade with grants ranging from $2,000 to $5,000.",
    buttons: [
      { id: "back", label: "Back", value: "k12", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  k12_resources: {
    content: "DonorsChoose: Crowd-funding platform for classroom resources where teachers can create projects and request specific materials with support from the community.",
    buttons: [
      { id: "back", label: "Back", value: "k12", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  k12_library: {
    content: "Target School Library Makeover Program: Provides resources to update and improve school libraries with book donations and enhancement grants for 15-20 schools annually.",
    buttons: [
      { id: "back", label: "Back", value: "k12", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  k12_stem: {
    content: "STEM Education Grants: Funding for science, technology, engineering, and math programs supporting innovative curriculum and classroom resources with grants ranging from $1,000 to $50,000.",
    buttons: [
      { id: "back", label: "Back", value: "k12", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  k12_digital: {
    content: "Digital Learning Innovation Grants: Support technology integration in classrooms funding digital tools, software, and online learning resources to improve digital literacy and skills.",
    buttons: [
      { id: "back", label: "Back", value: "k12", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  higher_exchange: {
    content: "Fulbright Program: Prestigious international exchange program supporting study, research, and teaching opportunities for students, scholars, and professionals.",
    buttons: [
      { id: "back", label: "Back", value: "higher_ed", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  medical_specific: {
    content: "NIH Research Project Grants (R01): Gold standard for independent research supporting specific research projects for up to 5 years with average awards exceeding $500,000 per year.",
    buttons: [
      { id: "back", label: "Back", value: "medical_research", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  },
  housing_community: {
    content: "HUD Community Development Block Grants (CDBG): Provides communities with resources for housing and urban development with over $3 billion allocated annually nationwide.",
    buttons: [
      { id: "back", label: "Back", value: "housing", action: "back" },
      { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
    ]
  }
};

export function ChatBot() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage: MessageType = {
      id: uuidv4(),
      content: CONVERSATION_FLOW.welcome.content,
      sender: 'bot',
      buttons: CONVERSATION_FLOW.welcome.buttons,
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleButtonClick = (option: ButtonOption) => {
    const userMessage: MessageType = {
      id: uuidv4(),
      content: option.label,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      const nextStep = option.value;
      if (nextStep in CONVERSATION_FLOW) {
        const botResponse = CONVERSATION_FLOW[nextStep as keyof typeof CONVERSATION_FLOW];
        
        const botMessage: MessageType = {
          id: uuidv4(),
          content: botResponse.content,
          sender: 'bot',
          buttons: botResponse.buttons,
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    }, 500);
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const userMessage: MessageType = {
      id: uuidv4(),
      content: userInput,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    
    setTimeout(() => {
      const botMessage: MessageType = {
        id: uuidv4(),
        content: "I'm designed to work with button selections for the best experience. Please use the buttons to navigate through grant options.",
        sender: 'bot',
        buttons: [
          { id: "restart", label: "Start Over", value: "welcome", action: "restart" }
        ],
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-chatbot-primary p-4 text-white">
        <h2 className="text-xl font-semibold">Grant Finder Assistant</h2>
        <p className="text-sm opacity-90">Find grants that match your needs</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onButtonClick={handleButtonClick}
            isLatestMessage={index === messages.length - 1 && msg.sender === 'bot'}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleUserInput} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your question or use the buttons above..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chatbot-primary"
          />
          <Button 
            type="submit" 
            className="bg-chatbot-primary hover:bg-chatbot-secondary"
          >
            <ArrowUp size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
