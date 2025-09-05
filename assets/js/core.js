class MobileMenuHandler {
  constructor() {
    this.elements = this.getElements();
    this.isOpen = false;
    this.init();
  }

  getElements() {
    return {
      menuBtn: document.getElementById("menuBtn"),
      burgerMenu: document.getElementById("burgerMenu"),
      closeMenu: document.getElementById("closeMenu"),
      menuContent: document.getElementById("menuContent"),
    };
  }

  init() {
    this.elements.menuBtn.addEventListener("click", () => this.toggle());
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }

  toggle() {
    const { burgerMenu, closeMenu, menuContent } = this.elements;

    burgerMenu.classList.toggle("hidden");
    closeMenu.classList.toggle("hidden");
    menuContent.classList.toggle("hidden");
    menuContent.classList.toggle("flex");

    this.isOpen = !menuContent.classList.contains("hidden");
    document.body.classList.toggle("no-scroll", this.isOpen);
  }

  handleOutsideClick(e) {
    if (!this.isOpen) return;

    const { menuContent, menuBtn } = this.elements;
    const isClickInside =
      menuContent.contains(e.target) || menuBtn.contains(e.target);

    if (!isClickInside) {
      this.toggle();
    }
  }
}

class CtaFormModalHandler {
  constructor() {
    this.submitUrl = "https://stg.arabtherapy.com/api/v1/forms/submit/9";
    this.elements = this.getElements();
    this.isOpen = false;
    this.isLoading = false;
    this.intlTelInputInstance = null;
    this.init();
  }

  getElements() {
    return {
      ctaBtn: document.getElementById("ctaBtn"),
      ctaModal: document.getElementById("ctaModal"),
      ctaModalContent: document.getElementById("ctaModalContent"),
      modalCloseBtn: document.getElementById("modalCloseBtn"),
      form: document.getElementById("ctaForm"),
      mobileNumberInput: document.getElementById("mobileNumber"),
    };
  }

  init() {
    this.initModalContent();
    this.bindEvents();
  }

  async initModalContent() {
    const companySizeList = document.getElementById("companySize");
    const countries = (await import("/assets/js/countries.js")).default;

    if (
      this.elements.mobileNumberInput &&
      typeof intlTelInput !== "undefined"
    ) {
      this.intlTelInputInstance = intlTelInput(
        this.elements.mobileNumberInput,
        {
          initialCountry: "jo",
          excludeCountries: ["il"],
          i18n: {
            searchPlaceholder: "ابحث عن الدولة",
            zeroSearchResults: "لا توجد نتائج",
            ...countries,
          },
        }
      );
    }

    if (companySizeList && typeof Choices !== "undefined") {
      new Choices(companySizeList, {
        searchEnabled: false,
        searchChoices: false,
        placeholder: true,
        itemSelectText: "",
        placeholderValue: "اختر حجم الشركة",
      });
    }
  }

  bindEvents() {
    const { ctaBtn, modalCloseBtn, form } = this.elements;

    ctaBtn.addEventListener("click", () => this.open());
    modalCloseBtn.addEventListener("click", () => this.close());
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
    form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  open() {
    this.elements.ctaModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    this.isOpen = true;
  }

  close() {
    this.elements.ctaModal.classList.add("hidden");
    this.elements.form.reset();
    document.body.classList.remove("overflow-hidden");
    this.isOpen = false;
    this.clearErrorMessages();
    this.isLoading = false;
  }

  handleOutsideClick(e) {
    if (!this.isOpen) return;

    const { ctaModalContent, ctaBtn, modalCloseBtn } = this.elements;
    const isClickInside =
      ctaModalContent.contains(e.target) ||
      ctaBtn.contains(e.target) ||
      modalCloseBtn.contains(e.target);

    if (!isClickInside) {
      this.close();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.elements.form);
    const data = Object.fromEntries(formData.entries());
    if (this.intlTelInputInstance) {
      const countryData = this.intlTelInputInstance.getSelectedCountryData();

      data.mobile = !!data.mobile.trim()
        ? `+${countryData.dialCode}${data.mobile}`
        : "";
    }

    try {
      this.setLoading(true);
      const response = await fetch(this.submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response?.json();
      const { errors } = result ?? {};

      this.setLoading(false);

      if (response.ok) {
        toast.showSuccess("تم إرسال النموذج بنجاح!");
        this.close();
        return;
      }

      if (errors) {
        this.displayErrors(errors);
        toast.showError("يرجى تصحيح الأخطاء في النموذج");
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      this.setLoading(false);
      toast.showError("حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.");
    }
  }

  setLoading(loading = false) {
    this.isLoading = loading;
    const submitBtn = this.elements.form.querySelector("[type='submit']");
    if (loading) {
      submitBtn.disabled = true;
      return;
    }
    submitBtn.disabled = false;
  }

  displayErrors(errors = {}) {
    this.clearErrorMessages();
    const errorsList = Object.entries(errors);

    if (!!errorsList?.length) {
      for (const [field, messages] of errorsList) {
        const input = this.elements.form.querySelector(`[name="${field}"]`);
        if (!input) continue;

        const errorMessageWrapper = this.elements.form.querySelector(
          `.error-message.field-${field}`
        );
        if (errorMessageWrapper) {
          errorMessageWrapper.classList.remove("invisible");
          messages?.forEach((msg) => {
            const div = document.createElement("div");
            div.textContent = msg;
            errorMessageWrapper.appendChild(div);
          });
        }

        if (field?.trim() === "company_size") {
          this.elements.form
            .querySelector(".choices")
            .classList.add("!border-red-500");
        }

        input.classList.add("border-red-500");
      }
    }
  }

  clearErrorMessages() {
    this.elements.form.querySelectorAll(".error-message")?.forEach((span) => {
      span.textContent = "";
    });
    this.elements.form
      .querySelectorAll("input, select, .choices")
      ?.forEach((input) => {
        input.classList.remove("border-red-500");
        input.classList.remove("!border-red-500");
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toastHandler = new ToastHandler();
  window.toast = toastHandler;

  new MobileMenuHandler();
  new CtaFormModalHandler();
});
