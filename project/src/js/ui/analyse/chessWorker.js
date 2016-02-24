import { Chess } from 'chess.js';

export default function chessWorker(self) {
  function forsyth(role) {
    return role === 'knight' ? 'n' : role[0];
  }

  self.onmessage = function (msg) {
    switch (msg.data.topic) {
      case 'dests':
        getDests(msg.data.payload);
        break;
      case 'move':
        addMove(msg.data.payload);
        break;
    }
  };

  function getDests(data) {
    const { fen, path } = data;
    const chess = new Chess(fen, 0);
    self.postMessage({
      topic: 'dests',
      payload: {
        dests: chess.dests(),
        path
      }
    });
  }

  function addMove(data) {
    console.log(data);
    const { fen, promotion, orig, dest, path } = data;
    const promotionLetter = (dest[1] === '1' || dest[1] === '8') ?
    (promotion ? forsyth(promotion) : 'q') : null;
    const chess = new Chess(fen, 0);
    const move = chess.move({
      from: orig,
      to: dest,
      promotion: promotionLetter
    });
    self.postMessage({
      topic: 'step',
      payload: {
        step: {
          dests: chess.dests(),
          fen: chess.fen(),
          ply: chess.ply,
          uci: move.uci,
          san: move.san
        },
        path
      }
    });
  }
}
