// Backend Node.js/Express + Supabase para Webhooks
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use a service role para inserir sem autenticação
);

// 1. Criar um novo webhook (gera UUID)
app.post('/api/webhook', async (req, res) => {
  const { data, error } = await supabase
    .from('webhooks')
    .insert({})
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

// 2. Receber payload (POST /api/webhook/:id)
app.post('/api/webhook/:id', async (req, res) => {
  const webhook_id = req.params.id;
  const body = req.body;
  // Verifica se o webhook existe
  const { data: webhook, error: whError } = await supabase
    .from('webhooks')
    .select('id')
    .eq('id', webhook_id)
    .single();
  if (whError || !webhook) return res.status(404).json({ error: 'Webhook não encontrado' });
  // Insere o payload
  const { error } = await supabase
    .from('payloads')
    .insert({ webhook_id, body });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// 3. Listar payloads de um webhook (GET /api/webhook/:id)
app.get('/api/webhook/:id', async (req, res) => {
  const webhook_id = req.params.id;
  // Busca payloads dos últimos 2 dias
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('payloads')
    .select('id, received_at, body')
    .eq('webhook_id', webhook_id)
    .gte('received_at', since)
    .order('received_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Porta
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor de webhooks rodando na porta ${PORT}`);
});

// .env exemplo:
// SUPABASE_URL=https://xxxx.supabase.co
// SUPABASE_SERVICE_ROLE_KEY=chave_service_role 