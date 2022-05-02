import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import {
    isEmail,
    required,
    validate,
    minLength,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

const validationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
};
  
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

const registerUser = async ({ request, response, render }) => {
    const data = await getData(request);
    const [passes, errors] = await validate(data, validationRules);

    if (!passes) {
        data.errors = errors;
        render("registration.eta", data);
      } else {
        await userService.addUser( 
            data.email,
            await bcrypt.hash(data.password),
        );
        response.redirect("/auth/login");
      }
    
};

const showRegistrationForm = ({ render }) => {
    const data = { email: "", password: "" };
    render("registration.eta", data);
};

export { registerUser, showRegistrationForm };