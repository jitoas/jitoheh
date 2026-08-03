import { Card, CaseState, CaseSettings, Player, Role, VoteResult, ConfirmedClue } from '../types';
import { WEAPONS_DATABASE } from '../data/weapons';
import { EVIDENCE_DATABASE } from '../data/evidence';
import { INVESTIGATION_FOLDERS } from '../data/clues';
import { getRandomEvent } from '../data/events';

const casesMap = new Map<string, CaseState>();

function generateCaseCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createCase(hostProfile: { id: string; name: string; avatar: string }, socketId: string): CaseState {
  let code = generateCaseCode();
  while (casesMap.has(code)) {
    code = generateCaseCode();
  }

  const hostPlayer: Player = {
    id: hostProfile.id,
    name: hostProfile.name,
    avatar: hostProfile.avatar,
    isHost: true,
    isReady: true,
    role: null,
    weapons: [],
    evidence: [],
    hasVoted: false,
    socketId,
    isConnected: true,
    profileEditedThisMatch: false,
  };

  const newCase: CaseState = {
    caseCode: code,
    caseName: `قضية #${code}`,
    hostId: hostProfile.id,
    settings: {
      enableJoker: true,
      medicalExaminerMode: 'random',
      medicalExaminerPlayerId: null,
      clueReleaseSpeed: 'normal',
      maxPlayers: 8,
    },
    phase: 'LOBBY',
    players: [hostPlayer],
    selectedWeapon: null,
    selectedEvidence: null,
    killerId: null,
    accompliceId: null,
    witnessId: null,
    medicalExaminerId: null,
    jokerId: null,
    jokerVotedOut: false,
    jokerTargetKillerGuess: null,
    confirmedClues: [],
    clueCycleStartTime: null,
    meDraftClues: {},
    meChangedClueCount: 0,
    votes: {},
    latestVoteResult: null,
    killerWitnessGuess: null,
    winnerTeam: null,
    jokerStoleVictory: false,
    activeRandomEvent: null,
    matchStartTime: null,
    log: [`تم إنشاء القضية #${code} بواسطة المضيف ${hostProfile.name}.`],
  };

  casesMap.set(code, newCase);
  return newCase;
}

export function getCase(code: string): CaseState | undefined {
  return casesMap.get(code.toUpperCase());
}

export function joinCase(
  code: string,
  profile: { id: string; name: string; avatar: string },
  socketId: string
): CaseState {
  const c = getCase(code);
  if (!c) {
    throw new Error('القضية غير موجودة. يرجى التحقق من رمز القضية.');
  }

  // Check if player is reconnecting or existing
  const existingPlayerIndex = c.players.findIndex((p) => p.id === profile.id);
  if (existingPlayerIndex !== -1) {
    // Reconnect existing player cleanly!
    const p = c.players[existingPlayerIndex];
    p.socketId = socketId;
    p.isConnected = true;
    p.name = profile.name;
    p.avatar = profile.avatar;
    c.log.push(`اللاعب ${profile.name} أعاد الاتصال بالقضية #${c.caseCode}.`);
    return c;
  }

  if (c.players.length >= c.settings.maxPlayers) {
    throw new Error('وصلت هذه القضية إلى الحد الأقصى لسعة اللاعبين.');
  }

  const newPlayer: Player = {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar,
    isHost: false,
    isReady: false,
    role: null,
    weapons: [],
    evidence: [],
    hasVoted: false,
    socketId,
    isConnected: true,
    profileEditedThisMatch: false,
  };

  c.players.push(newPlayer);
  c.log.push(`اللاعب ${profile.name} انضم إلى القضية #${c.caseCode}.`);
  return c;
}

export function leaveCase(socketId: string): { caseCode: string; playerId: string } | null {
  for (const [code, c] of casesMap.entries()) {
    const player = c.players.find((p) => p.socketId === socketId);
    if (player) {
      player.isConnected = false;
      c.log.push(`اللاعب ${player.name} قطع الاتصال عن القضية #${code}.`);

      // If in lobby and disconnected, remove unless host
      if (c.phase === 'LOBBY') {
        c.players = c.players.filter((p) => p.id !== player.id);
        // Transfer host if host disconnected
        if (player.isHost && c.players.length > 0) {
          c.players[0].isHost = true;
          c.hostId = c.players[0].id;
          c.log.push(`تم نقل الإدارة إلى ${c.players[0].name}.`);
        }
      }
      return { caseCode: code, playerId: player.id };
    }
  }
  return null;
}

