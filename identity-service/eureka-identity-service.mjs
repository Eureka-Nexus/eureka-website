import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";

const HOST =
  process.env.EUREKA_IDENTITY_HOST ||
  "127.0.0.1";

const PORT =
  Number(
    process.env.EUREKA_IDENTITY_PORT ||
    8786
  );

const STORAGE =
  process.env.EUREKA_IDENTITY_STORAGE ||
  "/home/eureka/EurekaNexus/private/eureka-identities";

const DRAFT_STORAGE =
  process.env.EUREKA_IDENTITY_DRAFT_STORAGE ||
  "/home/eureka/EurekaNexus/private/eureka-identity-drafts";

const IMAGE_MODEL =
  process.env.OPENAI_IMAGE_MODEL ||
  "gpt-image-2";

const OPENAI_API_KEY =
  String(
    process.env.OPENAI_API_KEY ||
    ""
  ).trim();

const ALLOWED_ORIGINS =
  String(
    process.env.EUREKA_IDENTITY_ALLOWED_ORIGINS ||
    "http://127.0.0.1:8765,http://localhost:8765"
  )
    .split(",")
    .map(v=>v.trim())
    .filter(Boolean);

const MAX_BODY =
  128 * 1024;

const DRAFT_TTL_MS =
  24 * 60 * 60 * 1000;


/* =========================================================
   HELPERS
   ========================================================= */

function originHeaders(req) {

  const origin =
    String(
      req.headers.origin ||
      ""
    );

  if (
    origin &&
    ALLOWED_ORIGINS.includes(origin)
  ) {
    return {
      "Access-Control-Allow-Origin":
        origin,

      "Vary":
        "Origin"
    };
  }

  return {};
}


function json(
  req,
  res,
  status,
  body
) {

  const payload =
    JSON.stringify(body);

  res.writeHead(
    status,
    {
      "Content-Type":
        "application/json; charset=utf-8",

      "Content-Length":
        Buffer.byteLength(payload),

      "Cache-Control":
        "no-store",

      ...originHeaders(req)
    }
  );

  res.end(payload);
}


function text(
  value,
  max = 1000
) {
  return String(
    value ?? ""
  )
    .trim()
    .slice(0, max);
}


function sha256(
  buffer
) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}


function randomCode(
  prefix
) {

  const chars =
    crypto
      .randomBytes(9)
      .toString("hex")
      .toUpperCase();

  return (
    prefix +
    "-" +
    chars.slice(0,4) +
    "-" +
    chars.slice(4,8) +
    "-" +
    chars.slice(8,12)
  );
}


function validEkaCode(
  value
) {
  return /^EKA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    .test(value);
}


function validDraftId(
  value
) {
  return /^DRF-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    .test(value);
}


async function readBody(
  req
) {

  const chunks=[];
  let total=0;

  for await (
    const chunk
    of req
  ) {

    total += chunk.length;

    if (
      total >
      MAX_BODY
    ) {
      throw new Error(
        "Request too large."
      );
    }

    chunks.push(chunk);
  }

  const raw=
    Buffer
      .concat(chunks)
      .toString("utf8");

  return raw
    ? JSON.parse(raw)
    : {};
}


/* =========================================================
   PROFILE
   ========================================================= */

function validateProfile(
  input
) {

  const age =
    Math.round(
      Number(
        input.age ||
        0
      )
    );

  if (
    !Number.isFinite(age) ||
    age < 18 ||
    age > 120
  ) {
    throw new Error(
      "Eureka character must be an adult profile (18+)."
    );
  }

  const profile={

    name:
      text(
        input.name ||
        "Eureka",
        40
      ),

    age,

    gender:
      text(
        input.gender,
        120
      ),

    role:
      text(
        input.role,
        200
      ),

    personality:
      text(
        input.personality,
        300
      ),

    style:
      text(
        input.style,
        300
      ),

    appearance:
      text(
        input.appearance,
        1600
      ),

    vision:
      text(
        input.vision,
        2200
      ),

    goals:
      text(
        input.goals,
        1200
      ),

    boundaries:
      text(
        input.boundaries,
        1200
      ),

    customCapabilities:
      text(
        input.customCapabilities,
        900
      ),

    capabilities:
      Array.isArray(
        input.capabilities
      )
        ? input.capabilities
            .map(v=>text(v,100))
            .filter(Boolean)
            .slice(0,50)
        : [],

    autonomy:
      Math.max(
        0,
        Math.min(
          3,
          Number(
            input.autonomy ||
            0
          )
        )
      )

  };

  if (
    !profile.appearance &&
    !profile.vision
  ) {
    throw new Error(
      "Describe the desired appearance or character."
    );
  }

  return profile;
}


