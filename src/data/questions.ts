import type { Question } from '../types/survey';

export const questions: Question[] = [
  {
    id: 1,
    text: 'Qual a sua faixa etária?',
    type: 'radio',
    options: ['Menos de 18 anos', '18 a 25 anos', '26 a 35 anos', '36 anos ou mais'],
  },
  {
    id: 2,
    text: 'Com que frequência você consome conteúdos de influencers fitness ou perfis que exibem corpos de alto desempenho?',
    type: 'radio',
    options: ['Diariamente', 'Às vezes', 'Raramente', 'Nunca'],
  },
  {
    id: 3,
    text: 'Você sente que seu progresso natural na academia é lento em comparação ao que vê nas redes sociais?',
    type: 'radio',
    options: [
      'Sim, sinto muita frustração com meus resultados',
      'Às vezes sinto que poderia evoluir mais rápido',
      'Não, estou satisfeito(a) com meu ritmo',
    ],
  },
  {
    id: 4,
    text: 'Você sabe diferenciar suplementos alimentares (ex: whey, creatina) de esteroides anabolizantes?',
    type: 'radio',
    options: ['Sim, claramente', 'Tenho uma ideia, mas não sei explicar', 'Não sei a diferença'],
  },
  {
    id: 5,
    text: 'Em sua opinião, qual o principal motivo que leva jovens a iniciarem o uso de anabolizantes?',
    type: 'radio',
    options: [
      'Pressão estética / busca pelo "corpo perfeito"',
      'Aceleração de resultados',
      'Influência de amigos ou redes sociais',
    ],
    hasOther: true,
  },
  {
    id: 6,
    text: 'Você acredita que o uso de anabolizantes, mesmo com acompanhamento, pode trazer riscos graves à saúde a longo prazo?',
    type: 'radio',
    options: [
      'Sim, os riscos são altos',
      'Depende da dose e da substância',
      'Não, se souber usar é seguro',
    ],
  },
  {
    id: 7,
    text: 'Qual desses efeitos colaterais você considera mais preocupante?',
    type: 'checkbox',
    options: [
      'Problemas cardíacos / pressão alta',
      'Danos ao fígado',
      'Alterações psicológicas (agressividade, depressão, ansiedade)',
      'Alterações estéticas irreversíveis (acne severa, queda de cabelo, ginecomastia)',
    ],
  },
  {
    id: 8,
    text: 'Você já ouviu conversas ou recebeu sugestões sobre o uso de substâncias para acelerar resultados físicos?',
    type: 'radio',
    options: [
      'Sim, de amigos/conhecidos',
      'Sim, de profissionais da área',
      'Já ouvi em ambientes de treino',
      'Nunca',
    ],
  },
  {
    id: 9,
    text: 'Alguma vez você já se sentiu tentado(a) a usar anabolizantes para atingir resultados mais rápidos?',
    type: 'radio',
    options: [
      'Frequentemente',
      'Já pensei sobre isso, mas tive medo',
      'Nunca pensei a respeito',
    ],
  },
  {
    id: 10,
    text: 'Caso decidisse usar esse tipo de substância, qual seria sua principal fonte de informação?',
    type: 'radio',
    options: [
      'Médicos ou nutricionistas',
      'Internet / redes sociais / fóruns',
      'Amigos de treino ou instrutores',
    ],
  },
  {
    id: 11,
    text: 'Você acredita que alimentação adequada, treino e descanso podem trazer resultados satisfatórios sem o uso de anabolizantes?',
    type: 'radio',
    options: [
      'Sim, de forma saudável e sustentável',
      'Sim, mas os resultados demoram mais do que eu gostaria',
      'Não, acredito que a genética limita os resultados naturais',
    ],
  },
  {
    id: 12,
    text: 'Como você avalia sua alimentação atual em relação aos seus objetivos físicos?',
    type: 'radio',
    options: [
      'Sigo um plano alimentar profissional',
      'Tento me alimentar bem por conta própria',
      'Acredito que minha alimentação ainda atrapalha meus resultados',
    ],
  },
];