export function updateHostSettings(code: string, hostId: string, settings: Partial<CaseSettings>): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.hostId !== hostId) throw new Error('يمكن للمضيف فقط تعديل إعدادات القضية');
  if (c.phase !== 'LOBBY') throw new Error('يمكن تغيير الإعدادات فقط في صالة الانتظار');

  c.settings = { ...c.settings, ...settings };
  c.log.push(`قام المضيف بتحديث إعدادات القضية.`);
  return c;
}

export function toggleReady(code: string, playerId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  const player = c.players.find((p) => p.id === playerId);
  if (!player) throw new Error('اللاعب غير موجود');

  player.isReady = !player.isReady;
  return c;
}

export function updatePlayerProfile(
  code: string,
  playerId: string,
  newProfile: { name: string; avatar: string }
): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  const player = c.players.find((p) => p.id === playerId);
  if (!player) throw new Error('اللاعب غير موجود');

  if (c.phase !== 'LOBBY' && player.profileEditedThisMatch) {
    throw new Error('تعديل الملف الشخصي محظور أثناء مباراة نشطة');
  }

  player.name = newProfile.name;
  player.avatar = newProfile.avatar;
  if (c.phase !== 'LOBBY') {
    player.profileEditedThisMatch = true;
  }
  return c;
}

export function kickPlayer(code: string, hostId: string, targetPlayerId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.hostId !== hostId) throw new Error('يمكن للمضيف فقط طرد اللاعبين');

  const target = c.players.find((p) => p.id === targetPlayerId);
  if (target) {
    c.players = c.players.filter((p) => p.id !== targetPlayerId);
    c.log.push(`قام المضيف بطرد ${target.name} من القضية.`);
  }
  return c;
}

export function getClueCycleDuration(settings: CaseSettings): number {
  if (settings.clueReleaseSpeed === 'fast') return 30;
  if (settings.clueReleaseSpeed === 'normal') return 60;
  if (settings.clueReleaseSpeed === 'slow') return 120;
  if (settings.clueReleaseSpeed === 'custom') return settings.customClueTimeSeconds || 45;
  return 60;
}

export function startMatch(code: string, hostId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.hostId !== hostId) throw new Error('يمكن للمضيف فقط بدء المباراة');
  if (c.players.length < 4) throw new Error('يلزم وجود 4 لاعبين على الأقل لبدء التحقيق');

  const unready = c.players.filter((p) => !p.isReady);
  if (unready.length > 0) throw new Error('يجب أن يكون جميع اللاعبين المتصلين جاهزين قبل البدء');

  // Reset match state
  c.phase = 'ROLE_REVEAL';
  c.matchStartTime = Date.now();
  c.selectedWeapon = null;
  c.selectedEvidence = null;
  c.confirmedClues = [];
  c.clueCycleStartTime = null;
  c.meDraftClues = {};
  c.meChangedClueCount = 0;
  c.votes = {};
  c.latestVoteResult = null;
  c.killerWitnessGuess = null;
  c.winnerTeam = null;
  c.jokerStoleVictory = false;
  c.jokerVotedOut = false;
  c.jokerTargetKillerGuess = null;
  c.activeRandomEvent = null;

  // 1. Assign Roles
  const shuffledPlayers = shuffle(c.players);
  let remainingPlayers = [...shuffledPlayers];

  // Medical Examiner assignment
  let mePlayer: Player;
  if (c.settings.medicalExaminerMode === 'host_chooses' && c.settings.medicalExaminerPlayerId) {
    const designatedMe = c.players.find((p) => p.id === c.settings.medicalExaminerPlayerId);
    if (designatedMe) {
      mePlayer = designatedMe;
      remainingPlayers = remainingPlayers.filter((p) => p.id !== designatedMe.id);
    } else {
      mePlayer = remainingPlayers.pop()!;
    }
  } else {
    mePlayer = remainingPlayers.pop()!;
  }
  mePlayer.role = 'MEDICAL_EXAMINER';
  c.medicalExaminerId = mePlayer.id;

  // Killer
  const killerPlayer = remainingPlayers.pop()!;
  killerPlayer.role = 'KILLER';
  c.killerId = killerPlayer.id;

  // Accomplice
  const accomplicePlayer = remainingPlayers.pop()!;
  accomplicePlayer.role = 'ACCOMPLICE';
  c.accompliceId = accomplicePlayer.id;

  // Witness
  const witnessPlayer = remainingPlayers.pop()!;
  witnessPlayer.role = 'WITNESS';
  c.witnessId = witnessPlayer.id;

  // Joker (Optional)
  if (c.settings.enableJoker && remainingPlayers.length > 0) {
    const jokerPlayer = remainingPlayers.pop()!;
    jokerPlayer.role = 'JOKER';
    c.jokerId = jokerPlayer.id;
  } else {
    c.jokerId = null;
  }

  // Remaining become Investigators
  remainingPlayers.forEach((p) => {
    p.role = 'INVESTIGATOR';
  });

  // 2. Distribute 4 Weapons & 4 Evidence to all non-ME players
  const shuffledWeapons = shuffle(WEAPONS_DATABASE);
  const shuffledEvidence = shuffle(EVIDENCE_DATABASE);

  let weaponIdx = 0;
  let evidenceIdx = 0;

  c.players.forEach((p) => {
    p.hasVoted = false;
    p.profileEditedThisMatch = false;
    if (p.role === 'MEDICAL_EXAMINER') {
      p.weapons = [];
      p.evidence = [];
    } else {
      p.weapons = shuffledWeapons.slice(weaponIdx, weaponIdx + 4);
      weaponIdx += 4;
      p.evidence = shuffledEvidence.slice(evidenceIdx, evidenceIdx + 4);
      evidenceIdx += 4;
    }
  });

  c.log.push(`انطلق التحقيق في الجريمة! تم توزيع الأدوار وبطاقات مسرح الجريمة.`);
  return c;
}

