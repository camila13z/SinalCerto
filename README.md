# SinalCerto

Aplicativo móvel (React Native + Expo) de **monitoramento e previsão da
qualidade de conexão de internet**, em linguagem simples e com foco em
acessibilidade. Integra-se à **Internet Quality API** para obter previsões de
qualidade por horário e recomendações de atividade.

> Projeto da disciplina — Sistema de Monitoramento de Qualidade de Internet.

---

## Demonstração rápida (Expo Snack)

Para testar sem instalar nada, abra o projeto no Expo Snack e rode pelo app
**Expo Go** (escaneando o QR Code que o Snack mostra). No celular, o app usa os
dados reais da Internet Quality API.

> Link do Snack: _COLE-AQUI-O-LINK-DO-SEU-SNACK_

Observação: a versão do Snack reúne o código em um único arquivo apenas para
facilitar a execução online. O código-fonte organizado em pastas é o deste
repositório (seção "Estrutura do projeto").

---

## 1. Pré-requisitos

- **Node.js LTS** (18+).
- **App Expo Go** no celular (Android/iOS) para testar, ou um emulador.
- Conexão com a internet (a API fica no Render e pode levar ~1 min para
  "acordar" no primeiro acesso).

## 2. Como rodar

### Caminho recomendado (garante versões compatíveis com o seu Expo Go)

O jeito mais seguro de evitar conflito de versões é criar um projeto Expo novo
e copiar o código-fonte para dentro dele:

```bash
# 1. Crie um projeto Expo em branco (baixa a SDK compatível com seu Expo Go)
npx create-expo-app@latest SinalCerto --template blank
cd SinalCerto

# 2. Instale as bibliotecas usadas (versões resolvidas pelo próprio Expo)
npx expo install @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context expo-status-bar \
  expo-location @react-native-async-storage/async-storage
# (o pacote @expo/vector-icons já vem incluído no Expo)

# 3. Copie para dentro do projeto, substituindo quando pedir:
#    - a pasta  src/
#    - os arquivos  App.js  e  index.js
#    (mantenha o package.json/app.json gerados pelo create-expo-app)

# 4. Inicie
npx expo start
```

Abra o app **Expo Go** e escaneie o QR Code que aparece no terminal.

### Caminho direto (usando os arquivos deste repositório)

```bash
git clone https://github.com/camila13z/SinalCerto.git
cd SinalCerto
npx expo install            # reconcilia as versões do package.json com sua SDK
npx expo start
```

> O `package.json` aqui traz versões **de referência** (Expo SDK 54). Rodar
> `npx expo install` ajusta tudo para a SDK que o seu Expo Go suporta. Se o seu
> Expo Go for mais novo, prefira o "caminho recomendado" acima.

## 3. Estrutura do projeto

```
App.js                      Entrada: contexto + navegação
index.js                    Registro do componente raiz
src/
  theme/        index.js    Cores (contraste AA), espaçamento, tipografia, 48dp
  i18n/         labels.js   Textos em PT-BR, traduções de qualidade/atividades, glossário
  domain/
    quality.js              Visual por estado + regra de atividades adequadas (RQ03)
    format.js               Formatação de RTT, perda, datas e horas
  services/
    config.js               URL base, endpoints, referência geográfica fixa
    apiClient.js            fetch com timeout e erros padronizados
    internetQualityApi.js   Uma função por endpoint da API
    mockData.js             Dados simulados no mesmo formato da API (fallback)
    index.js                Fachada: tenta API, normaliza e faz fallback
  context/      AppContext.js   Modelo selecionado, modelos, probe, referência
  components/   ...             Componentes reutilizáveis e acessíveis
  screens/      ...             As 5 telas do app
```

## 4. Integração com a API

Base: `https://internet-quality-api.onrender.com/api/v1`

| Tela | Endpoint | Uso |
|------|----------|-----|
| Início | `GET /forecasts/nearby?lat&lon&model_id` | Previsão mais próxima |
| Próximas previsões | `GET /forecasts/probes/{probe}/timeline?model_id&limit` | Hora a hora |
| Planejar atividade | `POST /activity/check` | Veredito por atividade/horário |
| Escolher modelo | `GET /models` | Lista de modelos ativos |

Pontos de design relevantes:

- **Localização com permissão.** O app pede permissão de localização e, se
  concedida, usa a posição **aproximada** apenas para encontrar o ponto de
  medição (probe) mais próximo. Se a permissão for negada, usa **São Paulo**
  como referência. A localização não é guardada nem compartilhada. A probe é
  apenas referência geográfica, como a própria API indica.
- **A lógica usa os códigos estáveis** da API (`quality`,
  `recommendation.code`), nunca o texto livre — como a documentação pede.
- **Modo de dados simulados.** Se a API não responder (ex.: servidor
  "dormindo"), o app continua navegável com dados equivalentes e exibe um aviso
  de "dados simulados". Isso também ajuda a demonstrar todos os estados.

### Onde mexer se algo mudar

- **Trocar a referência geográfica ou a URL:** `src/services/config.js`.
- **Se o formato de resposta da API mudar:** só os normalizadores em
  `src/services/index.js` (funções `normForecast`, `normTimeline`,
  `normActivity`). Nenhuma tela precisa mudar.

## 5. Acessibilidade (mapeado à rubrica)

A acessibilidade foi considerada desde o início (não só no visual):

- **Independência de cor (RNF03):** todo estado de qualidade mostra sempre
  **cor + ícone de forma distinta + texto** (`QualityBadge`).
- **Contraste (RNF04):** paleta escolhida para ≥ 4,5:1 em texto e ≥ 3:1 em
  componentes, documentada em `src/theme/index.js`.
- **Tecnologias assistivas (RNF02):** `accessibilityRole`, `accessibilityLabel`,
  `accessibilityState` (selecionado/desabilitado) em todos os controles;
  ícones decorativos ocultos da leitura; foco movido ao título ao trocar de
  tela; resultados anunciados com `announceForAccessibility`.
- **Escala de fonte (RNF05):** o escalonamento do sistema é respeitado
  (não desativamos `allowFontScaling`); layouts flexíveis evitam corte.
- **Gestos simples (RNF06):** tudo por toque; nenhum gesto complexo.
- **Área de toque (RNF09):** mínimo de 48×48 dp nos controles.
- **Linguagem simples (RNF07):** termos técnicos traduzidos (latência →
  "Tempo de resposta"; perda → "Dados perdidos") e explicados no glossário.
- **Navegação previsível (RNF08):** fluxo linear e cabeçalhos consistentes.

## 6. Requisitos funcionais

- **RQ01** Condição atual prevista em categorias (Boa / Regular / Instável).
- **RQ02** Previsões para horários futuros (lista hora a hora).
- **RQ03** Atividades adequadas à qualidade prevista (guia rápido na tela
  inicial + verificação detalhada por atividade/horário).
- **RQ04** Seleção de horário para consultar a previsão.

## 7. Glossário

Os termos usados no app seguem o glossário em `src/i18n/labels.js`, garantindo
consistência de linguagem em todas as telas.
