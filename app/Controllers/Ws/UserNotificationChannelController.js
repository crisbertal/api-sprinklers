'use strict'

class GeneralChanelController {
  constructor({ socket, request, auth }) {
    this.socket = socket
    this.request = request
  }

  onMessage(message) {
    this.socket.broadcastToAll('message', message)
  }
}

module.exports = GeneralChanelController