export function finishRoleReveal(code: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.phase === 'ROLE_REVEAL') {
    c.phase = 'KILLER_SELECTION';
    c.log.push(`انتهت مرحلة كشف الأدوار. يدخل القاتل الآن مرحلة اختيار سلاح الجريمة والدليل.`);
  }
  return c;
}

function determineCauseOfDeath(weaponName: string, tags: string[] = []): string {
  const text = (weaponName + ' ' + tags.join(' ')).toLowerCase();
  if (text.includes('سم') || text.includes('دواء') || text.includes('poison') || text.includes('vial') || text.includes('جرعة') || text.includes('كيميائي') || text.includes('حقنة')) {
    return 'تسمم'; // Poisoning
  }
  if (text.includes('حبل') || text.includes('سلك') || text.includes('خنق') || text.includes('rope') || text.includes('strangle') || text.includes('شال') || text.includes('رباط')) {
    return 'خنق'; // Strangulation
  }
  if (text.includes('سكين') || text.includes('سيف') || text.includes('خنجر') || text.includes('مقص') || text.includes('شفرة') || text.includes('knife') || text.includes('blade') || text.includes('طعن') || text.includes('منشار')) {
    return 'طعن'; // Stabbing
  }
  if (text.includes('مسدس') || text.includes('بندقية') || text.includes('رصاص') || text.includes('سلاح ناري') || text.includes('gun') || text.includes('pistol') || text.includes('إطلاق') || text.includes('قناص')) {
    return 'إطلاق نار'; // Shooting
  }
  if (text.includes('نار') || text.includes('شمعة') || text.includes('حرق') || text.includes('زيت') || text.includes('fire') || text.includes('burn') || text.includes('ولاعة')) {
    return 'حرق'; // Burning
  }
  if (text.includes('ماء') || text.includes('سائل') || text.includes('غرق') || text.includes('دلو') || text.includes('water') || text.includes('drown') || text.includes('مسبح')) {
    return 'غرق'; // Drowning
  }
  return 'صدمة قوة حادة'; // Blunt Force Trauma
}

function determineCrimeSceneLocation(weaponName: string, tags: string[] = []): string {
  const text = (weaponName + ' ' + tags.join(' ')).toLowerCase();
  if (text.includes('غابة') || text.includes('حديقة') || text.includes('شارع') || text.includes('شاطئ') || text.includes('خارجي') || text.includes('سيارة')) {
    return 'خارجي';
  }
  if (text.includes('مستشفى') || text.includes('حقنة') || text.includes('دواء')) {
    return 'مستشفى';
  }
  if (text.includes('مدرسة') || text.includes('قلم') || text.includes('كتاب')) {
    return 'مدرسة';
  }
  if (text.includes('مطرقة') || text.includes('خشب') || text.includes('بناء') || text.includes('منشار')) {
    return 'موقع بناء';
  }
  if (text.includes('منزل') || text.includes('مطبخ') || text.includes('وسادة')) {
    return 'منزل';
  }
  return 'داخلي';
}

