export const socketEvents = (io) => {
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
  
      socket.on("joinHousehold", (householdId) => {
        socket.join(householdId);
        socket.householdId = householdId;
        console.log(`${socket.id} joined household ${householdId}`);
      });

      socket.on("cartCreated", ({ householdId, cartId, cartName, createdBy }) => {
        socket.to(householdId).emit("cartNotification", {
          type: "created",
          cartId,
          cartName,
          message: `${createdBy} created a new shopping cart: "${cartName}".`,
        });
      });
  
      socket.on("cartUpdated", ({ householdId, cartId }) => {
        socket.to(householdId).emit("cartNotification", {
          type: "updated",
          cartId,
          message: `The shopping cart was updated.`,
        });
      });
  
      socket.on("cartDeleted", ({ householdId, cartId }) => {
        socket.to(householdId).emit("cartDeleted", {
          type: "deleted",
          cartId,
        });
        socket.to(householdId).emit("cartNotification", {
          type: "deleted",
          cartId,
          message: `A shopping cart was deleted.`,
        });
      });
  
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  };