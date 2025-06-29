import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Textarea,
  Button,
  Flex,
  Stack,
  Alert,
  AlertIcon,
  useColorModeValue
} from '@chakra-ui/react';

import JsonTree from '../components/JsonTree';
import MappingPanel from '../components/MappingPanel';
import SearchInput from '../components/SearchInput';
import type { JsonPath, JsonValue } from '../types/json';
import { findAllPaths } from '../utils/findAllPaths';

function JsonViewer() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonData, setJsonData] = useState<JsonValue | null>(null);
  const [paths, setPaths] = useState<JsonPath[]>([]);
  const [selectedField, setSelectedField] = useState<JsonPath | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');

  const bgColor = useColorModeValue('#f7f7fb', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');


  useEffect(() => {
    const saved = localStorage.getItem('jsonviewer_input');
    if (saved) {
      setJsonInput(JSON.stringify(JSON.parse(saved), null, 2));
      localStorage.removeItem('jsonviewer_input');
    }
  }, []);

  const analyzeJson = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const newPaths = findAllPaths(parsedData);
      setJsonData(parsedData);
      setPaths(newPaths);
      setCollapsedNodes(new Set());
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('JSON inválido');
    }
  };

  const handleFieldSelect = (path: string) => {
    const field = paths.find(p => p.caminho === path);
    if (field) {
      setSelectedField(field);
    }
  };

  const toggleCollapse = (path: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <Box minH="100vh" position="relative">
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="32vh"
        zIndex="-1"
        bgGradient="linear(120deg, #a4508b 0%, #5f0a87 40%, #1e2a78 100%)"
        opacity={0.95}
        filter="blur(0.5px)"
      />
      <Box
        position="absolute"
        top="32vh"
        left="0"
        w="100%"
        h="calc(100vh - 32vh)"
        bg={bgColor}
        zIndex="-2"
      />
      <Container maxW="container.xl" py={8} pt={24}>
        <Stack>
          <Box>
            <Heading color="white" size="lg">Visualizador de JSON da Clint</Heading>
            <Text color="whiteAlpha.800" mt={1}>
              Cole seu JSON para visualizar e mapear os campos
            </Text>
          </Box>
          <Flex gap={8}>
            <Stack flex="0 0 400px" minW="400px" maxW="400px">
              <Box bg={cardBgColor} p={4} borderRadius="lg" shadow="lg" w="100%" border="1px solid" borderColor={borderColor}>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Cole seu JSON aqui..."
                  size="sm"
                  fontFamily="mono"
                  h="300px"
                  bg={bgColor}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'purple.400' }}
                  _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)' }}
                />
                {errorMessage && (
                  <Alert status="error" mt={2} borderRadius="md">
                    <AlertIcon />
                    {errorMessage}
                  </Alert>
                )}
                <Button
                  mt={4}
                  colorScheme="purple"
                  w="100%"
                  onClick={analyzeJson}
                >
                  Analisar JSON
                </Button>
              </Box>
              <MappingPanel field={selectedField} />
            </Stack>
            <Stack flex={1}>
              <SearchInput value={searchTerm} onChange={setSearchTerm} />
              <Box
                bg={cardBgColor}
                p={4}
                borderRadius="lg"
                shadow="lg"
                w="100%"
                h="600px"
                overflowY="auto"
                border="1px solid"
                borderColor={borderColor}
                style={{ resize: 'vertical', overflow: 'auto', minHeight: '200px' }}
              >
                {jsonData ? (
                  <JsonTree
                    data={jsonData}
                    paths={paths}
                    search={searchTerm}
                    collapsedNodes={collapsedNodes}
                    toggleCollapse={toggleCollapse}
                    onSelect={handleFieldSelect}
                  />
                ) : (
                  <Text color={secondaryTextColor} textAlign="center">
                    Nenhum JSON para exibir
                  </Text>
                )}
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

export default JsonViewer;
