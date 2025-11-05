import { Server } from 'socket.io';

export const handleSocketConnections = (io: Server) => {
  console.log('Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join user to their personal room
    socket.on('join:user', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their personal room`);
    });

    // Join restaurant to their room for order notifications
    socket.on('join:restaurant', (restaurantId: string) => {
      socket.join(`restaurant:${restaurantId}`);
      console.log(`Restaurant ${restaurantId} joined their room`);
    });

    // Join delivery partner to their room
    socket.on('join:delivery', (partnerId: string) => {
      socket.join(`delivery:${partnerId}`);
      console.log(`Delivery partner ${partnerId} joined their room`);
    });

    // Handle order status updates
    socket.on('order:status_update', (data: { orderId: string; status: string }) => {
      socket.broadcast.emit(`order:${data.orderId}`, {
        type: 'status_update',
        orderId: data.orderId,
        status: data.status,
        timestamp: new Date().toISOString()
      });
    });

    // Handle new order notifications
    socket.on('order:new', (data: { restaurantId: string; orderData: any }) => {
      io.to(`restaurant:${data.restaurantId}`).emit('order:new', {
        type: 'new_order',
        orderData: data.orderData,
        timestamp: new Date().toISOString()
      });
    });

    // Handle delivery requests
    socket.on('delivery:request', (data: { orderData: any; location: any }) => {
      socket.broadcast.emit('delivery:request', {
        type: 'delivery_request',
        orderData: data.orderData,
        location: data.location,
        timestamp: new Date().toISOString()
      });
    });

    // Handle location updates from delivery partners
    socket.on('delivery:location_update', (data: { orderId: string; location: any }) => {
      socket.broadcast.emit(`delivery:${data.orderId}`, {
        type: 'location_update',
        orderId: data.orderId,
        location: data.location,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};