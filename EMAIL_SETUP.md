# Configuração de E-mail - Minuto com Deus

## 📧 Sistema de E-mail Implementado

O sistema utiliza **múltiplos métodos** para garantir que os e-mails cheguem em `ghlh.dev@gmail.com`:

### 🚀 Métodos Implementados (em ordem de prioridade):

#### 1. **Formspree** (Método Principal)
- **Status:** ✅ Configurado e funcional
- **URL:** `https://formspree.io/f/xpwagvko`
- **Como funciona:** Serviço gratuito que envia e-mails direto para `ghlh.dev@gmail.com`
- **Configuração:** Já está funcionando, sem necessidade de setup adicional

#### 2. **Netlify Forms** (Fallback)
- **Status:** ✅ Configurado no HTML
- **Como funciona:** Se o site estiver hospedado no Netlify, captura automaticamente
- **Configuração:** Automática quando deploy no Netlify

#### 3. **WebHook** (Opcional)
- **Status:** 🔧 Precisa de configuração
- **Serviços sugeridos:** Make.com, Zapier, n8n
- **Como configurar:**
  1. Criar conta no Make.com ou Zapier
  2. Criar webhook que envia e-mail para `ghlh.dev@gmail.com`
  3. Substituir URL no código: `hook.us1.make.com/webhook-url-here`

#### 4. **Mailto** (Fallback Final)
- **Status:** ✅ Sempre funciona
- **Como funciona:** Abre cliente de e-mail do usuário
- **Backup:** Se falhar, copia informações para clipboard

## 🔧 Como Configurar Webhooks (Opcional)

### Make.com (Recomendado):
1. Acesse [make.com](https://make.com)
2. Crie novo cenário
3. Adicione trigger "Webhook"
4. Adicione ação "Email" para `ghlh.dev@gmail.com`
5. Copie URL do webhook
6. Substitua no código JavaScript

### Zapier:
1. Acesse [zapier.com](https://zapier.com)
2. Crie novo Zap
3. Trigger: "Webhooks by Zapier"
4. Action: "Email by Zapier" para `ghlh.dev@gmail.com`
5. Copie URL do webhook

## 📊 Status Atual

✅ **Funcionando:** Formspree + Netlify Forms + Mailto
🔧 **Opcional:** WebHook (configuração manual)

## 🧪 Como Testar

1. Acesse a landing page
2. Preencha o formulário com um e-mail de teste
3. Verifique se recebeu e-mail em `ghlh.dev@gmail.com`
4. Se não funcionar, o sistema tentará métodos alternativos automaticamente

## 📝 Logs

O sistema registra logs no console do navegador:
- `console.log('Email sent via Formspree')`
- `console.log('Email sent via Netlify Forms')`
- `console.log('Email client opened')`

## 🛡️ Segurança

- Nenhuma informação sensível exposta
- E-mails validados no frontend
- Rate limiting natural dos serviços
- Fallbacks garantem funcionamento

## 📧 Formato do E-mail Recebido

```
De: formspree.io (ou serviço configurado)
Para: ghlh.dev@gmail.com
Assunto: Novo interessado - Minuto com Deus

Novo usuário interessado no app Minuto com Deus:

Email: usuario@exemplo.com
Data: 20/07/2025 14:30:00
Origem: Landing Page
```