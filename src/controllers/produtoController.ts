import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { Request, Response } from "express";
import { verifyAccess } from "../utils/jwt.ts";

enum produtoColumns {
  TAMANHO = "tamanho",
  MODELO = "modelo",
  TECIDO = "tecido",
  COR = "cor",
  ESTAMPA = "estampa",
  BLOCO = "bloco",
  ESTOQUE = "estoque"
}

export const createProduto = async (req: Request, res: Response) => {
  const { body } = req;
  const token = req?.headers?.authorization?.slice("Bearer ".length);
  const payload = verifyAccess(token || "");
  try {
    const produto = await prismaClient.produto.create({
      data: {
        ...body,
        userId: payload.userId,
      },
    });

    res.status(201).json(produto);
  } catch (error) {
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listProdutos = async (_: Request, res: Response) => {
  try {
    const pedidos = await prismaClient.produto.findMany();
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const listProdutoById = async (req: Request, res: Response) => {
  try {
    const { params } = req;

    const produto = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto não existe no banco de dados.",
      });
    }

    return res.json(produto);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const updateProduto = async (req: Request, res: Response) => {
  try {
    const { params, body } = req;
    const bodyKeys: string[] = Object.keys(body);
    const token = req?.headers?.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "");
    for (const key of bodyKeys) {
      if (
        key !== produtoColumns.TAMANHO &&
        key !== produtoColumns.MODELO &&
        key !== produtoColumns.TECIDO &&
        key !== produtoColumns.ESTAMPA &&
        key !== produtoColumns.COR &&
        key !== produtoColumns.ESTOQUE
      )
        return res.status(404).send("Colunas não existentes");
    }
    const produtoToUpdated = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });
    if (produtoToUpdated?.userId !== payload.userId) {
      return res.status(403).send("Produto não pertence ao usuário");
    }
    const produto = await prismaClient.produto.update({
      where: { id: Number(params.id) },
      data: {
        ...body,
      },
    });
    return res.status(200).json({
      message: "Produto atualizado!",
      data: produto,
    });
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code == "P2025") {
      res.status(404).send("Produto não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};

export const deleteProduto = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const token = req?.headers?.authorization?.slice("Bearer ".length);
    const payload = verifyAccess(token || "");
    const produtoToDelete = await prismaClient.produto.findUnique({
      where: {
        id: Number(params.id),
      },
    });
    if (produtoToDelete?.userId !== payload.userId) {
      return res.status(403).send("Produto não pertence ao usuário");
    }
    await prismaClient.produto.delete({
      where: {
        id: Number(params.id),
      },
    });
    res.status(200).send("Produto deletado com sucesso!");
  } catch (error) {
    if ((error as PrismaClientKnownRequestError).code == "P2025") {
      res.status(404).send("Produto não encontrado!");
    }
    console.log(error);
    res.status(500).send(`Erro no servidor: ${error}`);
  }
};
