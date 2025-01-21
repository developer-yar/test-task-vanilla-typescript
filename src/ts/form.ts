import IMask from "imask";

type Data = { [key: string]: string };
type Form = { [key: string]: TextElement };
type TextElement = HTMLInputElement | HTMLTextAreaElement;

export const form = (): void => {
  setPhoneMask();
  validateForm();
  submitForm();
};

const setPhoneMask = (): void => {
  const phoneInput: HTMLElement | null = document.getElementById("phone");

  const maskOptions = {
    mask: "+{375}(00)000-00-00",
  };
  if (phoneInput) IMask(phoneInput, maskOptions);
};

const validateForm = (): void => {
  const { name, email, phone, message }: Form = getFormFields();

  [name, email, phone, message].forEach((field: TextElement) =>
    field.addEventListener("input", () => {
      const { value }: { value: string } = field;

      let fieldName: string = "";
      switch (field) {
        case name:
          fieldName = "Имя не должно";
          break;
        case email:
          fieldName = "Email не должен";
          break;
        case phone:
          fieldName = "Телефон не должен";
          break;
        case message:
          fieldName = "Сообщение не должно";
          break;
      }

      validateField(field, `${fieldName} быть пустым`, () => isNotEmpty(value));

      if (field === email && value) {
        const pattern: RegExp =
          /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

        validateField(field, "Некорректный формат email", () =>
          isMatchRegex(value, pattern),
        );
      }
    }),
  );
};

const validateField = (
  field: TextElement,
  errorText: string,
  validationFunction: () => boolean,
): void => {
  const errorMessage: HTMLElement = field.nextElementSibling as HTMLElement;
  if (errorMessage) {
    const isValid: boolean = validationFunction();

    errorMessage.hidden = isValid;
    if (errorMessage.innerText !== errorText)
      errorMessage.innerText = errorText;

    isValid ? field.classList.remove("error") : field.classList.add("error");
  }
};

const getFormFields = (): Form => {
  const nameInput = document.getElementById("name") as TextElement | null;
  const emailInput = document.getElementById("email") as TextElement | null;
  const phoneInput = document.getElementById("phone") as TextElement | null;
  const messageInput = document.getElementById("message") as TextElement | null;

  if (!nameInput || !emailInput || !phoneInput || !messageInput) {
    throw new Error("One or more form fields are missing.");
  }

  return {
    name: nameInput,
    email: emailInput,
    phone: phoneInput,
    message: messageInput,
  };
};

const isNotEmpty = (value: string): boolean => Boolean(value.trim());

const isMatchRegex = (value: string, pattern: RegExp): boolean =>
  pattern.test(value);

const submitForm = async (): Promise<void> => {
  const form = document.getElementById("form");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formFields: Form = getFormFields();
    const data: Data = {};

    Object.keys(formFields).forEach((key: string) => {
      data[key] = formFields[key].value;
    });

    try {
      const response = await fetch(`${process.env.API_URL}/api/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      let p = document.getElementById("result");
      if (p) {
        if (responseData.status === "success") {
          p.innerHTML = responseData.msg;

          clearForm(formFields);
        } else {
          p.innerHTML = "";
          Object.keys(responseData.fields).forEach((key) => {
            p.innerHTML += `${responseData.fields[key]}<br />`;
          });
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("An error has occured while sending data: ", error);
    }
  });
};

const clearForm = (formFields: Form): void => {
  Object.keys(formFields).forEach((key: string) => {
    formFields[key].value = "";
  });
};
