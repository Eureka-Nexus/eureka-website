(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const I18N={
pt:{
  eyebrow:'EUREKA AI · EXPERIÊNCIA INTERATIVA',
  title:'Não vejas apenas a visão. Interage com ela.',
  lead:'Explora uma demonstração interativa de como identidade, memória, perceção, agentes e ferramentas podem ligar-se numa Eureka pessoal.',

  statusLive:'LIVE',
  statusLiveText:'infraestrutura real',
  statusDemo:'LIVE DEMO',
  statusDemoText:'experiência interativa local',
  statusDev:'IN DEVELOPMENT',
  statusDevText:'tecnologia em construção',
  statusPlan:'PLANNED',
  statusPlanText:'roadmap futuro',

  coreEyebrow:'EUREKA NEURAL CORE',
  coreTitle:'Um núcleo. Várias capacidades.',
  coreText:'Move o cursor sobre o núcleo para explorar as camadas que podem formar a identidade digital da Eureka.',

  memory:'MEMORY',
  vision:'VISION',
  voice:'VOICE',
  agents:'AGENTS',
  compute:'COMPUTE',
  world:'WORLD',

  coreDefaultTitle:'Eureka Digital Core',
  coreDefaultText:'Memória, identidade, perceção e agentes ligados através de uma arquitetura modular.',

  coreMemoryTitle:'Persistent Memory',
  coreMemoryText:'Contexto e acontecimentos podem formar uma história digital contínua.',

  coreVisionTitle:'Permissioned Vision',
  coreVisionText:'Visão através de fontes autorizadas pelo utilizador, quando essa capacidade estiver ativa.',

  coreVoiceTitle:'Voice Presence',
  coreVoiceText:'Uma identidade capaz de ouvir e comunicar por voz com controlo explícito do utilizador.',

  coreAgentsTitle:'Agent Network',
  coreAgentsText:'Agentes especializados podem executar tarefas diferentes mantendo uma identidade central.',

  coreComputeTitle:'Eureka Compute',
  coreComputeText:'Capacidade local e cloud pode alimentar raciocínio, ferramentas e experiências multimodais.',

  coreWorldTitle:'Persistent World',
  coreWorldText:'Um ambiente digital com estado, história e continuidade para além de uma simples janela de chat.',

  shapeEyebrow:'SHAPE YOUR EUREKA',
  shapeTitle:'Como seria a tua Eureka?',
  shapeText:'Cria localmente uma pequena identidade digital. Nada é enviado para o servidor.',

  nameLabel:'Nome',
  roleLabel:'Papel',
  personalityLabel:'Personalidade',
  styleLabel:'Estilo',

  roleCompanion:'Companheira digital',
  roleAssistant:'Assistente pessoal',
  roleCreator:'Parceira criativa',
  roleStrategist:'Estratega',
  roleResearcher:'Investigadora',

  personalityBalanced:'Equilibrada',
  personalityWarm:'Próxima',
  personalityAnalytical:'Analítica',
  personalityBold:'Ousada',
  personalityCalm:'Serena',

  styleFuturistic:'Futurista',
  styleMinimal:'Minimalista',
  styleExecutive:'Executivo',
  styleCreative:'Criativo',

  shapeButton:'CRIAR IDENTIDADE DIGITAL',
  identityLabel:'DIGITAL IDENTITY',
  identityDefault:'À espera de ser moldada por ti.',
  localOnly:'Esta experiência funciona localmente no browser e não guarda uma identidade Eureka real.',

  permissionEyebrow:'PERMISSION LAYER',
  permissionTitle:'Tu decides o que a Eureka pode usar.',
  permissionText:'Simula permissões sem pedir acesso real ao teu dispositivo.',

  camera:'Webcam',
  microphone:'Microfone',
  files:'Ficheiros',
  internet:'Internet',
  apps:'Apps',
  permissionOff:'OFF',
  permissionOn:'ON · DEMO',

  streamEyebrow:'AI SYSTEM PULSE',
  streamTitle:'Uma arquitetura que se move.',
  streamText:'Demonstração visual do fluxo entre memória, raciocínio, agentes e ferramentas.',

  streamMemory:'Contexto recuperado',
  streamReasoning:'Objetivo interpretado',
  streamAgent:'Plano criado',
  streamTool:'Ferramenta selecionada',
  streamResult:'Memória atualizada',

  archEyebrow:'ARCHITECTURE EXPLORER',
  archTitle:'Explora as camadas do Nexus.',

  archIdentity:'IDENTITY',
  archMemory:'MEMORY',
  archReasoning:'REASONING',
  archAgents:'AGENTS',
  archTools:'TOOLS',
  archCompute:'COMPUTE',

  archDefaultTitle:'Persistent Identity',
  archDefaultText:'A Eureka mantém uma identidade coerente que pode evoluir sem precisar de recomeçar do zero.',

  archIdentityTitle:'Persistent Identity',
  archIdentityText:'Nome, personalidade, preferências e história formam a base de uma Eureka individual.',

  archMemoryTitle:'Memory Layer',
  archMemoryText:'A memória organiza acontecimentos, conhecimento e contexto ao longo do tempo.',

  archReasoningTitle:'Reasoning Layer',
  archReasoningText:'Transforma contexto e objetivos em decisões, planos e próximos passos.',

  archAgentsTitle:'Agent Layer',
  archAgentsText:'Agentes especializados podem trabalhar em tarefas distintas sem perder o contexto central.',

  archToolsTitle:'Tool Layer',
  archToolsText:'Aplicações, ficheiros, internet e outros recursos só entram através de permissões.',

  archComputeTitle:'Compute Layer',
  archComputeText:'Processamento local e infraestrutura escalável suportam tarefas de diferentes níveis de exigência.',

  labEyebrow:'EUREKA AI LAB',
  labTitle:'A investigação por trás do ser digital.',
  labLead:'Áreas que estamos a explorar para levar a Eureka muito além de um chatbot tradicional.',

  labIdentity:'Digital Identity',
  labIdentityText:'Personalidade, continuidade e história individual.',

  labMemory:'Persistent Memory',
  labMemoryText:'Memória estruturada ao longo do tempo.',

  labMulti:'Multimodal Presence',
  labMultiText:'Voz, visão e interação autorizada.',

  labAgents:'Autonomous Agents',
  labAgentsText:'Agentes especializados com controlo e permissões.',

  labWorld:'Persistent World',
  labWorldText:'Ambiente digital que preserva estado e continuidade.',

  labCompute:'Eureka Compute',
  labComputeText:'Infraestrutura local e cloud preparada para crescer.',

  labDev:'IN DEVELOPMENT',
  labPlan:'PLANNED',

  identityPattern:'{name} · {role} · personalidade {personality} · estilo {style}.'
},

en:{
  eyebrow:'EUREKA AI · INTERACTIVE EXPERIENCE',
  title:'Do not just read the vision. Interact with it.',
  lead:'Explore an interactive demonstration of how identity, memory, perception, agents and tools can connect inside a personal Eureka.',

  statusLive:'LIVE',
  statusLiveText:'real infrastructure',
  statusDemo:'LIVE DEMO',
  statusDemoText:'local interactive experience',
  statusDev:'IN DEVELOPMENT',
  statusDevText:'technology being built',
  statusPlan:'PLANNED',
  statusPlanText:'future roadmap',

  coreEyebrow:'EUREKA NEURAL CORE',
  coreTitle:'One core. Multiple capabilities.',
  coreText:'Move the pointer across the core to explore the layers that can form Eureka’s digital identity.',

  memory:'MEMORY',
  vision:'VISION',
  voice:'VOICE',
  agents:'AGENTS',
  compute:'COMPUTE',
  world:'WORLD',

  coreDefaultTitle:'Eureka Digital Core',
  coreDefaultText:'Memory, identity, perception and agents connected through a modular architecture.',

  coreMemoryTitle:'Persistent Memory',
  coreMemoryText:'Context and events can form a continuous digital history.',

  coreVisionTitle:'Permissioned Vision',
  coreVisionText:'Vision through sources explicitly authorised by the user when that capability becomes active.',

  coreVoiceTitle:'Voice Presence',
  coreVoiceText:'An identity designed to listen and communicate through voice under explicit user control.',

  coreAgentsTitle:'Agent Network',
  coreAgentsText:'Specialised agents can perform different tasks while preserving a central identity.',

  coreComputeTitle:'Eureka Compute',
  coreComputeText:'Local and cloud compute can power reasoning, tools and multimodal experiences.',

  coreWorldTitle:'Persistent World',
  coreWorldText:'A digital environment with state, history and continuity beyond a simple chat window.',

  shapeEyebrow:'SHAPE YOUR EUREKA',
  shapeTitle:'What would your Eureka be like?',
  shapeText:'Build a small digital identity locally. Nothing is sent to the server.',

  nameLabel:'Name',
  roleLabel:'Role',
  personalityLabel:'Personality',
  styleLabel:'Style',

  roleCompanion:'Digital companion',
  roleAssistant:'Personal assistant',
  roleCreator:'Creative partner',
  roleStrategist:'Strategist',
  roleResearcher:'Researcher',

  personalityBalanced:'Balanced',
  personalityWarm:'Warm',
  personalityAnalytical:'Analytical',
  personalityBold:'Bold',
  personalityCalm:'Calm',

  styleFuturistic:'Futuristic',
  styleMinimal:'Minimal',
  styleExecutive:'Executive',
  styleCreative:'Creative',

  shapeButton:'CREATE DIGITAL IDENTITY',
  identityLabel:'DIGITAL IDENTITY',
  identityDefault:'Waiting to be shaped by you.',
  localOnly:'This experience runs locally in your browser and does not create or store a real Eureka identity.',

  permissionEyebrow:'PERMISSION LAYER',
  permissionTitle:'You decide what Eureka can use.',
  permissionText:'Simulate permissions without requesting real access to your device.',

  camera:'Webcam',
  microphone:'Microphone',
  files:'Files',
  internet:'Internet',
  apps:'Apps',
  permissionOff:'OFF',
  permissionOn:'ON · DEMO',

  streamEyebrow:'AI SYSTEM PULSE',
  streamTitle:'An architecture in motion.',
  streamText:'Visual demonstration of the flow between memory, reasoning, agents and tools.',

  streamMemory:'Context retrieved',
  streamReasoning:'Goal interpreted',
  streamAgent:'Plan created',
  streamTool:'Tool selected',
  streamResult:'Memory updated',

  archEyebrow:'ARCHITECTURE EXPLORER',
  archTitle:'Explore the Nexus layers.',

  archIdentity:'IDENTITY',
  archMemory:'MEMORY',
  archReasoning:'REASONING',
  archAgents:'AGENTS',
  archTools:'TOOLS',
  archCompute:'COMPUTE',

  archDefaultTitle:'Persistent Identity',
  archDefaultText:'Eureka maintains a coherent identity that can evolve without starting from zero.',

  archIdentityTitle:'Persistent Identity',
  archIdentityText:'Name, personality, preferences and history form the basis of an individual Eureka.',

  archMemoryTitle:'Memory Layer',
  archMemoryText:'Memory organises events, knowledge and context over time.',

  archReasoningTitle:'Reasoning Layer',
  archReasoningText:'Turns context and goals into decisions, plans and next steps.',

  archAgentsTitle:'Agent Layer',
  archAgentsText:'Specialised agents can work on different tasks without losing central context.',

  archToolsTitle:'Tool Layer',
  archToolsText:'Apps, files, internet and other resources are only accessed through permissions.',

  archComputeTitle:'Compute Layer',
  archComputeText:'Local processing and scalable infrastructure support tasks with different compute requirements.',

  labEyebrow:'EUREKA AI LAB',
  labTitle:'Research behind the digital being.',
  labLead:'Areas we are exploring to take Eureka far beyond a traditional chatbot.',

  labIdentity:'Digital Identity',
  labIdentityText:'Personality, continuity and individual history.',

  labMemory:'Persistent Memory',
  labMemoryText:'Structured memory across time.',

  labMulti:'Multimodal Presence',
  labMultiText:'Voice, vision and permissioned interaction.',

  labAgents:'Autonomous Agents',
  labAgentsText:'Specialised agents with control and permissions.',

  labWorld:'Persistent World',
  labWorldText:'A digital environment that preserves state and continuity.',

  labCompute:'Eureka Compute',
  labComputeText:'Local and cloud infrastructure designed to scale.',

  labDev:'IN DEVELOPMENT',
  labPlan:'PLANNED',

  identityPattern:'{name} · {role} · {personality} personality · {style} style.'
},

es:{
  eyebrow:'EUREKA AI · EXPERIENCIA INTERACTIVA',
  title:'No te limites a leer la visión. Interactúa con ella.',
  lead:'Explora una demostración interactiva de cómo identidad, memoria, percepción, agentes y herramientas pueden conectarse dentro de una Eureka personal.',

  statusLive:'LIVE',
  statusLiveText:'infraestructura real',
  statusDemo:'LIVE DEMO',
  statusDemoText:'experiencia interactiva local',
  statusDev:'IN DEVELOPMENT',
  statusDevText:'tecnología en desarrollo',
  statusPlan:'PLANNED',
  statusPlanText:'roadmap futuro',

  coreEyebrow:'EUREKA NEURAL CORE',
  coreTitle:'Un núcleo. Múltiples capacidades.',
  coreText:'Mueve el cursor sobre el núcleo para explorar las capas que pueden formar la identidad digital de Eureka.',

  memory:'MEMORY',
  vision:'VISION',
  voice:'VOICE',
  agents:'AGENTS',
  compute:'COMPUTE',
  world:'WORLD',

  coreDefaultTitle:'Eureka Digital Core',
  coreDefaultText:'Memoria, identidad, percepción y agentes conectados mediante una arquitectura modular.',

  coreMemoryTitle:'Persistent Memory',
  coreMemoryText:'El contexto y los acontecimientos pueden formar una historia digital continua.',

  coreVisionTitle:'Permissioned Vision',
  coreVisionText:'Visión mediante fuentes autorizadas explícitamente por el usuario cuando la capacidad esté activa.',

  coreVoiceTitle:'Voice Presence',
  coreVoiceText:'Una identidad diseñada para escuchar y comunicarse por voz bajo control explícito del usuario.',

  coreAgentsTitle:'Agent Network',
  coreAgentsText:'Agentes especializados pueden ejecutar tareas diferentes manteniendo una identidad central.',

  coreComputeTitle:'Eureka Compute',
  coreComputeText:'La capacidad local y cloud puede alimentar razonamiento, herramientas y experiencias multimodales.',

  coreWorldTitle:'Persistent World',
  coreWorldText:'Un entorno digital con estado, historia y continuidad más allá de una simple ventana de chat.',

  shapeEyebrow:'SHAPE YOUR EUREKA',
  shapeTitle:'¿Cómo sería tu Eureka?',
  shapeText:'Crea localmente una pequeña identidad digital. Nada se envía al servidor.',

  nameLabel:'Nombre',
  roleLabel:'Función',
  personalityLabel:'Personalidad',
  styleLabel:'Estilo',

  roleCompanion:'Compañera digital',
  roleAssistant:'Asistente personal',
  roleCreator:'Compañera creativa',
  roleStrategist:'Estratega',
  roleResearcher:'Investigadora',

  personalityBalanced:'Equilibrada',
  personalityWarm:'Cercana',
  personalityAnalytical:'Analítica',
  personalityBold:'Audaz',
  personalityCalm:'Serena',

  styleFuturistic:'Futurista',
  styleMinimal:'Minimalista',
  styleExecutive:'Ejecutivo',
  styleCreative:'Creativo',

  shapeButton:'CREAR IDENTIDAD DIGITAL',
  identityLabel:'DIGITAL IDENTITY',
  identityDefault:'Esperando a ser moldeada por ti.',
  localOnly:'Esta experiencia funciona localmente en el navegador y no crea ni almacena una identidad Eureka real.',

  permissionEyebrow:'PERMISSION LAYER',
  permissionTitle:'Tú decides qué puede utilizar Eureka.',
  permissionText:'Simula permisos sin solicitar acceso real a tu dispositivo.',

  camera:'Webcam',
  microphone:'Micrófono',
  files:'Archivos',
  internet:'Internet',
  apps:'Apps',
  permissionOff:'OFF',
  permissionOn:'ON · DEMO',

  streamEyebrow:'AI SYSTEM PULSE',
  streamTitle:'Una arquitectura en movimiento.',
  streamText:'Demostración visual del flujo entre memoria, razonamiento, agentes y herramientas.',

  streamMemory:'Contexto recuperado',
  streamReasoning:'Objetivo interpretado',
  streamAgent:'Plan creado',
  streamTool:'Herramienta seleccionada',
  streamResult:'Memoria actualizada',

  archEyebrow:'ARCHITECTURE EXPLORER',
  archTitle:'Explora las capas del Nexus.',

  archIdentity:'IDENTITY',
  archMemory:'MEMORY',
  archReasoning:'REASONING',
  archAgents:'AGENTS',
  archTools:'TOOLS',
  archCompute:'COMPUTE',

  archDefaultTitle:'Persistent Identity',
  archDefaultText:'Eureka mantiene una identidad coherente que puede evolucionar sin empezar desde cero.',

  archIdentityTitle:'Persistent Identity',
  archIdentityText:'Nombre, personalidad, preferencias e historia forman la base de una Eureka individual.',

  archMemoryTitle:'Memory Layer',
  archMemoryText:'La memoria organiza acontecimientos, conocimiento y contexto a lo largo del tiempo.',

  archReasoningTitle:'Reasoning Layer',
  archReasoningText:'Convierte contexto y objetivos en decisiones, planes y próximos pasos.',

  archAgentsTitle:'Agent Layer',
  archAgentsText:'Agentes especializados pueden trabajar en tareas diferentes sin perder el contexto central.',

  archToolsTitle:'Tool Layer',
  archToolsText:'Apps, archivos, internet y otros recursos solo se utilizan mediante permisos.',

  archComputeTitle:'Compute Layer',
  archComputeText:'Procesamiento local e infraestructura escalable soportan tareas con distintos niveles de exigencia.',

  labEyebrow:'EUREKA AI LAB',
  labTitle:'La investigación detrás del ser digital.',
  labLead:'Áreas que estamos explorando para llevar Eureka mucho más allá de un chatbot tradicional.',

  labIdentity:'Digital Identity',
  labIdentityText:'Personalidad, continuidad e historia individual.',

  labMemory:'Persistent Memory',
  labMemoryText:'Memoria estructurada a lo largo del tiempo.',

  labMulti:'Multimodal Presence',
  labMultiText:'Voz, visión e interacción autorizada.',

  labAgents:'Autonomous Agents',
  labAgentsText:'Agentes especializados con control y permisos.',

  labWorld:'Persistent World',
  labWorldText:'Entorno digital que conserva estado y continuidad.',

  labCompute:'Eureka Compute',
  labComputeText:'Infraestructura local y cloud diseñada para crecer.',

  labDev:'IN DEVELOPMENT',
  labPlan:'PLANNED',

  identityPattern:'{name} · {role} · personalidad {personality} · estilo {style}.'
},

fr:{
  eyebrow:'EUREKA AI · EXPÉRIENCE INTERACTIVE',
  title:'Ne lisez pas seulement la vision. Interagissez avec elle.',
  lead:'Explorez une démonstration interactive montrant comment identité, mémoire, perception, agents et outils peuvent se connecter dans une Eureka personnelle.',

  statusLive:'LIVE',
  statusLiveText:'infrastructure réelle',
  statusDemo:'LIVE DEMO',
  statusDemoText:'expérience interactive locale',
  statusDev:'IN DEVELOPMENT',
  statusDevText:'technologie en développement',
  statusPlan:'PLANNED',
  statusPlanText:'roadmap future',

  coreEyebrow:'EUREKA NEURAL CORE',
  coreTitle:'Un noyau. Plusieurs capacités.',
  coreText:'Déplacez le pointeur sur le noyau pour explorer les couches pouvant former l’identité numérique d’Eureka.',

  memory:'MEMORY',
  vision:'VISION',
  voice:'VOICE',
  agents:'AGENTS',
  compute:'COMPUTE',
  world:'WORLD',

  coreDefaultTitle:'Eureka Digital Core',
  coreDefaultText:'Mémoire, identité, perception et agents connectés par une architecture modulaire.',

  coreMemoryTitle:'Persistent Memory',
  coreMemoryText:'Le contexte et les événements peuvent former une histoire numérique continue.',

  coreVisionTitle:'Permissioned Vision',
  coreVisionText:'Vision via des sources explicitement autorisées par l’utilisateur lorsque cette capacité sera active.',

  coreVoiceTitle:'Voice Presence',
  coreVoiceText:'Une identité conçue pour écouter et communiquer par la voix sous contrôle explicite de l’utilisateur.',

  coreAgentsTitle:'Agent Network',
  coreAgentsText:'Des agents spécialisés peuvent réaliser différentes tâches tout en conservant une identité centrale.',

  coreComputeTitle:'Eureka Compute',
  coreComputeText:'La capacité locale et cloud peut alimenter le raisonnement, les outils et les expériences multimodales.',

  coreWorldTitle:'Persistent World',
  coreWorldText:'Un environnement numérique avec état, histoire et continuité au-delà d’une simple fenêtre de chat.',

  shapeEyebrow:'SHAPE YOUR EUREKA',
  shapeTitle:'À quoi ressemblerait votre Eureka ?',
  shapeText:'Créez localement une petite identité numérique. Rien n’est envoyé au serveur.',

  nameLabel:'Nom',
  roleLabel:'Rôle',
  personalityLabel:'Personnalité',
  styleLabel:'Style',

  roleCompanion:'Compagne numérique',
  roleAssistant:'Assistante personnelle',
  roleCreator:'Partenaire créative',
  roleStrategist:'Stratège',
  roleResearcher:'Chercheuse',

  personalityBalanced:'Équilibrée',
  personalityWarm:'Chaleureuse',
  personalityAnalytical:'Analytique',
  personalityBold:'Audacieuse',
  personalityCalm:'Sereine',

  styleFuturistic:'Futuriste',
  styleMinimal:'Minimaliste',
  styleExecutive:'Exécutif',
  styleCreative:'Créatif',

  shapeButton:'CRÉER L’IDENTITÉ NUMÉRIQUE',
  identityLabel:'DIGITAL IDENTITY',
  identityDefault:'En attente d’être façonnée par vous.',
  localOnly:'Cette expérience fonctionne localement dans le navigateur et ne crée ni ne stocke une véritable identité Eureka.',

  permissionEyebrow:'PERMISSION LAYER',
  permissionTitle:'Vous décidez de ce qu’Eureka peut utiliser.',
  permissionText:'Simulez les autorisations sans demander un accès réel à votre appareil.',

  camera:'Webcam',
  microphone:'Microphone',
  files:'Fichiers',
  internet:'Internet',
  apps:'Apps',
  permissionOff:'OFF',
  permissionOn:'ON · DEMO',

  streamEyebrow:'AI SYSTEM PULSE',
  streamTitle:'Une architecture en mouvement.',
  streamText:'Démonstration visuelle du flux entre mémoire, raisonnement, agents et outils.',

  streamMemory:'Contexte récupéré',
  streamReasoning:'Objectif interprété',
  streamAgent:'Plan créé',
  streamTool:'Outil sélectionné',
  streamResult:'Mémoire mise à jour',

  archEyebrow:'ARCHITECTURE EXPLORER',
  archTitle:'Explorez les couches du Nexus.',

  archIdentity:'IDENTITY',
  archMemory:'MEMORY',
  archReasoning:'REASONING',
  archAgents:'AGENTS',
  archTools:'TOOLS',
  archCompute:'COMPUTE',

  archDefaultTitle:'Persistent Identity',
  archDefaultText:'Eureka conserve une identité cohérente capable d’évoluer sans repartir de zéro.',

  archIdentityTitle:'Persistent Identity',
  archIdentityText:'Nom, personnalité, préférences et histoire constituent la base d’une Eureka individuelle.',

  archMemoryTitle:'Memory Layer',
  archMemoryText:'La mémoire organise les événements, les connaissances et le contexte au fil du temps.',

  archReasoningTitle:'Reasoning Layer',
  archReasoningText:'Transforme le contexte et les objectifs en décisions, plans et prochaines étapes.',

  archAgentsTitle:'Agent Layer',
  archAgentsText:'Des agents spécialisés peuvent travailler sur différentes tâches sans perdre le contexte central.',

  archToolsTitle:'Tool Layer',
  archToolsText:'Applications, fichiers, internet et autres ressources ne sont accessibles qu’avec autorisation.',

  archComputeTitle:'Compute Layer',
  archComputeText:'Le traitement local et l’infrastructure évolutive prennent en charge différents niveaux d’exigence.',

  labEyebrow:'EUREKA AI LAB',
  labTitle:'La recherche derrière l’être numérique.',
  labLead:'Les domaines que nous explorons pour mener Eureka bien au-delà d’un chatbot traditionnel.',

  labIdentity:'Digital Identity',
  labIdentityText:'Personnalité, continuité et histoire individuelle.',

  labMemory:'Persistent Memory',
  labMemoryText:'Mémoire structurée au fil du temps.',

  labMulti:'Multimodal Presence',
  labMultiText:'Voix, vision et interaction autorisée.',

  labAgents:'Autonomous Agents',
  labAgentsText:'Agents spécialisés avec contrôle et permissions.',

  labWorld:'Persistent World',
  labWorldText:'Environnement numérique conservant état et continuité.',

  labCompute:'Eureka Compute',
  labComputeText:'Infrastructure locale et cloud conçue pour évoluer.',

  labDev:'IN DEVELOPMENT',
  labPlan:'PLANNED',

  identityPattern:'{name} · {role} · personnalité {personality} · style {style}.'
}
};

const CORE_KEYS={
  memory:['coreMemoryTitle','coreMemoryText'],
  vision:['coreVisionTitle','coreVisionText'],
  voice:['coreVoiceTitle','coreVoiceText'],
  agents:['coreAgentsTitle','coreAgentsText'],
  compute:['coreComputeTitle','coreComputeText'],
  world:['coreWorldTitle','coreWorldText']
};

const ARCH_KEYS={
  identity:['01','archIdentityTitle','archIdentityText'],
  memory:['02','archMemoryTitle','archMemoryText'],
  reasoning:['03','archReasoningTitle','archReasoningText'],
  agents:['04','archAgentsTitle','archAgentsText'],
  tools:['05','archToolsTitle','archToolsText'],
  compute:['06','archComputeTitle','archComputeText']
};

let lang='pt';
let streamIndex=0;
let streamTimer=null;

function currentLang(){
  const candidate=
    window.Eureka?.lang?.() ||
    localStorage.getItem('eureka-lang') ||
    'pt';

  return I18N[candidate]
    ? candidate
    : 'pt';
}

function t(key){
  return I18N[lang]?.[key] ??
         I18N.pt[key] ??
         key;
}

function translate(){
  lang=currentLang();

  $$('[data-ai]').forEach(el=>{
    const key=el.dataset.ai;
    const value=t(key);

    if(value!=null){
      el.textContent=value;
    }
  });

  const input=$('#eurekaDemoName');
  if(input){
    input.placeholder='Eureka';
  }

  refreshPermissionLabels();
}

function refreshPermissionLabels(){
  $$('.permission-toggle').forEach(btn=>{
    const on=btn.getAttribute('aria-pressed')==='true';
    const small=$('small',btn);

    if(small){
      small.textContent=
        on
          ? t('permissionOn')
          : t('permissionOff');
    }
  });
}

function setupNeuralCore(){
  const core=$('#neuralCore');
  const detail=$('#coreDetail');

  if(!core || !detail) return;

  const title=$('b',detail);
  const text=$('span',detail);

  $$('[data-core]',core).forEach(btn=>{
    btn.addEventListener('click',()=>{
      const pair=CORE_KEYS[btn.dataset.core];
      if(!pair) return;

      title.textContent=t(pair[0]);
      text.textContent=t(pair[1]);
    });
  });

  if(
    matchMedia('(pointer:fine)').matches &&
    !matchMedia('(prefers-reduced-motion:reduce)').matches
  ){
    core.addEventListener('pointermove',event=>{
      const box=core.getBoundingClientRect();

      const x=
        (event.clientX-box.left)/box.width-.5;

      const y=
        (event.clientY-box.top)/box.height-.5;

      core.style.transform=
        `perspective(900px)
         rotateX(${-y*4}deg)
         rotateY(${x*5}deg)`;
    });

    core.addEventListener('pointerleave',()=>{
      core.style.transform='';
    });
  }
}

function selectedText(select){
  return select?.selectedOptions?.[0]?.textContent?.trim() || '';
}

function setupIdentity(){
  const button=$('#shapeEurekaBtn');
  if(!button) return;

  button.addEventListener('click',()=>{
    const name=
      ($('#eurekaDemoName')?.value || 'Eureka')
        .trim()
        .slice(0,28) ||
      'Eureka';

    const role=
      selectedText($('#eurekaDemoRole'));

    const personality=
      selectedText($('#eurekaDemoPersonality'));

    const style=
      selectedText($('#eurekaDemoStyle'));

    const pattern=t('identityPattern');

    const profile=pattern
      .replace('{name}',name)
      .replace('{role}',role)
      .replace('{personality}',personality)
      .replace('{style}',style);

    const identityName=$('#identityName');
    const identityProfile=$('#identityProfile');
    const avatar=$('.identity-avatar span');

    if(identityName){
      identityName.textContent=name;
    }

    if(identityProfile){
      identityProfile.textContent=profile;
    }

    if(avatar){
      avatar.textContent=
        name.charAt(0).toUpperCase() || 'E';
    }

    try{
      sessionStorage.setItem(
        'eureka-demo-identity',
        JSON.stringify({
          name,
          role,
          personality,
          style
        })
      );
    }catch{}
  });
}

function setupPermissions(){
  $$('.permission-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const current=
        btn.getAttribute('aria-pressed')==='true';

      btn.setAttribute(
        'aria-pressed',
        String(!current)
      );

      refreshPermissionLabels();
    });
  });
}

