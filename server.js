const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const STATUS = {
  ERROR: "error",
  SUCCESS: "success",
};

const ERROR_MESSAGES = {
  EMPTY: "не должно быть пустым",
  INVALID_EMAIL: "Некорректный формат email",
};

const validateInput = (data) => {
  const { name, phone, email, message } = data;
  const isValidEmail =
    /^[^<>()[\].,;:\s@"]+@[^<>()[\].,;:\s@"]+\.[^<>()[\].,;:\s@"]{2,}$/iu.test(
      email
    );

  const errors = {};
  if (!name) errors.inputName = `Имя ${ERROR_MESSAGES.EMPTY}`;
  if (!phone) errors.inputPhone = `Телефон ${ERROR_MESSAGES.EMPTY}`;
  if (!email) errors.inputEmail = `Email ${ERROR_MESSAGES.EMPTY}`;
  if (!message) errors.inputMessage = `Сообщение ${ERROR_MESSAGES.EMPTY}`;
  if (!isValidEmail) errors.inputEmail = ERROR_MESSAGES.INVALID_EMAIL;

  return { isValid: Object.keys(errors).length === 0, errors };
};

app.post("/api/data", (req, res) => {
  const { isValid, errors } = validateInput(req.body);

  if (!isValid) {
    res.status(400).json({ status: STATUS.ERROR, fields: errors });
  } else {
    res.json({ status: STATUS.SUCCESS, msg: "Ваша заявка успешно отправлена" });
  }
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
