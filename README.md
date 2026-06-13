# Calculadora de Pórtico Móvel DIY

Ferramenta educativa para estimativas preliminares de carga, flecha da viga, compressão das colunas, flambagem e capacidade dos rodízios de um pórtico móvel caseiro.

> ⚠️ **Esta ferramenta não substitui projeto estrutural profissional, inspeção por engenheiro habilitado, ART, ensaio de carga ou normas técnicas aplicáveis.** Todos os resultados são estimativas preliminares. Nunca apresente o resultado como "seguro para içamento".

---

## Funcionalidades

- Cálculo do peso próprio da viga
- Reação por coluna (modelo simplificado)
- Tensão de compressão axial nas colunas
- Carga crítica de flambagem de Euler
- Flecha da viga (carga central, viga simplesmente apoiada)
- Capacidade nominal e conservadora dos rodízios
- Conclusão textual automática baseada nos resultados
- Interface responsiva para celular
- Valores padrão baseados no projeto real (viga S6×12,5, colunas 80×80×3 mm)

---

## Stack

| Tecnologia | Versão |
|---|---|
| React | 18.x |
| TypeScript | 5.x |
| Vite | 5.x |
| CSS | Módulo global (sem dependências de UI) |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

### Instalação e execução

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/Site-Portico.git
cd Site-Portico

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:5173` no navegador.

### Build de produção

```bash
npm run build
# Arquivos gerados em: dist/
```

### Preview do build

```bash
npm run preview
```

---

## Deploy no GitHub Pages

### Automático (via GitHub Actions)

O arquivo `.github/workflows/deploy.yml` já está configurado para publicar automaticamente a cada push na branch `main`.

**Passos:**

1. Crie um repositório no GitHub e faça push do código
2. Vá em **Settings → Pages**
3. Em **Source**, selecione **GitHub Actions**
4. Faça um push para a branch `main`
5. Aguarde a action concluir — o site estará disponível em `https://SEU_USUARIO.github.io/Site-Portico/`

### Manual

```bash
# Build
npm run build

# Os arquivos em dist/ podem ser publicados em qualquer servidor estático
```

---

## Estrutura do projeto

```
src/
├── components/
│   ├── Header.tsx            — cabeçalho com navegação
│   ├── GantryIllustration.tsx — ilustração SVG do pórtico
│   ├── ProjectSpecs.tsx      — seção "Meu Pórtico"
│   ├── InputPanel.tsx        — formulário "Calcule o Seu"
│   ├── ResultsPanel.tsx      — cards de resultados (A–G)
│   ├── FormulaCard.tsx       — card reutilizável com fórmula
│   ├── SafetyWarning.tsx     — seção de limitações
│   └── ResultBadge.tsx       — badge colorido de status
├── engineering/
│   ├── types.ts              — interfaces TypeScript
│   ├── units.ts              — conversões de unidades
│   ├── beam.ts               — cálculos da viga
│   ├── column.ts             — cálculos das colunas
│   └── caster.ts             — cálculos dos rodízios
├── data/
│   └── defaults.ts           — valores padrão do exemplo real
├── styles/
│   └── global.css            — estilos globais
├── App.tsx
└── main.tsx
```

---

## Verificação dos cálculos (valores padrão)

| Grandeza | Fórmula | Resultado esperado |
|---|---|---|
| Peso da viga | 18,6 × 2,2 | ≈ 40,9 kg |
| Reação por coluna | (300 + 40,9) / 2 | ≈ 170 kg |
| Área da seção (80×80×3) | 80² − 74² | = 924 mm² |
| Compressão | 170 × 9,807 / 924e-6 | ≈ 1,8 MPa |
| Flambagem (K=2, L=2m) | π² × 200e9 × I / (4)² | ≈ 113 kN |
| Flecha (300 kg, 2,2m) | P·L³ / (48·E·I) | ≈ 0,35 mm |
| Rodízios nominal | 4 × 300 | = 1200 kg |
| Rodízios conservador | 3 × 300 | = 900 kg |

---

## Licença

MIT — Uso livre para fins educativos. Nenhuma garantia de qualquer natureza é expressa ou implícita.
