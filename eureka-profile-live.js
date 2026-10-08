(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const STORAGE_KEY='eureka-live-profile-v3';

const TEXT={

pt:{
  sectionTitle:'CRIA A TUA EUREKA',
  sectionLead:'Define quem ela é, como fala, o que pode fazer e quais são os seus limites.',

  gender:'Género / apresentação',
  female:'Feminino',
  male:'Masculino',
  nonbinary:'Não binário',
  custom:'Personalizado',
  customGender:'Define a apresentação',
  customGenderPlaceholder:'Ex.: masculino, feminino, androginia, personagem própria…',

  age:'Idade aparente',
  ageHint:'Apenas perfis adultos · 18+',

  voice:'Voz',
  voiceAuto:'Automática do sistema',
  voicePreview:'OUVIR VOZ',
  voiceUnsupported:'A síntese de voz não é suportada neste browser.',
  voiceText:'Olá. Eu sou a tua Eureka. Esta é apenas uma demonstração da minha voz.',

  role:'Papel',
  roleCustom:'Outro / Personalizado',
  customRole:'Define o papel',
  customRolePlaceholder:'Ex.: assistente, engenheiro, parceiro de projeto, treinador, investigador…',

  personality:'Personalidade',
  personalityCustom:'Outra / Personalizada',
  customPersonality:'Define a personalidade',
  customPersonalityPlaceholder:'Ex.: divertida, curiosa, protetora, exigente, direta, calma…',

  style:'Estilo',
  styleCustom:'Outro / Personalizado',
  customStyle:'Define o estilo',
  customStylePlaceholder:'Ex.: elegante, futurista, executivo, cyberpunk, clássico…',

  capabilities:'Capacidades',
  capabilitiesLead:'Escolhe todas as capacidades que queres associar ao teu perfil Eureka.',

  capMemory:'Memória',
  capVoice:'Voz',
  capVision:'Visão autorizada',
  capWeb:'Pesquisa web',
  capFiles:'Ficheiros',
  capApps:'Aplicações',
  capPlanning:'Planeamento',
  capCreative:'Criatividade',
  capCode:'Programação',
  capResearch:'Investigação',
  capAutomation:'Automação',
  capMarkets:'Análise de mercados',

  customCapabilities:'Outras capacidades',
  customCapabilitiesPlaceholder:'Escreve qualquer outra capacidade que gostarias de associar à tua Eureka…',

  goals:'Objetivos da Eureka',
  goalsPlaceholder:'O que queres que a tua Eureka te ajude a alcançar?',

  boundaries:'Limites e regras',
  boundariesPlaceholder:'Define coisas que nunca deve fazer, decisões que exigem confirmação, limites de privacidade, etc.',

  autonomy:'Nível de autonomia',
  autonomy0:'Manual',
  autonomy1:'Assistida',
  autonomy2:'Proativa',
  autonomy3:'Alta autonomia com confirmação',

  appearance:'Aparência',
  appearancePlaceholder:'Descreve a aparência que imaginas para a tua Eureka…',

  vision:'Quem queres que a tua Eureka seja?',
  visionPlaceholder:'Escreve livremente a identidade, comportamento, forma de falar, interesses e relação que queres construir com a tua Eureka.',

  create:'CRIAR A MINHA EUREKA',
  update:'ATUALIZAR A MINHA EUREKA',
  clear:'LIMPAR PERFIL',
  export:'EXPORTAR PERFIL',
  copy:'COPIAR PERFIL',

  created:'PERFIL EUREKA CRIADO',
  updated:'PERFIL EUREKA ATUALIZADO',
  localOnly:'Guardado apenas neste dispositivo.',
  localId:'ID LOCAL',
  copied:'Perfil copiado.',
  cleared:'Perfil local eliminado.',

  previewTitle:'IDENTIDADE DIGITAL',
  previewEmpty:'Define a tua Eureka e carrega em Criar.',
  years:'anos',

  autonomyLabel0:'Manual',
  autonomyLabel1:'Assistida',
  autonomyLabel2:'Proativa',
  autonomyLabel3:'Alta autonomia com confirmação',

  freedomTitle:'TU DEFINES A EUREKA',
  freedomText:'As opções existentes são apenas atalhos. Os campos livres permitem criar uma identidade fora das opções predefinidas.'
},

en:{
  sectionTitle:'CREATE YOUR EUREKA',
  sectionLead:'Define who Eureka is, how Eureka speaks, what it can do and where its limits are.',

  gender:'Gender / presentation',
  female:'Female',
  male:'Male',
  nonbinary:'Non-binary',
  custom:'Custom',
  customGender:'Define presentation',
  customGenderPlaceholder:'E.g. masculine, feminine, androgynous, original character…',

  age:'Apparent age',
  ageHint:'Adult profiles only · 18+',

  voice:'Voice',
  voiceAuto:'Automatic system voice',
  voicePreview:'PREVIEW VOICE',
  voiceUnsupported:'Speech synthesis is not supported by this browser.',
  voiceText:'Hello. I am your Eureka. This is only a demonstration of my voice.',

  role:'Role',
  roleCustom:'Other / Custom',
  customRole:'Define the role',
  customRolePlaceholder:'E.g. assistant, engineer, project partner, coach, researcher…',

  personality:'Personality',
  personalityCustom:'Other / Custom',
  customPersonality:'Define personality',
  customPersonalityPlaceholder:'E.g. funny, curious, protective, demanding, direct, calm…',

  style:'Style',
  styleCustom:'Other / Custom',
  customStyle:'Define style',
  customStylePlaceholder:'E.g. elegant, futuristic, executive, cyberpunk, classic…',

  capabilities:'Capabilities',
  capabilitiesLead:'Select every capability you want associated with your Eureka profile.',

  capMemory:'Memory',
  capVoice:'Voice',
  capVision:'Permissioned vision',
  capWeb:'Web research',
  capFiles:'Files',
  capApps:'Applications',
  capPlanning:'Planning',
  capCreative:'Creativity',
  capCode:'Coding',
  capResearch:'Research',
  capAutomation:'Automation',
  capMarkets:'Market analysis',

  customCapabilities:'Other capabilities',
  customCapabilitiesPlaceholder:'Write any other capability you would like to associate with your Eureka…',

  goals:'Eureka goals',
  goalsPlaceholder:'What do you want your Eureka to help you achieve?',

  boundaries:'Limits and rules',
  boundariesPlaceholder:'Define things it should never do, decisions requiring confirmation, privacy boundaries, etc.',

  autonomy:'Autonomy level',
  autonomy0:'Manual',
  autonomy1:'Assisted',
  autonomy2:'Proactive',
  autonomy3:'High autonomy with confirmation',

  appearance:'Appearance',
  appearancePlaceholder:'Describe the appearance you imagine for your Eureka…',

  vision:'Who do you want your Eureka to be?',
  visionPlaceholder:'Freely describe the identity, behaviour, way of speaking, interests and relationship you want to build with Eureka.',

  create:'CREATE MY EUREKA',
  update:'UPDATE MY EUREKA',
  clear:'CLEAR PROFILE',
  export:'EXPORT PROFILE',
  copy:'COPY PROFILE',

  created:'EUREKA PROFILE CREATED',
  updated:'EUREKA PROFILE UPDATED',
  localOnly:'Stored only on this device.',
  localId:'LOCAL ID',
  copied:'Profile copied.',
  cleared:'Local profile deleted.',

  previewTitle:'DIGITAL IDENTITY',
  previewEmpty:'Define your Eureka and press Create.',
  years:'years',

  autonomyLabel0:'Manual',
  autonomyLabel1:'Assisted',
  autonomyLabel2:'Proactive',
  autonomyLabel3:'High autonomy with confirmation',

  freedomTitle:'YOU DEFINE EUREKA',
  freedomText:'Existing options are only shortcuts. Free-text fields allow you to create an identity beyond the predefined choices.'
}

};

const CAPABILITIES=[
  ['memory','capMemory'],
  ['voice','capVoice'],
  ['vision','capVision'],
  ['web','capWeb'],
  ['files','capFiles'],
  ['apps','capApps'],
  ['planning','capPlanning'],
  ['creative','capCreative'],
  ['code','capCode'],
  ['research','capResearch'],
  ['automation','capAutomation'],
  ['markets','capMarkets']
];

function lang(){
  const value=
    window.Eureka?.lang?.() ||
    localStorage.getItem('eureka-lang') ||
    'pt';

  return value==='en'
    ? 'en'
    : 'pt';
}

function t(key){
  return TEXT[lang()][key] || key;
}

function getStored(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}

function save(profile){
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(profile)
  );
}

