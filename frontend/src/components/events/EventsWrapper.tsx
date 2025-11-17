import type { FC } from "react";
import { useState, useMemo } from "react";
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
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Calendar, Clock, MapPin, Sparkles, Code, Globe, Heart, MessageCircle, Star} from "lucide-react";
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

interface FilterState {
  search: string;
  category: string;
  eventType: string;
  price: string;
  sortBy: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.98
  }
};

const EventsWrapper: FC = () => {
  // Color values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.600", "blue.300");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const filterBg = useColorModeValue("white", "gray.700");
  const gradientFrom = useColorModeValue("blue.500", "blue.300");
  const gradientTo = useColorModeValue("purple.500", "purple.300");
  const highlightBg = useColorModeValue("blue.50", "blue.900");
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");

  // State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    eventType: "All",
    price: "All",
    sortBy: "date"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

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
    },
    {
      id: "7",
      title: "Web3 & Blockchain Development",
      description: "Learn about smart contracts, decentralized applications, and the future of web technology.",
      date: "2024-02-10",
      time: "15:00",
      location: "Blockchain Hub",
      locationType: "in-person",
      attendees: 28,
      maxAttendees: 40,
      category: "Workshop",
      tags: ["Web3", "Blockchain", "Solidity", "Ethereum"],
      organizer: {
        name: "Crypto Labs",
        avatar: "https://bit.ly/sage-adebayo"
      },
      price: "paid",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "8",
      title: "Mobile App Development Summit",
      description: "Comprehensive guide to building cross-platform mobile applications with React Native and Flutter.",
      date: "2024-02-15",
      time: "11:00",
      location: "Mobile Dev Center",
      locationType: "in-person",
      attendees: 67,
      maxAttendees: 80,
      category: "Conference",
      tags: ["React Native", "Flutter", "Mobile", "iOS", "Android"],
      organizer: {
        name: "Mobile Masters",
        avatar: "https://bit.ly/prosper-baba"
      },
      price: "paid",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "9",
      title: "Open Source Contributors Meetup",
      description: "Connect with fellow open source enthusiasts and learn how to contribute to major projects.",
      date: "2024-02-20",
      time: "18:00",
      location: "Virtual Event",
      locationType: "online",
      attendees: 89,
      maxAttendees: 150,
      category: "Networking",
      tags: ["Open Source", "GitHub", "Community", "Collaboration"],
      organizer: {
        name: "Open Source Foundation",
        avatar: "https://bit.ly/code-beast"
      },
      price: "free",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  // Filter options
  const categories = ["All", "Workshop", "Networking", "Tech Talk", "Conference", "Social"];
  const eventTypes = ["All", "Online", "In-person"];
  const priceTypes = ["All", "Free", "Paid"];
  const sortOptions = [
    { value: "date", label: "Date: Soonest" },
    { value: "popularity", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "title", label: "Title A-Z" }
  ];

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = filters.search === "" ||
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesCategory = filters.category === "All" || event.category === filters.category;

      const matchesEventType = filters.eventType === "All" ||
        (filters.eventType === "Online" && event.locationType === "online") ||
        (filters.eventType === "In-person" && event.locationType === "in-person");

      const matchesPrice = filters.price === "All" ||
        (filters.price === "Free" && event.price === "free") ||
        (filters.price === "Paid" && event.price === "paid");

      return matchesSearch && matchesCategory && matchesEventType && matchesPrice;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "popularity":
          return b.attendees - a.attendees;
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, startIndex + eventsPerPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle filter change
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      eventType: "All",
      price: "All",
      sortBy: "date"
    });
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Event Card Component
  const EventCard: FC<{ event: Event }> = ({ event }) => {
    const hoverBg = useColorModeValue("blue.700", "blue.400");

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        layout
      >
        <Card.Root
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="16px"
          overflow="hidden"
          height="100%"
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
            <VStack gap="16px" align="start" height="100%">
              {/* Event Header */}
              <VStack gap="12px" align="start" width="100%">
                <Badge
                  colorScheme="blue"
                  fontSize="xs"
                  px="8px"
                  py="2px"
                  borderRadius="6px"
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
                  <Calendar size={16} color={iconColor} />
                  <Text fontWeight="500">{formatDate(event.date)}</Text>
                  <Text>•</Text>
                  <Clock size={16} color={iconColor} />
                  <Text>{event.time}</Text>
                </HStack>

                <HStack color={textColor} fontSize="sm">
                  <MapPin size={16} color={iconColor} />
                  <Text fontWeight="500">{event.location}</Text>
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
              <HStack justify="space-between" width="100%" mt="auto" pt="8px">
                <Text fontSize="sm" color={textColor}>
                  {event.organizer.name}
                </Text>
                <Text fontSize="sm" color={textColor} fontWeight="500">
                  {event.attendees} attending
                </Text>
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
      </motion.div>
    );
  };

  // Active filters count
  const activeFiltersCount = Object.values(filters).filter(value =>
    value !== "" && value !== "All" && value !== "date"
  ).length;

  // Stats for header
  const totalEvents = events.length;
  const onlineEvents = events.filter(e => e.locationType === "online").length;
  const freeEvents = events.filter(e => e.price === "free").length;

  return (
    <Box bg={bgColor} minH="100vh" py="40px">
      <Container maxW="container.xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header */}
          <VStack gap="32px" align="start" mb="48px">
            <motion.div variants={itemVariants} style={{ width: '100%' }}>
              <VStack gap="24px" align="start" width="100%">
                {/* Main Heading with Gradient */}
                <Box>
                  <Badge
                    bg={highlightBg}
                    color={accentColor}
                    px="16px"
                    py="6px"
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="600"
                    mb="16px"
                    display="flex"
                    alignItems="center"
                    gap="8px"
                    width="fit-content"
                  >
                    <Sparkles size={14} />
                    The Developer's Platform
                  </Badge>
                  <Heading
                    as="h1"
                    size="2xl"
                    fontWeight="800"
                    bgGradient={`linear(to-r, ${gradientFrom}, ${gradientTo})`}
                    bgClip="text"
                    lineHeight="1.2"
                  >
                    Where Interests Become Friendships
                  </Heading>
                  <Text
                    color={textColor}
                    fontSize="xl"
                    mt="16px"
                    maxW="600px"
                    lineHeight="1.6"
                  >
                    Connect with developers who share your passions. Learn together, build together,
                    and grow your network through amazing events and communities.
                  </Text>
                </Box>

                {/* Stats Row */}
                <HStack gap="32px" flexWrap="wrap" mt="8px">
                  <HStack>
                    <Box p="8px" bg="blue.100" borderRadius="8px">
                      <Code size={20} color={accentColor} />
                    </Box>
                    <VStack align="start" gap="0">
                      <Text fontWeight="700" fontSize="lg">{totalEvents}+</Text>
                      <Text color={textColor} fontSize="sm">Tech Events</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Box p="8px" bg="green.100" borderRadius="8px">
                      <Globe size={20} color="green.500" />
                    </Box>
                    <VStack align="start" gap="0">
                      <Text fontWeight="700" fontSize="lg">{onlineEvents}</Text>
                      <Text color={textColor} fontSize="sm">Online Events</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Box p="8px" bg="purple.100" borderRadius="8px">
                      <Heart size={20} color="purple.500" />
                    </Box>
                    <VStack align="start" gap="0">
                      <Text fontWeight="700" fontSize="lg">{freeEvents}</Text>
                      <Text color={textColor} fontSize="sm">Free to Join</Text>
                    </VStack>
                  </HStack>
                  <HStack>
                    <Box p="8px" bg="orange.100" borderRadius="8px">
                      <MessageCircle size={20} color="orange.500" />
                    </Box>
                    <VStack align="start" gap="0">
                      <Text fontWeight="700" fontSize="lg">500+</Text>
                      <Text color={textColor} fontSize="sm">Developers</Text>
                    </VStack>
                  </HStack>
                </HStack>
              </VStack>
            </motion.div>

            {/* Search and Filters */}
            <Box width="100%">
              <VStack gap="24px" width="100%">
                {/* Enhanced Search Bar with InputGroup */}
                <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: '600px' }}>
                      <Search size={20} color={iconColor} />
                    <Input
                      placeholder="Search events by technology, topic, or location..."
                      bg={inputBg}
                      border="2px solid"
                      borderColor={inputBorder}
                      borderRadius="12px"
                      _placeholder={{
                        color: "gray.500",
                        fontSize: "md"
                      }}
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 3px ${useColorModeValue('blue.100', 'blue.900')}`,
                        bg: inputBg,
                        transform: 'translateY(-1px)'
                      }}
                      _hover={{
                        borderColor: accentColor,
                        transform: 'translateY(-1px)'
                      }}
                      pl="48px"
                      pr="20px"
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      fontSize="md"
                      height="56px"
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    />
                </motion.div>

                {/* Enhanced Filter Toggle */}
                <motion.div variants={itemVariants}>
                  <Button
                    variant={showFilters ? "solid" : "outline"}
                    bg={showFilters ? accentColor : "transparent"}
                    color={showFilters ? "white" : accentColor}
                    borderColor={accentColor}
                    borderWidth="2px"
                    fontWeight="600"
                    onClick={() => setShowFilters(!showFilters)}
                    size="lg"
                    px="28px"
                    height="56px"
                    borderRadius="12px"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl',
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    {activeFiltersCount > 0 && (
                      <Badge
                        colorScheme="blue"
                        borderRadius="full"
                        minW="24px"
                        height="24px"
                        ml="12px"
                        bg={showFilters ? "white" : accentColor}
                        color={showFilters ? accentColor : "white"}
                        fontSize="xs"
                        fontWeight="700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </motion.div>

                {/* Filter Controls */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -20 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      style={{ width: "100%" }}
                    >
                      <Box
                        bg={filterBg}
                        p="32px"
                        borderRadius="20px"
                        border="2px solid"
                        borderColor={borderColor}
                        boxShadow="2xl"
                        backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
                      >
                        <VStack gap="24px" align="start">
                          <HStack>
                            <Box p="10px" bg={accentColor} borderRadius="10px">
                              <Star size={20} color="white" />
                            </Box>
                            <Heading as="h3" size="md" color={accentColor}>
                              Filter Events
                            </Heading>
                          </HStack>
                          <HStack gap="20px" flexWrap="wrap" width="100%">
                            <Box flex="1" minW="200px">
                              <Text fontSize="sm" fontWeight="600" mb="8px" color={textColor}>
                                Category
                              </Text>
                              <select
                                style={{
                                  background: inputBg,
                                  border: '2px solid',
                                  borderColor: inputBorder,
                                  borderRadius: '12px',
                                  width: '100%',
                                  padding: '14px 16px',
                                  fontSize: '15px',
                                  fontWeight: '500',
                                  transition: 'all 0.3s',
                                  cursor: 'pointer'
                                }}
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = accentColor;
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = inputBorder;
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                <option value="All">All Categories</option>
                                {categories.map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </Box>

                            <Box flex="1" minW="200px">
                              <Text fontSize="sm" fontWeight="600" mb="8px" color={textColor}>
                                Event Type
                              </Text>
                              <select
                                style={{
                                  background: inputBg,
                                  border: '2px solid',
                                  borderColor: inputBorder,
                                  borderRadius: '12px',
                                  width: '100%',
                                  padding: '14px 16px',
                                  fontSize: '15px',
                                  fontWeight: '500',
                                  transition: 'all 0.3s',
                                  cursor: 'pointer'
                                }}
                                value={filters.eventType}
                                onChange={(e) => handleFilterChange("eventType", e.target.value)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = accentColor;
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = inputBorder;
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                <option value="All">All Types</option>
                                {eventTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </Box>

                            <Box flex="1" minW="180px">
                              <Text fontSize="sm" fontWeight="600" mb="8px" color={textColor}>
                                Price
                              </Text>
                              <select
                                style={{
                                  background: inputBg,
                                  border: '2px solid',
                                  borderColor: inputBorder,
                                  borderRadius: '12px',
                                  width: '100%',
                                  padding: '14px 16px',
                                  fontSize: '15px',
                                  fontWeight: '500',
                                  transition: 'all 0.3s',
                                  cursor: 'pointer'
                                }}
                                value={filters.price}
                                onChange={(e) => handleFilterChange("price", e.target.value)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = accentColor;
                                  e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = inputBorder;
                                  e.currentTarget.style.transform = 'translateY(0)';
                                }}
                              >
                                <option value="All">All Prices</option>
                                {priceTypes.map(price => (
                                  <option key={price} value={price}>{price}</option>
                                ))}
                              </select>
                            </Box>

                            <Button
                              variant="outline"
                              borderColor="gray.400"
                              color="gray.600"
                              fontWeight="600"
                              onClick={clearFilters}
                              disabled={activeFiltersCount === 0}
                              height="52px"
                              px="24px"
                              borderRadius="12px"
                              _hover={{
                                bg: 'gray.50',
                                transform: 'translateY(-2px)',
                                borderColor: 'gray.500'
                              }}
                              transition="all 0.3s"
                            >
                              Clear All
                            </Button>
                          </HStack>
                        </VStack>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </VStack>
            </Box>
          </VStack>

          {/* Enhanced Divider */}
          <motion.div variants={itemVariants}>
            <Box
              height="3px"
              bgGradient={`linear(to-r, transparent, ${accentColor}, transparent)`}
              my="48px"
              width="100%"
              opacity="0.3"
              borderRadius="full"
            />
          </motion.div>

          {/* Enhanced Events Header */}
          <motion.div variants={itemVariants}>
            <HStack justify="space-between" mb="32px" align="flex-end">
              <VStack align="start" gap="12px">
                <HStack>
                  <Box p="10px" bg={accentColor} borderRadius="10px">
                    <Calendar size={20} color="white" />
                  </Box>
                  <Heading as="h2" size="xl" fontWeight="800" color={accentColor}>
                    Upcoming Events
                  </Heading>
                </HStack>
                <HStack gap="16px">
                  <Text color={textColor} fontSize="lg" fontWeight="600">
                    Showing {paginatedEvents.length} of {filteredAndSortedEvents.length} events
                  </Text>
                  {activeFiltersCount > 0 && (
                    <Badge colorScheme="blue" fontSize="sm" px="12px" py="4px" borderRadius="full">
                      {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                    </Badge>
                  )}
                </HStack>
              </VStack>
              <Box>
                <Text fontSize="sm" fontWeight="600" mb="8px" color={textColor}>
                  Sort by
                </Text>
                <select
                  style={{
                    background: inputBg,
                    border: '2px solid',
                    borderColor: inputBorder,
                    borderRadius: '12px',
                    minWidth: '200px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '500',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accentColor;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = inputBorder;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Box>
            </HStack>
          </motion.div>

          {/* Events Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${JSON.stringify(filters)}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {paginatedEvents.length > 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  gap="32px"
                >
                  <AnimatePresence>
                    {paginatedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </AnimatePresence>
                </SimpleGrid>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    textAlign="center"
                    py="100px"
                    bg={cardBg}
                    borderRadius="20px"
                    border="2px dashed"
                    borderColor={borderColor}
                    backgroundImage="linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
                  >
                    <VStack gap="20px">
                      <Box p="20px" bg={highlightBg} borderRadius="12px">
                        <Search size={32} color={accentColor} />
                      </Box>
                      <Heading as="h3" size="lg" color={textColor}>
                        No events found
                      </Heading>
                      <Text color={textColor} fontSize="lg" maxW="400px">
                        Try adjusting your filters or search terms to find more events.
                      </Text>
                      <Button
                        variant="solid"
                        bg={accentColor}
                        color="white"
                        size="lg"
                        onClick={clearFilters}
                        mt="16px"
                      >
                        Clear All Filters
                      </Button>
                    </VStack>
                  </Box>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div variants={itemVariants}>
              <Flex justify="center" mt="48px" gap="16px" alignItems="center">
                <Button
                  variant="outline"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <HStack gap="8px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "solid" : "outline"}
                      bg={currentPage === page ? accentColor : "transparent"}
                      color={currentPage === page ? "white" : accentColor}
                      borderColor={accentColor}
                      onClick={() => goToPage(page)}
                      minW="48px"
                      height="48px"
                    >
                      {page}
                    </Button>
                  ))}
                </HStack>

                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </Flex>
              
              {/* Page info */}
              <Text textAlign="center" color={textColor} mt="16px" fontSize="sm">
                Page {currentPage} of {totalPages} • Showing {paginatedEvents.length} events
              </Text>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default EventsWrapper;