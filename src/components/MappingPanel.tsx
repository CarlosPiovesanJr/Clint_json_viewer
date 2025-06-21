import { Box, Code, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { JsonPath } from '../types/json';

interface MappingPanelProps {
  field: JsonPath | null;
}

const MappingPanel: React.FC<MappingPanelProps> = ({ field }) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const codeBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box bg={cardBgColor} p={4} borderRadius="lg" shadow="lg" w="100%" border="1px solid" borderColor={borderColor}>
      <Heading size="sm" mb={4} color={textColor}>Mapeamento do Campo Selecionado</Heading>
      {field ? (
        <Stack>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Nome do Campo:
            </Text>
            <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
              {field.nome}
            </Code>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Tipo:
            </Text>
            <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs">
              {field.tipo}
            </Code>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Valor:
            </Text>
            <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
              {String(field.valor)}
            </Code>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Caminho:
            </Text>
            <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
              {field.caminho}
            </Code>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Mapeamento Clint:
            </Text>
            <Code p={1} bg={codeBgColor} color={textColor} fontSize="xs" whiteSpace="pre-wrap" wordBreak="break-all">
              {field.caminho.replace(/^body\./, '')}
            </Code>
          </Box>
        </Stack>
      ) : (
        <Text color={secondaryTextColor} textAlign="center">Nenhum campo selecionado</Text>
      )}
    </Box>
  );
};

export default MappingPanel;
