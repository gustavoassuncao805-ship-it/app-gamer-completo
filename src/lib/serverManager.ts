import { Server, ServerLog } from '@/types/server';

class ServerManager {
  private servers: Map<string, Server> = new Map();
  private autoShutdownTimers: Map<string, NodeJS.Timeout> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private pingIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadServers();
    this.startHealthCheck();
    this.startPingMonitoring();
  }

  // Carregar servidores do localStorage
  private loadServers() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('omlet_servers');
    if (saved) {
      const serversArray = JSON.parse(saved);
      serversArray.forEach((server: Server) => {
        this.servers.set(server.id, server);
      });
    }
  }

  // Salvar servidores no localStorage
  private saveServers() {
    if (typeof window === 'undefined') return;
    const serversArray = Array.from(this.servers.values());
    localStorage.setItem('omlet_servers', JSON.stringify(serversArray));
  }

  // Gerar ID único automático
  private gerarIdUnico(): string {
    return `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Gerar nome automático
  private gerarNomeAutomatico(userId: string): string {
    const sufixo = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `Servidor-${userId.substr(0, 8)}-${sufixo}`;
  }

  // Gerar link de entrada automático
  private gerarLinkEntrada(serverId: string): string {
    return `omlet://join/${serverId}`;
  }

  // Gerar código de entrada (6 dígitos)
  private gerarCodigoEntrada(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Criar servidor AUTOMATICAMENTE
  criarServidorAutomatico(
    userId: string,
    jogo: string = 'Minecraft',
    tipo: 'publico' | 'privado' = 'publico',
    maxJogadores: number = 10,
    pagamentoAprovado: boolean = true
  ): Server | null {
    // Verificar se servidores privados exigem pagamento
    if (tipo === 'privado' && !pagamentoAprovado) {
      return null;
    }

    const id = this.gerarIdUnico();
    const nome = this.gerarNomeAutomatico(userId);
    const linkEntrada = this.gerarLinkEntrada(id);
    const codigoEntrada = this.gerarCodigoEntrada();
    
    const server: Server = {
      id,
      nome,
      tipo,
      jogo,
      criador: userId,
      status: 'online',
      jogadores: [],
      maxJogadores,
      criadoEm: Date.now(),
      ultimaAtividade: Date.now(),
      logs: [],
      banidos: [],
      linkEntrada,
      codigoEntrada,
      ping: Math.floor(Math.random() * 50) + 10, // Ping inicial simulado
      ip: `server-${id.substr(-8)}.omlet.gg`,
      porta: 25565 + Math.floor(Math.random() * 1000)
    };

    this.servers.set(id, server);
    this.addLog(id, 'sistema', `🟢 Servidor "${nome}" criado e iniciado automaticamente`);
    this.addLog(id, 'sistema', `📡 Endereço: ${server.ip}:${server.porta}`);
    this.addLog(id, 'sistema', `🔗 Link: ${linkEntrada}`);
    this.addLog(id, 'sistema', `🔢 Código: ${codigoEntrada}`);
    this.saveServers();
    this.startPingForServer(id);
    
    return server;
  }

  // Entrar em servidor por ID ou código
  entrarServidorPorId(servidorIdOuCodigo: string, jogador: { id: string; nome: string; avatar: string }): boolean {
    // Buscar por ID
    let server = this.servers.get(servidorIdOuCodigo);
    
    // Se não encontrou, buscar por código
    if (!server) {
      server = Array.from(this.servers.values()).find(s => s.codigoEntrada === servidorIdOuCodigo);
    }

    if (!server) return false;

    return this.entrarServidor(server.id, jogador);
  }

  // Entrar em servidor
  entrarServidor(serverId: string, jogador: { id: string; nome: string; avatar: string }): boolean {
    const server = this.servers.get(serverId);
    if (!server) return false;

    // Verificar se servidor está offline
    if (server.status === 'offline') {
      // Reiniciar automaticamente
      this.iniciarServidorAutomatico(serverId);
    }

    // Verificar se está banido
    if (server.banidos.includes(jogador.id)) {
      return false;
    }

    // Verificar limite de jogadores
    if (server.jogadores.length >= server.maxJogadores) {
      return false;
    }

    // Verificar se já está no servidor
    if (server.jogadores.some(p => p.id === jogador.id)) {
      return true;
    }

    // Adicionar jogador
    server.jogadores.push({
      ...jogador,
      entradaEm: Date.now()
    });

    server.ultimaAtividade = Date.now();
    this.addLog(serverId, 'entrada', `${jogador.nome} entrou no servidor`, jogador.nome);
    this.cancelAutoShutdown(serverId);
    this.saveServers();

    return true;
  }

  // Sair do servidor
  sairServidor(serverId: string, jogadorId: string) {
    const server = this.servers.get(serverId);
    if (!server) return;

    const jogador = server.jogadores.find(p => p.id === jogadorId);
    if (!jogador) return;

    server.jogadores = server.jogadores.filter(p => p.id !== jogadorId);
    server.ultimaAtividade = Date.now();
    this.addLog(serverId, 'saida', `${jogador.nome} saiu do servidor`, jogador.nome);

    // Se não há mais jogadores, iniciar timer de desligamento AUTOMÁTICO
    if (server.jogadores.length === 0) {
      this.scheduleAutoShutdown(serverId);
    }

    this.saveServers();
  }

  // Iniciar servidor automaticamente
  private iniciarServidorAutomatico(serverId: string) {
    const server = this.servers.get(serverId);
    if (!server) return;

    server.status = 'online';
    this.addLog(serverId, 'sistema', `🟢 Servidor reiniciado automaticamente`);
    this.cancelAutoShutdown(serverId);
    this.saveServers();
  }

  // Kick jogador
  kickJogador(serverId: string, jogadorId: string, adminId: string) {
    const server = this.servers.get(serverId);
    if (!server || server.criador !== adminId) return false;

    const jogador = server.jogadores.find(p => p.id === jogadorId);
    if (!jogador) return false;

    server.jogadores = server.jogadores.filter(p => p.id !== jogadorId);
    server.ultimaAtividade = Date.now();
    this.addLog(serverId, 'kick', `${jogador.nome} foi expulso do servidor`, jogador.nome);
    this.saveServers();

    return true;
  }

  // Banir jogador
  banirJogador(serverId: string, jogadorId: string, adminId: string) {
    const server = this.servers.get(serverId);
    if (!server || server.criador !== adminId) return false;

    const jogador = server.jogadores.find(p => p.id === jogadorId);
    if (!jogador) return false;

    server.jogadores = server.jogadores.filter(p => p.id !== jogadorId);
    server.banidos.push(jogadorId);
    server.ultimaAtividade = Date.now();
    this.addLog(serverId, 'ban', `${jogador.nome} foi banido do servidor`, jogador.nome);
    this.saveServers();

    return true;
  }

  // Atualizar configurações do servidor
  atualizarServidor(serverId: string, adminId: string, updates: Partial<Pick<Server, 'nome' | 'tipo' | 'maxJogadores'>>) {
    const server = this.servers.get(serverId);
    if (!server || server.criador !== adminId) return false;

    if (updates.nome) server.nome = updates.nome;
    if (updates.tipo) server.tipo = updates.tipo;
    if (updates.maxJogadores) server.maxJogadores = updates.maxJogadores;

    server.ultimaAtividade = Date.now();
    this.addLog(serverId, 'sistema', `⚙️ Configurações do servidor atualizadas`);
    this.saveServers();

    return true;
  }

  // Controlar status do servidor
  controlarServidor(serverId: string, adminId: string, acao: 'pausar' | 'iniciar' | 'reiniciar' | 'finalizar') {
    const server = this.servers.get(serverId);
    if (!server || server.criador !== adminId) return false;

    switch (acao) {
      case 'pausar':
        server.status = 'pausado';
        this.addLog(serverId, 'sistema', `⏸️ Servidor pausado`);
        break;
      case 'iniciar':
        server.status = 'online';
        this.addLog(serverId, 'sistema', `▶️ Servidor iniciado`);
        break;
      case 'reiniciar':
        server.status = 'offline';
        setTimeout(() => {
          server.status = 'online';
          this.addLog(serverId, 'sistema', `🔄 Servidor reiniciado`);
          this.saveServers();
        }, 2000);
        this.addLog(serverId, 'sistema', `🔄 Reiniciando servidor...`);
        break;
      case 'finalizar':
        this.excluirServidorAutomatico(serverId);
        return true;
    }

    server.ultimaAtividade = Date.now();
    this.saveServers();
    return true;
  }

  // Excluir servidor automaticamente
  private excluirServidorAutomatico(serverId: string) {
    const server = this.servers.get(serverId);
    if (!server) return;

    this.addLog(serverId, 'sistema', `🔴 Servidor encerrado`);
    this.servers.delete(serverId);
    this.cancelAutoShutdown(serverId);
    this.stopPingForServer(serverId);
    this.saveServers();
  }

  // Adicionar log
  private addLog(serverId: string, tipo: ServerLog['tipo'], mensagem: string, usuario?: string) {
    const server = this.servers.get(serverId);
    if (!server) return;

    const log: ServerLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tipo,
      mensagem,
      timestamp: Date.now(),
      usuario
    };

    server.logs.push(log);
    
    // Manter apenas os últimos 100 logs
    if (server.logs.length > 100) {
      server.logs = server.logs.slice(-100);
    }
  }

  // Agendar desligamento automático (5 minutos sem jogadores)
  private scheduleAutoShutdown(serverId: string) {
    this.cancelAutoShutdown(serverId);
    
    const timer = setTimeout(() => {
      const server = this.servers.get(serverId);
      if (server && server.jogadores.length === 0) {
        this.addLog(serverId, 'sistema', `🔴 Servidor desligado automaticamente (sem jogadores há 5 minutos)`);
        server.status = 'offline';
        this.saveServers();
      }
    }, 5 * 60 * 1000); // 5 minutos

    this.autoShutdownTimers.set(serverId, timer);
  }

  // Cancelar desligamento automático
  private cancelAutoShutdown(serverId: string) {
    const timer = this.autoShutdownTimers.get(serverId);
    if (timer) {
      clearTimeout(timer);
      this.autoShutdownTimers.delete(serverId);
    }
  }

  // Health check - verificar servidores travados e reiniciar automaticamente
  private startHealthCheck() {
    if (typeof window === 'undefined') return;
    
    this.healthCheckInterval = setInterval(() => {
      const now = Date.now();
      
      this.servers.forEach((server, serverId) => {
        // Se servidor está online mas sem atividade há 10 minutos, reiniciar AUTOMATICAMENTE
        if (server.status === 'online' && now - server.ultimaAtividade > 10 * 60 * 1000) {
          this.addLog(serverId, 'sistema', `⚠️ Servidor travado detectado - reiniciando automaticamente`);
          this.controlarServidor(serverId, server.criador, 'reiniciar');
        }
      });
    }, 60 * 1000); // Verificar a cada 1 minuto
  }

  // Monitoramento de ping automático
  private startPingMonitoring() {
    if (typeof window === 'undefined') return;
    
    setInterval(() => {
      this.servers.forEach((server, serverId) => {
        if (server.status === 'online') {
          this.atualizarPing(serverId);
        }
      });
    }, 5000); // Atualizar ping a cada 5 segundos
  }

  // Iniciar ping para servidor específico
  private startPingForServer(serverId: string) {
    this.atualizarPing(serverId);
  }

  // Parar ping para servidor específico
  private stopPingForServer(serverId: string) {
    const interval = this.pingIntervals.get(serverId);
    if (interval) {
      clearInterval(interval);
      this.pingIntervals.delete(serverId);
    }
  }

  // Atualizar ping do servidor
  private atualizarPing(serverId: string) {
    const server = this.servers.get(serverId);
    if (!server) return;

    // Simular ping realista (10-150ms)
    server.ping = Math.floor(Math.random() * 140) + 10;
    this.saveServers();
  }

  // Abrir jogo via deep link
  abrirJogoDeepLink(jogo: string, servidor: Server): boolean {
    const deepLinks: Record<string, string> = {
      'Minecraft': `minecraft://?addExternalServer=${encodeURIComponent(servidor.nome)}|${servidor.ip}:${servidor.porta}`,
      'Roblox': `roblox://placeId=${servidor.id}`,
      'Free Fire': `freefire://join/${servidor.id}`,
      'PUBG': `pubgm://join/${servidor.id}`,
      'Among Us': `amongus://join/${servidor.id}`
    };

    const deepLink = deepLinks[jogo];
    if (!deepLink) return false;

    try {
      window.location.href = deepLink;
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obter servidor
  getServidor(serverId: string): Server | undefined {
    return this.servers.get(serverId);
  }

  // Listar todos os servidores
  listarServidores(): Server[] {
    return Array.from(this.servers.values());
  }

  // Listar servidores públicos
  listarServidoresPublicos(): Server[] {
    return Array.from(this.servers.values()).filter(s => s.tipo === 'publico');
  }

  // Listar servidores privados
  listarServidoresPrivados(): Server[] {
    return Array.from(this.servers.values()).filter(s => s.tipo === 'privado');
  }

  // Matchmaking - encontrar sala disponível automaticamente
  encontrarSalaDisponivel(jogo: string): Server | null {
    const servidores = this.listarServidoresPublicos()
      .filter(s => s.jogo === jogo && s.jogadores.length < s.maxJogadores && s.status === 'online')
      .sort((a, b) => b.jogadores.length - a.jogadores.length); // Priorizar salas com mais jogadores

    return servidores[0] || null;
  }

  // Verificar se usuário tem permissão para criar servidor privado
  verificarPermissaoServidorPrivado(userId: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const pagamentos = localStorage.getItem('pagamentos_mundos_privados');
    if (!pagamentos) return false;

    const pagamentosArray = JSON.parse(pagamentos);
    return pagamentosArray.some((p: any) => p.userId === userId && p.status === 'Aprovado');
  }
}

// Singleton
let serverManagerInstance: ServerManager | null = null;

export function getServerManager(): ServerManager {
  if (!serverManagerInstance) {
    serverManagerInstance = new ServerManager();
  }
  return serverManagerInstance;
}
