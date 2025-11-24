import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { verifyAccess } from "../utils/jwt.ts";
import { simuladorService } from "../services/simuladorService.ts";

enum pedidoColumns {
  STATUS = "status",
  USER_ID = "userId",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
}

export const createPedido = async (req: Request, res: Response) => {
  const { body } = req;
  const { produtos, ...dados } = body;
  try {
    // TO-DO -> ARMAZENAR DADOS DO USUARIO EM FORMATO DE CACHE OU ALGO PARECIDO
    const token = req?.headers?.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "");
    // produtos pode ser array de ids [1,2] ou array de objetos [{ id, quantidade }]
    let produtoIds: number[] = [];
    const quantidadeMap = new Map<number, number>();

    if (Array.isArray(produtos) && produtos.length > 0) {
      if (typeof produtos[0] === 'number') {
        produtoIds = produtos;
        produtos.forEach((id: number) => quantidadeMap.set(id, 1));
      } else if (typeof produtos[0] === 'object' && produtos[0].id) {
        produtoIds = produtos.map((p: any) => p.id);
        produtos.forEach((p: any) => quantidadeMap.set(p.id, Number(p.quantidade) || 1));
      }
    }

    // buscar produtos do pedido no banco
    const produtosDb = await prismaClient.produto.findMany({ where: { id: { in: produtoIds } } });

    // Se houver vários produtos, criar pedidos separados e enviar um por vez ao simulador
    const results: Array<any> = [];

    for (const produto of produtosDb) {
      const qtd = quantidadeMap.get(produto.id) || 1;

      // criar um pedido para este produto
      const pedidoItem = await prismaClient.pedido.create({
        data: {
          ...dados,
          userId: payload.userId,
        },
      });

      // criar ligação produto-pedido com quantidade
      await prismaClient.produtosEmPedidos.create({
        data: {
          id_pedido: pedidoItem.id,
          id_produto: produto.id,
          quantidade: qtd,
        },
      });

      // preparar e enviar apenas este item ao simulador
      const produtoForSimulador = { bloco: produto.bloco, quantidade: qtd };
      console.log('Payload para simulador (pedidoId, produtosForSimulador):', { pedidoId: pedidoItem.id, produtosForSimulador: [produtoForSimulador] });

      try {
        const resultado = await simuladorService.enviarPedidoParaFila(pedidoItem, [produtoForSimulador]);
        console.log('Enviado para simulador/bancada com sucesso!', resultado?.status);
        results.push({ pedidoId: pedidoItem.id, ok: true });
      } catch (simError: any) {
        console.error('Erro ao enviar para o simulador/bancada (pedidoId=' + pedidoItem.id + '):', simError.response?.data || simError.message || simError);
        // marcar pedido como pendente para retry posterior
        await prismaClient.pedido.update({ where: { id: pedidoItem.id }, data: { status: 'PENDENTE' } });
        results.push({ pedidoId: pedidoItem.id, ok: false, error: simError.response?.data || simError.message });
      }
    }

    // Retornar resumo dos pedidos criados/enviados
    return res.status(201).json({ results });
  } catch (error) {
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listPedidos = async (req: Request, res: Response) => {
  try {
    const token = req?.headers?.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "");
    const pedidos = await prismaClient.pedido.findMany({
      where: { userId: payload.userId },
      include: {
        produtosEmPedidos: {
          include: {
            produto: true,
          },
        },
      },
    });
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listPedidoById = async (req: Request, res: Response) => {
  try {
    const { params } = req;

    const pedido = await prismaClient.pedido.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não existe no banco de dados.",
      });
    }

    return res.json(pedido);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { params, body } = req;
    const bodyKeys: string[] = Object.keys(body);
    for (const key of bodyKeys) {
      if (
        key !== pedidoColumns.STATUS &&
        key !== pedidoColumns.USER_ID &&
        key !== pedidoColumns.CREATED_AT &&
        key !== pedidoColumns.UPDATED_AT
      )
        return res.status(404).send("Colunas não existentes");
    }
    const pedido = await prismaClient.pedido.update({
      where: { id: Number(params.id) },
      data: {
        ...body,
      },
    });
    return res.status(200).json({
      message: "Pedido atualizado!",
      data: pedido,
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code == "P2025") {
      res.status(404).send("Pedido não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    await prismaClient.pedido.delete({
      where: {
        id: Number(params.id),
      },
    });
    res.status(200).send("Pedido deletado com sucesso!");
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code == "P2025") {
      res.status(404).send("Pedido não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { params, query } = req;
  try {
    // aceitar status via query ?status= or via body { status: '...' } (ex.: callback da bancada)
    const status = String(query.status || req.body?.status || "");
    const pedidoUpdate = await prismaClient.pedido.update({
      where: { id: Number(params.id) },
      data: {
        status,
      },
    });

    return res.status(200).json({
      message: "Pedido atualizado!",
      data: pedidoUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