function createId(){
  if(
    window.crypto &&
    typeof crypto.randomUUID==='function'
  ){
    return 'EUR-'+
      crypto.randomUUID()
        .split('-')[0]
        .toUpperCase();
  }

  return 'EUR-'+
    Date.now()
      .toString(36)
      .toUpperCase();
}

function optionText(select){
  return select
    ?.selectedOptions?.[0]
    ?.textContent
    ?.trim() || '';
}

function resolveChoice(select,custom){
  if(!select) return '';

  if(select.value==='custom'){
    return custom?.value?.trim() ||
           optionText(select);
  }

  return optionText(select);
}

function ensureCustomOptions(){

  const definitions=[
    ['#eurekaDemoRole','roleCustom'],
    ['#eurekaDemoPersonality','personalityCustom'],
    ['#eurekaDemoStyle','styleCustom']
  ];

  definitions.forEach(([selector,key])=>{

    const select=$(selector);

    if(!select) return;

    if(
      !select.querySelector(
        'option[value="custom"]'
      )
    ){
      const option=
        document.createElement('option');

      option.value='custom';
      option.dataset.liveI18n=key;
      option.textContent=t(key);

      select.appendChild(option);
    }
  });
}

function capabilityHTML(){

  return CAPABILITIES.map(
    ([value,key])=>`

      <label class="eureka-capability">
        <input type="checkbox"
               value="${value}"
               data-capability>

        <span data-live-i18n="${key}">
          ${t(key)}
        </span>
      </label>

    `
  ).join('');
}

