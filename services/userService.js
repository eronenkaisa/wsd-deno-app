import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
    await executeQuery(
        "INSERT INTO users (email, admin, password) VALUES ($1, $2, $3)", email, false, password
    );
    const result = await executeQuery("SELECT * FROM users WHERE email = $1 AND admin = $2 AND password = $3", email, false, password)
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await executeQuery(
      "SELECT * FROM users WHERE email = $1",
      email,
    );
  
    return result.rows;
};

const checkIfAdmin = async (id) => {
  const result = await executeQuery(
    "SELECT admin FROM users WHERE id = $1", id
  )
  if (result.rows[0] = true) {
    return true
  } else {
    return false
  }
}
  
const deleteUser = async (email) => {
  await executeQuery("DELETE FROM users WHERE email = $1", email);
}

export { addUser, findUserByEmail, checkIfAdmin, deleteUser };