EUREKA NEXUS WEBSITE · PRODUCTION 2026-10-02

PARA SUBSTITUIR O SITE ATUAL
1. Faz backup da pasta pública atual.
2. Apaga/substitui os ficheiros públicos antigos.
3. Coloca o CONTEÚDO deste pacote na raiz de eurekanexus.pt.
4. Confirma que index.html está diretamente na raiz.
5. Testa a entrada direta, navegação, idiomas e layout mobile em https://eurekanexus.pt/

ANTES DE PUBLICAR
- Criar/confirmar emails em site-config.js.
- Manter downloads em "soon" enquanto não existirem releases verificadas.
- O painel LIVE fica pronto mas sem números inventados até existir endpoint HTTPS público.
- A taxa 1% está apresentada no site, mas deve ser implementada e testada no Mining Server de produção antes de abrir mineração pública.

CONFIGURAÇÃO CENTRAL
site-config.js

TOKEN EKNX
Network: BNB Smart Chain Mainnet (56)
Contract: 0xF54913A8d5E2AEBD0B62c6411cCf1b5B4aB069c9
Genesis Market: 0x837dBE1D3b67e8315127c36a119E163e713ee73D
Mining fee: 1%
Fee wallet: 0x42F58c8a09Bce3A00Faf553AAC60B0daF320858b