function build(){

  const card=$('.shape-card');
  const grid=$('.shape-card .ai-form-grid');
  const createBtn=$('#shapeEurekaBtn');

  if(!card || !grid || !createBtn) return;

  ensureCustomOptions();

  if($('#eurekaProfileV3')){
    translate();
    restore();
    return;
  }

  const block=document.createElement('div');

  block.id='eurekaProfileV3';
  block.className='eureka-profile-v3';

  block.innerHTML=`

    <div class="eureka-profile-v3-head">
      <span class="eyebrow"
            data-live-i18n="sectionTitle">
        ${t('sectionTitle')}
      </span>

      <p data-live-i18n="sectionLead">
        ${t('sectionLead')}
      </p>
    </div>


    <div class="ai-form-grid">

      <label class="ai-field">

        <span data-live-i18n="gender">
          ${t('gender')}
        </span>

        <select id="eurekaDemoGender">

          <option value="female"
                  data-live-i18n="female">
            ${t('female')}
          </option>

          <option value="male"
                  data-live-i18n="male">
            ${t('male')}
          </option>

          <option value="nonbinary"
                  data-live-i18n="nonbinary">
            ${t('nonbinary')}
          </option>

          <option value="custom"
                  data-live-i18n="custom">
            ${t('custom')}
          </option>

        </select>

      </label>


      <label class="ai-field">

        <span data-live-i18n="age">
          ${t('age')}
        </span>

        <input id="eurekaDemoAge"
               type="number"
               min="18"
               max="120"
               value="28"
               inputmode="numeric">

        <small class="field-hint"
               data-live-i18n="ageHint">
          ${t('ageHint')}
        </small>

      </label>


      <label id="customGenderWrap"
             class="ai-field ai-field-wide"
             hidden>

        <span data-live-i18n="customGender">
          ${t('customGender')}
        </span>

        <input id="eurekaCustomGender"
               type="text"
               maxlength="100"
               autocomplete="off"
               data-live-placeholder="customGenderPlaceholder">

      </label>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="voice">
          ${t('voice')}
        </span>

        <div class="eureka-voice-row">

          <select id="eurekaDemoVoice">
            <option value="">
              ${t('voiceAuto')}
            </option>
          </select>

          <button id="eurekaVoicePreview"
                  class="btn mini ghost"
                  type="button"
                  data-live-i18n="voicePreview">
            ${t('voicePreview')}
          </button>

        </div>

      </label>


      <label id="customRoleWrap"
             class="ai-field ai-field-wide"
             hidden>

        <span data-live-i18n="customRole">
          ${t('customRole')}
        </span>

        <input id="eurekaCustomRole"
               type="text"
               maxlength="100"
               autocomplete="off"
               data-live-placeholder="customRolePlaceholder">

      </label>


      <label id="customPersonalityWrap"
             class="ai-field ai-field-wide"
             hidden>

        <span data-live-i18n="customPersonality">
          ${t('customPersonality')}
        </span>

        <input id="eurekaCustomPersonality"
               type="text"
               maxlength="120"
               autocomplete="off"
               data-live-placeholder="customPersonalityPlaceholder">

      </label>


      <label id="customStyleWrap"
             class="ai-field ai-field-wide"
             hidden>

        <span data-live-i18n="customStyle">
          ${t('customStyle')}
        </span>

        <input id="eurekaCustomStyle"
               type="text"
               maxlength="120"
               autocomplete="off"
               data-live-placeholder="customStylePlaceholder">

      </label>


      <div class="ai-field ai-field-wide">

        <span data-live-i18n="capabilities">
          ${t('capabilities')}
        </span>

        <small class="field-hint"
               data-live-i18n="capabilitiesLead">
          ${t('capabilitiesLead')}
        </small>

        <div class="eureka-capability-grid">
          ${capabilityHTML()}
        </div>

      </div>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="customCapabilities">
          ${t('customCapabilities')}
        </span>

        <textarea id="eurekaCustomCapabilities"
                  rows="3"
                  maxlength="400"
                  data-live-placeholder="customCapabilitiesPlaceholder"></textarea>

      </label>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="goals">
          ${t('goals')}
        </span>

        <textarea id="eurekaDemoGoals"
                  rows="4"
                  maxlength="600"
                  data-live-placeholder="goalsPlaceholder"></textarea>

      </label>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="boundaries">
          ${t('boundaries')}
        </span>

        <textarea id="eurekaDemoBoundaries"
                  rows="4"
                  maxlength="600"
                  data-live-placeholder="boundariesPlaceholder"></textarea>

      </label>


      <div class="ai-field ai-field-wide">

        <span data-live-i18n="autonomy">
          ${t('autonomy')}
        </span>

        <input id="eurekaDemoAutonomy"
               type="range"
               min="0"
               max="3"
               step="1"
               value="1">

        <div class="eureka-autonomy-scale">
          <span data-live-i18n="autonomy0">${t('autonomy0')}</span>
          <span data-live-i18n="autonomy1">${t('autonomy1')}</span>
          <span data-live-i18n="autonomy2">${t('autonomy2')}</span>
          <span data-live-i18n="autonomy3">${t('autonomy3')}</span>
        </div>

        <b id="eurekaAutonomyValue">
          ${t('autonomyLabel1')}
        </b>

      </div>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="appearance">
          ${t('appearance')}
        </span>

        <input id="eurekaDemoAppearance"
               type="text"
               maxlength="220"
               autocomplete="off"
               data-live-placeholder="appearancePlaceholder">

      </label>


      <label class="ai-field ai-field-wide">

        <span data-live-i18n="vision">
          ${t('vision')}
        </span>

        <textarea id="eurekaDemoVision"
                  rows="6"
                  maxlength="1000"
                  data-live-placeholder="visionPlaceholder"></textarea>

      </label>


      <div class="eureka-freedom-note ai-field-wide">

        <b data-live-i18n="freedomTitle">
          ${t('freedomTitle')}
        </b>

        <span data-live-i18n="freedomText">
          ${t('freedomText')}
        </span>

      </div>

    </div>

  `;

  createBtn
    .parentNode
    .insertBefore(
      block,
      createBtn
    );


  createBtn.dataset.liveI18n='create';


  const actions=document.createElement('div');

  actions.className='eureka-profile-actions';

  actions.innerHTML=`

    <button id="clearEurekaProfile"
            class="btn ghost"
            type="button"
            data-live-i18n="clear">
      ${t('clear')}
    </button>

    <button id="copyEurekaProfile"
            class="btn ghost"
            type="button"
            data-live-i18n="copy">
      ${t('copy')}
    </button>

    <button id="exportEurekaProfile"
            class="btn ghost"
            type="button"
            data-live-i18n="export">
      ${t('export')}
    </button>

  `;

  createBtn.insertAdjacentElement(
    'afterend',
    actions
  );


  const preview=$('#eurekaIdentityPreview');

  if(preview){

    if(!$('#eurekaLiveProfileMeta')){

      const meta=document.createElement('div');

      meta.id='eurekaLiveProfileMeta';
      meta.className='eureka-profile-meta';

      preview.appendChild(meta);
    }

    if(!$('#eurekaLiveProfileDetail')){

      const detail=document.createElement('div');

      detail.id='eurekaLiveProfileDetail';
      detail.className='eureka-profile-detail';

      preview.appendChild(detail);
    }
  }


  const status=document.createElement('div');

  status.id='eurekaLiveStatus';
  status.className='eureka-create-status';
  status.setAttribute(
    'aria-live',
    'polite'
  );

  actions.insertAdjacentElement(
    'afterend',
    status
  );


  bind();
  populateVoices();
  translate();
  updateVisibility();
  updateAutonomy();
  restore();
}