/* =========================================================
   PROMPT
   ========================================================= */

function buildPrompt(
  profile
) {

  return `
Create one original photorealistic adult digital character.

This person represents a persistent Eureka digital identity.

The user's description is the primary source of truth.
Follow the user's requested physical appearance and visual
preferences as closely as possible.

The character must clearly be an adult.

IDENTITY

Name:
${profile.name}

Apparent age:
${profile.age}

Gender / presentation:
${profile.gender || "User-defined"}

Role:
${profile.role || "User-defined"}

Personality:
${profile.personality || "User-defined"}

Style:
${profile.style || "User-defined"}

USER APPEARANCE DESCRIPTION:
${profile.appearance || "Not separately specified."}

USER FULL CHARACTER VISION:
${profile.vision || "Not separately specified."}

VISUAL REQUIREMENTS

- photorealistic adult human-like digital being
- realistic skin
- realistic eyes
- realistic hair
- realistic anatomy
- natural facial proportions
- photographic detail
- cinematic portrait lighting
- sophisticated futuristic atmosphere
- believable clothing and materials
- no cartoon
- no anime
- no 3D-render look
- no plastic skin
- no visible text
- no watermark
- no logo

The character must be original and fictional.
Do not intentionally reproduce a real public figure.

Composition:
vertical portrait suitable for a digital-character interface,
upper-body or three-quarter framing,
dark elegant futuristic environment,
subtle cyan and gold Eureka-style technological accents.

The user's requested age, presentation, physical traits,
hair, eyes, clothing, style and overall appearance have
priority over generic visual choices.
`.trim();
}


/* =========================================================
   IMAGE GENERATION
   ========================================================= */