export function killerSelectCards(code: string, killerId: string, weaponId: string, evidenceId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.killerId !== killerId) throw new Error('يمكن للقاتل فقط اختيار سلاح الجريمة والدليل');

  const killer = c.players.find((p) => p.id === killerId);
  if (!killer) throw new Error('القاتل غير موجود');

  const chosenW = killer.weapons.find((w) => w.id === weaponId);
  const chosenE = killer.evidence.find((e) => e.id === evidenceId);

  if (!chosenW || !chosenE) {
    throw new Error('يجب اختيار السلاح والدليل من مخزون القاتل');
  }

  c.selectedWeapon = chosenW;
  c.selectedEvidence = chosenE;
  c.phase = 'INVESTIGATION';
  const now = Date.now();
  c.clueCycleStartTime = now;

  const locClue = determineCrimeSceneLocation(chosenW.name, chosenW.tags);
  const codClue = determineCauseOfDeath(chosenW.name, chosenW.tags);

  c.confirmedClues = [
    { folderIndex: 0, folderName: INVESTIGATION_FOLDERS[0].name, clueTag: locClue, confirmedAt: now },
    { folderIndex: 1, folderName: INVESTIGATION_FOLDERS[1].name, clueTag: codClue, confirmedAt: now },
  ];

  c.log.push(`قام القاتل بسريّة باختيار سلاح الجريمة والدليل.`);
  c.log.push(`تم كشف الدليلين الدائمين تلقائياً: موقع الجريمة (${locClue}) وسبب الوفاة (${codClue}).`);
  return c;
}

export function meSelectDraftClue(code: string, meId: string, folderIndex: number, clueTag: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.medicalExaminerId !== meId) throw new Error('يمكن للطبيب الشرعي فقط اختيار أدلة التحقيق');

  c.meDraftClues[folderIndex] = clueTag;
  return c;
}

export function meConfirmClue(code: string, meId: string, folderIndex: number): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.medicalExaminerId !== meId) throw new Error('يمكن للطبيب الشرعي فقط تأكيد الأدلة');

  if (folderIndex === 0 || folderIndex === 1) {
    throw new Error('الدليلان الأول والثاني دائمين ومكشوفين من بداية القضية');
  }

  const now = Date.now();
  const duration = getClueCycleDuration(c.settings);
  const elapsedSeconds = c.clueCycleStartTime ? Math.floor((now - c.clueCycleStartTime) / 1000) : duration;
  if (c.clueCycleStartTime && elapsedSeconds < duration - 2) {
    const remaining = Math.max(1, duration - elapsedSeconds);
    throw new Error(`لا يمكنك كشف الدليل حتى ينتهي مؤقت الأدلة (متبقي ${remaining} ثانية)`);
  }

  const draftTag = c.meDraftClues[folderIndex];
  if (!draftTag) throw new Error('لم يتم تحديد دليل في المجلد');

  const folder = INVESTIGATION_FOLDERS.find((f) => f.id === folderIndex);
  if (!folder) throw new Error('مجلد غير صالح');

  // Check if replacing an existing clue (ME can change 1 clue max per match)
  const existingIndex = c.confirmedClues.findIndex((cc) => cc.folderIndex === folderIndex);
  if (existingIndex !== -1) {
    if (c.meChangedClueCount >= 1) {
      throw new Error('يمكن للطبيب الشرعي تغيير دليل واحد فقط خلال المباراة');
    }
    c.confirmedClues[existingIndex] = {
      folderIndex,
      folderName: folder.name,
      clueTag: draftTag,
      confirmedAt: Date.now(),
    };
    c.meChangedClueCount++;
    c.log.push(`قام الطبيب الشرعي بتغيير دليل مجلد التحقيق #${folderIndex + 1} إلى "${draftTag}".`);
  } else {
    c.confirmedClues.push({
      folderIndex,
      folderName: folder.name,
      clueTag: draftTag,
      confirmedAt: Date.now(),
    });
    c.log.push(`قام الطبيب الشرعي بإصدار دليل مجلد التحقيق #${folderIndex + 1}: "${draftTag}".`);
  }

  // Restart timer immediately for the next clue cycle
  c.clueCycleStartTime = Date.now();

  return c;
}

