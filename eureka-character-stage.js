(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const PROFILE_KEY='eureka-live-profile-v3';
const STAGE_KEY='eureka-character-stage-v1';

const TEXT={

pt:{
  title:'A TUA EUREKA',
  subtitle:'A personagem que imaginas vai aparecer aqui.',
  waiting:'PREVIEW VISUAL',
  engine:'GERAÇÃO FOTOREALISTA · MOTOR A LIGAR',
  generated:'PERSONAGEM GERADA',
  confirmed:'IDENTIDADE CONFIRMADA',

  name:'NOME',
  presentation:'APRESENTAÇÃO',
  age:'IDADE',
  role:'PAPEL',
  personality:'PERSONALIDADE',
  style:'ESTILO',

  years:'anos',

  instruction:
    'Altera as opções do lado direito. O perfil visual atualiza em tempo real. Quando ligarmos o motor de imagem, esta área será substituída pela personagem fotorealista criada a partir das tuas escolhas.',

  code:'CÓDIGO EUREKA',
  noCode:'EKA-••••-••••-••••',

  generate:'GERAR A MINHA PERSONAGEM',
  regenerate:'GERAR OUTRA',
  confirm:'É ESTA A MINHA EUREKA',

  pending:
    'Motor de geração ainda não ligado.',

  canonical:
    'Esta imagem será a referência visual permanente da tua Eureka.'
},

en:{
  title:'YOUR EUREKA',
  subtitle:'The character you imagine will appear here.',
  waiting:'VISUAL PREVIEW',
  engine:'PHOTOREALISTIC GENERATION · ENGINE TO BE CONNECTED',
  generated:'CHARACTER GENERATED',
  confirmed:'IDENTITY CONFIRMED',

  name:'NAME',
  presentation:'PRESENTATION',
  age:'AGE',
  role:'ROLE',
  personality:'PERSONALITY',
  style:'STYLE',

  years:'years',

  instruction:
    'Change the options on the right. The visual profile updates in real time. Once the image engine is connected, this area will be replaced by the photorealistic character generated from your choices.',

  code:'EUREKA CODE',
  noCode:'EKA-••••-••••-••••',

  generate:'GENERATE MY CHARACTER',
  regenerate:'GENERATE ANOTHER',
  confirm:'THIS IS MY EUREKA',

  pending:
    'Image generation engine is not connected yet.',

  canonical:
    'This image will become the permanent visual reference for your Eureka.'
}

};

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

function optionText(selector){
  return $(selector)
    ?.selectedOptions?.[0]
    ?.textContent
    ?.trim() || '';
}

function value(selector){
  return $(selector)?.value?.trim() || '';
}

function getProfile(){

  let stored=null;

  try{
    const raw=
      localStorage.getItem(PROFILE_KEY);

    stored=
      raw ? JSON.parse(raw) : null;
  }
  catch{}

  const genderSelect=
    $('#eurekaDemoGender');

  let gender=
    optionText('#eurekaDemoGender');

  if(
    genderSelect?.value==='custom'
  ){
    gender=
      value('#eurekaCustomGender') ||
      gender;
  }

  const roleSelect=
    $('#eurekaDemoRole');

  let role=
    optionText('#eurekaDemoRole');

  if(
    roleSelect?.value==='custom'
  ){
    role=
      value('#eurekaCustomRole') ||
      role;
  }

  const personalitySelect=
    $('#eurekaDemoPersonality');

  let personality=
    optionText('#eurekaDemoPersonality');

  if(
    personalitySelect?.value==='custom'
  ){
    personality=
      value('#eurekaCustomPersonality') ||
      personality;
  }

  const styleSelect=
    $('#eurekaDemoStyle');

  let style=
    optionText('#eurekaDemoStyle');

  if(
    styleSelect?.value==='custom'
  ){
    style=
      value('#eurekaCustomStyle') ||
      style;
  }

  return {

    name:
      value('#eurekaDemoName') ||
      stored?.name ||
      'Eureka',

    gender:
      gender ||
      stored?.gender ||
      '—',

    age:
      value('#eurekaDemoAge') ||
      stored?.age ||
      '—',

    role:
      role ||
      stored?.role ||
      '—',

    personality:
      personality ||
      stored?.personality ||
      '—',

    style:
      style ||
      stored?.style ||
      '—',

    appearance:
      value('#eurekaDemoAppearance') ||
      stored?.appearance ||
      '',

    vision:
      value('#eurekaDemoVision') ||
      stored?.vision ||
      ''

  };
}


function findLeftPanel(){

  const shape=
    $('.shape-card');

  if(!shape){
    return null;
  }

  /*
   * Current LIVE AI layout:
   * left technological panel + right Shape Your Eureka panel.
   */
  if(
    shape.previousElementSibling
  ){
    return shape.previousElementSibling;
  }

  const parent=
    shape.parentElement;

  if(
    parent?.previousElementSibling
  ){
    return parent.previousElementSibling;
  }

  return null;
}


function build(){

  if(
    $('#eurekaCharacterStage')
  ){
    return;
  }

  const left=
    findLeftPanel();

  if(!left){
    console.warn(
      'Eureka Character Stage: left panel not found.'
    );
    return;
  }

  left.classList.add(
    'eureka-stage-host'
  );

  const stage=
    document.createElement('div');

  stage.id=
    'eurekaCharacterStage';

  stage.className=
    'eureka-character-stage';

  stage.innerHTML=`

    <div class="eureka-stage-head">

      <div>

        <span class="eyebrow"
              data-stage-i18n="title">
          ${t('title')}
        </span>

        <h3 id="eurekaStageName">
          Eureka
        </h3>

      </div>

      <span id="eurekaStageStatus"
            class="eureka-stage-status"
            data-stage-i18n="waiting">
        ${t('waiting')}
      </span>

    </div>


    <div class="eureka-stage-portrait">

      <img id="eurekaStageImage"
           src="assets/eureka-hero-2026.png"
           alt="Eureka character preview">

      <div id="eurekaStagePlaceholder"
           class="eureka-stage-placeholder">

        <div class="eureka-stage-scanner"></div>

        <div class="eureka-stage-placeholder-copy">

          <span data-stage-i18n="engine">
            ${t('engine')}
          </span>

          <b data-stage-i18n="subtitle">
            ${t('subtitle')}
          </b>

        </div>

      </div>


      <div class="eureka-stage-hud hud-top-left">
        <span>IDENTITY / 01</span>
      </div>

      <div class="eureka-stage-hud hud-top-right">
        <span>VISUAL / LIVE</span>
      </div>

    </div>


    <div class="eureka-stage-profile">

      <div>
        <span data-stage-i18n="presentation">
          ${t('presentation')}
        </span>
        <b id="stageGender">—</b>
      </div>

      <div>
        <span data-stage-i18n="age">
          ${t('age')}
        </span>
        <b id="stageAge">—</b>
      </div>

      <div>
        <span data-stage-i18n="role">
          ${t('role')}
        </span>
        <b id="stageRole">—</b>
      </div>

      <div>
        <span data-stage-i18n="personality">
          ${t('personality')}
        </span>
        <b id="stagePersonality">—</b>
      </div>

      <div class="wide">
        <span data-stage-i18n="style">
          ${t('style')}
        </span>
        <b id="stageStyle">—</b>
      </div>

    </div>


    <div class="eureka-stage-code">

      <span data-stage-i18n="code">
        ${t('code')}
      </span>

      <strong id="eurekaStageCode">
        ${t('noCode')}
      </strong>

    </div>


    <p class="eureka-stage-info"
       data-stage-i18n="instruction">
      ${t('instruction')}
    </p>


    <div class="eureka-stage-actions">

      <button id="eurekaStageGenerate"
              class="btn"
              type="button"
              data-stage-i18n="generate">
        ${t('generate')}
      </button>

      <button id="eurekaStageConfirm"
              class="btn ghost"
              type="button"
              data-stage-i18n="confirm"
              hidden>
        ${t('confirm')}
      </button>

    </div>


    <div id="eurekaStageMessage"
         class="eureka-stage-message"
         aria-live="polite">
    </div>

  `;

  left.appendChild(stage);

  bind();
  translate();
  update();
  restoreStage();
}


function update(){

  const profile=
    getProfile();

  const name=
    $('#eurekaStageName');

  if(name){
    name.textContent=
      profile.name;
  }

  const gender=
    $('#stageGender');

  if(gender){
    gender.textContent=
      profile.gender || '—';
  }

  const age=
    $('#stageAge');

  if(age){
    age.textContent=
      profile.age !== '—'
        ? `${profile.age} ${t('years')}`
        : '—';
  }

  const role=
    $('#stageRole');

  if(role){
    role.textContent=
      profile.role || '—';
  }

  const personality=
    $('#stagePersonality');

  if(personality){
    personality.textContent=
      profile.personality || '—';
  }

  const style=
    $('#stageStyle');

  if(style){
    style.textContent=
      profile.style || '—';
  }
}


function translate(){

  $$('[data-stage-i18n]')
    .forEach(el=>{

      const key=
        el.dataset.stageI18n;

      if(
        TEXT[lang()][key]
      ){
        el.textContent=
          t(key);
      }
    });

  update();
}


function stageState(){

  try{
    return JSON.parse(
      localStorage.getItem(STAGE_KEY) ||
      'null'
    );
  }
  catch{
    return null;
  }
}


function saveStage(
  state
){
  localStorage.setItem(
    STAGE_KEY,
    JSON.stringify(state)
  );
}


function setGenerated({
  imageUrl,
  code='',
  confirmed=false
}={}){

  if(!imageUrl){
    return;
  }

  const image=
    $('#eurekaStageImage');

  const placeholder=
    $('#eurekaStagePlaceholder');

  const status=
    $('#eurekaStageStatus');

  const codeEl=
    $('#eurekaStageCode');

  const confirm=
    $('#eurekaStageConfirm');

  const generate=
    $('#eurekaStageGenerate');

  if(image){
    image.src=imageUrl;
    image.classList.add(
      'generated'
    );
  }

  if(placeholder){
    placeholder.hidden=true;
  }

  if(status){
    status.textContent=
      confirmed
        ? t('confirmed')
        : t('generated');

    status.classList.add(
      'ready'
    );
  }

  if(codeEl){
    codeEl.textContent=
      code || t('noCode');
  }

  if(confirm){
    confirm.hidden=
      confirmed;
  }

  if(generate){
    generate.textContent=
      confirmed
        ? t('regenerate')
        : t('regenerate');
  }

  saveStage({
    imageUrl,
    code,
    confirmed
  });
}


function clearGenerated(){

  localStorage.removeItem(
    STAGE_KEY
  );

  const image=
    $('#eurekaStageImage');

  const placeholder=
    $('#eurekaStagePlaceholder');

  const status=
    $('#eurekaStageStatus');

  const code=
    $('#eurekaStageCode');

  const confirm=
    $('#eurekaStageConfirm');

  const generate=
    $('#eurekaStageGenerate');

  if(image){
    image.src=
      'assets/eureka-hero-2026.png';

    image.classList.remove(
      'generated'
    );
  }

  if(placeholder){
    placeholder.hidden=false;
  }

  if(status){
    status.textContent=
      t('waiting');

    status.classList.remove(
      'ready'
    );
  }

  if(code){
    code.textContent=
      t('noCode');
  }

  if(confirm){
    confirm.hidden=true;
  }

  if(generate){
    generate.textContent=
      t('generate');
  }
}


function restoreStage(){

  const state=
    stageState();

  if(
    state?.imageUrl
  ){
    setGenerated(state);
  }
}


function generationPending(){

  const message=
    $('#eurekaStageMessage');

  if(message){

    message.innerHTML=`
      <b>${t('pending')}</b>
      <span>
        ${
          lang()==='pt'
            ? 'O palco já está preparado. No próximo passo ligamos este botão ao Eureka Identity Service.'
            : 'The stage is ready. Next we connect this button to the Eureka Identity Service.'
        }
      </span>
    `;
  }
}


function confirmIdentity(){

  const state=
    stageState();

  if(
    !state?.imageUrl
  ){
    return;
  }

  state.confirmed=true;

  saveStage(state);

  setGenerated(state);

  const message=
    $('#eurekaStageMessage');

  if(message){

    message.innerHTML=`
      <b>${t('confirmed')}</b>
      <span>${t('canonical')}</span>
    `;
  }
}


function bind(){

  const section=
    $('#ai-experience');

  section?.addEventListener(
    'input',
    update
  );

  section?.addEventListener(
    'change',
    update
  );


  $('#eurekaStageGenerate')
    ?.addEventListener(
      'click',
      generationPending
    );


  $('#eurekaStageConfirm')
    ?.addEventListener(
      'click',
      confirmIdentity
    );


  window.addEventListener(
    'eureka:language',
    translate
  );
}


/*
 * Integration contract for the real image engine.
 *
 * Later, after:
 * POST /v1/eureka/identity/generate
 *
 * the frontend only needs:
 *
 * EurekaCharacterStage.setGenerated({
 *   imageUrl: "...",
 *   code: "EKA-XXXX-XXXX-XXXX"
 * });
 */
window.EurekaCharacterStage={
  update,
  setGenerated,
  clearGenerated
};


build();

})();
