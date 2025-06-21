import React from 'react';
import {
  Box,
  Flex,
  Text,
  Stack,
  Code,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import type { JsonPath } from '../types/json';

interface JsonTreeProps {
  data: any;
  paths: JsonPath[];
  search: string;
  collapsedNodes: Set<string>;
  toggleCollapse: (path: string) => void;
  onSelect: (path: string) => void;
}

const JsonTree: React.FC<JsonTreeProps> = ({
  data,
  paths,
  search,
  collapsedNodes,
  toggleCollapse,
  onSelect
}) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const codeBgColor = useColorModeValue('gray.100', 'gray.700');

  const TreeLineWrapper = ({
    children,
    showLine,
    isLast
  }: {
    children: React.ReactNode;
    showLine: boolean;
    isLast: boolean;
  }) => (
    <Box position="relative" pl={4}>
      {showLine && (
        <Box position="absolute" top={0} left={0} h="100%" w="16px" zIndex={0}>
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

  const renderJsonNode = (obj: any, level = 0, currentPath = ''): React.ReactNode => {
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
                onClick={() => onSelect(path)}
                borderBottom="1px solid"
                borderColor={borderColor}
                position="relative"
                zIndex={1}
              >
                {isObject && (
                  <IconButton
                    aria-label={isCollapsed ? 'Expandir' : 'Recolher'}
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
                    <Text fontSize="sm" color={secondaryTextColor} mx={2}>
                      :
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {String(item)}
                    </Text>
                    <Code ml={2} fontSize="xs" bg={codeBgColor} color={textColor}>
                      {typeof item}
                    </Code>
                  </>
                )}
                {isObject && (
                  <Text fontSize="sm" color={secondaryTextColor} ml={2}>
                    {Array.isArray(item)
                      ? `[${item.length} itens]`
                      : `{${Object.keys(item).length} campos}`}
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
              onClick={() => onSelect(path)}
              borderBottom="1px solid"
              borderColor={borderColor}
              position="relative"
              zIndex={1}
            >
              {isObject && (
                <IconButton
                  aria-label={isCollapsed ? 'Expandir' : 'Recolher'}
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
                  <Text fontSize="sm" color={secondaryTextColor} mx={2}>
                    :
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    {String(value)}
                  </Text>
                  <Code ml={2} fontSize="xs" bg={codeBgColor} color={textColor}>
                    {typeof value}
                  </Code>
                </>
              )}
              {isObject && (
                <Text fontSize="sm" color={secondaryTextColor} ml={2}>
                  {Array.isArray(value)
                    ? `[${value.length} itens]`
                    : `{${Object.keys(value).length} campos}`}
                </Text>
              )}
            </Flex>
            {isObject && !isCollapsed && renderJsonNode(value, level + 1, path)}
          </Box>
        </TreeLineWrapper>
      );
    });
  };

  const renderFilteredJson = (obj: any, term: string) => {
    if (!term) return renderJsonNode(obj);

    const matchingPaths = paths.filter(
      (p) =>
        p.caminho.toLowerCase().includes(term.toLowerCase()) ||
        String(p.valor).toLowerCase().includes(term.toLowerCase()) ||
        p.nome.toLowerCase().includes(term.toLowerCase())
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
            onClick={() => onSelect(path.caminho)}
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

  return <>{data && renderFilteredJson(data, search)}</>;
};

export default JsonTree;