function populateVoices(){

  const select=$('#eurekaDemoVoice');

  if(!select) return;

  const previous=select.value;

  select.innerHTML=
    `<option value="">${t('voiceAuto')}</option>`;

  if(
    !('speechSynthesis' in window)
  ){
    return;
  }

  const voices=
    speechSynthesis.getVoices();

  voices.forEach((voice,index)=>{

    const option=
      document.createElement('option');

    option.value=String(index);
    option.textContent=
      `${voice.name} · ${voice.lang}`;

    select.appendChild(option);
  });

  if(
    [...select.options]
      .some(o=>o.value===previous)
  ){
    select.value=previous;
  }
}


function selectedCapabilities(){

  return $$('[data-capability]:checked')
    .map(input=>input.value);
}


function getCapabilityLabel(value){

  const found=
    CAPABILITIES.find(
      ([v])=>v===value
    );

  return found
    ? t(found[1])
    : value;
}


function updateVisibility(){

  const gender=$('#eurekaDemoGender');
  const role=$('#eurekaDemoRole');
  const personality=$('#eurekaDemoPersonality');
  const style=$('#eurekaDemoStyle');

  const customGender=$('#customGenderWrap');
  const customRole=$('#customRoleWrap');
  const customPersonality=$('#customPersonalityWrap');
  const customStyle=$('#customStyleWrap');

  if(customGender){
    customGender.hidden=
      gender?.value!=='custom';
  }

  if(customRole){
    customRole.hidden=
      role?.value!=='custom';
  }

  if(customPersonality){
    customPersonality.hidden=
      personality?.value!=='custom';
  }

  if(customStyle){
    customStyle.hidden=
      style?.value!=='custom';
  }
}


