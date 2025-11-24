import axios from "axios";

class SimuladorService {
  constructor() {}
  async enviarPedidoParaFila(pedido: any, produtos: any ) {
    try {
      const pedidoId = pedido.id;
      // produtos is expected to be an array of items with { bloco, quantidade }
      const orderItems = produtos.map((produto: any) => ({ bloco: produto.bloco, quantidade: produto.quantidade || 1 }));

      // Log do que vamos enviar ao simulador para facilitar debug
      console.log('Enviando ao simulador', { pedidoId, orderItems });

      const result = await axios({
        method: "post",
        url: "http://52.72.137.244:3000/queue/items",
        data: {
          payload: {
            orderId: pedidoId,
            order: orderItems,
          },
          callbackUrl: `http://localhost:3000/pedidos/${pedidoId}`,
        },
      });

      return result;
    } catch (error: any) {
      console.error('Erro ao enviar pedido para simulador:', error.response?.data || error.message || error);
      throw error;
    }
  }
}

export const simuladorService = new SimuladorService();
