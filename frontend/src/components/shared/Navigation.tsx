import { Box, Flex, Input, Text, Icon, useDisclosure, Menu } from '@chakra-ui/react';
import { Search, Bell, User, LogOut, Settings, Users, Menu as MenuIcon, X, ChevronDown, Calendar, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FC } from 'react';

const MotionBox = motion(Box);

const Navigation: FC = () => {
    const { open: isMobileMenuOpen, onToggle: onMobileMenuToggle, onClose: onMobileMenuClose } = useDisclosure();
    const { open: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

    return (
        <>
            <Box 
                as="nav" 
                w="full" 
                px={{ base: 4, md: 8 }} 
                py={4} 
                bg="white"
                borderBottom="1px"
                borderColor="gray.200"
                shadow="sm"
            >
                <Flex justify="space-between" align="center" gap={4}>
                    {/* Logo s ikonkou a hamburger menu */}
                    <Flex align="center" gap={4}>
                        {/* Hamburger Menu Button - Mobile */}
                        <Icon 
                            as={isMobileMenuOpen ? X : MenuIcon}
                            w={6} 
                            h={6} 
                            color="gray.600"
                            display={{ base: 'block', md: 'none' }}
                            onClick={onMobileMenuToggle}
                            cursor="pointer"
                        />
                        
                        {/* Logo */}
                        <Flex align="center" gap={2}>
                            <Icon as={Users} w={6} h={6} color="blue.500" />
                            <Text 
                                fontSize="2xl" 
                                fontWeight="bold" 
                                color="gray.800"
                            >
                                DevMeet
                            </Text>
                        </Flex>
                    </Flex>

                    {/* Search Bar - Hidden on mobile and tablet */}
                    <Flex 
                        position="relative" 
                        maxW="400px" 
                        flex="1"
                        display={{ base: 'none', lg: 'flex' }}
                    >
                        <Icon 
                            as={Search} 
                            w={4} 
                            h={4} 
                            color="gray.500" 
                            position="absolute"
                            left="12px"
                            top="50%"
                            transform="translateY(-50%)"
                            zIndex={1}
                        />
                        <Input 
                            placeholder="Browse Meetups" 
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                            borderRadius="lg"
                            pl={10}
                            _placeholder={{ color: 'gray.500' }}
                            _hover={{ borderColor: 'gray.300' }}
                            _focus={{
                                borderColor: 'blue.500',
                                boxShadow: '0 0 0 1px blue.500',
                                bg: 'white'
                            }}
                        />
                    </Flex>

                    {/* Right side icons and user */}
                    <Flex align="center" gap={4}>
                        {/* Search Icon - Mobile and tablet only */}
                        <Icon 
                            as={Search} 
                            w={5} 
                            h={5} 
                            color="gray.600"
                            display={{ base: 'block', lg: 'none' }}
                            cursor="pointer"
                            onClick={onSearchOpen}
                        />

                        {/* Notifications Dropdown - Hidden on mobile */}
                        <Menu.Root positioning={{ placement: 'bottom-end' }}>
                            <Menu.Trigger asChild>
                                <Box 
                                    position="relative"
                                    p={2}
                                    borderRadius="md"
                                    _hover={{ bg: 'blue.50', cursor: 'pointer' }}
                                    display={{ base: 'none', md: 'block' }}
                                    transition="all 0.2s"
                                >
                                    <Icon as={Bell} w={5} h={5} color="gray.600" />
                                    <Box
                                        position="absolute"
                                        top={1}
                                        right={1}
                                        w={2}
                                        h={2}
                                        bg="red.500"
                                        borderRadius="full"
                                        border="2px"
                                        borderColor="white"
                                    />
                                </Box>
                            </Menu.Trigger>
                            <Menu.Positioner>
                                <Menu.Content 
                                    bg="white" 
                                    borderRadius="xl" 
                                    shadow="xl" 
                                    border="1px" 
                                    borderColor="gray.200"
                                    p={2}
                                    minW="280px"
                                >
                                    <Flex align="center" justify="space-between" p={3} borderBottom="1px" borderColor="gray.100">
                                        <Text fontWeight="bold" color="gray.800">Notifications</Text>
                                        <Text fontSize="sm" color="blue.500" cursor="pointer">Mark all read</Text>
                                    </Flex>
                                    
                                    <Menu.Item value="meetup" _hover={{ bg: 'blue.50' }} p={3} borderRadius="md">
                                        <Flex align="start" gap={3}>
                                            <Box p={2} bg="blue.100" borderRadius="md">
                                                <Icon as={Calendar} w={4} h={4} color="blue.600" />
                                            </Box>
                                            <Box flex="1">
                                                <Text fontWeight="medium" color="gray.800">New meetup scheduled</Text>
                                                <Text fontSize="sm" color="gray.600" mt={1}>React Conference - Tomorrow at 2 PM</Text>
                                                <Text fontSize="xs" color="gray.500" mt={1}>2 hours ago</Text>
                                            </Box>
                                        </Flex>
                                    </Menu.Item>
                                    
                                    <Menu.Item value="attendees" _hover={{ bg: 'green.50' }} p={3} borderRadius="md">
                                        <Flex align="start" gap={3}>
                                            <Box p={2} bg="green.100" borderRadius="md">
                                                <Icon as={UserPlus} w={4} h={4} color="green.600" />
                                            </Box>
                                            <Box flex="1">
                                                <Text fontWeight="medium" color="gray.800">New attendees</Text>
                                                <Text fontSize="sm" color="gray.600" mt={1}>3 people joined your meetup</Text>
                                                <Text fontSize="xs" color="gray.500" mt={1}>5 hours ago</Text>
                                            </Box>
                                        </Flex>
                                    </Menu.Item>
                                    
                                    <Menu.Item value="reminder" _hover={{ bg: 'orange.50' }} p={3} borderRadius="md">
                                        <Flex align="start" gap={3}>
                                            <Box p={2} bg="orange.100" borderRadius="md">
                                                <Icon as={Bell} w={4} h={4} color="orange.600" />
                                            </Box>
                                            <Box flex="1">
                                                <Text fontWeight="medium" color="gray.800">Reminder</Text>
                                                <Text fontSize="sm" color="gray.600" mt={1}>Don't forget about the meetup</Text>
                                                <Text fontSize="xs" color="gray.500" mt={1}>1 day ago</Text>
                                            </Box>
                                        </Flex>
                                    </Menu.Item>

                                    <Flex justify="center" p={2} borderTop="1px" borderColor="gray.100">
                                        <Text fontSize="sm" color="blue.500" cursor="pointer" fontWeight="medium">
                                            View all notifications
                                        </Text>
                                    </Flex>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Menu.Root>

                        {/* User Dropdown - Hidden on mobile */}
                        <Menu.Root positioning={{ placement: 'bottom-end' }}>
                            <Menu.Trigger asChild>
                                <Flex 
                                    align="center" 
                                    gap={2} 
                                    _hover={{ bg: 'blue.50', cursor: 'pointer' }} 
                                    p={2} 
                                    borderRadius="lg"
                                    display={{ base: 'none', md: 'flex' }}
                                    transition="all 0.2s"
                                >
                                    <Box 
                                        w={8} 
                                        h={8} 
                                        bg="blue.500" 
                                        borderRadius="full" 
                                        display="flex" 
                                        alignItems="center" 
                                        justifyContent="center"
                                        color="white"
                                        fontSize="xs"
                                        fontWeight="bold"
                                        border="2px"
                                        borderColor="blue.200"
                                    >
                                        UN
                                    </Box>
                                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                        User Name
                                    </Text>
                                    <Icon as={ChevronDown} w={4} h={4} color="gray.500" />
                                </Flex>
                            </Menu.Trigger>
                            <Menu.Positioner>
                                <Menu.Content 
                                    bg="white" 
                                    borderRadius="xl" 
                                    shadow="xl" 
                                    border="1px" 
                                    borderColor="gray.200"
                                    p={2}
                                    minW="200px"
                                >
                                    <Flex align="center" gap={3} p={3} borderBottom="1px" borderColor="gray.100">
                                        <Box 
                                            w={10} 
                                            h={10} 
                                            bg="blue.500" 
                                            borderRadius="full" 
                                            display="flex" 
                                            alignItems="center" 
                                            justifyContent="center"
                                            color="white"
                                            fontSize="sm"
                                            fontWeight="bold"
                                        >
                                            UN
                                        </Box>
                                        <Box>
                                            <Text fontWeight="bold" color="gray.800">User Name</Text>
                                            <Text fontSize="sm" color="gray.600">user@example.com</Text>
                                        </Box>
                                    </Flex>
                                    
                                    <Menu.Item value="profile" _hover={{ bg: 'blue.50' }} p={3} borderRadius="md">
                                        <Flex align="center" gap={3}>
                                            <Icon as={User} w={4} h={4} color="blue.600" />
                                            <Text fontWeight="medium">Profile</Text>
                                        </Flex>
                                    </Menu.Item>
                                    
                                    <Menu.Item value="settings" _hover={{ bg: 'blue.50' }} p={3} borderRadius="md">
                                        <Flex align="center" gap={3}>
                                            <Icon as={Settings} w={4} h={4} color="blue.600" />
                                            <Text fontWeight="medium">Settings</Text>
                                        </Flex>
                                    </Menu.Item>
                                    
                                    <Menu.Separator my={2} />
                                    
                                    <Menu.Item value="logout" _hover={{ bg: 'red.50' }} p={3} borderRadius="md">
                                        <Flex align="center" gap={3}>
                                            <Icon as={LogOut} w={4} h={4} color="red.600" />
                                            <Text fontWeight="medium" color="red.600">Logout</Text>
                                        </Flex>
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Menu.Root>
                    </Flex>
                </Flex>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <MotionBox
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            overflow="hidden"
                            mt={4}
                            display={{ md: 'none' }}
                        >
                            <Flex direction="column" gap={3} bg="gray.50" borderRadius="lg" p={4}>
                                {/* Mobile Menu Items */}
                                <Flex 
                                    align="center" 
                                    gap={3} 
                                    p={3} 
                                    borderRadius="md"
                                    _hover={{ bg: 'white', cursor: 'pointer' }}
                                    onClick={onMobileMenuClose}
                                >
                                    <Icon as={Bell} w={5} h={5} color="gray.600" />
                                    <Text fontWeight="medium">Notifications</Text>
                                </Flex>

                                <Flex 
                                    align="center" 
                                    gap={3} 
                                    p={3} 
                                    borderRadius="md"
                                    _hover={{ bg: 'white', cursor: 'pointer' }}
                                    onClick={onMobileMenuClose}
                                >
                                    <Icon as={User} w={5} h={5} color="gray.600" />
                                    <Text fontWeight="medium">Profile</Text>
                                </Flex>

                                <Flex 
                                    align="center" 
                                    gap={3} 
                                    p={3} 
                                    borderRadius="md"
                                    _hover={{ bg: 'white', cursor: 'pointer' }}
                                    onClick={onMobileMenuClose}
                                >
                                    <Icon as={Settings} w={5} h={5} color="gray.600" />
                                    <Text fontWeight="medium">Settings</Text>
                                </Flex>

                                <Flex 
                                    align="center" 
                                    gap={3} 
                                    p={3} 
                                    borderRadius="md"
                                    _hover={{ bg: 'white', cursor: 'pointer' }}
                                    onClick={onMobileMenuClose}
                                >
                                    <Icon as={LogOut} w={5} h={5} color="gray.600" />
                                    <Text fontWeight="medium">Logout</Text>
                                </Flex>
                            </Flex>
                        </MotionBox>
                    )}
                </AnimatePresence>
            </Box>

            {/* Search Dialog for Mobile and Tablet */}
            <AnimatePresence>
                {isSearchOpen && (
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        position="fixed"
                        top="0"
                        left="0"
                        w="full"
                        h="full"
                        bg="blackAlpha.600"
                        zIndex={50}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                    >
                        <MotionBox
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            w="full"
                            maxW="500px"
                            bg="white"
                            borderRadius="xl"
                            shadow="xl"
                            p={6}
                        >
                            <Flex position="relative" align="center">
                                <Icon 
                                    as={Search} 
                                    w={5} 
                                    h={5} 
                                    color="gray.500" 
                                    position="absolute"
                                    left="16px"
                                />
                                <Input 
                                    placeholder="Browse Meetups..." 
                                    bg="white"
                                    border="1px"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    pl={12}
                                    pr={12}
                                    size="lg"
                                    _placeholder={{ color: 'gray.500' }}
                                    _focus={{
                                        borderColor: 'blue.500',
                                        boxShadow: '0 0 0 1px blue.500',
                                    }}
                                    autoFocus
                                />
                                <Icon 
                                    as={X} 
                                    w={5} 
                                    h={5} 
                                    color="gray.500"
                                    position="absolute"
                                    right="16px"
                                    cursor="pointer"
                                    onClick={onSearchClose}
                                />
                            </Flex>
                        </MotionBox>
                    </MotionBox>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navigation;