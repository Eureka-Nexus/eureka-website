(function () {
  "use strict";

  const C = window.EUREKA_PREROUND;

  let connectedWallet = "";

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
        "No compatible wallet was found. Install MetaMask, Trust Wallet or another EVM wallet."
      );
    }

    const chainId = await window.ethereum.request({
      method: "eth_chainId"
    });

    if (chainId.toLowerCase() === "0x38") {
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }]
      });
    } catch (err) {
      if (err && err.code === 4902) {
        await window.ethereum.request({
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

    const after = await window.ethereum.request({
      method: "eth_chainId"
    });

    if (after.toLowerCase() !== "0x38") {
      throw new Error(
        "The wallet must be connected to BNB Smart Chain Mainnet."
      );
    }
  }

  window.connectInvestmentWallet = async function () {
    const btn = el("connectWalletBtn");
    const status = el("walletStatus");

    try {
      btn.disabled = true;
      btn.textContent = "CONNECTING...";

      await ensureBsc();

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      if (!accounts || !accounts.length) {
        throw new Error("No account was authorised.");
      }

      connectedWallet = cleanAddress(accounts[0]);

      if (!/^0x[a-f0-9]{40}$/.test(connectedWallet)) {
        throw new Error("The wallet returned an invalid address.");
      }

      el("payerWallet").value = connectedWallet;

      status.textContent =
        "✓ Wallet connected: " + shortAddress(connectedWallet);

      status.style.color = "#6ee7b7";

      btn.textContent = "WALLET CONNECTED";

    } catch (err) {
      connectedWallet = "";
      el("payerWallet").value = "";

      status.textContent =
        err?.message || "Unable to connect the wallet.";

      status.style.color = "#ff8787";

      btn.textContent = "CONNECT WALLET";

    } finally {
      btn.disabled = false;
    }
  };

  async function currentWalletStillMatches() {
    const accounts = await window.ethereum.request({
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
        body.error || "Unable to create the wallet challenge."
      );
    }

    return body;
  }

  async function signChallenge(message) {
    return await window.ethereum.request({
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
        body.error || "The payment was not accepted by the server."
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
      " intended · Verified transfer: " +
      (assets || "ativo confirmado");

    el("requity").textContent =
      "Pending acceptance and formalisation";

    el("rtx").textContent =
      el("txhash").value.trim();

    const status =
      document.querySelector("#receipt .status");

    status.textContent =
      "TRANSFER VERIFIED · INVESTMENT PENDING ACCEPTANCE";

    let details = el("verificationDetails");

    if (!details) {
      details = document.createElement("div");
      details.id = "verificationDetails";
      details.className = "notice";

      el("receipt").appendChild(details);
    }

    details.innerHTML =
      "<strong>Verified record</strong>" +
      "<p><b>Reference:</b> " +
      result.reference +
      "</p>" +
      "<p><b>Asset received:</b> " +
      (assets || "confirmado on-chain") +
      "</p>" +
      "<p><b>Receipt SHA-256 hash:</b></p>" +
      '<p class="wallet">' +
      result.receiptSha256 +
      "</p>" +
      "<p>The payment was confirmed on-chain. " +
      "The final EUR value and corporate ownership " +
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
      alert("Enter your name, email and country.");
      return;
    }

    if (
      !Number.isFinite(intendedEur) ||
      intendedEur < C.minimumIndicativeInvestmentEur
    ) {
      alert(
        "The minimum investment in this Pre-Round is €" +
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
        "You must accept the Terms, acknowledge the investment risk and confirm the Privacy Policy."
      );
      return;
    }

    if (!connectedWallet) {
      alert("First connect the wallet that made the payment.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      alert("Enter a valid BSC transaction hash.");
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
          "The active wallet changed. Reconnect the wallet that made the payment."
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
        "Unable to complete verification:\n\n" +
        (err?.message || err)
      );

    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "REGISTER TRANSFER";
      }
    }
  };

  if (window.ethereum) {
    window.ethereum.on?.("accountsChanged", () => {
      connectedWallet = "";
      el("payerWallet").value = "";
      el("walletStatus").textContent =
        "The wallet account changed. Reconnect it.";
      el("walletStatus").style.color = "#ffc76b";
      el("connectWalletBtn").textContent =
        "CONNECT WALLET";
    });

    window.ethereum.on?.("chainChanged", () => {
      connectedWallet = "";
      el("payerWallet").value = "";
      el("walletStatus").textContent =
        "The network changed. Reconnect on BNB Smart Chain.";
      el("walletStatus").style.color = "#ffc76b";
      el("connectWalletBtn").textContent =
        "CONNECT WALLET";
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
      throw new Error("Enter a valid BNB amount.");
    }

    const parts = text.split(".");
    const whole = parts[0] || "0";
    const fraction = (parts[1] || "").padEnd(18, "0");

    const wei =
      BigInt(whole) * (10n ** 18n) +
      BigInt(fraction || "0");

    if (wei <= 0n) {
      throw new Error("The BNB amount must be greater than zero.");
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
          "No compatible EVM wallet was found."
        );
      }

      const payer =
        String(el("payerWallet").value || "").trim().toLowerCase();

      if (!/^0x[a-f0-9]{40}$/.test(payer)) {
        throw new Error(
          "First connect the wallet that will make the investment."
        );
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId"
      });

      if (String(chainId).toLowerCase() !== "0x38") {
        throw new Error(
          "Select BNB Smart Chain Mainnet in your wallet."
        );
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts"
      });

      if (
        !accounts ||
        !accounts.length ||
        String(accounts[0]).toLowerCase() !== payer
      ) {
        throw new Error(
          "The active wallet does not match the connected wallet."
        );
      }

      const value =
        parseBnbToWeiHex(el("bnbAmount").value);

      btn.disabled = true;
      btn.textContent = "CONFIRM IN WALLET...";

      status.textContent =
        "Waiting for confirmation in your wallet...";
      status.style.color = "#ffc76b";

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: payer,
          to: C.receivingWallet,
          value
        }]
      });

      el("txhash").value = txHash;

      status.innerHTML =
        "✓ Transaction sent. TX: " +
        '<a target="_blank" rel="noopener" href="https://bscscan.com/tx/' +
        txHash +
        '">view on BscScan ↗</a><br>' +
        "Wait for at least 3 confirmations and then click " +
        "<b>REGISTER TRANSFER</b>.";

      status.style.color = "#6ee7b7";

    } catch (err) {
      status.textContent =
        err?.message || "Unable to send the payment.";

      status.style.color = "#ff8787";

    } finally {
      btn.disabled = false;
      btn.textContent = "SEND BNB TO THE PRE-ROUND";
    }
  };
})();
