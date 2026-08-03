import { Server, Socket } from 'socket.io';
import {
  createCase,
  getCase,
  joinCase,
  leaveCase,
  updateHostSettings,
  toggleReady,
  updatePlayerProfile,
  kickPlayer,
  startMatch,
  finishRoleReveal,
  killerSelectCards,
  meSelectDraftClue,
  meConfirmClue,
  submitVote,
  killerGuessWitness,
  jokerSecretGuessKiller,
  returnToLobby,
  getClientState,
} from './caseManager';

export function setupSocketHandlers(io: Server) {
  function broadcastCaseState(caseCode: string) {
    const c = getCase(caseCode);
    if (!c) return;

    c.players.forEach((p) => {
      const clientState = getClientState(caseCode, p.id);
      if (clientState && p.socketId) {
        io.to(p.socketId).emit('case_state_updated', clientState);
      }
    });
  }

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('create_case', ({ profile }, callback) => {
      try {
        const c = createCase(profile, socket.id);
        socket.join(c.caseCode);
        broadcastCaseState(c.caseCode);
        if (callback) callback({ success: true, caseCode: c.caseCode });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('join_case', ({ caseCode, profile }, callback) => {
      try {
        const c = joinCase(caseCode, profile, socket.id);
        socket.join(c.caseCode);
        broadcastCaseState(c.caseCode);
        if (callback) callback({ success: true, caseCode: c.caseCode });
      } catch (err: any) {
        if (callback) callback({ success: false, error: err.message });
      }
    });

    socket.on('update_host_settings', ({ caseCode, hostId, settings }) => {
      try {
        updateHostSettings(caseCode, hostId, settings);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('toggle_ready', ({ caseCode, playerId }) => {
      try {
        toggleReady(caseCode, playerId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('update_profile', ({ caseCode, playerId, profile }) => {
      try {
        updatePlayerProfile(caseCode, playerId, profile);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('kick_player', ({ caseCode, hostId, targetPlayerId }) => {
      try {
        kickPlayer(caseCode, hostId, targetPlayerId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('start_match', ({ caseCode, hostId }) => {
      try {
        startMatch(caseCode, hostId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('finish_role_reveal', ({ caseCode }) => {
      try {
        finishRoleReveal(caseCode);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('killer_select_cards', ({ caseCode, killerId, weaponId, evidenceId }) => {
      try {
        killerSelectCards(caseCode, killerId, weaponId, evidenceId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('me_select_draft_clue', ({ caseCode, meId, folderIndex, clueTag }) => {
      try {
        meSelectDraftClue(caseCode, meId, folderIndex, clueTag);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('me_confirm_clue', ({ caseCode, meId, folderIndex }) => {
      try {
        meConfirmClue(caseCode, meId, folderIndex);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('submit_vote', ({ caseCode, voterId, targetPlayerId, weaponId, evidenceId }) => {
      try {
        submitVote(caseCode, voterId, targetPlayerId, weaponId, evidenceId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('killer_guess_witness', ({ caseCode, killerId, witnessGuessId }) => {
      try {
        killerGuessWitness(caseCode, killerId, witnessGuessId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('joker_secret_guess', ({ caseCode, jokerId, killerGuessId }) => {
      try {
        jokerSecretGuessKiller(caseCode, jokerId, killerGuessId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('return_to_lobby', ({ caseCode, hostId }) => {
      try {
        returnToLobby(caseCode, hostId);
        broadcastCaseState(caseCode);
      } catch (err: any) {
        socket.emit('error_message', err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      const res = leaveCase(socket.id);
      if (res) {
        broadcastCaseState(res.caseCode);
      }
    });
  });
}
