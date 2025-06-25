import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Input,
  Button,
  IconButton,
  useToast,
  Flex,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useDisclosure,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import { CopyIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverFooter, PopoverCloseButton, PopoverHeader, PopoverAnchor } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_URL = 'http://localhost:4000/api/webhook';

type Payload = {
  id: string;
  received_at: string;
  body: any;
};

function generateFrontendUrl(id: string) {
  return `${window.location.origin}/api/webhook/${id}`;
}

const Webhook = () => {
  const [webhookId, setWebhookId] = useState(null);
  const [payloads, setPayloads] = useState<Payload[]>([]);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState<Payload | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const deleteAllPopover = useDisclosure();
  const deleteSelectedPopover = useDisclosure();
  const boxBg = useColorModeValue('gray.100', 'gray.800');
  const payloadBg = useColorModeValue('white', 'gray.900');
  const payloadText = useColorModeValue('gray.800', 'gray.100');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { colorMode } = useColorMode();

  // Carregar webhookId do localStorage ou criar novo
  useEffect(() => {
    const savedId = localStorage.getItem('webhook_id');
    if (savedId) {
      setWebhookId(savedId);
    } else {
      createNewWebhook();
    }
    // eslint-disable-next-line
  }, []);

  // Salvar webhookId no localStorage sempre que mudar
  useEffect(() => {
    if (webhookId) {
      localStorage.setItem('webhook_id', webhookId);
    }
  }, [webhookId]);

  // Busca os payloads periodicamente
  useEffect(() => {
    if (!webhookId) return;
    setLoading(true);
    const fetchPayloads = async () => {
      try {
        const res = await axios.get(`${API_URL}/${webhookId}`);
        setPayloads(res.data);
      } catch (e) {
        setPayloads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayloads();
    const interval = setInterval(fetchPayloads, 5000);
    return () => clearInterval(interval);
  }, [webhookId]);

  async function createNewWebhook() {
    setLoading(true);
    setPayloads([]);
    setWebhookId(null);
    localStorage.removeItem('webhook_id');
    try {
      const res = await axios.post(API_URL);
      setWebhookId(res.data.id);
    } catch (e) {
      toast({ title: 'Erro ao criar webhook', status: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!webhookId) return;
    setCopying(true);
    navigator.clipboard.writeText(generateFrontendUrl(webhookId)).then(() => {
      toast({ title: 'Endpoint copiado!', status: 'success' });
      setCopying(false);
    });
  }

  function handleViewInJsonViewer(json: any) {
    localStorage.setItem('jsonviewer_input', JSON.stringify(json));
    navigate('/jsonviewer');
  }

  async function handleDeleteSelected() {
    if (!selectedPayload) return;
    // Chamada para deletar o payload selecionado
    await axios.delete(`${API_URL}/${webhookId}/payload/${selectedPayload.id}`);
    setPayloads(payloads.filter(p => p.id !== selectedPayload.id));
    setSelectedPayload(null);
  }

  async function handleDeleteAll() {
    // Chamada para deletar todos os payloads do webhook
    await axios.delete(`${API_URL}/${webhookId}/payloads`);
    setPayloads([]);
    setSelectedPayload(null);
  }

  async function handleSendFeedback(type: 'feedback' | 'feature') {
    setSending(true);
    // Aqui você pode integrar com um serviço de e-mail (ex: EmailJS, backend próprio, etc)
    // Por enquanto, só simula envio
    setTimeout(() => {
      setSending(false);
      setMessage('');
      setName('');
      setEmail('');
      if (type === 'feedback') setIsFeedbackOpen(false);
      else setIsFeatureOpen(false);
      toast({ title: 'Mensagem enviada!', status: 'success' });
    }, 1500);
  }

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
        bg={useColorModeValue('#f7f7fb', 'gray.900')}
        zIndex="-2"
      />
      <Box display="flex" alignItems="flex-start" justifyContent="center" pt={32} minH="80vh">
        <Flex gap={8} align="flex-start" w="100%" maxW="1200px" direction={{ base: 'column', md: 'row' }}>
          <Box flex={1} minW="320px" alignSelf="flex-start">
            <Box w="100%" maxW="400px" bg={cardBgColor} borderRadius="lg" boxShadow="lg" border="1px solid" borderColor={borderColor} p={6} mb={6}>
              <Heading mb={4}>Webhook receiver</Heading>
              <Text color="gray.500" maxW="lg" textAlign="left">
                Use o endpoint abaixo para enviar webhooks (exemplo: via Postman, curl ou integração).<br/>
                As cargas recebidas ficam disponíveis por 48 horas, sem necessidade de login.
              </Text>
              <Flex align="center" gap={2} my={4}>
                <Input value={webhookId ? generateFrontendUrl(webhookId) : ''} isReadOnly w="400px" fontFamily="mono" />
                <IconButton
                  icon={<CopyIcon />}
                  aria-label="Copiar endpoint"
                  onClick={handleCopy}
                  isLoading={copying}
                  colorScheme="purple"
                />
                <IconButton
                  icon={<RepeatIcon />}
                  aria-label="Novo webhook"
                  onClick={createNewWebhook}
                  colorScheme="gray"
                  variant="outline"
                />
              </Flex>
            </Box>
            <Box w="100%" maxW="400px" minH="200px" bg={boxBg} borderRadius="lg" boxShadow="lg" border="1px solid" borderColor={borderColor} p={4} position="relative">
              <Flex position="absolute" top={2} right={2} gap={2} zIndex={2}>
                <Popover placement="bottom-end" isOpen={deleteAllPopover.isOpen} onClose={deleteAllPopover.onClose}>
                  <PopoverTrigger>
                    <Tooltip label="Deletar todos" hasArrow>
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Deletar todos"
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        isDisabled={payloads.length === 0}
                        onClick={deleteAllPopover.onOpen}
                      />
                    </Tooltip>
                  </PopoverTrigger>
                  <PopoverContent w="auto">
                    <PopoverArrow />
                    <PopoverBody>
                      Tem certeza que deseja deletar todos?
                      <Button colorScheme="red" size="xs" ml={2} onClick={() => { handleDeleteAll(); deleteAllPopover.onClose(); }}>Sim</Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <Text fontWeight="bold" mb={2}>Webhooks recebidos:</Text>
              {loading && <Spinner />}
              {!loading && payloads.length === 0 && (
                <Text color="gray.500">Nenhum webhook recebido ainda.</Text>
              )}
              <Stack spacing={1} mt={2}>
                {payloads.map((p) => (
                  <Flex key={p.id} align="center" gap={2}>
                    <Button
                      size="sm"
                      variant={selectedPayload?.id === p.id ? 'solid' : 'ghost'}
                      colorScheme="purple"
                      justifyContent="flex-start"
                      w="100%"
                      onClick={() => setSelectedPayload(p)}
                      fontWeight={selectedPayload?.id === p.id ? 'bold' : 'normal'}
                      textAlign="left"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {new Date(p.received_at).toLocaleString()}
                    </Button>
                    {selectedPayload?.id === p.id && (
                      <Popover placement="right" isOpen={deleteSelectedPopover.isOpen} onClose={deleteSelectedPopover.onClose}>
                        <PopoverTrigger>
                          <Tooltip label="Deletar" hasArrow>
                            <IconButton
                              icon={<DeleteIcon />}
                              aria-label="Deletar selecionado"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              isDisabled={!selectedPayload}
                              onClick={deleteSelectedPopover.onOpen}
                            />
                          </Tooltip>
                        </PopoverTrigger>
                        <PopoverContent w="auto">
                          <PopoverArrow />
                          <PopoverBody>
                            Tem certeza que deseja deletar?
                            <Button colorScheme="red" size="xs" ml={2} onClick={() => { handleDeleteSelected(); deleteSelectedPopover.onClose(); }}>Sim</Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    )}
                  </Flex>
                ))}
              </Stack>
              <Flex gap={2} mt={4} wrap="wrap">
                <Button colorScheme="purple" size="sm" variant="outline" onClick={() => setIsFeedbackOpen(true)}>
                  Deixe um feedback
                </Button>
                <Button colorScheme="purple" size="sm" variant="outline" onClick={() => setIsFeatureOpen(true)}>
                  Solicitar funcionalidade
                </Button>
              </Flex>
            </Box>
          </Box>
          <Box flex={2} minW="320px" maxW="700px" bg={boxBg} borderRadius="lg" boxShadow="lg" border="1px solid" borderColor={borderColor} p={6}>
            {selectedPayload ? (
              <>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="bold">Conteúdo do Payload</Text>
                  <Button size="xs" colorScheme="purple" variant="outline" onClick={() => handleViewInJsonViewer(selectedPayload.body)}>
                    Visualizar no JSON Viewer
                  </Button>
                </Flex>
                <Box maxH="60vh" overflowY="auto" borderRadius="md" border="1px solid #e2e8f0" bg={payloadBg} p={3}>
                  <SyntaxHighlighter
                    language="json"
                    style={colorMode === 'dark' ? vscDarkPlus : oneLight}
                    customStyle={{
                      background: 'none',
                      fontSize: 14,
                      margin: 0,
                      padding: 0,
                      color: colorMode === 'dark' ? '#d4d4d4' : '#1a202c',
                    }}
                  >
                    {JSON.stringify(selectedPayload.body, null, 2)}
                  </SyntaxHighlighter>
                </Box>
              </>
            ) : (
              <Text color="gray.400">Selecione um payload para visualizar o conteúdo.</Text>
            )}
          </Box>
          {/* Modal de Feedback */}
          <Modal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Deixe um feedback</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={2}>
                  <FormLabel>Nome (opcional)</FormLabel>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel>E-mail (opcional)</FormLabel>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu e-mail" type="email" />
                </FormControl>
                <FormControl>
                  <FormLabel>Mensagem</FormLabel>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite seu feedback..." />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" mr={3} onClick={() => handleSendFeedback('feedback')} isLoading={sending}>
                  Enviar
                </Button>
                <Button variant="ghost" onClick={() => setIsFeedbackOpen(false)}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Modal de Solicitar Funcionalidade */}
          <Modal isOpen={isFeatureOpen} onClose={() => setIsFeatureOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Solicitar funcionalidade</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl mb={2}>
                  <FormLabel>Nome (opcional)</FormLabel>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel>E-mail (opcional)</FormLabel>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu e-mail" type="email" />
                </FormControl>
                <FormControl>
                  <FormLabel>Mensagem</FormLabel>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva a funcionalidade desejada..." />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="purple" mr={3} onClick={() => handleSendFeedback('feature')} isLoading={sending}>
                  Enviar
                </Button>
                <Button variant="ghost" onClick={() => setIsFeatureOpen(false)}>Cancelar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Box>
    </Box>
  );
};

export default Webhook;
