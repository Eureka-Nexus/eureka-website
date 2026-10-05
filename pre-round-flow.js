(function () {
  "use strict";

  const C = window.EUREKA_PREROUND;

  let connectedWallet = "";
  let activeWalletProvider = null;
  const eip6963Providers = [];

  function registerEip6963Provider(event) {
    const detail = event?.detail;
    const provider = detail?.provider;

    if (
      provider &&
      typeof provider.request === "function" &&
      !eip6963Providers.some(
        item => item.provider === provider
      )
    ) {
      eip6963Providers.push({
        provider,
        info: detail.info || {}
      });
    }
  }

  window.addEventListener(
    "eip6963:announceProvider",
    registerEip6963Provider
  );

  try {
    window.dispatchEvent(
      new Event("eip6963:requestProvider")
    );
  } catch (_) {}

  async function refreshEip6963Providers() {
    try {
      window.dispatchEvent(
        new Event("eip6963:requestProvider")
      );
    } catch (_) {}

    await new Promise(resolve =>
      setTimeout(resolve, 250)
    );
  }

  function walletProviders() {
    const root = window.ethereum;

    if (!root) return [];

    const raw =
      Array.isArray(root.providers) && root.providers.length
        ? root.providers
        : [root];

    const unique = [];

    for (const item of eip6963Providers) {
      const provider = item.provider;

      if (
        provider &&
        typeof provider.request === "function" &&
        !unique.includes(provider)
      ) {
        unique.push(provider);
      }
    }

    for (const provider of raw) {
      if (
        provider &&
        typeof provider.request === "function" &&
        !unique.includes(provider)
      ) {
        unique.push(provider);
      }
    }

    function score(provider) {
      if (provider.isMetaMask && !provider.isBraveWallet) return 100;
      if (provider.isTrust || provider.isTrustWallet) return 95;
      if (provider.isRabby) return 90;
      if (provider.isCoinbaseWallet) return 85;
      if (provider.isBraveWallet) return 80;
      return 10;
    }

    return unique.sort((a, b) => score(b) - score(a));
  }

  function walletErrorText(err) {
    return String(
      err?.message ||
      err?.data?.message ||
      err ||
      ""
    );
  }

  function providerCanFallback(err) {
    const message =
      walletErrorText(err).toLowerCase();

    return (
      message.includes("broadcast channel unavailable") ||
      message.includes("provider disconnected") ||
      message.includes("disconnected from chain") ||
      err?.code === 4900 ||
      err?.code === 4901
    );
  }

  async function walletRequest(payload) {
    await refreshEip6963Providers();

    const candidates = walletProviders();

    if (!candidates.length) {
      throw new Error(
        "Não foi encontrada uma wallet EVM neste navegador."
      );
    }

    const ordered = [];

    if (
      activeWalletProvider &&
      candidates.includes(activeWalletProvider)
    ) {
      ordered.push(activeWalletProvider);
    }

    for (const provider of candidates) {
      if (!ordered.includes(provider)) {
        ordered.push(provider);
      }
    }

    let lastError = null;

    for (const provider of ordered) {
      try {
        const result =
          await provider.request(payload);

        activeWalletProvider = provider;

        window.__EUREKA_WALLET_PROVIDER__ = provider;

        return result;

      } catch (err) {
        lastError = err;

        if (!providerCanFallback(err)) {
          throw err;
        }

        if (activeWalletProvider === provider) {
          activeWalletProvider = null;
        }
      }
    }

    const message = walletErrorText(lastError);

    if (
      message
        .toLowerCase()
        .includes("broadcast channel unavailable")
    ) {
      throw new Error(
        "A extensão da wallet está indisponível neste navegador. " +
        "Desbloqueia/reabre a wallet e tenta novamente."
      );
    }

    throw lastError ||
      new Error("Não foi possível comunicar com a wallet.");
  }

  function el(id) {
    return document.getElementById(id);
  }

  function cleanAddress(v) {
    return String(v || "").trim().toLowerCase();
  }

  function euro(n) {
    return Number(n).toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR"
    });
  }

  function shortAddress(a) {
    if (!a || a.length < 12) return a || "";
    return a.slice(0, 6) + "…" + a.slice(-4);
  }

  async function ensureBsc() {
    if (!window.ethereum) {
      throw new Error(
        "Não foi encontrada uma wallet compatível. Instala MetaMask, Trust Wallet ou outra wallet EVM."
      );
    }

    const chainIdRaw = await walletRequest({
      method: "eth_chainId"
    });

    const chainId =
      String(chainIdRaw || "").trim().toLowerCase();

    if (!chainId) {
      throw new Error(
        "A wallet não devolveu o identificador da rede."
      );
    }

    if (chainId === "0x38") {
      return;
    }

    try {
      await walletRequest({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }]
      });
    } catch (err) {
      if (err && err.code === 4902) {
        await walletRequest({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: "0x38",
            chainName: "BNB Smart Chain Mainnet",
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18
            },
            rpcUrls: [
              "https://bsc-dataseed.bnbchain.org/"
            ],
            blockExplorerUrls: [
              "https://bscscan.com/"
            ]
          }]
        });
      } else {
        throw err;
      }
    }

    const afterRaw = await walletRequest({
      method: "eth_chainId"
    });

    const after =
      String(afterRaw || "").trim().toLowerCase();

    if (after !== "0x38") {
      throw new Error(
        "A wallet tem de estar ligada à BNB Smart Chain Mainnet."
      );
    }
  }

  window.connectInvestmentWallet = async function () {
    const btn = el("connectWalletBtn");
    const status = el("walletStatus");

    try {
      btn.disabled = true;
      btn.textContent = "A LIGAR...";

      let accounts;

      try {
        accounts = await walletRequest({
          method: "eth_requestAccounts"
        });
      } catch (err) {
        throw new Error(
          "WALLET_STAGE_REQUEST_ACCOUNTS: " +
          (err?.message || String(err))
        );
      }

      try {
        await ensureBsc();
      } catch (err) {
        throw new Error(
          "WALLET_STAGE_BSC_NETWORK: " +
          (err?.message || String(err))
        );
      }

      if (!accounts || !accounts.length) {
        throw new Error("Nenhuma conta foi autorizada.");
      }

      connectedWallet = cleanAddress(accounts[0]);

      if (!/^0x[a-f0-9]{40}$/.test(connectedWallet)) {
        throw new Error("A wallet devolveu um endereço inválido.");
      }

      el("payerWallet").value = connectedWallet;

      status.textContent =
        "✓ Wallet ligada: " + shortAddress(connectedWallet);

      status.style.color = "#6ee7b7";

      btn.textContent = "WALLET LIGADA";

    } catch (err) {
      connectedWallet = "";
      el("payerWallet").value = "";

      status.textContent =
        err?.message || "Não foi possível ligar a wallet.";

      status.style.color = "#ff8787";

      btn.textContent = "LIGAR WALLET";

    } finally {
      btn.disabled = false;
    }
  };

  async function currentWalletStillMatches() {
    const accounts = await walletRequest({
      method: "eth_accounts"
    });

    if (!accounts || !accounts.length) return false;

    return cleanAddress(accounts[0]) === connectedWallet;
  }

  async function createChallenge(intendedEur) {
    const response = await fetch(
      C.apiBaseUrl + "/v1/challenge",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          payerWallet: connectedWallet,
          intendedEur,
          termsVersion: C.termsVersion,
          privacyVersion: C.privacyVersion,
          termsAccepted: true,
          riskAccepted: true,
          privacyAcknowledged: true
        })
      }
    );

    const body = await response.json();

    if (!response.ok || !body.ok) {
      throw new Error(
        body.error || "Não foi possível criar o desafio da wallet."
      );
    }

    return body;
  }

  async function signChallenge(message) {
    return await walletRequest({
      method: "personal_sign",
      params: [
        message,
        connectedWallet
      ]
    });
  }

  async function submitToBackend(data) {
    const response = await fetch(
      C.apiBaseUrl + "/v1/payment",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const body = await response.json();

    if (!response.ok || !body.ok) {
      throw new Error(
        body.error || "O pagamento não foi aceite pelo servidor."
      );
    }

    return body;
  }

  function renderReceipt(result, intendedEur) {
    el("rref").textContent =
      result.reference;

    el("rname").textContent =
      el("name").value.trim();

    el("remail").textContent =
      el("email").value.trim();

    const assets = (result.payments || [])
      .map(p => p.amount + " " + p.asset)
      .join(" + ");

    el("ramount").textContent =
      euro(intendedEur) +
      " pretendidos · Transferência verificada: " +
      (assets || "ativo confirmado");

    el("requity").textContent =
      "Pendente de aceitação e formalização";

    el("rtx").textContent =
      el("txhash").value.trim();

    const status =
      document.querySelector("#receipt .status");

    status.textContent =
      "TRANSFERÊNCIA VERIFICADA · INVESTIMENTO PENDENTE DE ACEITAÇÃO";

    let details = el("verificationDetails");

    if (!details) {
      details = document.createElement("div");
      details.id = "verificationDetails";
      details.className = "notice";

      el("receipt").appendChild(details);
    }

    details.innerHTML =
      "<strong>Registo verificado</strong>" +
      "<p><b>Referência:</b> " +
      result.reference +
      "</p>" +
      "<p><b>Ativo recebido:</b> " +
      (assets || "confirmado on-chain") +
      "</p>" +
      "<p><b>Hash SHA-256 do comprovativo:</b></p>" +
      '<p class="wallet">' +
      result.receiptSha256 +
      "</p>" +
      "<p>O pagamento foi confirmado na blockchain. " +
      "O valor final em euros e a participação societária " +
      "continuam sujeitos a validação e documentação definitiva.</p>";

    el("receipt").style.display = "block";

    el("receipt").scrollIntoView({
      behavior: "smooth"
    });
  }

  window.registerPayment = async function () {
    const txHash = el("txhash").value.trim();
    const intendedEur = Number(el("amount").value || 0);

    const name = el("name").value.trim();
    const email = el("email").value.trim();
    const country = el("country").value.trim();

    if (!name || !email || !country) {
      alert("Preenche nome, email e país.");
      return;
    }

    if (
      !Number.isFinite(intendedEur) ||
      intendedEur < C.minimumIndicativeInvestmentEur
    ) {
      alert(
        "O investimento mínimo desta Pre-Round é €" +
        C.minimumIndicativeInvestmentEur +
        "."
      );
      return;
    }

    if (
      !el("accept1").checked ||
      !el("accept2").checked ||
      !el("accept3").checked
    ) {
      alert(
        "É necessário aceitar os Termos, reconhecer o risco e confirmar a Política de Privacidade."
      );
      return;
    }

    if (!connectedWallet) {
      alert("Liga primeiro a wallet que fez o pagamento.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      alert("Introduz um TX Hash BSC válido.");
      return;
    }

    const btn = document.activeElement;

    try {
      if (btn) {
        btn.disabled = true;
        btn.textContent = "A VALIDAR...";
      }

      await ensureBsc();

      if (!(await currentWalletStillMatches())) {
        throw new Error(
          "A wallet ativa mudou. Liga novamente a wallet que efetuou o pagamento."
        );
      }

      const challenge =
        await createChallenge(intendedEur);

      const signature =
        await signChallenge(challenge.message);

      const result =
        await submitToBackend({
          name,
          email,
          country,
          payerWallet: connectedWallet,
          intendedEur,
          txHash,
          challengeId: challenge.challengeId,
          signature,
          termsVersion: C.termsVersion,
          privacyVersion: C.privacyVersion,
          termsAccepted: true,
          riskAccepted: true,
          privacyAcknowledged: true
        });

      renderReceipt(result, intendedEur);

    } catch (err) {
      alert(
        "Não foi possível concluir a verificação:\n\n" +
        (err?.message || err)
      );

    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "REGISTAR TRANSFERÊNCIA";
      }
    }
  };

  if (window.ethereum) {
    window.ethereum.on?.("accountsChanged", () => {
      connectedWallet = "";
      el("payerWallet").value = "";
      el("walletStatus").textContent =
        "A conta da wallet mudou. Liga novamente.";
      el("walletStatus").style.color = "#ffc76b";
      el("connectWalletBtn").textContent =
        "LIGAR WALLET";
    });

    window.ethereum.on?.("chainChanged", () => {
      connectedWallet = "";
      el("payerWallet").value = "";
      el("walletStatus").textContent =
        "A rede mudou. Liga novamente na BNB Smart Chain.";
      el("walletStatus").style.color = "#ffc76b";
      el("connectWalletBtn").textContent =
        "LIGAR WALLET";
    });
  }
})();

