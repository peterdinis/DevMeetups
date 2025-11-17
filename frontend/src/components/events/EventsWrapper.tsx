import type { FC } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Flex,
  Input,
  SimpleGrid,
  Card,
  Badge,
  Tag,
} from "@chakra-ui/react";
import { SearchIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "../ui/color-mode";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationType: "online" | "in-person";
  attendees: number;
  maxAttendees: number;
  category: string;
  tags: string[];
  organizer: {
    name: string;
    avatar: string;
  };
  price: "free" | "paid";
  image?: string;
}

const EventsWrapper: FC = () => {
  
  // Color values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.600", "blue.300");

  // Demo data
  const events: Event[] = [
    {
      id: "1",
      title: "React TypeScript Masterclass",
      description: "Advanced TypeScript patterns and best practices for React developers. Learn how to build type-safe applications with real-world examples.",
      date: "2024-01-20",
      time: "14:00",
      location: "Virtual Meeting",
      locationType: "online",
      attendees: 45,
      maxAttendees: 100,
      category: "Workshop",
      tags: ["React", "TypeScript", "Frontend", "Advanced"],
      organizer: {
        name: "Sarah Chen",
        avatar: "https://bit.ly/sage-adebayo"
      },
      price: "free",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "2",
      title: "Node.js Microservices Architecture",
      description: "Build scalable microservices with Node.js, Docker, and Kubernetes. Hands-on workshop with practical examples.",
      date: "2024-01-22",
      time: "18:30",
      location: "Tech Hub Downtown",
      locationType: "in-person",
      attendees: 32,
      maxAttendees: 50,
      category: "Workshop",
      tags: ["Node.js", "Microservices", "Docker", "Backend"],
      organizer: {
        name: "Mike Rodriguez",
        avatar: "https://bit.ly/prosper-baba"
      },
      price: "paid",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "3",
      title: "AI & Machine Learning Meetup",
      description: "Exploring the latest trends in AI and ML with practical demonstrations and networking opportunities.",
      date: "2024-01-25",
      time: "17:00",
      location: "AI Research Lab",
      locationType: "in-person",
      attendees: 78,
      maxAttendees: 100,
      category: "Networking",
      tags: ["AI", "Machine Learning", "Data Science"],
      organizer: {
        name: "Dr. Alex Kim",
        avatar: "https://bit.ly/code-beast"
      },
      price: "free",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "4",
      title: "Full Stack Development Workshop",
      description: "Comprehensive workshop covering frontend and backend development with modern tools and frameworks.",
      date: "2024-01-28",
      time: "10:00",
      location: "Coding Campus",
      locationType: "in-person",
      attendees: 95,
      maxAttendees: 120,
      category: "Workshop",
      tags: ["Fullstack", "React", "Node.js", "MongoDB"],
      organizer: {
        name: "Tech Community",
        avatar: "https://bit.ly/dan-abramov"
      },
      price: "paid",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "5",
      title: "Startup Founder Networking",
      description: "Connect with fellow startup founders, investors, and tech enthusiasts. Share experiences and build partnerships.",
      date: "2024-02-01",
      time: "19:00",
      location: "Virtual Event",
      locationType: "online",
      attendees: 120,
      maxAttendees: 200,
      category: "Networking",
      tags: ["Startups", "Entrepreneurship", "Networking"],
      organizer: {
        name: "Startup Hub",
        avatar: "https://bit.ly/kent-c-dodds"
      },
      price: "free",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "6",
      title: "DevOps & Cloud Infrastructure",
      description: "Deep dive into modern DevOps practices, CI/CD pipelines, and cloud infrastructure management.",
      date: "2024-02-05",
      time: "16:00",
      location: "Cloud Innovation Center",
      locationType: "in-person",
      attendees: 42,
      maxAttendees: 60,
      category: "Tech Talk",
      tags: ["DevOps", "AWS", "Docker", "Kubernetes"],
      organizer: {
        name: "Cloud Experts",
        avatar: "https://bit.ly/ryan-florence"
      },
      price: "free",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Categories for filter
  const categories = ["All", "Workshop", "Networking", "Tech Talk", "Conference", "Social"];
  const eventTypes = ["All", "Online", "In-person"];
  const priceTypes = ["All", "Free", "Paid"];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Event Card Component
  const EventCard: FC<{ event: Event }> = ({ event }) => {
    const hoverBg = useColorModeValue("blue.700", "blue.400");
    
    return (
      <Card.Root
        bg={cardBg} 
        border="1px solid" 
        borderColor={borderColor}
        borderRadius="16px"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{ 
          transform: "translateY(-4px)",
          shadow: "xl",
          borderColor: accentColor
        }}
      >
        {/* Event Image */}
        <Box 
          height="200px" 
          position="relative"
          backgroundImage={`url(${event.image})`}
          backgroundSize="cover"
          backgroundPosition="center"
        >
          <Box 
            position="absolute" 
            top="16px" 
            right="16px"
          >
            <Badge
              colorScheme={event.price === "free" ? "green" : "purple"}
              fontSize="xs"
              px="12px"
              py="4px"
              borderRadius="full"
              fontWeight="600"
            >
              {event.price === "free" ? "FREE" : "PAID"}
            </Badge>
          </Box>
          <Box 
            position="absolute" 
            top="16px" 
            left="16px"
          >
            <Badge
              bg={event.locationType === "online" ? "blue.500" : "orange.500"}
              color="white"
              fontSize="xs"
              px="12px"
              py="4px"
              borderRadius="full"
              fontWeight="600"
            >
              {event.locationType === "online" ? "ONLINE" : "IN-PERSON"}
            </Badge>
          </Box>
        </Box>

        <Card.Body p="24px">
          <VStack gap="16px" align="start">
            {/* Event Header */}
            <VStack gap="12px" align="start" width="100%">
              <Badge
                colorScheme="blue"
                fontSize="xs"
                px="8px"
                py="2px"
                borderRadius="6px"
                alignSelf="flex-start"
              >
                {event.category}
              </Badge>
              
              <Heading as="h3" size="md" fontWeight="700" lineHeight="1.3">
                {event.title}
              </Heading>
              
              <Text color={textColor} fontSize="sm" lineHeight="1.5">
                {event.description}
              </Text>
            </VStack>

            {/* Event Details */}
            <VStack gap="12px" align="start" width="100%">
              <HStack color={textColor} fontSize="sm">
                <CalendarIcon color="gray.500" />
                <Text fontWeight="500">{formatDate(event.date)}</Text>
                <Text>•</Text>
                <TimeIcon color="gray.500" />
                <Text>{event.time}</Text>
              </HStack>
              
              <HStack color={textColor} fontSize="sm">
                <Text fontWeight="500">📍 {event.location}</Text>
              </HStack>
            </VStack>

            {/* Tags */}
            <Flex gap="8px" flexWrap="wrap">
              {event.tags.map((tag) => (
                <Tag.Root
                  key={tag}
                  size="sm"
                  bg="gray.100"
                  color="gray.700"
                  borderRadius="full"
                  px="12px"
                  py="4px"
                >
                  {tag}
                </Tag.Root>
              ))}
            </Flex>

            {/* Footer */}
            <HStack justify="space-between" width="100%" pt="8px">
              <HStack>
                
                <Text fontSize="sm" color={textColor}>
                  {event.organizer.name}
                </Text>
              </HStack>
              
              <HStack>
                <Text fontSize="sm" color={textColor} fontWeight="500">
                  {event.attendees} attending
                </Text>
              </HStack>
            </HStack>

            {/* Action Button */}
            <Button
              width="100%"
              bg={accentColor}
              color="white"
              _hover={{ bg: hoverBg }}
              fontWeight="600"
              size="md"
              mt="8px"
            >
              {event.attendees >= event.maxAttendees ? "Join Waitlist" : "Register Now"}
            </Button>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh" py="40px">
      <Container maxW="container.xl">
        {/* Header */}
        <VStack gap="32px" align="start" mb="40px">
          <VStack gap="16px" align="start">
            <Heading as="h1" size="2xl" fontWeight="800">
              Discover Events
            </Heading>
            <Text color={textColor} fontSize="xl">
              Find and join amazing developer events, workshops, and meetups
            </Text>
          </VStack>

          {/* Search and Filters */}
          <Box width="100%">
            <VStack gap="24px" width="100%">
              {/* Search Bar */}
              <Box position="relative" maxW="600px">
                <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" zIndex="1">
                  <SearchIcon color="gray.400" />
                </Box>
                <Input
                  placeholder="Search events by technology, topic, or location..."
                  bg="white"
                  borderColor={borderColor}
                  _focus={{ borderColor: accentColor, boxShadow: "none" }}
                  pl="40px"
                  pr="20px"
                />
              </Box>

              {/* Filter Row */}
              <HStack gap="16px" flexWrap="wrap" width="100%">
                <Box 
                  as="select" 
                  bg="white" 
                  border="1px solid" 
                  borderColor={borderColor}
                  borderRadius="6px"
                  minW="140px"
                  p="8px 12px"
                  fontSize="sm"
                  _focus={{ 
                    borderColor: accentColor, 
                    boxShadow: "none",
                    outline: "none"
                  }}
                >
                  <option value="">Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Box>
                
                <Box 
                  as="select" 
                  bg="white" 
                  border="1px solid" 
                  borderColor={borderColor}
                  borderRadius="6px"
                  minW="140px"
                  p="8px 12px"
                  fontSize="sm"
                  _focus={{ 
                    borderColor: accentColor, 
                    boxShadow: "none",
                    outline: "none"
                  }}
                >
                  <option value="">Event Type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Box>
                
                <Box 
                  as="select" 
                  bg="white" 
                  border="1px solid" 
                  borderColor={borderColor}
                  borderRadius="6px"
                  minW="120px"
                  p="8px 12px"
                  fontSize="sm"
                  _focus={{ 
                    borderColor: accentColor, 
                    boxShadow: "none",
                    outline: "none"
                  }}
                >
                  <option value="">Price</option>
                  {priceTypes.map(price => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </Box>
                
                <Button
                  variant="outline"
                  borderColor={borderColor}
                  fontWeight="500"
                >
                  Clear Filters
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* Divider */}
        <Box 
          height="1px" 
          bg={borderColor} 
          my="32px" 
          width="100%"
        />

        {/* Events Grid */}
        <Box>
          <HStack justify="space-between" mb="24px">
            <Heading as="h2" size="lg" fontWeight="700">
              Upcoming Events ({events.length})
            </Heading>
            <Box 
              as="select" 
              bg="white" 
              border="1px solid" 
              borderColor={borderColor}
              borderRadius="6px"
              minW="160px"
              p="8px 12px"
              fontSize="sm"
              _focus={{ 
                borderColor: accentColor, 
                boxShadow: "none",
                outline: "none"
              }}
            >
              <option value="">Sort by</option>
              <option value="date">Date: Soonest</option>
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest First</option>
            </Box>
          </HStack>

          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            gap="32px"
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>

          {/* Load More Button */}
          <Flex justify="center" mt="48px">
            <Button
              variant="outline"
              size="lg"
              px="32px"
              borderColor={accentColor}
              color={accentColor}
              _hover={{ bg: accentColor, color: "white" }}
              fontWeight="600"
            >
              Load More Events
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default EventsWrapper;