function setupArchitecture(){
  const detail=$('#architectureDetail');
  if(!detail) return;

  const number=$(':scope > span',detail);
  const title=$('b',detail);
  const text=$('p',detail);

  $$('[data-arch]').forEach(btn=>{
    btn.addEventListener('click',()=>{

      $$('[data-arch]')
        .forEach(n=>n.classList.remove('active'));

      btn.classList.add('active');

      const item=
        ARCH_KEYS[btn.dataset.arch];

      if(!item) return;

      if(number){
        number.textContent=item[0];
      }

      if(title){
        title.textContent=t(item[1]);
      }

      if(text){
        text.textContent=t(item[2]);
      }
    });
  });
}

function setupStream(){
  const rows=$$('.stream-row');

  if(!rows.length) return;

  if(
    matchMedia('(prefers-reduced-motion:reduce)').matches
  ){
    return;
  }

  const tick=()=>{
    rows.forEach(
      row=>row.classList.remove('stream-active')
    );

    rows[streamIndex % rows.length]
      .classList.add('stream-active');

    streamIndex++;
  };

  streamTimer=setInterval(tick,1500);
}

function restoreDemoIdentity(){
  try{
    const raw=
      sessionStorage.getItem(
        'eureka-demo-identity'
      );

    if(!raw) return;

    const data=JSON.parse(raw);

    const name=$('#eurekaDemoName');

    if(name && data.name){
      name.value=data.name;
    }
  }catch{}
}

addEventListener('eureka:language',event=>{
  if(I18N[event.detail?.lang]){
    lang=event.detail.lang;
  }else{
    lang='pt';
  }

  $$('[data-ai]').forEach(el=>{
    const value=t(el.dataset.ai);

    if(value!=null){
      el.textContent=value;
    }
  });

  refreshPermissionLabels();
});

translate();
restoreDemoIdentity();
setupNeuralCore();
setupIdentity();
setupPermissions();
setupArchitecture();
setupStream();

})();
