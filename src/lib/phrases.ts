/**
 * Frases temáticas por coleção e significados poéticos por palavra.
 */

/**
 * Frase de reflexão exibida ao completar cada coleção.
 * Índice corresponde ao índice da coleção em collections.ts.
 */
export const COLLECTION_PHRASES: string[] = [
  // 0 — Acolhimento
  "quando você acolhe o que sente, o mundo fica mais leve.",
  // 1 — Serenidade
  "a paz mora dentro de você. às vezes só precisa de silêncio pra ouvir.",
  // 2 — Crescimento
  "florescer exige coragem. e você já está florescendo.",
  // 3 — Conexão
  "estar presente pra alguém é o maior presente que existe.",
  // 4 — Autocuidado
  "cuidar de si não é egoísmo. é o primeiro passo pra cuidar do mundo.",
  // 5 — Amor próprio
  "você não precisa ser perfeito. precisa ser real.",
  // 6 — Reconexão
  "todo recomeço começa com um respiro.",
  // 7 — Companhia
  "a gente não foi feito pra caminhar sozinho.",
  // 8 — Resiliência
  "cair faz parte. levantar é escolha. e você escolheu.",
  // 9 — Esperança
  "enquanto você sonha, o caminho já está se abrindo.",
  // 10 — Vulnerabilidade
  "pedir ajuda é coisa de gente forte.",
  // 11 — Pertencimento
  "seu lugar existe. e ele tá mais perto do que você imagina.",
  // 12 — Gratidão
  "agradecer muda a forma como a gente enxerga o dia.",
  // 13 — Leveza
  "dançar, sorrir, brincar — tudo isso também é resistir.",
  // 14 — Força interior
  "sua força não vem de fora. ela sempre morou em você.",
  // 15 — Paz interior
  "aquietar a mente é deixar o coração falar.",
  // 16 — Autocompaixão
  "seja gentil consigo. você também merece o seu carinho.",
  // 17 — Recomeço
  "cada manhã é uma semente. plante com cuidado.",
];

/**
 * Significados poéticos por palavra.
 * Exibidos como tooltip ao encontrar a palavra.
 */
