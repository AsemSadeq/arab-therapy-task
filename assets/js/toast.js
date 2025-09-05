class ToastHandler {
  constructor() {
    this.elements = this.getElements();
    this.defaultDuration = 4000;
    this.currentTimeout = null;
  }

  getElements() {
    return {
      toastWrapper: document.getElementById("toastWrapper"),
      toastMessage: document.getElementById("toastMessage"),
    };
  }

  showSuccess(message, duration = this.defaultDuration) {
    this.show(message, "success", duration);
  }

  showError(message, duration = this.defaultDuration) {
    this.show(message, "error", duration);
  }

  show(message, type, duration) {
    const { toastWrapper, toastMessage } = this.elements;

    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }

    toastMessage.textContent = message;

    if (type === "success") {
      toastWrapper.classList.remove("toast-error");
      toastWrapper.classList.add("toast-success");
    } else {
      toastWrapper.classList.remove("toast-success");
      toastWrapper.classList.add("toast-error");
    }

    toastWrapper.classList.remove("hidden");

    requestAnimationFrame(() => {
      toastWrapper.classList.remove("translate-x-full", "opacity-0");
      toastWrapper.classList.add("translate-x-0", "opacity-100");
    });

    this.currentTimeout = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    const { toastWrapper } = this.elements;

    if (!toastWrapper) return;

    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }

    toastWrapper.classList.remove("translate-x-0", "opacity-100");
    toastWrapper.classList.add("translate-x-full", "opacity-0");

    setTimeout(() => {
      toastWrapper.classList.add("hidden");
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toastHandler = new ToastHandler();
  window.toast = toastHandler;
});
