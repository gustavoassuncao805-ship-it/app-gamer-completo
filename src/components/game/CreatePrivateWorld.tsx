'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Copy, Upload, Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface CreatePrivateWorldProps {
  onBack: () => void;
}

export default function CreatePrivateWorld({ onBack }: CreatePrivateWorldProps) {
  const { currentPlayer } = useGame();
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [comprovantePreview, setComprovantePreview] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const PIX_KEY = '6ecc4921-3f18-4bb6-b850-91aa63f6b1d1';
  const VALOR = 4.99;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setMessage('✅ Chave PIX copiada com sucesso!');
    setStatus('idle');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Por favor, envie apenas imagens (PNG, JPG, JPEG)');
        setStatus('error');
        return;
      }
      
      setComprovante(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setComprovantePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const handleSubmit = async () => {
    if (!comprovante) {
      setMessage('❌ Por favor, anexe o comprovante de pagamento');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setMessage('📤 Enviando comprovante...');

    try {
      // Simular upload (em produção, fazer upload real para Supabase Storage)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Salvar no localStorage (em produção, salvar no Supabase)
      const pagamento = {
        id: Date.now().toString(),
        userId: currentPlayer?.id || 'guest',
        userName: currentPlayer?.name || 'Jogador',
        comprovanteUrl: comprovantePreview,
        dataPagamento: new Date().toISOString(),
        status: 'Pendente',
        valor: VALOR
      };

      const pagamentos = JSON.parse(localStorage.getItem('pagamentos_mundos_privados') || '[]');
      pagamentos.push(pagamento);
      localStorage.setItem('pagamentos_mundos_privados', JSON.stringify(pagamentos));

      setStatus('success');
      setMessage('✅ Comprovante enviado com sucesso! Aguarde a aprovação do administrador para liberar seu acesso.');
      
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('❌ Erro ao enviar comprovante. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Criar Mundo Privado
            </h1>
          </div>
          <p className="text-gray-400 ml-15">
            Desbloqueie a criação de mundos privados exclusivos
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-gradient-to-br from-gray-900/50 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
          {/* Valor */}
          <div className="text-center mb-8 pb-8 border-b border-purple-500/30">
            <p className="text-gray-400 mb-2">Valor do Acesso</p>
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              R$ {VALOR.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Pagamento único via PIX</p>
          </div>

          {/* Chave PIX */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Chave PIX
            </label>
            <div className="bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm break-all">
              {PIX_KEY}
            </div>
          </div>

          {/* Botão Copiar PIX */}
          <button
            onClick={handleCopyPix}
            className="w-full mb-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30"
          >
            <Copy className="w-5 h-5" />
            Copiar Chave PIX
          </button>

          {/* Upload Comprovante */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Comprovante de Pagamento
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="comprovante-upload"
              />
              <label
                htmlFor="comprovante-upload"
                className="flex flex-col items-center justify-center w-full h-40 bg-black/50 border-2 border-dashed border-purple-500/30 rounded-xl cursor-pointer hover:border-purple-500/60 transition-colors"
              >
                {comprovantePreview ? (
                  <img
                    src={comprovantePreview}
                    alt="Comprovante"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-purple-400 mb-2" />
                    <p className="text-gray-400 text-sm">Clique para anexar o comprovante</p>
                    <p className="text-gray-600 text-xs mt-1">PNG, JPG ou JPEG</p>
                  </>
                )}
              </label>
            </div>
            {comprovante && (
              <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {comprovante.name}
              </p>
            )}
          </div>

          {/* Botão Enviar */}
          <button
            onClick={handleSubmit}
            disabled={status === 'uploading' || !comprovante}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all duration-300 shadow-lg ${
              status === 'uploading' || !comprovante
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-500/30'
            }`}
          >
            {status === 'uploading' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Enviar Comprovante
              </>
            )}
          </button>

          {/* Mensagem de Status */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
                status === 'success'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : status === 'error'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                  : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : status === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : null}
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Informações */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h3 className="text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Como funciona:
            </h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">1.</span>
                <span>Copie a chave PIX acima e faça o pagamento de <strong>R$ 4,99</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">2.</span>
                <span>Tire um print ou foto do comprovante de pagamento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">3.</span>
                <span>Clique em "Enviar Comprovante" e anexe a imagem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">4.</span>
                <span>Aguarde a aprovação do administrador (geralmente em até 24h)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 font-bold">5.</span>
                <span><strong>Após aprovado</strong>, você poderá criar e gerenciar mundos privados ilimitados!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
