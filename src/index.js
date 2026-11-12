import express from "express";
import dotenv from "dotenv";
import proveedoresRoutes from "./routes/proveedores.routes.js";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use("/api", proveedoresRoutes);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});