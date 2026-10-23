/**
 * Tema central do SinalCerto.
 *
 * As cores foram escolhidas visando conformidade com a WCAG 2.2 nível AA:
 *  - Texto normal sobre o fundo: contraste >= 4,5:1
 *  - Texto grande e componentes de interface: contraste >= 3:1
 *
 * Os pares de cor usados em texto estão anotados com a razão de contraste
 * aproximada (verificada com a fórmula da WCAG). Sempre que a equipe alterar
 * uma cor, revalidar em um verificador (ex.: WebAIM Contrast Checker).
 *
 * Nenhuma informação do app depende apenas de cor: os estados de qualidade
 * sempre combinam COR + ÍCONE (forma distinta) + TEXTO (RNF03).
 */

export const colors = {
  // Superfícies
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F5F7', // cartão de apoio
  surfaceInfo: '#EAF1FB', // bloco informativo (azul bem claro)

  // Bordas
  border: '#D4D7DD', // borda sutil
  borderStrong: '#6B7280', // borda com contraste >= 3:1 sobre branco

  // Texto (sobre fundo branco)
  textPrimary: '#18181B', // ~16:1
  textSecondary: '#4B5563', // ~7:1
  textMuted: '#6B7280', // ~4,8:1 — usar só em texto não essencial

  // Marca / ação
  primary: '#1D4ED8', // ~6,7:1 com branco (texto branco em botão OK)
  primaryText: '#FFFFFF',
  primaryPressed: '#1E40AF',

  focusRing: '#1D4ED8',

  // Estados de qualidade (bg = fundo do selo, fg = texto/ícone, border = contorno)
  quality: {
    GOOD: { bg: '#E3F2E7', fg: '#1B5E20', border: '#2E7D32' }, // verde
    MODERATE: { bg: '#FCEFD9', fg: '#7A4F00', border: '#B06E00' }, // âmbar
    UNSTABLE: { bg: '#FBE3E1', fg: '#A1140A', border: '#C62828' }, // vermelho
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

/**
 * Tamanhos de fonte em dp. Não desabilitamos o escalonamento do sistema
 * (allowFontScaling permanece true por padrão) para respeitar o RNF05.
 */
export const typography = {
  display: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: '400', color: colors.textPrimary },
  bodyStrong: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  secondary: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textSecondary,
  },
};

// Alvo mínimo de toque (RNF09): 48 x 48 dp.
export const MIN_TOUCH = 48;

export default { colors, spacing, radius, typography, MIN_TOUCH };
