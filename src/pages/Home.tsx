import { Box, Heading, Text, Flex, useColorModeValue } from '@chakra-ui/react';

const Home = () => {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const boxTextColor = useColorModeValue('gray.600', 'gray.100');
  return (
    <Box minH="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Flex w="100%" maxW="1100px" minH="60vh" mx="auto" direction="column" align="center" justify="center" flex={1} pt={{ base: 12, md: 18 }}>
        <Heading
          size="2xl"
          textAlign="center"
          mb={20}
          mt={4}
          bgGradient="linear(120deg, #e0aaff 0%, #b085f5 40%, #7c43bd 100%)"
          bgClip="text"
          color="transparent"
          textShadow="0 2px 16px rgba(95, 10, 135, 0.18), 0 1px 0 #fff, 0 0 8px #fff8"
          fontWeight="extrabold"
        >
          Bem-vindo ao Visualizador de JSON<br />da Clint
        </Heading>
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
          bg={useColorModeValue('#f7f7fb', 'gray.900')}
          zIndex="-2"
        />
        <Flex w="100%" direction={{ base: 'column', md: 'row' }} gap={12} align="center" justify="center">
          <Box flex={1} maxW="650px" w="100%">
            <Box bg={cardBgColor} borderRadius="lg" boxShadow="0 4px 24px 0 rgba(164, 80, 139, 0.25)" border="1px solid" borderColor={borderColor} p={8}>
              <Text fontSize="lg" color={boxTextColor} textAlign="left">
                Este site permite que você teste, visualize e analise webhooks de forma simples e rápida.<br/><br/>
                <b>Como usar:</b><br/>
                1. Acesse a página <b>Webhook</b> para gerar um endpoint único.<br/>
                2. Envie requisições para esse endpoint (via Postman, curl, integrações, etc).<br/>
                3. Veja os webhooks recebidos listados na tela.<br/>
                4. Clique em qualquer payload para visualizar o conteúdo detalhado.<br/>
                5. Use o botão "Visualizar no JSON Viewer" para analisar o JSON com recursos avançados.<br/>
                <br/>
                Os dados recebidos ficam disponíveis por 48 horas, sem necessidade de login.
              </Text>
            </Box>
          </Box>
          <Box flex={1} maxW="560px" w="100%" h="315px" display="flex" alignItems="center" justifyContent="center">
            <Box w="100%" h="100%" bg="gray.200" borderRadius="lg" display="flex" alignItems="center" justifyContent="center" boxShadow="md">
              <Text color="gray.500">Vídeo de demonstração será exibido aqui</Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Home;
