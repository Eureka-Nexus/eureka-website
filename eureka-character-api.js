(()=>{
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const DRAFT_KEY=
  'eureka-current-character-draft-v1';

const CONFIRMED_KEY=
  'eureka-confirmed-identity-code-v1';

const REQUEST_TIMEOUT=
  180000;


/* =========================================================
   API LOCATION

   LOCAL:
   http://127.0.0.1:8786

   PRODUCTION:
   /identity-api
   This will later be reverse-proxied on the Eureka server.
   ========================================================= */

const API_BASE=(()=>{

  const configured=
    window.EUREKA_CONFIG
      ?.identityServiceUrl;

  if(configured){
    return String(configured)
      .replace(/\/+$/,'');
  }

  if(
    location.hostname==='127.0.0.1' ||
    location.hostname==='localhost'
  ){
    return 'http://127.0.0.1:8786';
  }

  return '/identity-api';

})();


const TEXT={

pt:{
  generating:
    'A GERAR A TUA EUREKA…',

  generatingLead:
    'Estamos a transformar as tuas escolhas numa personagem fotorealista. Pode demorar alguns segundos.',

  generated:
    'PERSONAGEM CRIADA',

  generatedLead:
    'Esta é uma pré-visualização. Se não for exatamente como desejas, carrega em GERAR OUTRA. Nenhum código permanente foi criado ainda.',

  confirming:
    'A CONFIRMAR IDENTIDADE…',

  confirmed:
    'A TUA EUREKA FOI CONFIRMADA',

  confirmedLead:
    'Guarda este código. É a referência permanente desta personagem e será usado no futuro programa Eureka.',

  generateError:
    'Não foi possível gerar a personagem.',

  confirmError:
    'Não foi possível confirmar a identidade.',

  missingAppearance:
    'Descreve primeiro a aparência ou escreve como queres que a tua Eureka seja.',

  missingDraft:
    'Primeiro tens de gerar uma personagem.',

  engineOffline:
    'O motor fotorealista ainda não está configurado.',

  engineOfflineLead:
    'A ligação ao Eureka Identity está correta. Falta apenas ativar a chave privada do motor de imagem.',

  copied:
    'CÓDIGO COPIADO',

  copiedLead:
    'Guarda-o num local seguro para recuperares esta Eureka no futuro.',

  codeHint:
    'Clica no código para copiar.'
},

en:{
  generating:
    'GENERATING YOUR EUREKA…',

  generatingLead:
    'We are transforming your choices into a photorealistic character. This may take a few seconds.',

  generated:
    'CHARACTER CREATED',

  generatedLead:
    'This is a preview. If it is not exactly what you want, press GENERATE ANOTHER. No permanent code has been created yet.',

  confirming:
    'CONFIRMING IDENTITY…',

  confirmed:
    'YOUR EUREKA HAS BEEN CONFIRMED',

  confirmedLead:
    'Save this code. It is the permanent reference for this character and will be used by the future Eureka application.',

  generateError:
    'The character could not be generated.',

  confirmError:
    'The identity could not be confirmed.',

  missingAppearance:
    'First describe the appearance or write who you want your Eureka to be.',

  missingDraft:
    'You must generate a character first.',

  engineOffline:
    'The photorealistic engine is not configured yet.',

  engineOfflineLead:
    'The Eureka Identity connection is working. Only the private image-engine key still needs to be activated.',

  copied:
    'CODE COPIED',

  copiedLead:
    'Keep it somewhere safe so you can recover this Eureka in the future.',

  codeHint:
    'Click the code to copy.'
}

};


function lang(){

  const value=
    window.Eureka?.lang?.() ||
    localStorage.getItem(
      'eureka-lang'
    ) ||
    'pt';

  return value==='en'
    ? 'en'
    : 'pt';
}


function t(key){
  return TEXT[lang()][key] || key;
}


/* =========================================================
   UI
   ========================================================= */

function message(
  title,
  text,
  type=''
){

  const box=
    $('#eurekaStageMessage');

  if(!box) return;

  box.className=
    'eureka-stage-message '+
    (
      type
        ? `stage-${type}`
        : ''
    );

  box.innerHTML=`

    <b>
      ${escapeHtml(title)}
    </b>

    ${
      text
        ? `<span>${escapeHtml(text)}</span>`
        : ''
    }

  `;
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


function setBusy(
  busy,
  mode=''
){

  const generate=
    $('#eurekaStageGenerate');

  const confirm=
    $('#eurekaStageConfirm');

  if(generate){
    generate.disabled=busy;

    if(
      busy &&
      mode==='generate'
    ){
      generate.textContent=
        t('generating');
    }
  }

  if(confirm){
    confirm.disabled=busy;

    if(
      busy &&
      mode==='confirm'
    ){
      confirm.textContent=
        t('confirming');
    }
  }
}


/* =========================================================
   PROFILE COLLECTION
   ========================================================= */

function selectedText(selector){

  return $(selector)
    ?.selectedOptions?.[0]
    ?.textContent
    ?.trim() || '';
}


function inputValue(selector){

  return $(selector)
    ?.value
    ?.trim() || '';
}


function customChoice(
  selectSelector,
  customSelector
){

  const select=
    $(selectSelector);

  if(!select){
    return '';
  }

  if(
    select.value==='custom'
  ){
    return (
      inputValue(customSelector) ||
      selectedText(selectSelector)
    );
  }

  return selectedText(
    selectSelector
  );
}


function collectProfile(){

  const genderSelect=
    $('#eurekaDemoGender');

  let gender=
    selectedText(
      '#eurekaDemoGender'
    );

  if(
    genderSelect?.value==='custom'
  ){
    gender=
      inputValue(
        '#eurekaCustomGender'
      ) ||
      gender;
  }


  const capabilities=
    $$('[data-capability]:checked')
      .map(input=>input.value);


  let age=
    Number(
      $('#eurekaDemoAge')
        ?.value || 28
    );

  if(
    !Number.isFinite(age)
  ){
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


  return {

    name:
      inputValue(
        '#eurekaDemoName'
      ) ||
      'Eureka',

    age,

    gender,

    role:
      customChoice(
        '#eurekaDemoRole',
        '#eurekaCustomRole'
      ),

    personality:
      customChoice(
        '#eurekaDemoPersonality',
        '#eurekaCustomPersonality'
      ),

    style:
      customChoice(
        '#eurekaDemoStyle',
        '#eurekaCustomStyle'
      ),

    appearance:
      inputValue(
        '#eurekaDemoAppearance'
      ),

    vision:
      inputValue(
        '#eurekaDemoVision'
      ),

    goals:
      inputValue(
        '#eurekaDemoGoals'
      ),

    boundaries:
      inputValue(
        '#eurekaDemoBoundaries'
      ),

    customCapabilities:
      inputValue(
        '#eurekaCustomCapabilities'
      ),

    capabilities,

    autonomy:
      Number(
        $('#eurekaDemoAutonomy')
          ?.value || 1
      )

  };
}


/* =========================================================
   API
   ========================================================= */

function apiUrl(path){

  if(
    /^https?:\/\//i.test(path)
  ){
    return path;
  }

  let base;

  if(
    /^https?:\/\//i.test(
      API_BASE
    )
  ){
    base=API_BASE;
  }
  else{
    base=
      location.origin+
      (
        API_BASE.startsWith('/')
          ? API_BASE
          : '/'+API_BASE
      );
  }

  return (
    base.replace(/\/+$/,'')+
    (
      path.startsWith('/')
        ? path
        : '/'+path
    )
  );
}


async function fetchJson(
  path,
  options={}
){

  const controller=
    new AbortController();

  const timer=
    setTimeout(
      ()=>controller.abort(),
      REQUEST_TIMEOUT
    );

  try{

    const response=
      await fetch(
        apiUrl(path),
        {
          ...options,

          signal:
            controller.signal,

          headers:{
            'Content-Type':
              'application/json',

            ...(options.headers || {})
          }
        }
      );

    const raw=
      await response.text();

    let body={};

    if(raw){

      try{
        body=
          JSON.parse(raw);
      }
      catch{
        throw new Error(
          `Invalid server response (${response.status}).`
        );
      }
    }

    if(
      !response.ok ||
      body?.ok===false
    ){
      const error=
        new Error(
          body?.error ||
          `HTTP ${response.status}`
        );

      error.status=
        response.status;

      throw error;
    }

    return body;

  }
  finally{
    clearTimeout(timer);
  }
}


/* =========================================================
   GENERATE PREVIEW
   ========================================================= */

async function generateCharacter(){

  const profile=
    collectProfile();

  if(
    !profile.appearance &&
    !profile.vision
  ){
    message(
      t('generateError'),
      t('missingAppearance'),
      'error'
    );

    return;
  }

  setBusy(
    true,
    'generate'
  );

  message(
    t('generating'),
    t('generatingLead'),
    'working'
  );

  try{

    const result=
      await fetchJson(
        '/v1/eureka/identity/preview',
        {
          method:'POST',

          body:
            JSON.stringify({
              profile
            })
        }
      );


    if(
      !result.draft_id ||
      !result.preview_url
    ){
      throw new Error(
        'Identity server returned an incomplete preview.'
      );
    }


    localStorage.setItem(
      DRAFT_KEY,
      result.draft_id
    );


    /*
     * Important:
     * NO EKA code exists at this stage.
     */
    localStorage.removeItem(
      CONFIRMED_KEY
    );


    window.EurekaCharacterStage
      ?.setGenerated?.({
        imageUrl:
          apiUrl(
            result.preview_url
          ),

        code:
          '',

        confirmed:
          false
      });


    message(
      t('generated'),
      t('generatedLead'),
      'success'
    );

  }
  catch(error){

    const msg=
      String(
        error?.message ||
        error
      );


    if(
      msg.includes(
        'Image generator is not configured'
      )
    ){

      message(
        t('engineOffline'),
        t('engineOfflineLead'),
        'info'
      );

    }
    else{

      message(
        t('generateError'),
        msg,
        'error'
      );
    }
  }
  finally{

    setBusy(
      false
    );

    /*
     * The stage script restores the correct
     * Generate Another label after preview.
     */
    const generate=
      $('#eurekaStageGenerate');

    if(
      generate &&
      localStorage.getItem(
        DRAFT_KEY
      )
    ){
      generate.textContent=
        lang()==='pt'
          ? 'GERAR OUTRA'
          : 'GENERATE ANOTHER';
    }
  }
}


/* =========================================================
   CONFIRM PERMANENT IDENTITY
   ========================================================= */

async function confirmCharacter(){

  const draftId=
    localStorage.getItem(
      DRAFT_KEY
    );

  if(!draftId){

    message(
      t('confirmError'),
      t('missingDraft'),
      'error'
    );

    return;
  }


  setBusy(
    true,
    'confirm'
  );

  message(
    t('confirming'),
    '',
    'working'
  );


  try{

    const result=
      await fetchJson(
        '/v1/eureka/identity/confirm',
        {
          method:'POST',

          body:
            JSON.stringify({
              draft_id:
                draftId
            })
        }
      );


    if(
      !result.code ||
      !result.image_url
    ){
      throw new Error(
        'Identity server returned an incomplete confirmation.'
      );
    }


    localStorage.setItem(
      CONFIRMED_KEY,
      result.code
    );


    window.EurekaCharacterStage
      ?.setGenerated?.({
        imageUrl:
          apiUrl(
            result.image_url
          ),

        code:
          result.code,

        confirmed:
          true
      });


    /*
     * Draft is no longer needed by the browser.
     * Server keeps its audit link internally.
     */
    localStorage.removeItem(
      DRAFT_KEY
    );


    message(
      t('confirmed'),
      t('confirmedLead'),
      'success'
    );

  }
  catch(error){

    message(
      t('confirmError'),
      String(
        error?.message ||
        error
      ),
      'error'
    );
  }
  finally{
    setBusy(false);
  }
}


/* =========================================================
   COPY PERMANENT CODE
   ========================================================= */

async function copyCode(){

  const code=
    $('#eurekaStageCode')
      ?.textContent
      ?.trim() || '';

  if(
    !/^EKA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
      .test(code)
  ){
    return;
  }

  try{

    await navigator.clipboard
      .writeText(code);

    message(
      t('copied'),
      t('copiedLead'),
      'success'
    );

  }
  catch{}
}


/* =========================================================
   BIND

   Capture phase intentionally overrides the temporary
   placeholder click handlers in eureka-character-stage.js.
   ========================================================= */

function bind(){

  const generate=
    $('#eurekaStageGenerate');

  const confirm=
    $('#eurekaStageConfirm');

  const code=
    $('#eurekaStageCode');


  generate?.addEventListener(
    'click',
    event=>{

      event.preventDefault();
      event.stopImmediatePropagation();

      generateCharacter();

    },
    true
  );


  confirm?.addEventListener(
    'click',
    event=>{

      event.preventDefault();
      event.stopImmediatePropagation();

      confirmCharacter();

    },
    true
  );


  code?.addEventListener(
    'click',
    copyCode
  );


  if(code){

    code.title=
      t('codeHint');

    code.classList.add(
      'eureka-copy-code'
    );
  }
}


/* =========================================================
   PUBLIC DEBUG / FUTURE INTEGRATION
   ========================================================= */

window.EurekaIdentityAPI={

  base:
    API_BASE,

  generate:
    generateCharacter,

  confirm:
    confirmCharacter,

  collectProfile

};


bind();

})();