function updateAutonomy(){

  const range=$('#eurekaDemoAutonomy');
  const output=$('#eurekaAutonomyValue');

  if(!range || !output) return;

  output.textContent=
    t(
      'autonomyLabel'+
      range.value
    );
}


function collect(){

  const previous=getStored();

  let age=
    Number(
      $('#eurekaDemoAge')?.value || 28
    );

  if(!Number.isFinite(age)){
    age=28;
  }

  age=
    Math.max(
      18,
      Math.min(
        120,
        Math.round(age)
      )
    );

  const genderSelect=$('#eurekaDemoGender');

  const gender=
    genderSelect?.value==='custom'
      ? (
          $('#eurekaCustomGender')
            ?.value
            ?.trim() ||
          t('custom')
        )
      : optionText(genderSelect);


  return {

    id:
      previous?.id ||
      createId(),

    createdAt:
      previous?.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    name:
      (
        $('#eurekaDemoName')?.value ||
        'Eureka'
      )
      .trim()
      .slice(0,28) ||
      'Eureka',

    genderValue:
      genderSelect?.value ||
      'female',

    gender,

    customGender:
      $('#eurekaCustomGender')
        ?.value
        ?.trim() || '',

    age,

    voiceIndex:
      $('#eurekaDemoVoice')?.value || '',

    voiceName:
      optionText(
        $('#eurekaDemoVoice')
      ),

    roleValue:
      $('#eurekaDemoRole')?.value ||
      'companion',

    role:
      resolveChoice(
        $('#eurekaDemoRole'),
        $('#eurekaCustomRole')
      ),

    customRole:
      $('#eurekaCustomRole')
        ?.value
        ?.trim() || '',

    personalityValue:
      $('#eurekaDemoPersonality')
        ?.value ||
      'balanced',

    personality:
      resolveChoice(
        $('#eurekaDemoPersonality'),
        $('#eurekaCustomPersonality')
      ),

    customPersonality:
      $('#eurekaCustomPersonality')
        ?.value
        ?.trim() || '',

    styleValue:
      $('#eurekaDemoStyle')?.value ||
      'futuristic',

    style:
      resolveChoice(
        $('#eurekaDemoStyle'),
        $('#eurekaCustomStyle')
      ),

    customStyle:
      $('#eurekaCustomStyle')
        ?.value
        ?.trim() || '',

    capabilities:
      selectedCapabilities(),

    customCapabilities:
      $('#eurekaCustomCapabilities')
        ?.value
        ?.trim() || '',

    goals:
      $('#eurekaDemoGoals')
        ?.value
        ?.trim() || '',

    boundaries:
      $('#eurekaDemoBoundaries')
        ?.value
        ?.trim() || '',

    autonomy:
      Number(
        $('#eurekaDemoAutonomy')
          ?.value || 1
      ),

    appearance:
      $('#eurekaDemoAppearance')
        ?.value
        ?.trim() || '',

    vision:
      $('#eurekaDemoVision')
        ?.value
        ?.trim() || ''

  };
}


