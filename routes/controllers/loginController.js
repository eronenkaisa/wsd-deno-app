import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const getData = async (request) => {
  const data = {
    password: "",
    email: "",
    errors: [],
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.password = params.get("password");
    data.email = params.get("email");
  }
  return data;
};

const processLogin = async ({ request, response, state, render }) => {
  const data = await getData(request);
  const userFromDatabase = await userService.findUserByEmail(
    data.email,
  );
  if (userFromDatabase.length != 1) {
    data.errors.push("The email was not found");
    render("login.eta", data);
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    data.password,
    user.password,
  );

  if (!passwordMatches) {
    data.errors.push("The password didn't match the email");
    render("login.eta", data);
    return;
  }

  await state.session.set("user", user);
  response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

export { processLogin, showLoginForm };