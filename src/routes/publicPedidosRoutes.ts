import { Router } from "express";
import {
  updateStatus,
} from "../controllers/pedidosController.ts";

const publicPedidosRouter = Router();

publicPedidosRouter.patch("/pedidos/:id", updateStatus);

export default publicPedidosRouter;
