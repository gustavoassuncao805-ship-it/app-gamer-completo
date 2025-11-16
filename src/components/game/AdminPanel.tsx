'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, DollarSign, ArrowLeft, Eye, AlertCircle } from 'lucide-react';

interface Pagamento {
  id: string;
  userId: string;
  userName: string;
  comprovanteUrl: string;
  dataPagamento: string;
  status: 'Pendente' | 'Aprovado';
  valor: number;
}

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filter, setFilter] = useState<'all' | 'Pendente' | 'Aprovado'>('all');
  const [selectedComprovante, setSelectedComprovante] = useState<string | null>(null);

  useEffect(() => {
    loadPagamentos();
  }, []);

  const loadPagamentos = () => {
    const stored = localStorage.getItem('pagamentos_mundos_privados');
    if (stored) {
      const data = JSON.parse(stored);
      setPagamentos(data.sort((a: Pagamento, b: Pagamento) => 
        new Date(b.dataPagamento).getTime() - new Date(a.dataPagamento).getTime()
      ));
    }
  };

  const handleApprove = (id: string) => {
    const pagamento = pagamentos.find(p => p.id === id);
    if (!pagamento) return;

    // Atualizar status do pagamento para "Aprovado"
    const updated = pagamentos.map(p => 
      p.id === id ? { ...p, status: 'Aprovado' as const } : p
    );
    setPagamentos(updated);
    localStorage.setItem('pagamentos_mundos_privados', JSON.stringify(updated));

    // Adicionar usuário à lista de usuários aprovados (liberar acesso)
    const aprovados = JSON.parse(localStorage.getItem('usuarios_mundos_privados_aprovados') || '[]');
    if (!aprovados.includes(pagamento.userId)) {
      aprovados.push(pagamento.userId);
      localStorage.setItem('usuarios_mundos_privados_aprovados', JSON.stringify(aprovados));
    }

    // Feedback visual
    alert(`✅ Pagamento aprovado! O usuário ${pagamento.userName} agora tem acesso para criar mundos privados.`);
  };

  const handleReject = (id: string) => {
    if (!confirm('Tem certeza que deseja rejeitar este pagamento? Esta ação não pode ser desfeita.')) {
      return;
    }

    const updated = pagamentos.filter(p => p.id !== id);
    setPagamentos(updated);
    localStorage.setItem('pagamentos_mundos_privados', JSON.stringify(updated));
  };

  const filteredPagamentos = filter === 'all' 
    ? pagamentos 
    : pagamentos.filter(p => p.status === filter);

  const stats = {
    total: pagamentos.length,
    pendentes: pagamentos.filter(p => p.status === 'Pendente').length,
    aprovados: pagamentos.filter(p => p.status === 'Aprovado').length,
    receita: pagamentos.filter(p => p.status === 'Aprovado').reduce((sum, p) => sum + p.valor, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">Gerencie pagamentos de mundos privados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm font-medium">Total</span>
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400 mt-1">Pagamentos registrados</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/20 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400 text-sm font-medium">Pendentes</span>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.pendentes}</p>
            <p className="text-xs text-gray-400 mt-1">Aguardando aprovação</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm font-medium">Aprovados</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.aprovados}</p>
            <p className="text-xs text-gray-400 mt-1">Acessos liberados</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 text-sm font-medium">Receita</span>
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">R$ {stats.receita.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Total aprovado</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setFilter('Pendente')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'Pendente'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Pendentes ({stats.pendentes})
          </button>
          <button
            onClick={() => setFilter('Aprovado')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'Aprovado'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            Aprovados ({stats.aprovados})
          </button>
        </div>

        {/* Lista de Pagamentos */}
        <div className="space-y-4">
          {filteredPagamentos.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum pagamento encontrado</p>
              <p className="text-gray-600 text-sm mt-2">
                {filter === 'all' 
                  ? 'Aguardando primeiro pagamento...'
                  : `Nenhum pagamento com status "${filter}"`
                }
              </p>
            </div>
          ) : (
            filteredPagamentos.map((pagamento) => (
              <div
                key={pagamento.id}
                className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{pagamento.userName}</h3>
                        <p className="text-sm text-gray-400">ID: {pagamento.userId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">R$ {pagamento.valor.toFixed(2)}</span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          pagamento.status === 'Aprovado'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {pagamento.status === 'Aprovado' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {pagamento.status}
                      </span>
                    </div>
                  </div>

                  {/* Comprovante */}
                  <div className="lg:w-64">
                    <p className="text-sm text-gray-400 mb-2">Comprovante:</p>
                    <button
                      onClick={() => setSelectedComprovante(pagamento.comprovanteUrl)}
                      className="w-full h-32 bg-black/50 rounded-lg overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-all group relative"
                    >
                      <img
                        src={pagamento.comprovanteUrl}
                        alt="Comprovante"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  </div>

                  {/* Ações */}
                  {pagamento.status === 'Pendente' && (
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => handleApprove(pagamento.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => handleReject(pagamento.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Comprovante */}
      {selectedComprovante && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedComprovante(null)}
        >
          <div className="max-w-4xl w-full bg-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden">
            <div className="p-4 border-b border-purple-500/30 flex items-center justify-between">
              <h3 className="text-white font-bold">Comprovante de Pagamento</h3>
              <button
                onClick={() => setSelectedComprovante(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedComprovante}
                alt="Comprovante"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
