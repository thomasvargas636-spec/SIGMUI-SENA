import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// View engine setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "frontend/src/views"));

// Static assets (css, js, data, images)
app.use(express.static(path.join(__dirname, "frontend/src")));

// Default locals shared by all admin pages, until real auth exists
const defaultUser = {
  name: "Thom Vargas",
  role: "Administrator",
  avatarUrl: "/img/default-avatar.png",
};

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

app.get("/auth/login", (req, res) => {
  res.render("pages/auth/loginView", {
    title: "Log In",
  });
});

app.get("/dashboard", (req, res) => {
  res.render("pages/home/home", {
    title: "Dashboard",
    user: defaultUser,
    currentRoute: "dashboard",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});