export function submitVote(
  code: string,
  voterId: string,
  targetPlayerId: string,
  weaponId: string,
  evidenceId: string
): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');

  const voter = c.players.find((p) => p.id === voterId);
  if (!voter) throw new Error('المصوت غير موجود');
  if (voter.hasVoted) throw new Error('لقد قمت بالتصويت بالفعل في هذا التحقيق');

  const targetPlayer = c.players.find((p) => p.id === targetPlayerId);
  if (!targetPlayer) throw new Error('اللاعب المشتبه به غير موجود');

  // Find target's cards
  const targetWeapon = targetPlayer.weapons.find((w) => w.id === weaponId);
  const targetEvidence = targetPlayer.evidence.find((e) => e.id === evidenceId);

  if (!targetWeapon || !targetEvidence) {
    throw new Error('يجب أن ينتمي السلاح والدليل إلى مخزون اللاعب المشتبه به');
  }

  voter.hasVoted = true;

  const isWeaponCorrect = targetWeapon.id === c.selectedWeapon?.id;
  const isEvidenceCorrect = targetEvidence.id === c.selectedEvidence?.id;
  const isKillerCorrect = targetPlayer.id === c.killerId;
  const isFullyCorrect = isWeaponCorrect && isEvidenceCorrect && isKillerCorrect;

  const result: VoteResult = {
    voterName: voter.name,
    targetPlayerName: targetPlayer.name,
    weaponName: targetWeapon.name,
    isWeaponCorrect,
    evidenceName: targetEvidence.name,
    isEvidenceCorrect,
    isKillerCorrect,
    isFullyCorrect,
  };

  c.votes[voterId] = { voterId, targetPlayerId, weaponId, evidenceId };
  c.latestVoteResult = result;

  c.log.push(
    `تسجيل تصويت: اتهم ${voter.name} اللاعب ${targetPlayer.name} باستعمال ${targetWeapon.name} و ${targetEvidence.name}.`
  );

  // Check Joker Elimination
  if (targetPlayer.id === c.jokerId) {
    c.jokerVotedOut = true;
    c.log.push(`تم التصويت ضد المهرج من قبل المحققين!`);
  }

  // Check If Fully Correct
  if (isFullyCorrect) {
    c.phase = 'KILLER_FINAL_GUESS';
    c.log.push(`المحققون حلوا الجريمة! يدخل القاتل المرحلة النهائية للتعرف على الشاهد.`);
  }

  return c;
}

export function killerGuessWitness(code: string, killerId: string, witnessGuessId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.killerId !== killerId) throw new Error('يمكن للقاتل فقط التخمين للتعرف على الشاهد');

  c.killerWitnessGuess = witnessGuessId;
  const isWitnessCorrect = witnessGuessId === c.witnessId;

  if (isWitnessCorrect) {
    c.winnerTeam = 'KILLER_TEAM';
    c.log.push(`تخمين صحيح للقاتل! حدد القاتل الشاهد ${c.players.find((p) => p.id === witnessGuessId)?.name}! فريق القاتل يفوز!`);
  } else {
    c.winnerTeam = 'INVESTIGATORS';
    c.log.push(`تخمين خاطئ للقاتل! فشل القاتل في التعرف على الشاهد. فريق المحققين يفوز!`);
  }

  // Check Joker Steal Victory!
  if (c.jokerVotedOut && c.jokerTargetKillerGuess === c.killerId) {
    c.jokerStoleVictory = true;
    c.winnerTeam = 'JOKER';
    c.log.push(`المهرج سرق الفوز! حدد المهرج القاتل الصحيح بعد التصويت ضده!`);
  }

  c.phase = 'END_GAME';
  return c;
}

export function jokerSecretGuessKiller(code: string, jokerId: string, killerGuessId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.jokerId !== jokerId) throw new Error('يمكن للمهرج فقط تقديم هذا التخمين السري');

  c.jokerTargetKillerGuess = killerGuessId;
  c.log.push(`قدم المهرج خياره الاستنتاجي السري.`);
  return c;
}