function render(profile){

  if(!profile) return;

  const name=$('#identityName');
  const description=$('#identityProfile');
  const avatar=$('.identity-avatar span');
  const meta=$('#eurekaLiveProfileMeta');
  const detail=$('#eurekaLiveProfileDetail');

  if(name){
    name.textContent=profile.name;
  }

  if(avatar){
    avatar.textContent=
      profile.name
        ?.charAt(0)
        ?.toUpperCase() ||
      'E';
  }

  if(description){

    description.textContent=
      `${profile.gender} · `+
      `${profile.age} ${t('years')} · `+
      `${profile.role} · `+
      `${profile.personality} · `+
      `${profile.style}`;
  }

  if(meta){

    const chips=[
      profile.gender,
      `${profile.age} ${t('years')}`,
      profile.role,
      profile.personality,
      profile.style,
      t(
        'autonomyLabel'+
        profile.autonomy
      )
    ];

    meta.innerHTML=
      chips
        .filter(Boolean)
        .map(
          value=>`<span>${escapeHtml(value)}</span>`
        )
        .join('');
  }

  if(detail){

    const caps=
      (profile.capabilities || [])
        .map(getCapabilityLabel);

    if(profile.customCapabilities){
      caps.push(
        profile.customCapabilities
      );
    }

    detail.innerHTML=`

      ${
        caps.length
          ? `<div>
               <b>${t('capabilities')}</b>
               <p>${escapeHtml(caps.join(' · '))}</p>
             </div>`
          : ''
      }

      ${
        profile.goals
          ? `<div>
               <b>${t('goals')}</b>
               <p>${escapeHtml(profile.goals)}</p>
             </div>`
          : ''
      }

      ${
        profile.boundaries
          ? `<div>
               <b>${t('boundaries')}</b>
               <p>${escapeHtml(profile.boundaries)}</p>
             </div>`
          : ''
      }

      ${
        profile.appearance
          ? `<div>
               <b>${t('appearance')}</b>
               <p>${escapeHtml(profile.appearance)}</p>
             </div>`
          : ''
      }

      ${
        profile.vision
          ? `<div>
               <b>${t('vision')}</b>
               <p>${escapeHtml(profile.vision)}</p>
             </div>`
          : ''
      }

    `;
  }

  const createBtn=$('#shapeEurekaBtn');

  if(createBtn){
    createBtn.textContent=
      t('update');
  }
}


