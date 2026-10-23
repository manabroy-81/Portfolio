
const OwnerAuth = {
  // Default PIN is 1234 (Owner can change this anytime)
  getSavedPin() {
    return localStorage.getItem("portfolio_owner_pin") || "1234";
  },

  isOwnerLoggedIn() {
    return sessionStorage.getItem("portfolio_owner_authenticated") === "true";
  },

  login(enteredPin) {
    const correctPin = this.getSavedPin();
    if (enteredPin === correctPin) {
      sessionStorage.setItem("portfolio_owner_authenticated", "true");
      this.applyOwnerModeUI(true);
      if (typeof showToast === "function") {
        showToast("🔓 Owner mode unlocked! You can now edit your portfolio.");
      }
      return true;
    } else {
      if (typeof showToast === "function") {
        showToast("❌ Incorrect Owner PIN. Access denied.");
      }
      return false;
    }
  },

  logout() {
    sessionStorage.removeItem("portfolio_owner_authenticated");
    this.applyOwnerModeUI(false);
    if (typeof showToast === "function") {
      showToast("🔒 Owner mode locked. Portfolio is now read-only.");
    }
  },

  changePin(currentPin, newPin) {
    if (currentPin !== this.getSavedPin()) {
      alert("Current PIN is incorrect.");
      return false;
    }
    if (!newPin || newPin.trim().length < 4) {
      alert("New PIN must be at least 4 characters.");
      return false;
    }
    localStorage.setItem("portfolio_owner_pin", newPin.trim());
    if (typeof showToast === "function") {
      showToast("🔑 Owner PIN updated successfully!");
    }
    return true;
  },

  applyOwnerModeUI(isOwner) {
    const ownerElements = document.querySelectorAll(".owner-only");
    const ownerBadge = document.getElementById("owner-mode-badge");

    ownerElements.forEach(el => {
      el.style.display = isOwner ? "" : "none";
    });

    if (ownerBadge) {
      ownerBadge.style.display = isOwner ? "flex" : "none";
    }

    // Update footer link state
    const footerLockText = document.getElementById("footer-owner-status-text");
    if (footerLockText) {
      footerLockText.textContent = isOwner ? "Owner Mode (Unlocked - Click to Lock)" : "Owner Access";
    }
  },

  init() {
    // Check URL parameters for ?owner=true or ?admin=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("owner") === "true" || urlParams.get("admin") === "true") {
      if (!this.isOwnerLoggedIn()) {
        setTimeout(() => this.openLoginModal(), 400);
      }
    }

    // Keyboard shortcut: Ctrl + Shift + O (Owner) or Ctrl + Shift + E (Edit)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "O" || e.key === "o" || e.key === "E" || e.key === "e")) {
        e.preventDefault();
        if (this.isOwnerLoggedIn()) {
          this.logout();
        } else {
          this.openLoginModal();
        }
      }
    });

    // Wire up Login Modal Buttons
    const loginModal = document.getElementById("owner-login-modal");
    const submitBtn = document.getElementById("owner-pin-submit-btn");
    const pinInput = document.getElementById("owner-pin-input");
    const footerLockBtn = document.getElementById("footer-owner-lock-btn");
    const changePinBtn = document.getElementById("change-owner-pin-btn");
    const lockSessionBtn = document.getElementById("lock-owner-session-btn");

    if (footerLockBtn) {
      footerLockBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (this.isOwnerLoggedIn()) {
          this.logout();
        } else {
          this.openLoginModal();
        }
      });
    }

    if (submitBtn && pinInput) {
      submitBtn.addEventListener("click", () => {
        const pin = pinInput.value.trim();
        if (this.login(pin)) {
          pinInput.value = "";
          loginModal.classList.remove("active");
          document.body.style.overflow = "";
        }
      });

      pinInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          submitBtn.click();
        }
      });
    }

    if (lockSessionBtn) {
      lockSessionBtn.addEventListener("click", () => this.logout());
    }

    if (changePinBtn) {
      changePinBtn.addEventListener("click", () => {
        const curr = prompt("Enter your current PIN:");
        if (curr === null) return;
        const next = prompt("Enter your NEW PIN (at least 4 characters):");
        if (next === null) return;
        this.changePin(curr, next);
      });
    }

    // Apply initial state
    this.applyOwnerModeUI(this.isOwnerLoggedIn());
  },

  openLoginModal() {
    const modal = document.getElementById("owner-login-modal");
    const pinInput = document.getElementById("owner-pin-input");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (pinInput) {
        pinInput.value = "";
        setTimeout(() => pinInput.focus(), 150);
      }
    }
  }
};

window.OwnerAuth = OwnerAuth;

document.addEventListener("DOMContentLoaded", () => {
  OwnerAuth.init();
});