export const WORD_MEANINGS: Record<string, string> = {
  // Coleção 0 — Acolhimento
  RESPIRA: "dar espaço pro ar e pra calma entrarem.",
  CORAGEM: "o coração que decide ir, mesmo tremendo.",
  CALMA: "a quietude que vem quando você para de lutar contra o momento.",
  CONFIA: "soltar o controle e acreditar que vai dar certo.",
  GENTILEZA: "o gesto pequeno que muda o dia de alguém.",
  ABRAÇO: "o lugar mais seguro do mundo.",
  AFETO: "o que a gente sente quando olha com carinho.",

  // Coleção 1 — Serenidade
  PRESENTE: "o único tempo que realmente existe.",
  LEVEZA: "quando a alma tira o peso das costas.",
  ESPERANÇA: "a luzinha que insiste em brilhar no escuro.",
  HARMONIA: "quando tudo encontra o seu lugar.",
  PAZ: "o silêncio bom que mora dentro da gente.",
  REFÚGIO: "o cantinho onde você pode ser quem é.",
  TERNURA: "o toque suave que diz 'eu me importo'.",

  // Coleção 2 — Crescimento
  PERTENCE: "saber que existe um lugar pra você nesse mundo.",
  MERECER: "não é algo que se conquista. já é seu.",
  FLORESCER: "quando o que estava guardado finalmente desabrocha.",
  FORÇA: "não é não sentir dor. é seguir sentindo.",
  BRILHAR: "ser quem você é, sem pedir desculpa.",
  INSPIRAR: "tocar alguém só sendo verdadeiro.",
  ACOLHER: "abrir espaço no coração pra alguém entrar.",

  // Coleção 3 — Conexão
  VÍNCULO: "o fio invisível que liga dois corações.",
  ENCONTRO: "quando duas solidões viram companhia.",
  SINTONIA: "estar na mesma frequência sem precisar de palavras.",
  EMPATIA: "sentir o mundo pelos olhos de outra pessoa.",
  ESCUTA: "ouvir com o coração, não só com os ouvidos.",
  OLHAR: "às vezes um olhar diz o que a boca não consegue.",
  PRESENÇA: "estar ali de verdade. inteiro.",

  // Coleção 4 — Autocuidado
  CUIDAR: "regar a própria vida com atenção.",
  DESCANSO: "a permissão que você dá pra si mesmo parar.",
  RENOVAR: "deixar ir o que pesa pra dar espaço ao novo.",
  NUTRIR: "alimentar a alma com o que faz bem.",
  PROTEGER: "guardar o que é precioso — inclusive você.",
  LIMITE: "a linha que diz 'até aqui, e tá tudo bem'.",
  SAÚDE: "o equilíbrio gentil entre corpo e mente.",

  // Coleção 5 — Amor próprio
  ACEITAR: "olhar no espelho e dizer 'eu sou suficiente'.",
  VALORIZAR: "reconhecer o próprio brilho.",
  ADMIRAR: "ver beleza no que você construiu.",
  RESPEITO: "honrar o próprio ritmo.",
  ORGULHO: "o sorriso que nasce quando você se reconhece.",
  ESSÊNCIA: "aquilo que resta quando tudo mais sai.",
  BELEZA: "existe em quem é real, não em quem é perfeito.",

  // Coleção 6 — Reconexão
  RECOMEÇO: "a coragem de virar a página e escrever de novo.",
  PERDOAR: "soltar o peso que não é seu.",
  CURAR: "o processo silencioso de voltar a ser inteiro.",
  LIBERTAR: "quando você escolhe a leveza.",
  RENASCER: "todo dia é uma nova chance de ser quem você quer.",
  SOLTAR: "abrir a mão e confiar no vento.",
  CONFIAR: "dar um passo sem ver o chão inteiro.",

  // Coleção 7 — Companhia
  AMIZADE: "a família que a gente escolhe.",
  CARINHO: "o tempero que deixa qualquer momento mais gostoso.",
  ABRAÇAR: "envolver alguém com tudo que você tem de bom.",
  SORRISO: "a linguagem universal do coração.",
  CONFORTO: "quando alguém faz o mundo parecer mais seguro.",
  AQUECER: "trazer calor quando o frio aperta.",
  UNIR: "juntar pedaços e descobrir que formam algo lindo.",

  // Coleção 8 — Resiliência
  SUPERAR: "passar por cima do impossível, um passo de cada vez.",
  PERSISTIR: "continuar quando tudo pede pra parar.",
  AGUENTAR: "a força silenciosa de quem não desiste.",
  CRESCER: "o prêmio invisível de cada dificuldade.",
  APRENDER: "transformar dor em sabedoria.",
  EVOLUIR: "se tornar uma versão mais gentil de si.",
  SEGUIR: "colocar um pé na frente do outro. é o bastante.",

  // Coleção 9 — Esperança
  DESTINO: "não é onde você chega. é quem você se torna no caminho.",
  CAMINHO: "às vezes torto, mas sempre seu.",
  FUTURO: "a página em branco mais bonita que existe.",
  SONHAR: "plantar no invisível o que um dia será real.",
  ACREDITAR: "a faísca que acende tudo.",
  LUTAR: "não desistir do que importa pra você.",

  // Coleção 10 — Vulnerabilidade
  SENTIR: "a coisa mais corajosa que um humano pode fazer.",
  CHORAR: "a chuva que lava a alma.",
  PEDIR: "estender a mão e dizer 'preciso de você'.",
  ABRIR: "mostrar o que mora dentro sem medo.",
  EXPRESSAR: "colocar pra fora o que precisa de espaço.",
  AMAR: "o verbo mais bonito que existe.",
  PRECISAR: "não é fraqueza. é ser humano.",

  // Coleção 11 — Pertencimento
  RAÍZES: "de onde a gente veio moram nossas forças.",
  ORIGEM: "a história que nos fez ser quem somos.",
  LAR: "não é um lugar. é onde o coração descansa.",
  FAMÍLIA: "quem fica quando o mundo vai embora.",
  COMUNIDADE: "muitas mãos construindo juntas.",
  TRIBO: "os seus. aqueles que entendem sem explicação.",

  // Coleção 12 — Gratidão
  AGRADECER: "reconhecer que algo de bom aconteceu.",
  CELEBRAR: "dar valor ao que deu certo.",
  APRECIAR: "olhar devagar pra não perder a beleza.",
  RECORDAR: "voltar ao que foi bom pra aquecer o agora.",
  SABOREAR: "viver o momento como quem morde uma fruta madura.",
  HONRAR: "respeitar o caminho que trouxe você até aqui.",
  LOUVAR: "reconhecer a grandeza nas coisas pequenas.",

  // Coleção 13 — Leveza
  DANÇAR: "deixar o corpo dizer o que a mente não consegue.",
  BRINCAR: "voltar a ser criança, mesmo que por um instante.",
  SORRIR: "acender uma luz no rosto de alguém.",
  CANTAR: "soltar a voz e, junto com ela, tudo que pesa.",
  CRIAR: "dar vida ao que só existia na imaginação.",
  IMAGINAR: "viajar sem sair do lugar.",
  VOAR: "quando a alma decide que não tem limite.",

  // Coleção 14 — Força interior
  GARRA: "a determinação que não precisa de plateia.",
  VONTADE: "o motor que te move quando o corpo quer parar.",
  FIRMEZA: "o pé plantado no chão quando o vento sopra forte.",
  OUSADIA: "a coragem de tentar o que ninguém tentou.",
  FIBRA: "o que te mantém inteiro quando tudo quer te quebrar.",
  POTÊNCIA: "a energia que mora dentro esperando ser usada.",

  // Coleção 15 — Paz interior
  SILÊNCIO: "o som mais honesto que existe.",
  MEDITAR: "ouvir o que o barulho não deixa.",
  RESPIRAR: "o lembrete de que você está vivo. e isso basta.",
  CENTRAR: "voltar pra si quando o mundo te puxa pra fora.",
  AQUIETAR: "fazer as pazes com o momento.",
  FLUIR: "ir sem forçar. como a água.",

  // Coleção 16 — Autocompaixão
  CUIDADO: "a atenção delicada que cura.",
  BONDADE: "fazer o bem sem esperar nada em troca.",
  PACIÊNCIA: "dar tempo ao tempo com gentileza.",
  SUAVIDADE: "a força de quem não precisa gritar.",
  AFEIÇÃO: "o carinho que nasce sem pedir licença.",
  CLEMÊNCIA: "perdoar o que dói com compaixão.",
  MIMO: "um gesto pequeno que diz 'você importa'.",

  // Coleção 17 — Recomeço
  AURORA: "a promessa de que, depois da escuridão, vem a luz.",
  SEMENTE: "tudo de grande começa pequeno.",
  BROTO: "a vida insistindo em nascer.",
  RAIAR: "quando o novo dia diz 'tenta de novo'.",
  DESPERTAR: "abrir os olhos pra vida com vontade de viver.",
  ALVORECER: "o momento mais bonito: quando tudo está por começar.",
  MANHÃ: "a chance que se repete todo dia.",
};
