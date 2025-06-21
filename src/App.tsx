import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Textarea,
  Button,
  Input,
  Flex,
  Stack,
  Code,
  Alert,
  AlertIcon,
  useColorModeValue,
  IconButton,
  useColorMode
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import type { JsonPath } from './types/json';
import { findAllPaths } from './utils/findAllPaths';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [paths, setPaths] = useState<JsonPath[]>([]);
  const [selectedField, setSelectedField] = useState<JsonPath | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');

  // Cores do tema
  const bgColor = useColorModeValue('#f7f7fb', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const codeBgColor = useColorModeValue('gray.100', 'gray.700');

  const { colorMode, toggleColorMode } = useColorMode();

  // Função para encontrar todos os caminhos no JSON está agora em utils/findAllPaths


  const analyzeJson = () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      const newPaths = findAllPaths(parsedData);
      setJsonData(parsedData);
      setPaths(newPaths);
      setCollapsedNodes(new Set());
      setErrorMessage('');
    } catch (error) {
      console.error('Erro ao analisar JSON:', error);
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

  // Função para renderizar apenas os caminhos que correspondem à busca
  const renderFilteredJson = (obj: any, searchTerm: string) => {
    if (!searchTerm) return renderJsonNode(obj);

    const matchingPaths = paths.filter(p => 
      p.caminho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.valor).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingPaths.length === 0) {
      return (
        <Text color={secondaryTextColor} textAlign="center">
          Nenhum resultado encontrado
        </Text>
      );
    }

    return (
      <Stack spacing={2}>
        {matchingPaths.map((path) => (
          <Box
            key={path.caminho}
            p={2}
            bg={cardBgColor}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: hoverBgColor }}
            cursor="pointer"
            onClick={() => handleFieldSelect(path.caminho)}
          >
            <Flex direction="column" gap={1}>
              <Text fontSize="sm" color={textColor} fontWeight="bold">
                {path.nome}
              </Text>
              <Text fontSize="xs" color={secondaryTextColor}>
                Caminho: {path.caminho}
              </Text>
              <Flex align="center" gap={2}>
                <Text fontSize="xs" color={textColor}>
                  Valor: {String(path.valor)}
                </Text>
                <Code fontSize="xs" bg={codeBgColor} color={textColor}>
                  {path.tipo}
                </Code>
              </Flex>
            </Flex>
          </Box>
        ))}
      </Stack>
    );
  };

  // Adiciona um wrapper para desenhar as linhas da árvore
  const TreeLineWrapper = ({ children, showLine, isLast }: { children: React.ReactNode, showLine: boolean, isLast: boolean }) => (
    <Box position="relative" pl={4}>
      {showLine && (
        <Box
          position="absolute"
          top={0}
          left={0}
          h="100%"
          w="16px"
          zIndex={0}
        >
          {/* Linha vertical */}
          <Box
            position="absolute"
            left="7px"
            top={isLast ? '16px' : 0}
            bottom={isLast ? 'auto' : 0}
            h={isLast ? '16px' : '100%'}
            w="2px"
            bg={borderColor}
          />
        </Box>
      )}
      {children}
    </Box>
  );

  // Ajusta renderJsonNode para usar o wrapper e desenhar as linhas
  const renderJsonNode = (obj: any, level = 0, currentPath = '') => {
    if (!obj || typeof obj !== 'object') return null;

    if (Array.isArray(obj)) {
      return obj.map((item, index) => {
        const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        const isObject = typeof item === 'object' && item !== null;
        const indent = level * 16;
        const isCollapsed = collapsedNodes.has(path);
        const last = index === obj.length - 1;

        return (
          <TreeLineWrapper key={path} showLine={level > 0} isLast={last}>
            <Box ml={`${indent}px`}>
              <Flex
                align="center"
                py={1}
                px={2}
                _hover={{ bg: hoverBgColor }}
                cursor="pointer"
                onClick={() => handleFieldSelect(path)}
                borderBottom="1px solid"
                borderColor={borderColor}
                position="relative"
                zIndex={1}
              >
                {isObject && (
                  <IconButton
                    aria-label={isCollapsed ? "Expandir" : "Recolher"}
                    icon={isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                    size="xs"
                    variant="ghost"
                    color={textColor}
                    mr={1}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(path);
                    }}
                  />
                )}
                <Text fontSize="sm" color={textColor}>
                  [{index}]
                </Text>
                {!isObject && (
                  <>
                    <Text fontSize="sm" color={secondaryTextColor} mx={2}>:</Text>
                    <Text fontSize="sm" color={textColor}>{String(item)}</Text>
                    <Code ml={2} fontSize="xs" bg={codeBgColor} color={textColor}>
                      {typeof item}
                    </Code>
                  </>
                )}
                {isObject && (
                  <Text fontSize="sm" color={secondaryTextColor} ml={2}>
                    {Array.isArray(item) ? `[${item.length} itens]` : `{${Object.keys(item).length} campos}`}
                  </Text>
                )}
              </Flex>
              {isObject && !isCollapsed && renderJsonNode(item, level + 1, path)}
            </Box>
          </TreeLineWrapper>
        );
      });
    }

    const entries = Object.entries(obj);
    return entries.map(([key, value], idx) => {
      const path = currentPath ? `${currentPath}.${key}` : key;
      const isObject = typeof value === 'object' && value !== null;
      const indent = level * 16;
      const isCollapsed = collapsedNodes.has(path);
      const last = idx === entries.length - 1;

      return (
        <TreeLineWrapper key={path} showLine={level > 0} isLast={last}>
          <Box ml={`${indent}px`}>
            <Flex
              align="center"
              py={1}
              px={2}
              _hover={{ bg: hoverBgColor }}
              cursor="pointer"
              onClick={() => handleFieldSelect(path)}
              borderBottom="1px solid"
              borderColor={borderColor}
              position="relative"
              zIndex={1}
            >
              {isObject && (
                <IconButton
                  aria-label={isCollapsed ? "Expandir" : "Recolher"}
                  icon={isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
                  size="xs"
                  variant="ghost"
                  color={textColor}
                  mr={1}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollapse(path);
                  }}
                />
              )}
              <Text fontSize="sm" color={textColor}>
                {key}
              </Text>
              {!isObject && (
                <>
                  <Text fontSize="sm" color={secondaryTextColor} mx={2}>:</Text>
                  <Text fontSize="sm" color={textColor}>{String(value)}</Text>
                  <Code ml={2} fontSize="xs" bg={codeBgColor} color={textColor}>
                    {typeof value}
                  </Code>
                </>
              )}
              {isObject && (
                <Text fontSize="sm" color={secondaryTextColor} ml={2}>
                  {Array.isArray(value) ? `[${value.length} itens]` : `{${Object.keys(value).length} campos}`}
                </Text>
              )}
            </Flex>
            {isObject && !isCollapsed && renderJsonNode(value, level + 1, path)}
          </Box>
        </TreeLineWrapper>
      );
    });
  };

  return (
    <Box minH="100vh" position="relative">
      {/* Fundo gradiente estilo Monterey */}
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
      {/* Fundo escuro para o restante da página */}
      <Box
        position="absolute"
        top="32vh"
        left="0"
        w="100%"
        h="calc(100vh - 32vh)"
        bg={bgColor}
        zIndex="-2"
      />
      {/* Botão de alternância dark/light */}
      <Box position="absolute" top={4} right={4} zIndex={10}>
        <IconButton
          aria-label={colorMode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          colorScheme="purple"
          size="lg"
        />
      </Box>
      {/* Fim do botão de alternância */}
      <Container maxW="container.xl" py={8}>
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

              <Box bg={cardBgColor} p={4} borderRadius="lg" shadow="lg" w="100%" border="1px solid" borderColor={borderColor}>
                <Heading size="sm" mb={4} color={textColor}>Mapeamento do Campo Selecionado</Heading>
                {selectedField ? (
                  <Stack>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Nome do Campo:
                      </Text>
                      <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
                        {selectedField.nome}
                      </Code>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Tipo:
                      </Text>
                      <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs">
                        {selectedField.tipo}
                      </Code>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Valor:
                      </Text>
                      <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
                        {String(selectedField.valor)}
                      </Code>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Caminho:
                      </Text>
                      <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
                        {selectedField.caminho}
                      </Code>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Mapeamento Clint:
                      </Text>
                      <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
                        {selectedField.caminho.replace(/^body\./, '')}
                      </Code>
                    </Box>
                  </Stack>
                ) : (
                  <Text color={secondaryTextColor} textAlign="center">
                    Nenhum campo selecionado
                  </Text>
                )}
              </Box>
            </Stack>

            <Stack flex={1}>
              <Input
                placeholder="🔍 Buscar campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
                bg={cardBgColor}
                color={textColor}
                borderColor={borderColor}
                _hover={{ borderColor: 'purple.400' }}
                _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)' }}
              />
              <Box bg={cardBgColor} p={4} borderRadius="lg" shadow="lg" w="100%" h="600px" overflowY="auto" border="1px solid" borderColor={borderColor}>
                {jsonData ? (
                  renderFilteredJson(jsonData, searchTerm)
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

export default App;
