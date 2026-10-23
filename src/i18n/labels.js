/**
 * Todos os textos voltados ao usuário final ficam aqui, em linguagem simples
 * (RNF07). Centralizar facilita manter o glossário consistente (critério 6).
 *
 * Os termos técnicos da API (GOOD/MODERATE/UNSTABLE, VIDEO_CALL, etc.) são
 * traduzidos para o vocabulário do app em um único lugar.
 */

// Qualidade da conexão -------------------------------------------------------
export const QUALITY_LABEL = {
  GOOD: 'Boa',
  MODERATE: 'Regular',
  UNSTABLE: 'Instável',
};

export const QUALITY_DESCRIPTION = {
  GOOD: 'A conexão deve estar estável. Bom momento para chamadas, vídeos e jogos.',
  MODERATE:
    'A conexão deve funcionar, mas pode ter pequenas pausas. Mensagens e sites devem ir bem.',
  UNSTABLE:
    'A conexão pode falhar ou travar. Prefira tarefas leves, como mensagens e leitura.',
};

// Recomendações (a lógica usa o code; o texto abaixo é só exibição) ----------
export const RECOMMENDATION_LABEL = {
  NORMAL_USE: 'Pode usar normalmente',
  REDUCE_NETWORK_USAGE: 'Reduza o uso da rede',
  PREPARE_OFFLINE: 'Prepare-se para ficar sem conexão',
};

// Atividades (enum real da API) ----------------------------------------------
export const ACTIVITIES = [
  { id: 'VIDEO_CALL', label: 'Chamada de vídeo', icon: 'videocam' },
  { id: 'AUDIO_CALL', label: 'Chamada de áudio', icon: 'call' },
  { id: 'STREAMING', label: 'Assistir vídeos', icon: 'play-circle' },
  { id: 'FILE_UPLOAD', label: 'Enviar arquivos', icon: 'cloud-upload' },
  { id: 'WEB_BROWSING', label: 'Navegar na web', icon: 'globe' },
  { id: 'MESSAGING', label: 'Enviar mensagens', icon: 'chatbubble-ellipses' },
];

export const ACTIVITY_LABEL = ACTIVITIES.reduce((acc, a) => {
  acc[a.id] = a.label;
  return acc;
}, {});

// Como a adequação de uma atividade é apresentada (não depende de cor) -------
export const SUITABILITY = {
  OK: { label: 'Deve funcionar', icon: 'checkmark-circle', quality: 'GOOD' },
  CAUTION: { label: 'Pode oscilar', icon: 'warning', quality: 'MODERATE' },
  AVOID: { label: 'Melhor evitar', icon: 'close-circle', quality: 'UNSTABLE' },
};

// Glossário "Internet sem mistério" ------------------------------------------
export const GLOSSARY = {
  intro: {
    title: 'Internet sem mistério',
    text: 'Veja o que cada informação quer dizer no seu dia a dia.',
  },
  terms: [
    {
      key: 'rtt',
      icon: 'time',
      title: 'Tempo de resposta',
      text:
        'É quanto tempo uma informação leva para ir e voltar pela internet. Quanto menor o número, mais rápida a conexão parece. Na parte técnica, isso é chamado de latência.',
    },
    {
      key: 'loss',
      icon: 'cube',
      title: 'Dados perdidos',
      text:
        'É a parte das informações que não chega ao destino. Acima de 1% você já pode sentir travamentos. Na parte técnica, isso é chamado de perda de pacotes.',
    },
  ],
  qualities: [
    { key: 'GOOD', title: 'Qualidade boa' },
    { key: 'MODERATE', title: 'Qualidade regular' },
    { key: 'UNSTABLE', title: 'Qualidade instável' },
  ],
  // Textos oficiais fornecidos pela própria API (campo metadata)
  about: [
    {
      key: 'reference',
      icon: 'location',
      title: 'De onde vem a previsão',
      text:
        'A previsão está associada a um ponto de medição público (probe) usado como referência geográfica. Ela não é uma medição direta do seu aparelho.',
    },
    {
      key: 'privacy',
      icon: 'lock-closed',
      title: 'Privacidade da localização',
      text:
        'Se você permitir, o app usa sua localização aproximada apenas para encontrar o ponto de medição mais próximo. Se você não permitir, ele usa São Paulo como referência. A sua localização não é guardada nem compartilhada.',
    },
  ],
};

export default {
  QUALITY_LABEL,
  QUALITY_DESCRIPTION,
  RECOMMENDATION_LABEL,
  ACTIVITIES,
  ACTIVITY_LABEL,
  SUITABILITY,
  GLOSSARY,
};
