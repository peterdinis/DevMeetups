import type { FC } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  SimpleGrid,
  Badge,
  Grid,
  Card,
  Flex,
} from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

const HomeWrapper: FC = () => {
  
  // Color values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const heroBg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  // Mock data for events
  const upcomingEvents = [
    {
      id: 1,
      title: "React Developers Hangout",
      description: "Weekly virtual meetup for React enthusiasts",
      date: "Tomorrow, 7:00 PM",
      attendees: 45,
      location: "Online Event",
      category: "Tech",
    },
    {
      id: 2,
      title: "TypeScript Study Group",
      description: "Deep dive into advanced TypeScript patterns",
      date: "Fri, Jan 19 • 6:30 PM",
      attendees: 32,
      location: "Virtual Meeting",
      category: "Programming",
    },
    {
      id: 3,
      title: "Node.js Microservices Workshop",
      description: "Hands-on workshop building scalable services",
      date: "Sat, Jan 20 • 10:00 AM",
      attendees: 28,
      location: "Online Event",
      category: "Backend",
    },
  ];

  // Popular categories
  const popularCategories = [
    { name: "Tech", members: "2.3k", color: "blue" },
    { name: "Programming", members: "1.8k", color: "green" },
    { name: "Startups", members: "1.5k", color: "purple" },
    { name: "AI & ML", members: "1.2k", color: "orange" },
    { name: "Web Development", members: "2.1k", color: "red" },
    { name: "Mobile Dev", members: "980", color: "teal" },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Box bg={heroBg} py={{ base: "60px", md: "100px" }}>
        <Container maxW="container.xl">
          <VStack gap="48px" textAlign="center">
            <VStack gap="32px" maxW="700px" mx="auto">
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                fontWeight="800"
                lineHeight="1.1"
                color={useColorModeValue("gray.900", "white")}
              >
                The{" "}
                <Box as="span" display="inline-flex" alignItems="center" px="8px">
                  👨‍💻
                </Box>{" "}
                developers platform.
                <br />
                Where{" "}
                <Box as="span" display="inline-flex" alignItems="center" px="8px">
                  ⚙️
                </Box>{" "}
                interests
                <br />
                become{" "}
                <Box as="span" display="inline-flex" alignItems="center" px="8px">
                  💝
                </Box>{" "}
                friendships.
              </Heading>
              
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                color={textColor}
                lineHeight="1.8"
                maxW="600px"
              >
                Whatever your interest in tech, from React and Node.js to AI and startups, 
                there are thousands of developers who share it on DevMeetup. Events are 
                happening every day—sign up to join the fun.
              </Text>

              <Button
                size="lg"
                bg="gray.900"
                color="white"
                _hover={{ bg: "gray.800" }}
                borderRadius="full"
                px="48px"
                py="28px"
                fontSize="lg"
                fontWeight="600"
                mt="16px"
              >
                Join DevMeetup
              </Button>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py="80px">
        <VStack gap="80px" align="stretch">
          {/* Events Section */}
          <Box>
            <Flex justify="space-between" align="center" mb="32px">
              <Heading 
                as="h2" 
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                color={useColorModeValue("gray.900", "white")}
              >
                Upcoming online events
              </Heading>
              <Button
                variant="ghost"
                color="blue.600"
                fontWeight="600"
                _hover={{ bg: "transparent", color: "blue.700" }}
              >
                See all events
              </Button>
            </Flex>

            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
              gap="24px"
            >
              {upcomingEvents.map((event) => (
                <Card.Root
                  key={event.id}
                  variant="outline"
                  borderRadius="16px"
                  overflow="hidden"
                  _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
                  transition="all 0.3s"
                  cursor="pointer"
                  bg={cardBg}
                >
                  <Card.Body p="24px">
                    <VStack gap="16px" align="start">
                      <Badge
                        colorPalette="gray"
                        fontSize="xs"
                        px="12px"
                        py="4px"
                        borderRadius="full"
                        fontWeight="600"
                      >
                        Free
                      </Badge>

                      <VStack gap="8px" align="start" width="100%">
                        <Heading as="h3" size="md" fontWeight="700">
                          {event.title}
                        </Heading>
                        
                        <Text fontSize="sm" color={textColor}>
                          {event.description}
                        </Text>
                      </VStack>

                      <VStack gap="12px" align="start" width="100%" pt="8px" borderTop="1px solid" borderColor={borderColor}>
                        <Text fontSize="sm" fontWeight="600" color={textColor}>
                          {event.date}
                        </Text>
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Grid>
          </Box>

          {/* How it works Section */}
          <Box bg={cardBg} borderRadius="24px" p={{ base: "40px", md: "60px" }}>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="60px" alignItems="center">
              <VStack gap="32px" align="start">
                <Heading 
                  as="h2" 
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                >
                  How DevMeetup works
                </Heading>
                
                <Text fontSize="lg" color={textColor} lineHeight="1.8">
                  Meet new people who share your interests through online and in-person events. 
                  It's free to create an account.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 1 }} gap="24px">
                {[
                  {
                    icon: "🔍",
                    title: "Join a group",
                    description: "Find communities that match your interests and passions"
                  },
                  {
                    icon: "📅",
                    title: "Find an event",
                    description: "See what's happening in your developer community"
                  },
                  {
                    icon: "💬",
                    title: "Start connecting",
                    description: "Chat with members and join the conversation"
                  }
                ].map((item, index) => (
                  <HStack key={index} gap="20px" align="start">
                    <Box
                      fontSize="3xl"
                      flexShrink={0}
                    >
                      {item.icon}
                    </Box>
                    <VStack gap="8px" align="start">
                      <Text fontSize="lg" fontWeight="700">
                        {item.title}
                      </Text>
                      <Text fontSize="md" color={textColor}>
                        {item.description}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </SimpleGrid>
            </Grid>
          </Box>

          {/* Popular Categories */}
          <Box>
            <Heading 
              as="h2" 
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              mb="32px"
            >
              Popular categories
            </Heading>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} gap="16px">
              {popularCategories.map((category) => (
                <Box
                  key={category.name}
                  p="24px"
                  bg={cardBg}
                  borderRadius="16px"
                  border="1px solid"
                  borderColor={borderColor}
                  _hover={{ 
                    shadow: "md", 
                    transform: "translateY(-2px)",
                    borderColor: "blue.300"
                  }}
                  transition="all 0.3s"
                  cursor="pointer"
                >
                  <VStack gap="8px" align="start">
                    <Text fontWeight="700" fontSize="md">
                      {category.name}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {category.members}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HomeWrapper;