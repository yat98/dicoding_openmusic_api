/* c8 ignore next 2 */
import amqp from 'amqplib';
import broker from '../../../config/broker.js';

const ProducersService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(broker.rabbitmq.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ProducersService;
