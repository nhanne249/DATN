import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProperty')
  handleJoinProperty(
    @MessageBody() propertyId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`property:${propertyId}`);
    return { joined: `property:${propertyId}` };
  }

  emitRoomStatusChanged(
    propertyId: string,
    payload: { roomId: string; roomNumber: string; status: string },
  ) {
    this.server
      .to(`property:${propertyId}`)
      .emit('roomStatusChanged', payload);
  }

  emitBookingCreated(propertyId: string, payload: { bookingId: string }) {
    this.server.to(`property:${propertyId}`).emit('bookingCreated', payload);
  }

  emitTaskUpdated(
    propertyId: string,
    payload: { taskId: string; status: string },
  ) {
    this.server.to(`property:${propertyId}`).emit('taskUpdated', payload);
  }

  emitLaundryUpdated(
    propertyId: string,
    payload: { orderId: string; status: string },
  ) {
    this.server.to(`property:${propertyId}`).emit('laundryUpdated', payload);
  }
}
