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
    this.name = name;

    this._sendToServer({
      type: 'join',
    });
  };

  send(data) {
    this.dataChannel.send(data);
  }

  _handleMessage(message) {
    const data = JSON.parse(message.data);
    console.log('Got message', data);

    switch (data.type) {
      case 'joined':
        this._sendWebRTCOffer();
        break;
      case 'offer':
        this._handleWebRTCOffer(data.offer);
        break;
      case 'answer':
        this._handleWebRTCAnswer(data.answer);
        break;
      case 'candidate':
        this._handleWebRTCCandidate(data.candidate);
        break;
      default:
        break;
    }

    this._broadcast(data.type, data);
  };

  _sendWebRTCOffer() {
    let offer;
    this._createWebRTCConnection();
    this.dataChannel = this.peerConnection.createDataChannel('data', { reliable: true });
    this._listenToDataChannel();
    this.peerConnection.createOffer().then(createdOffer => {
      offer = createdOffer;

      return this.peerConnection.setLocalDescription(offer);
    }).then(() => {
      this._sendToServer({
        offer,
        type: 'offer',
      });
    });
  };

  _handleWebRTCOffer(offer) {
    let answer;
    this._createWebRTCConnection();
    this.peerConnection.onicecandidate = event => {
      console.log('onicecandidate', event);
      if (event.candidate) {
        this._sendToServer({
          candidate: event.candidate,
          type: 'candidate',
        });
      }
    };

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    this.peerConnection.createAnswer().then(createdAnswer => {
      answer = createdAnswer;

      return this.peerConnection.setLocalDescription(answer)
    }).then(() => {
      this._sendToServer({
        answer,
        type: 'answer',
      });
    });
  };

  _handleWebRTCAnswer(answer) {
    const remoteDesc = new RTCSessionDescription(answer);
    this.peerConnection.setRemoteDescription(remoteDesc);
  }

  _handleWebRTCCandidate(candidate) {
    return this.peerConnection.addIceCandidate(candidate);
  }

  _createWebRTCConnection() {
    const configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.addEventListener('connectionstatechange', event => {
      console.log('connectionstatechange', event, this.peerConnection.connectionState === 'connected');
      if (this.peerConnection.connectionState === 'connected') {
        this._broadcast('connected', event);
      }
    });

    this.peerConnection.addEventListener('datachannel', event => {
      console.log('datachannel', event);
      this.dataChannel = event.channel;
      this._listenToDataChannel();
    });
  };

  _listenToDataChannel() {
    this.dataChannel.addEventListener('open', event => {
      console.log('dataChannelOpen', event);
      this.dataChannelIsOpen = true;
      this._broadcast('dataChannelOpen', event);
    });

    this.dataChannel.addEventListener('close', event => {
      console.log('dataChannelClose', event);
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
    this.serverConnection.send(JSON.stringify({
      ...data,
      gameCode: this.gameCode,
      name: this.name,
    }));
  };
}

export default new Messaging();
