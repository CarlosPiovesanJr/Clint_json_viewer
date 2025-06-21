import { Input, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Input
      placeholder="🔍 Buscar campo..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="sm"
      bg={cardBgColor}
      color={textColor}
      borderColor={borderColor}
      _hover={{ borderColor: 'purple.400' }}
      _focus={{ borderColor: 'purple.400', boxShadow: '0 0 0 1px var(--chakra-colors-purple-400)' }}
    />
  );
};

export default SearchInput;
