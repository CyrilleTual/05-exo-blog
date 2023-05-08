import { pool } from "../config/database.js";
import session from "express-session";
import bcrypt from "bcrypt";



export const login = (req, res) => {
    const session = {
      user: req.session.username || null,
      islog: req.session.isLogged || null,
      role: req.session.role || null,
      id: req.session.idUser || null,
    };
    res.render("layout", { template: "./login", session:session});
    res.end();
}
/**
 * traitement du form de connexion / set de session
 */
export const loginProcess = async (req, res) => {
  let { username, password } = req.body;
  // Ensure the input fields exists and are not empty
  if (username && password) {

    // selection du compte basé sur alias
    try {
      const query = `SELECT user.pwd, user.id, role.title AS role
                FROM user
                JOIN role ON role.id = user.id_role
                WHERE user.alias = ?
        `;
      const [result] = await pool.execute(query, [username]);

      // si reponse pleine -> user existe 
      if (result.length > 0) {
        //on a bien un user et on contrôle le password          
        if (!bcrypt.compareSync(password, result[0].pwd)) {
            res.redirect("/");
            res.end();
        }else{
          //-> set de la session
          req.session.isLogged = true;
          req.session.username = username;
          req.session.role = result[0].role;
          req.session.idUser = result[0].id;
          // Redirection  home page
          res.redirect("/");
          res.end();
        }

      }else{
        res.redirect(`/auth/login`);
        res.end(); 
      }
      res.end(); 

    } catch (error) {
        console.log("dans catch");
        res.redirect("/");
    res.end();
    }
  } else {
      res.redirect("/auth/login");
      res.end();
  }
}


/**
 * logout
 */
export const logout = (req, res) => {
  console.log("logout");
  req.session.destroy();
  res.redirect("/");
  res.end();
};

/**
 * affichage du form de register
 */
export const register = (req, res) => {
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
  };
  res.render("layout", { template: "./register", session: session });
  res.end();
};

/**
 * form register process
 */
export const registerProcess = async (req, res) => {
  let {alias, email, password } = req.body;
  // hash du pwd
  const hash = await  bcrypt.hash(password, 10)
  // insertion du nouvel utilisateur dans la DB
  try {
      const query = `INSERT INTO user (alias, email, pwd, regdate) VALUES (?, ?, ?, NOW())`;
      await pool.execute(query, [alias, email, hash]);
      res.redirect (`/auth/login`)
      res.end();
  } catch (error) {
      res.json({ msg: error });
  }
};

