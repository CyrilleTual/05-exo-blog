import { pool } from "../config/database.js";
import session from "express-session";

import bcrypt from "bcrypt";



export const login = (req, res) => {
    const session = {
      user: req.session.username || null,
      islog: req.session.isLogged || null,
      role: req.session.role || null,
    };
    res.render("layout", { template: "./login", session:session});
    res.end();
}
/**
 * traitement du form de connexion 
 */
export const loginProcess = async (req, res) => {
    let { username, password } = req.body;
    // Ensure the input fields exists and are not empty
    if (username && password) {


        // selection du compte basé sur email ET pwd
        try {
           
          const query = `SELECT role.title AS role
                FROM role
                JOIN user ON user.id_role = role.id
                WHERE user.alias = ? AND user.pwd = ? 
            `;
            const [result] = await pool.execute(query, [username, password]);
            // si reponse pleine -> user existe 

            if (result.length > 0) {
                //on a bien un user -> set de la session 
                req.session.isLogged = true;
                req.session.username = username;
                req.session.role = result[0].role;
                // Redirection  home page
                res.redirect("/");
                res.end();
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
  const session = {
    user: req.session.username || null,
    islog: req.session.isLogged || null,
    role: req.session.role || null,
  };
    const datas = req.body;
    const alias = datas.alias;
    const email = datas.email;
    const pwd = datas.password;
    // hash du pwd
    const hash = await  bcrypt.hash(pwd, 10)

    try {
        const query = `INSERT INTO user (alias, email, pwd, regdate) VALUES (?, ?, ?, NOW())`;
        await pool.execute(query, [alias, email, hash]);
        res.redirect (`/`)
        res.end();
    
    } catch (error) {
        res.json({ msg: error });
    }
};