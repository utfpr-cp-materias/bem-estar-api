import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Artigos com conteúdo na íntegra extraído das fontes oficiais (Ministério da Saúde / Fiocruz).
// Cada artigo guarda o texto completo em `content` e a fonte ao final.
const articles = [
  {
    title: 'Saúde Mental: o que é e como o SUS cuida',
    description:
      'Entenda o conceito biopsicossocial de saúde mental, como funciona a Rede de Atenção Psicossocial (RAPS) e os desafios do estigma. Conteúdo do Ministério da Saúde.',
    type: 'ARTICLE' as const,
    category: 'GENERAL' as const,
    imageUrl:
      'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/saude-mental/@@govbr.institucional.banner/d9fb67cd-8bdc-41db-a2d4-4d6bd7f36634/@@images/b3af1923-d92a-473a-9136-566aeeb5e6c7.png',
    tags: ['saúde mental', 'SUS', 'RAPS', 'CAPS', 'bem-estar', 'estigma'],
    content: `A saúde mental não se limita apenas ao que sentimos individualmente. Ela é uma rede de fatores relacionados. De acordo com a Organização Mundial de Saúde (OMS), a Saúde Mental pode ser considerada um estado de bem-estar vivido pelo indivíduo, que possibilita o desenvolvimento de suas habilidades pessoais para responder aos desafios da vida e contribuir com a comunidade.

O bem-estar de uma pessoa não depende apenas do aspecto psicológico e emocional, mas também de condições fundamentais, como saúde física, apoio social, condições de vida. Além dos aspectos individuais, a saúde mental é também determinada pelos aspectos sociais, ambientais e econômicos.

A saúde mental não é algo isolado, é também influenciada pelo ambiente ao nosso redor. Isso significa que deve-se considerar que a saúde mental resulta da interação de fatores biológicos, psicológicos e sociais. Pode-se afirmar que a saúde mental tem características biopsicossociais.

Entender a saúde mental como algo que envolve o corpo, as emoções e a forma como interagimos ajuda a ver que todos têm um papel importante em cuidar do bem-estar de todos, cuidando de nós mesmos e apoiando uns aos outros.

A garantia do direito constitucional à saúde inclui o cuidado à saúde mental. É um dever do Estado brasileiro, que tem a responsabilidade de oferecer condições dignas de cuidado em saúde para toda a população. No Brasil, a política de saúde mental se pauta em princípios como a desinstitucionalização, o cuidado em liberdade e os direitos humanos.

Situações de Crise

As pessoas em situações de crise podem ser atendidas em qualquer dispositivo da Rede de Atenção Psicossocial (RAPS), que é formada por vários serviços de saúde com finalidades e características distintas. São serviços da rede pública de saúde do SUS que seguem os princípios fundamentais da universalidade, integralidade e equidade, buscando proporcionar atendimento acessível, amplo e justo para todos e todas.

Para garantir um cuidado integral, é essencial a organização dos serviços de saúde em uma rede que funcione de maneira conectada e dinâmica. Essa rede de cuidados é como uma teia em cada um dos territórios, onde os diversos serviços de saúde ali existentes estão articulados e trabalham juntos. No SUS, a Rede de Atenção Psicossocial (RAPS) é uma das redes mais importantes, dedicada a cuidar da saúde mental.

Essa Rede é um sistema forte que oferece cuidados em saúde mental. Isso inclui ações para promover a saúde mental, oferecer assistência e cuidado, além de ajudar na recuperação e reintegração de pessoas com sofrimento mental e outros problemas de saúde relacionados ao uso de álcool e outras drogas.

Serviços e Programas

Os serviços e programas voltados para atenção em saúde mental, álcool e outras drogas têm como propósito assegurar o acesso e oferecer cuidado integral e tratamento às pessoas em sofrimento psíquico, incluindo aquelas com necessidades decorrentes do uso prejudicial de álcool e outras drogas.

Onde Encontrar

O atendimento em CAPS pode ser iniciado por escolha própria (quando o usuário(a) procura diretamente) ou por meio de encaminhamento proveniente de outros serviços da rede de saúde ou de setores interligados, como Assistência Social, Educação, Justiça e outros. Serviços tais como Unidade de Acolhimento, Serviço Residencial Terapêutico e Hospitais Gerais necessitam de encaminhamento.

O que Impacta na Saúde Mental

A realidade social, econômica, política, cultural e ambiental impacta diretamente na saúde mental da população, não sendo um problema meramente individual. Dessa maneira, compreende-se que os problemas de saúde mental resultam da coletividade, demandando políticas públicas, redes de proteção, melhores condições de vida, segurança alimentar e suporte comunitário.

Estigma e Desafios

O estigma não apenas afeta a pessoa que possui necessidades decorrentes de problemas de saúde mental, mas também se estende à sua família, aos serviços destinados a essa questão, à equipe que neles trabalha e às diversas formas de tratamento. Este estigma torna-se um obstáculo substancial à recuperação e reabilitação da pessoa, sendo um componente essencial da discriminação enfrentada por aqueles com problemas de saúde mental.

Reconhecer a importância de enfrentar esses desafios significa promover ambientes de cuidado em saúde mental mais acolhedores. A superação do estigma é crucial para melhorar a qualidade de vida das pessoas com problemas de saúde mental, garantir assistência adequada e promover a igualdade no acesso aos serviços de saúde mental. Apesar de serem condições comuns em todo o mundo, aqueles que vivem com essas necessidades encontram-se alvo de discriminação e tratamento diferenciado.

O medo, a incompreensão e os preconceitos são fatores que alimentam o estigma, contribuindo para a exclusão social e a discriminação enfrentadas por aqueles que lidam com condições de saúde mental. É crucial compreender que a recuperação e o controle de condições de saúde mental são possíveis. A luta contra o estigma é uma responsabilidade compartilhada: ao unir esforços, podemos construir uma sociedade onde a saúde mental seja compreendida e apoiada por todos.

Fonte: Ministério da Saúde — gov.br. Disponível em: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental`,
  },
  {
    title: 'Depressão: causas, sintomas, tipos e tratamento',
    description:
      'Visão geral da depressão: prevalência, causas, fatores de risco, sintomas, diagnóstico, subtipos, tratamento e prevenção. Conteúdo do Ministério da Saúde.',
    type: 'ARTICLE' as const,
    category: 'DEPRESSION' as const,
    imageUrl:
      'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/depressao/depressao/@@govbr.institucional.banner/c4b8dc25-381e-498e-9658-bb792094fa7f/@@images/18651ff1-8d7e-4d0a-968c-fd87d5306552.png',
    tags: ['depressão', 'sintomas', 'tratamento', 'prevenção', 'saúde mental'],
    content: `A depressão é uma doença mental de elevada prevalência e é a mais associada ao suicídio; tende a ser crônica e recorrente, principalmente quando não é tratada. É um problema médico grave e altamente prevalente na população em geral. De acordo com estudo epidemiológico, a prevalência de depressão ao longo da vida no Brasil está em torno de 15,5%. Segundo a OMS, a prevalência de depressão na rede de atenção primária de saúde é de 10,4%, isoladamente ou associada a um transtorno físico.

De acordo com a OMS, a depressão situa-se em 4º lugar entre as principais causas de ônus, respondendo por 4,4% dos ônus acarretados por todas as doenças durante a vida. Ocupa o 1º lugar quando considerado o tempo vivido com incapacitação ao longo da vida (11,9%). A época comum do aparecimento é o final da 3ª década da vida, mas pode começar em qualquer idade. Estudos mostram prevalência ao longo da vida em até 20% nas mulheres e 12% nos homens.

Causas

Genética: Estudos com famílias, gêmeos e adotados indicam a existência de um componente genético. Estima-se que esse componente represente 40% da suscetibilidade para desenvolver depressão.

Bioquímica cerebral: Há evidências de deficiência de substâncias cerebrais chamadas neurotransmissores. São eles a Noradrenalina, a Serotonina e a Dopamina, que estão envolvidos na regulação da atividade motora, do apetite, do sono e do humor.

Eventos vitais: Eventos estressantes podem desencadear episódios depressivos naqueles que têm uma predisposição genética a desenvolver a doença.

Fatores de risco

- Estresse crônico
- Disfunções hormonais
- Transtornos psiquiátricos correlatos
- Histórico familiar
- Ansiedade crônica
- Dependência de álcool e drogas ilícitas
- Conflitos conjugais
- Traumas psicológicos
- Mudança brusca de condições financeiras e desemprego
- Doenças cardiovasculares, endocrinológicas, neurológicas, neoplasias, entre outras

Sintomas

Humor depressivo: sensação de tristeza, autodesvalorização e sentimento de culpa. Muitos acreditam que perderam, de forma irreversível, a capacidade de sentir prazer ou alegria. Tudo parece vazio. Muitos se mostram mais apáticos do que tristes, referindo "sentimento de falta de sentimento". Os pensamentos suicidas variam desde o desejo de estar morto até planos detalhados; esses pensamentos devem ser sistematicamente investigados.

Retardo motor: falta de energia, preguiça ou cansaço excessivo, lentificação do pensamento, falta de concentração, queixas de falta de memória, de vontade e de iniciativa.

Insônia ou sonolência: a insônia geralmente é intermediária ou terminal; a sonolência está mais associada à depressão chamada Atípica.

Apetite: geralmente diminuído, podendo ocorrer em algumas formas de depressão aumento do apetite, com maior interesse por carboidratos e doces.

Redução do interesse sexual.

Dores e sintomas físicos difusos: como mal-estar, cansaço, queixas digestivas, dor no peito, taquicardia e sudorese.

Diagnóstico

O diagnóstico da depressão é clínico, feito pelo médico após coleta completa da história do paciente e realização de um exame do estado mental. Não existem exames laboratoriais específicos para diagnosticar depressão.

Subtipos de Depressão

Distimia: quadro mais leve e crônico, presente na maior parte do dia, todos os dias, por no mínimo dois anos. Prevalecem queixas de cansaço e desânimo. Geralmente se inicia na adolescência ou no princípio da idade adulta.

Depressão endógena: predominância de sintomas como perda de interesse ou prazer em atividades normalmente agradáveis, piora pela manhã, falta de reatividade do humor, lentidão psicomotora, perda de apetite importante e perda de peso, muito desânimo e tristeza.

Depressão sazonal: início no outono/inverno e remissão na primavera. Sintomas comuns: apatia, diminuição da atividade, isolamento social, sonolência, aumento do apetite, "fissura" por carboidratos e ganho de peso.

Depressão atípica: inversão dos sintomas, com aumento de apetite e/ou ganho de peso, dificuldade para conciliar o sono ou sonolência, sensação de corpo pesado e sensibilidade exagerada à rejeição.

Depressão psicótica: quadro grave, caracterizado pela presença de delírios e alucinações.

Depressão secundária: síndromes depressivas associadas ou causadas por doenças médico-sistêmicas e/ou por medicamentos.

Depressão bipolar: a maioria dos pacientes bipolares inicia a doença com um episódio depressivo. Histórico familiar de bipolaridade, depressão maior, abuso de substâncias e transtorno de ansiedade são indícios de evolução bipolar.

Tratamento

O tratamento é medicamentoso e psicoterápico. A escolha do antidepressivo é feita com base no subtipo da depressão, nos antecedentes pessoais e familiares e nas características dos antidepressivos. De 90% a 95% dos pacientes apresentam remissão total com o tratamento. É fundamental a adesão ao tratamento: interromper por conta própria ou usar a medicação de forma inadequada pode aumentar significativamente o risco de cronificação. O tratamento pode ser realizado na Atenção Primária, nos Centros de Atenção Psicossocial (CAPS) e nos ambulatórios especializados.

Prevenção

Para manter um estilo de vida saudável é preciso: ter uma dieta equilibrada; praticar atividade física regularmente; evitar o consumo de bebidas alcoólicas; não usar drogas ilícitas; diminuir as doses diárias de cafeína; manter rotina de sono regular; combater o estresse com atividades prazerosas; e não interromper o tratamento sem orientação médica.

Fonte: Ministério da Saúde — gov.br. Disponível em: https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/depressao`,
  },
  {
    title: 'Saúde Mental e Atividade Física: experiência com grupo de idosos',
    description:
      'Relato de experiência da RAPS sobre como um grupo de atividade física promove bem-estar biopsicossocial em idosos. Iniciativa Nós na Rede (Fiocruz / Ministério da Saúde).',
    type: 'ARTICLE' as const,
    category: 'GENERAL' as const,
    imageUrl:
      'https://brasilia.fiocruz.br/nosnarede/wp-content/uploads/sites/10/2025/01/20240919_084826-scaled.jpg',
    tags: ['atividade física', 'idosos', 'socialização', 'prevenção', 'saúde mental'],
    content: `Autoras: Adriana Cláudia de Faria Costa e Aline Cardoso de Almeida
Local: Unidade de Saúde da Família Jardim Aeroporto — Marília/SP
Período: setembro de 2024

Considerando a saúde mental um estado de bem-estar que permite a uma pessoa desenvolver suas habilidades para lidar com os desafios da vida e contribuir com a comunidade, identificamos a necessidade de trabalhar a saúde mental no território através do grupo de atividade física da Unidade de Saúde. A maior parte desses usuários são aposentados(as) e viúvos(as) que viviam em seus lares sozinhos, muitas vezes com sintomas depressivos e diversas queixas somáticas.

Este grupo conta com a participação de cerca de 40 idosos, além da educadora física da e-Multi. Através da prática de exercícios físicos, os pacientes, além de se exercitarem, se socializam e interagem uns com os outros, trabalhando assim aspectos biopsicossociais.

O grupo de atividade física ocorre semanalmente, com duração de uma hora. Os membros participantes também participam de ações de prevenção e promoção da saúde, como o Setembro Amarelo, realizado todos os anos com atividades diversas que complementam as já realizadas pelo grupo. O grupo realiza também passeios visando o lazer e o bem-estar daqueles que participam, agregando inclusive novos membros.

Através desse trabalho, foi observado que muitos pacientes se tornaram mais independentes, ativos e menos poliqueixosos. O desafio encontrado é incorporar a participação contínua de outros profissionais, visto que este já é um grupo consolidado, que poderia contar com uma diversidade maior de ações de prevenção e promoção da saúde da população idosa do território da Unidade de Saúde.

Palavras-chave: atividade física, prevenção e promoção à saúde, socialização.

Fonte: Nós na Rede — Fiocruz Brasília / Ministério da Saúde. Disponível em: https://brasilia.fiocruz.br/nosnarede/mostra-de-experiencias/saude-mental-e-atividade-fisica/`,
  },
];

async function main() {
  console.log('🌱 Populando artigos (resources do tipo ARTICLE)...\n');

  for (const a of articles) {
    const id = `res-${slug(a.title)}`;
    await prisma.resource.upsert({
      where: { id },
      update: a,
      create: { id, ...a },
    });
    console.log(`  ✅ ${a.title}`);
  }

  console.log(`\n🎉 ${articles.length} artigos inseridos/atualizados com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed de artigos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