async function generateImage(
  prompt
) {

  if (
    !OPENAI_API_KEY
  ) {

    const error =
      new Error(
        "Image generator is not configured."
      );

    error.code=
      "GENERATOR_NOT_CONFIGURED";

    throw error;
  }

  const response=
    await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method:
          "POST",

        headers:{
          "Authorization":
            `Bearer ${OPENAI_API_KEY}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            model:
              IMAGE_MODEL,

            prompt,

            size:
              "1024x1536",

            quality:
              "high",

            n:
              1
          })
      }
    );

  const raw=
    await response.text();

  let data;

  try{
    data=
      JSON.parse(raw);
  }
  catch{
    throw new Error(
      "Image provider returned invalid JSON."
    );
  }

  if(
    !response.ok
  ){
    throw new Error(
      data?.error?.message ||
      `Image provider HTTP ${response.status}`
    );
  }

  const base64=
    data?.data?.[0]?.b64_json;

  if(
    !base64
  ){
    throw new Error(
      "Image provider returned no image."
    );
  }

  return Buffer.from(
    base64,
    "base64"
  );
}


/* =========================================================
   DRAFTS
   ========================================================= */

async function createDraft({
  profile,
  prompt,
  image
}) {

  let draftId;

  for(
    let i=0;
    i<30;
    i+=1
  ){

    const candidate=
      randomCode("DRF");

    try{

      await fs.access(
        path.join(
          DRAFT_STORAGE,
          candidate
        )
      );

    }
    catch{

      draftId=
        candidate;

      break;
    }
  }

  if(
    !draftId
  ){
    throw new Error(
      "Could not allocate draft ID."
    );
  }

  const dir=
    path.join(
      DRAFT_STORAGE,
      draftId
    );

  await fs.mkdir(
    dir,
    {
      recursive:true,
      mode:0o700
    }
  );

  const createdAt=
    new Date();

  const expiresAt=
    new Date(
      createdAt.getTime() +
      DRAFT_TTL_MS
    );

  await fs.writeFile(
    path.join(
      dir,
      "preview.png"
    ),
    image,
    {
      mode:0o600
    }
  );

  const draft={

    schema:
      "eureka.identity.draft.v1",

    draft_id:
      draftId,

    created_at:
      createdAt.toISOString(),

    expires_at:
      expiresAt.toISOString(),

    confirmed_code:
      null,

    profile,

    generation:{
      model:
        IMAGE_MODEL,

      prompt
    },

    image:{
      file:
        "preview.png",

      sha256:
        sha256(image)
    }

  };

  await fs.writeFile(
    path.join(
      dir,
      "draft.json"
    ),

    JSON.stringify(
      draft,
      null,
      2
    ),

    {
      mode:0o600
    }
  );

  return draft;
}


async function loadDraft(
  draftId
) {

  if(
    !validDraftId(draftId)
  ){
    throw new Error(
      "Invalid draft ID."
    );
  }

  const dir=
    path.join(
      DRAFT_STORAGE,
      draftId
    );

  const raw=
    await fs.readFile(
      path.join(
        dir,
        "draft.json"
      ),
      "utf8"
    );

  const draft=
    JSON.parse(raw);

  const expires=
    Date.parse(
      draft.expires_at
    );

  if(
    !draft.confirmed_code &&
    Number.isFinite(expires) &&
    Date.now() > expires
  ){
    const error=
      new Error(
        "Draft expired."
      );

    error.code=
      "DRAFT_EXPIRED";

    throw error;
  }

  return {
    dir,
    draft
  };
}


/* =========================================================
   CONFIRMED IDENTITIES
   ========================================================= */

async function allocateEkaCode(){

  for(
    let i=0;
    i<30;
    i+=1
  ){

    const candidate=
      randomCode("EKA");

    try{

      await fs.access(
        path.join(
          STORAGE,
          candidate
        )
      );

    }
    catch{
      return candidate;
    }
  }

  throw new Error(
    "Could not allocate Eureka identity code."
  );
}


async function confirmDraft(
  draftId
) {

  const loaded=
    await loadDraft(
      draftId
    );

  const {
    dir,
    draft
  }=loaded;

  /*
   * Idempotent confirmation.
   * Double-clicking does not create a second identity.
   */
  if(
    draft.confirmed_code
  ){
    return {
      code:
        draft.confirmed_code,

      identity:
        await loadIdentity(
          draft.confirmed_code
        )
    };
  }

  const code=
    await allocateEkaCode();

  const targetDir=
    path.join(
      STORAGE,
      code
    );

  await fs.mkdir(
    targetDir,
    {
      recursive:true,
      mode:0o700
    }
  );

  const image=
    await fs.readFile(
      path.join(
        dir,
        "preview.png"
      )
    );

  await fs.writeFile(
    path.join(
      targetDir,
      "canonical.png"
    ),
    image,
    {
      mode:0o600
    }
  );

  const identity={

    schema:
      "eureka.identity.v1",

    code,

    created_at:
      new Date()
        .toISOString(),

    source_draft:
      draftId,

    profile:
      draft.profile,

    generation:
      draft.generation,

    image:{
      canonical:
        "canonical.png",

      sha256:
        sha256(image),

      model:
        IMAGE_MODEL
    }

  };

  await fs.writeFile(
    path.join(
      targetDir,
      "identity.json"
    ),

    JSON.stringify(
      identity,
      null,
      2
    ),

    {
      mode:0o600
    }
  );

  /*
   * Mark draft as confirmed.
   */
  draft.confirmed_code=
    code;

  await fs.writeFile(
    path.join(
      dir,
      "draft.json"
    ),

    JSON.stringify(
      draft,
      null,
      2
    ),

    {
      mode:0o600
    }
  );

  return {
    code,
    identity
  };
}


async function loadIdentity(
  code
) {

  if(
    !validEkaCode(code)
  ){
    throw new Error(
      "Invalid identity code."
    );
  }

  const raw=
    await fs.readFile(
      path.join(
        STORAGE,
        code,
        "identity.json"
      ),
      "utf8"
    );

  return JSON.parse(raw);
}


/* =========================================================
   SERVER
   ========================================================= */

const server=
  http.createServer(
    async(req,res)=>{

      try{

        if(
          req.method==="OPTIONS"
        ){

          const origin=
            String(
              req.headers.origin ||
              ""
            );

          if(
            !ALLOWED_ORIGINS.includes(origin)
          ){
            res.writeHead(403);
            return res.end();
          }

          res.writeHead(
            204,
            {
              "Access-Control-Allow-Origin":
                origin,

              "Access-Control-Allow-Headers":
                "Content-Type",

              "Access-Control-Allow-Methods":
                "GET,POST,OPTIONS",

              "Vary":
                "Origin"
            }
          );

          return res.end();
        }


        const url=
          new URL(
            req.url,
            `http://${req.headers.host || "localhost"}`
          );


        /* ---------------------------------------------
           HEALTH
           --------------------------------------------- */

        if(
          req.method==="GET" &&
          url.pathname==="/health"
        ){

          return json(
            req,
            res,
            200,
            {
              ok:true,
              service:"eureka-identity",
              version:"1.1.0",
              workflow:"preview-confirm",
              image_model:IMAGE_MODEL,
              generator_configured:Boolean(OPENAI_API_KEY)
            }
          );
        }


        /* ---------------------------------------------
           CREATE PREVIEW ONLY
           NO PERMANENT EKA CODE HERE
           --------------------------------------------- */

        if(
          req.method==="POST" &&
          url.pathname==="/v1/eureka/identity/preview"
        ){

          const input=
            await readBody(req);

          const profile=
            validateProfile(
              input.profile ||
              input
            );

          const prompt=
            buildPrompt(profile);

          const image=
            await generateImage(
              prompt
            );

          const draft=
            await createDraft({
              profile,
              prompt,
              image
            });

          return json(
            req,
            res,
            201,
            {
              ok:true,

              draft_id:
                draft.draft_id,

              preview_url:
                `/v1/eureka/identity/draft/${draft.draft_id}/image`,

              expires_at:
                draft.expires_at,

              permanent_code:
                null
            }
          );
        }


        /* ---------------------------------------------
           DRAFT IMAGE
           --------------------------------------------- */

        const draftImageMatch=
          url.pathname.match(
            /^\/v1\/eureka\/identity\/draft\/(DRF-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})\/image$/
          );

        if(
          req.method==="GET" &&
          draftImageMatch
        ){

          const {
            dir
          }=
            await loadDraft(
              draftImageMatch[1]
            );

          const image=
            await fs.readFile(
              path.join(
                dir,
                "preview.png"
              )
            );

          res.writeHead(
            200,
            {
              "Content-Type":
                "image/png",

              "Content-Length":
                image.length,

              "Cache-Control":
                "no-store",

              ...originHeaders(req)
            }
          );

          return res.end(image);
        }


        /* ---------------------------------------------
           CONFIRM SELECTED CHARACTER
           ONLY HERE CREATE EKA CODE
           --------------------------------------------- */

        if(
          req.method==="POST" &&
          url.pathname==="/v1/eureka/identity/confirm"
        ){

          const input=
            await readBody(req);

          const draftId=
            text(
              input.draft_id,
              64
            );

          const result=
            await confirmDraft(
              draftId
            );

          return json(
            req,
            res,
            201,
            {
              ok:true,

              code:
                result.code,

              image_url:
                `/v1/eureka/identity/${result.code}/image`,

              identity_url:
                `/v1/eureka/identity/${result.code}`
            }
          );
        }


        /* ---------------------------------------------
           READ CONFIRMED IDENTITY
           --------------------------------------------- */

        const identityMatch=
          url.pathname.match(
            /^\/v1\/eureka\/identity\/(EKA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})$/
          );

        if(
          req.method==="GET" &&
          identityMatch
        ){

          const identity=
            await loadIdentity(
              identityMatch[1]
            );

          return json(
            req,
            res,
            200,
            {
              ok:true,
              identity
            }
          );
        }


        /* ---------------------------------------------
           CONFIRMED CANONICAL IMAGE
           --------------------------------------------- */

        const identityImageMatch=
          url.pathname.match(
            /^\/v1\/eureka\/identity\/(EKA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4})\/image$/
          );

        if(
          req.method==="GET" &&
          identityImageMatch
        ){

          const code=
            identityImageMatch[1];

          if(
            !validEkaCode(code)
          ){
            throw new Error(
              "Invalid identity code."
            );
          }

          const image=
            await fs.readFile(
              path.join(
                STORAGE,
                code,
                "canonical.png"
              )
            );

          res.writeHead(
            200,
            {
              "Content-Type":
                "image/png",

              "Content-Length":
                image.length,

              "Cache-Control":
                "private, max-age=3600",

              ...originHeaders(req)
            }
          );

          return res.end(image);
        }


        return json(
          req,
          res,
          404,
          {
            ok:false,
            error:"Not found."
          }
        );

      }
      catch(error){

        const status=
          error?.code==="GENERATOR_NOT_CONFIGURED"
            ? 503
            : error?.code==="DRAFT_EXPIRED"
              ? 410
              : error?.code==="ENOENT"
                ? 404
                : 400;

        return json(
          req,
          res,
          status,
          {
            ok:false,
            error:String(
              error?.message ||
              error
            )
          }
        );
      }
    }
  );


await fs.mkdir(
  STORAGE,
  {
    recursive:true,
    mode:0o700
  }
);

await fs.mkdir(
  DRAFT_STORAGE,
  {
    recursive:true,
    mode:0o700
  }
);


server.listen(
  PORT,
  HOST,
  ()=>{

    console.log(
      `Eureka Identity Service http://${HOST}:${PORT}`
    );

    console.log(
      `Confirmed identities: ${STORAGE}`
    );

    console.log(
      `Draft identities: ${DRAFT_STORAGE}`
    );

    console.log(
      `Image model: ${IMAGE_MODEL}`
    );

    console.log(
      `Generator configured: ${Boolean(OPENAI_API_KEY)}`
    );
  }
);
