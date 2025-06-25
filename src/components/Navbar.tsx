import React, { useState } from 'react';
import { Box, Flex, Button, useColorModeValue, Link as ChakraLink, IconButton, useColorMode } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const menuItems = [
  {
    label: 'Início',
    path: '/',
    children: null,
  },
  {
    label: 'Webhook',
    path: '/webhook'
  },
  {
    label: 'JSON Viewer',
    path: '/jsonviewer'
  },
];

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const bg = useColorModeValue('rgba(255,255,255,0.85)', 'rgba(26, 32, 44, 0.85)');
  const border = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={100}
      bg={bg}
      borderRadius="2xl"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      border="1px solid"
      borderColor={border}
      px={6}
      py={2}
      minW="fit-content"
      maxW="90vw"
      style={{backdropFilter: 'blur(12px)'}}
    >
      <Flex justify="center" align="center" gap={4}>
        {menuItems.map((item) => (
          <Box key={item.label} position="relative" onMouseEnter={() => setActive(item.label)} onMouseLeave={() => setActive(null)}>
            <motion.div whileHover={{ scale: 1.13 }} style={{ display: 'inline-block' }}>
              <Button
                as={Link}
                to={item.path}
                variant={location.pathname === item.path ? 'solid' : 'ghost'}
                colorScheme="purple"
                fontWeight="bold"
                fontSize="md"
                px={6}
                py={2}
                _hover={{ opacity: 0.95 }}
                borderRadius="xl"
                transition="all 0.2s"
                boxShadow={location.pathname === item.path ? 'lg' : 'none'}
              >
                {item.label}
              </Button>
            </motion.div>
            <AnimatePresence>
              {active === item.label && item.children && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={transition}
                  style={{ position: 'absolute', left: '50%', top: 'calc(100% + 12px)', transform: 'translateX(-50%)', zIndex: 200 }}
                >
                  <Box bg={bg} borderRadius="xl" boxShadow="xl" border="1px solid" borderColor={border} p={2} minW="200px">
                    {item.children}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        ))}
        <IconButton
          aria-label={colorMode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme="purple"
          size="lg"
          ml={4}
        />
      </Flex>
    </Box>
  );
} 