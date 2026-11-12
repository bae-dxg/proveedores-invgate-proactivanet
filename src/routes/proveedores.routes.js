import { Router } from "express";
import { obtenerProveedores } from "../controllers/proveedores.controller.js";

const router = Router();

router.get("/proveedores", obtenerProveedores);

export default router;