function escapeHtml(value){

  return String(value ?? '')
    .replace(
      /[&<>"']/g,
      char=>({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":'&#39;'
      })[char]
    );
}


function create(){

  const previous=getStored();
  const profile=collect();

  save(profile);
  render(profile);

  const status=$('#eurekaLiveStatus');

  if(status){

    status.classList.add('created');

    status.innerHTML=`

      <b>
        ${previous ? t('updated') : t('created')}
      </b>

      <span>
        ${t('localId')} · ${escapeHtml(profile.id)}
      </span>

      <small>
        ${t('localOnly')}
      </small>

    `;
  }
}


function restore(){

  const profile=getStored();

  if(!profile) return;

  const set=(selector,value)=>{

    const el=$(selector);

    if(
      el &&
      value !== undefined &&
      value !== null
    ){
      el.value=value;
    }
  };

  set('#eurekaDemoName',profile.name);
  set('#eurekaDemoGender',profile.genderValue);
  set('#eurekaCustomGender',profile.customGender);
  set('#eurekaDemoAge',profile.age);
  set('#eurekaDemoRole',profile.roleValue);
  set('#eurekaCustomRole',profile.customRole);
  set('#eurekaDemoPersonality',profile.personalityValue);
  set('#eurekaCustomPersonality',profile.customPersonality);
  set('#eurekaDemoStyle',profile.styleValue);
  set('#eurekaCustomStyle',profile.customStyle);
  set('#eurekaCustomCapabilities',profile.customCapabilities);
  set('#eurekaDemoGoals',profile.goals);
  set('#eurekaDemoBoundaries',profile.boundaries);
  set('#eurekaDemoAutonomy',profile.autonomy);
  set('#eurekaDemoAppearance',profile.appearance);
  set('#eurekaDemoVision',profile.vision);

  $$('[data-capability]').forEach(input=>{
    input.checked=
      (profile.capabilities || [])
        .includes(input.value);
  });

  populateVoices();

  set(
    '#eurekaDemoVoice',
    profile.voiceIndex
  );

  updateVisibility();
  updateAutonomy();
  render(profile);

  const status=$('#eurekaLiveStatus');

  if(status){

    status.classList.add('created');

    status.innerHTML=`

      <b>${t('created')}</b>

      <span>
        ${t('localId')} · ${escapeHtml(profile.id)}
      </span>

      <small>
        ${t('localOnly')}
      </small>

    `;
  }
}


function clearProfile(){

  localStorage.removeItem(
    STORAGE_KEY
  );

  location.reload();
}


async function copyProfile(){

  const profile=getStored();

  if(!profile) return;

  try{

    await navigator.clipboard.writeText(
      JSON.stringify(
        profile,
        null,
        2
      )
    );

    const status=$('#eurekaLiveStatus');

    if(status){
      status.textContent=t('copied');
    }

  }catch{}
}


function exportProfile(){

  const profile=getStored();

  if(!profile) return;

  const blob=
    new Blob(
      [
        JSON.stringify(
          profile,
          null,
          2
        )
      ],
      {
        type:'application/json'
      }
    );

  const url=
    URL.createObjectURL(blob);

  const a=
    document.createElement('a');

  a.href=url;

  a.download=
    `eureka-profile-${profile.id}.json`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(
    ()=>URL.revokeObjectURL(url),
    1000
  );
}


function previewVoice(){

  if(
    !('speechSynthesis' in window)
  ){
    const status=$('#eurekaLiveStatus');

    if(status){
      status.textContent=
        t('voiceUnsupported');
    }

    return;
  }

  speechSynthesis.cancel();

  const utterance=
    new SpeechSynthesisUtterance(
      t('voiceText')
    );

  const voices=
    speechSynthesis.getVoices();

  const selected=
    $('#eurekaDemoVoice')?.value;

  if(
    selected !== '' &&
    voices[Number(selected)]
  ){
    utterance.voice=
      voices[Number(selected)];
  }

  utterance.lang=
    lang()==='pt'
      ? 'pt-PT'
      : 'en-GB';

  utterance.rate=.96;
  utterance.pitch=1;

  speechSynthesis.speak(
    utterance
  );
}


function bind(){

  $('#eurekaDemoGender')
    ?.addEventListener(
      'change',
      updateVisibility
    );

  $('#eurekaDemoRole')
    ?.addEventListener(
      'change',
      updateVisibility
    );

  $('#eurekaDemoPersonality')
    ?.addEventListener(
      'change',
      updateVisibility
    );

  $('#eurekaDemoStyle')
    ?.addEventListener(
      'change',
      updateVisibility
    );

  $('#eurekaDemoAutonomy')
    ?.addEventListener(
      'input',
      updateAutonomy
    );

  $('#eurekaVoicePreview')
    ?.addEventListener(
      'click',
      previewVoice
    );

  $('#clearEurekaProfile')
    ?.addEventListener(
      'click',
      clearProfile
    );

  $('#copyEurekaProfile')
    ?.addEventListener(
      'click',
      copyProfile
    );

  $('#exportEurekaProfile')
    ?.addEventListener(
      'click',
      exportProfile
    );


  /*
   * Capture phase overrides the old lightweight
   * Shape Your Eureka handler from ai-experience.js.
   */
  $('#shapeEurekaBtn')
    ?.addEventListener(
      'click',
      event=>{

        event.preventDefault();
        event.stopImmediatePropagation();

        create();

      },
      true
    );
}


function translate(){

  $$('[data-live-i18n]')
    .forEach(el=>{

      const key=
        el.dataset.liveI18n;

      const value=t(key);

      if(value){
        el.textContent=value;
      }
    });


  $$('[data-live-placeholder]')
    .forEach(el=>{

      const key=
        el.dataset.livePlaceholder;

      el.placeholder=
        t(key);
    });


  const createBtn=
    $('#shapeEurekaBtn');

  if(createBtn){

    createBtn.textContent=
      getStored()
        ? t('update')
        : t('create');
  }

  populateVoices();
  updateAutonomy();

  const profile=getStored();

  if(profile){
    render(profile);
  }
}


window.addEventListener(
  'eureka:language',
  ()=>{
    translate();
  }
);


if(
  'speechSynthesis' in window
){
  speechSynthesis.addEventListener?.(
    'voiceschanged',
    populateVoices
  );
}


build();

})();