export function returnToLobby(code: string, hostId: string): CaseState {
  const c = getCase(code);
  if (!c) throw new Error('القضية غير موجودة');
  if (c.hostId !== hostId) throw new Error('يمكن للمضيف فقط العودة إلى صالة الانتظار');

  c.phase = 'LOBBY';
  c.selectedWeapon = null;
  c.selectedEvidence = null;
  c.killerId = null;
  c.accompliceId = null;
  c.witnessId = null;
  c.medicalExaminerId = null;
  c.jokerId = null;
  c.jokerVotedOut = false;
  c.jokerTargetKillerGuess = null;
  c.confirmedClues = [];
  c.meDraftClues = {};
  c.meChangedClueCount = 0;
  c.votes = {};
  c.latestVoteResult = null;
  c.killerWitnessGuess = null;
  c.winnerTeam = null;
  c.jokerStoleVictory = false;

  c.players.forEach((p) => {
    p.role = null;
    p.isReady = p.isHost;
    p.hasVoted = false;
    p.weapons = [];
    p.evidence = [];
    p.profileEditedThisMatch = false;
  });

  c.log.push(`تم العودة إلى صالة الانتظار. جاهز للقضية التالية.`);
  return c;
}

// Transform CaseState into role-masked ClientGameState
export function getClientState(caseCode: string, playerId: string): any {
  const c = getCase(caseCode);
  if (!c) return null;

  const mePlayer = c.players.find((p) => p.id === playerId);
  const myRole = mePlayer?.role || null;

  // Mask player roles for clients except in END_GAME or self
  const playersMasked = c.players.map((p) => {
    const isSelf = p.id === playerId;
    const isEnd = c.phase === 'END_GAME';
    return {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      isHost: p.isHost,
      isReady: p.isReady,
      hasVoted: p.hasVoted,
      isConnected: p.isConnected,
      weapons: p.weapons,
      evidence: p.evidence,
      role: isSelf || isEnd ? p.role : undefined,
    };
  });

  const intel: any = {};

  if (myRole === 'KILLER') {
    intel.killerId = c.killerId;
    intel.accompliceId = c.accompliceId;
    intel.selectedWeapon = c.selectedWeapon;
    intel.selectedEvidence = c.selectedEvidence;
  } else if (myRole === 'ACCOMPLICE') {
    intel.killerId = c.killerId;
    intel.accompliceId = c.accompliceId;
    intel.selectedWeapon = c.selectedWeapon;
    intel.selectedEvidence = c.selectedEvidence;
  } else if (myRole === 'WITNESS') {
    // Witness knows Killer & Accomplice, but NOT which is which! Randomize order!
    if (c.killerId && c.accompliceId) {
      const pair = [c.killerId, c.accompliceId].sort();
      intel.witnessPair = pair;
    }
  } else if (myRole === 'MEDICAL_EXAMINER') {
    intel.killerId = c.killerId;
    intel.accompliceId = c.accompliceId;
    intel.selectedWeapon = c.selectedWeapon;
    intel.selectedEvidence = c.selectedEvidence;
  } else {
    // Investigators
    const meP = c.players.find((p) => p.role === 'MEDICAL_EXAMINER');
    if (meP) {
      intel.medicalExaminerPlayer = { id: meP.id, name: meP.name, avatar: meP.avatar };
    }
  }

  return {
    caseCode: c.caseCode,
    caseName: c.caseName,
    hostId: c.hostId,
    settings: c.settings,
    phase: c.phase,
    players: playersMasked,
    myRole,
    myWeapons: mePlayer?.weapons || [],
    myEvidence: mePlayer?.evidence || [],
    intel,
    confirmedClues: c.confirmedClues,
    clueCycleStartTime: c.clueCycleStartTime,
    meDraftClues: myRole === 'MEDICAL_EXAMINER' ? c.meDraftClues : undefined,
    meChangedClueCount: myRole === 'MEDICAL_EXAMINER' ? c.meChangedClueCount : undefined,
    latestVoteResult: c.latestVoteResult,
    winnerTeam: c.winnerTeam,
    jokerStoleVictory: c.jokerStoleVictory,
    actualWeapon: c.phase === 'END_GAME' ? c.selectedWeapon : undefined,
    actualEvidence: c.phase === 'END_GAME' ? c.selectedEvidence : undefined,
    activeRandomEvent: c.activeRandomEvent,
    log: c.log,
  };
}
