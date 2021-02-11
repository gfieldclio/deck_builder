class Messaging {
  constructor() {
    this.handlers = {};
    this.serverConnection = new WebSocket('ws://localhost:9090');

    this.serverConnection.onmessage = this._handleMessage.bind(this);
  }

  on(eventName, handler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    this.handlers[eventName].push(handler);
  };

  off(eventName, handler) {
    if (!this.handlers[eventName]) {
      return;
    }

    this.handlers[eventName] = this.handlers[eventName].filter(
      (currentHander) => currentHander === handler
    );
  };

  join(gameCode, name) {
    this.gameCode = gameCode;

    this._sendToServer({
      type: 'join',
      gameCode,
      name,
    });
  };

  send(data) {
    this.dataChannel.send(data);
  }

  _handleMessage(message) {
    console.log('Got message', message.data);
    const data = JSON.parse(message.data);

    switch (data.type) {
      case 'joined':
        this._sendToServerWebRTCOffer();
        break;
      case 'offer':
        this._handleWebRTCOffer(message.offer);
        break;
      case 'answer':
        this._handleWebRTCAnswer(message.answer);
        break;
      case 'candidate':
        this._handleWebRTCCandidate(message.candidate);
        break;
      default:
        break;
    }

    this._broadcast(data.type, data);
  };

  async _sendWebRTCOffer() {
    this._createWebRTCConnection();
    const offer = await peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this._sendToServer({
      gameCode: this.gameCode,
      offer,
      type: 'offer',
    });
  };

  async _handleWebRTCOffer(offer) {
    this._createWebRTCConnection();
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this._sendToServer({
      gameCode: this.gameCode,
      answer,
      type: 'answer',
    });
  };

  async _handleWebRTCAnswer() {
    const remoteDesc = new RTCSessionDescription(message.answer);
    await this.peerConnection.setRemoteDescription(remoteDesc);

    this.dataChannel = this.peerConnection.createDataChannel();
  }

  async _handleWebRTCCandidate() {
    await this.peerConnection.addIceCandidate(message.iceCandidate);
  }

  _createWebRTCConnection() {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.addEventListener('icecandidate', event => {
      if (event.candidate) {
        this._sendToServer({
          gameCode: this.gameCode,
          candidate: event.candidate,
          type: 'candidate',
        });
      }
    });

    this.peerConnection.addEventListener('connectionstatechange', event => {
      if (this.peerConnection.connectionState === 'connected') {
        this._broadcast('connected', event);
      }
    });

    this.peerConnection.addEventListener('datachannel', event => {
      this.dataChannel = event.channel;
    });
  };

  _listenToDataChannel() {
    this.dataChannel.addEventListener('open', event => {
      this._broadcast('dataChannelOpen', event);
    });

    this.dataChannel.addEventListener('close', event => {
      this._broadcast('dataChannelClose', event);
    });
  }

  _broadcast(eventName, data) {
    if (!this.handlers[eventName]) {
      return;
    }

    this.handlers[eventName].map((handler) => {
      handler(data);
    });
  };

  _sendToServer(data) {
    this.serverConnection.send(JSON.stringify(data));
  };
}

export default new Messaging();