/* Direct native-BNB payment helper */
(function () {
  "use strict";

  function el(id) {
    return document.getElementById(id);
  }

  function parseBnbToWeiHex(value) {
    const text = String(value || "").trim();

    if (!/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/.test(text)) {
      throw new Error("Introduz uma quantidade BNB válida.");
    }

    const parts = text.split(".");
    const whole = parts[0] || "0";
    const fraction = (parts[1] || "").padEnd(18, "0");

    const wei =
      BigInt(whole) * (10n ** 18n) +
      BigInt(fraction || "0");

    if (wei <= 0n) {
      throw new Error("A quantidade BNB tem de ser superior a zero.");
    }

    return "0x" + wei.toString(16);
  }

  window.sendBnbInvestment = async function () {
    const C = window.EUREKA_PREROUND;
    const status = el("paymentStatus");
    const btn = el("sendBnbBtn");

    try {
      if (!window.ethereum) {
        throw new Error(
          "Não foi encontrada uma wallet EVM compatível."
        );
      }

      const payer =
        String(el("payerWallet").value || "").trim().toLowerCase();

      if (!/^0x[a-f0-9]{40}$/.test(payer)) {
        throw new Error(
          "Liga primeiro a wallet que vai realizar o investimento."
        );
      }

      const chainId = await walletRequest({
        method: "eth_chainId"
      });

      if (String(chainId).toLowerCase() !== "0x38") {
        throw new Error(
          "Seleciona BNB Smart Chain Mainnet na wallet."
        );
      }

      const accounts = await walletRequest({
        method: "eth_accounts"
      });

      if (
        !accounts ||
        !accounts.length ||
        String(accounts[0]).toLowerCase() !== payer
      ) {
        throw new Error(
          "A wallet ativa não corresponde à wallet ligada."
        );
      }

      const value =
        parseBnbToWeiHex(el("bnbAmount").value);

      btn.disabled = true;
      btn.textContent = "CONFIRMA NA WALLET...";

      status.textContent =
        "A aguardar confirmação na tua wallet...";
      status.style.color = "#ffc76b";

      const txHash = await walletRequest({
        method: "eth_sendTransaction",
        params: [{
          from: payer,
          to: C.receivingWallet,
          value
        }]
      });

      el("txhash").value = txHash;

      status.innerHTML =
        "✓ Transação enviada. TX: " +
        '<a target="_blank" rel="noopener" href="https://bscscan.com/tx/' +
        txHash +
        '">ver no BscScan ↗</a><br>' +
        "Aguarda pelo menos 3 confirmações e depois carrega em " +
        "<b>REGISTAR TRANSFERÊNCIA</b>.";

      status.style.color = "#6ee7b7";

    } catch (err) {
      status.textContent =
        err?.message || "Não foi possível enviar o pagamento.";

      status.style.color = "#ff8787";

    } finally {
      btn.disabled = false;
      btn.textContent = "ENVIAR BNB PARA A PRE-ROUND";
    }
  };
})();
