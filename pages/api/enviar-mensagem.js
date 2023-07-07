const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
import { create, sendText } from '@wppconnect-team/wppconnect';

const sessionFilePath = './session.json';
let client = null;

const createSession = () => {
  return new Promise((resolve, reject) => {
    create({
      session: 'session',
      headless: 'new',
      statusFind: (statusSession, session) => {
        console.log('Status Session:', statusSession);
        console.log('Session name:', session);
      },
    })
      .then((newClient) => {
        client = newClient;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const storeSession = (sessionData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(sessionFilePath, JSON.stringify(sessionData), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const loadSession = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(sessionFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const sessionData = JSON.parse(data);
        resolve(sessionData);
      }
    });
  });
};

// Criar servidor HTTP
const server = http.createServer();
const io = socketIO(server);

// Evento de conexão com o cliente
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('enviarMensagem', async (data) => {
    const { phoneNumber, message } = data;

    try {
      await client.sendText(phoneNumber, message);
      console.log('Mensagem enviada para', phoneNumber);
      socket.emit('mensagemEnviada', 'Mensagem enviada com sucesso');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      socket.emit('erroEnvioMensagem', 'Erro ao enviar mensagem');
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const phoneNumber = req.body.phoneNumber;
    const message = req.body.message;

    if (!client) {
      // Verificar se a sessão já existe
      try {
        const sessionData = await loadSession();
        client = await create(client => sessionData);
        console.log('Sessão carregada.', client.session);
      } catch (error) {
        // Criar uma nova sessão se não houver sessão existente
        client = await createSession();
        await storeSession(client.session);
        console.log('Nova sessão criada.');
      }
    }

    await client.sendText(phoneNumber, message);
    console.log('Mensagem enviada para', phoneNumber);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor está ouvindo na porta 3000');
  createSession().catch((error) => {
    console.error('Erro ao criar sessão:', error);
  });
});

