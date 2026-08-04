export interface ClueFolder {
  id: number;
  name: string;
  category: string;
  options: [string, string, string, string, string, string];
}

export type Role =
  | 'KILLER'
  | 'ACCOMPLICE'
  | 'WITNESS'
  | 'INVESTIGATOR'
  | 'MEDICAL_EXAMINER'
  | 'JOKER';

export type ClueSpeed = 'fast' | 'normal' | 'slow' | 'custom';
export type MeMode = 'random' | 'host_chooses';

export interface Card {
  id: string;
  name: string;
  category: 'weapon' | 'evidence';
  tags: string[]; // e.g. ['metal', 'sharp', 'liquid', 'chemical', 'heavy', 'paper']
  description?: string;
  artStyleId?: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string; // preset ID or data URL
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  role: Role | null;
  weapons: Card[];
  evidence: Card[];
  hasVoted: boolean;
  socketId: string;
  isConnected: boolean;
  profileEditedThisMatch: boolean;
}

export interface CaseSettings {
  enableJoker: boolean;
  medicalExaminerMode: MeMode;
  medicalExaminerPlayerId: string | null;
  clueReleaseSpeed: ClueSpeed;
  customClueTimeSeconds?: number;
  slotTimers?: Record<number, number>;
  maxPlayers: 6 | 8 | 10 | 12;
}

export interface ConfirmedClue {
  folderIndex: number;
  folderName: string;
  clueTag: string;
  confirmedAt: number;
}

export interface VoteData {
  voterId: string;
  targetPlayerId: string;
  weaponId: string;
  evidenceId: string;
}

export interface VoteResult {
  id: string;
  voterName: string;
  targetPlayerName: string;
  weaponName: string;
  isWeaponCorrect: boolean;
  evidenceName: string;
  isEvidenceCorrect: boolean;
  isKillerCorrect: boolean;
  isFullyCorrect: boolean;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export type MatchPhase =
  | 'LOBBY'
  | 'ROLE_REVEAL'
  | 'KILLER_SELECTION'
  | 'INVESTIGATION'
  | 'VOTING_RESULT'
  | 'KILLER_FINAL_GUESS'
  | 'END_GAME';

export interface CaseState {
  caseCode: string;
  caseName: string;
  hostId: string;
  settings: CaseSettings;
  phase: MatchPhase;
  players: Player[];
  selectedWeapon: Card | null;
  selectedEvidence: Card | null;
  killerId: string | null;
  accompliceId: string | null;
  witnessId: string | null;
  medicalExaminerId: string | null;
  jokerId: string | null;
  jokerVotedOut: boolean;
  jokerTargetKillerGuess: string | null;
  confirmedClues: ConfirmedClue[];
  folders?: ClueFolder[];
  clueCycleStartTime: number | null;
  slotStartTimes?: Record<number, number>;
  meDraftClues: Record<number, string>; // folderIndex -> clueTag
  meChangedClueCount: number; // Max 1 change allowed
  votes: Record<string, VoteData>;
  latestVoteResult: VoteResult | null;
  killerWitnessGuess: string | null;
  winnerTeam: 'KILLER_TEAM' | 'INVESTIGATORS' | 'JOKER' | null;
  jokerStoleVictory: boolean;
  activeRandomEvent: RandomEvent | null;
  matchStartTime: number | null;
  log: string[];
}

// Role-masked client view
export interface ClientGameState {
  caseCode: string;
  caseName: string;
  hostId: string;
  settings: CaseSettings;
  phase: MatchPhase;
  players: Array<{
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
    isReady: boolean;
    hasVoted: boolean;
    isConnected: boolean;
    role?: Role; // only revealed if current player or end game
  }>;
  myRole: Role | null;
  myWeapons: Card[];
  myEvidence: Card[];
  // Intel depending on role:
  intel: {
    killerId?: string;
    accompliceId?: string;
    witnessPair?: [string, string]; // for witness: 2 player IDs in random order!
    selectedWeapon?: Card;
    selectedEvidence?: Card;
    medicalExaminerPlayer?: { id: string; name: string; avatar: string };
  };
  confirmedClues: ConfirmedClue[];
  folders?: ClueFolder[];
  clueCycleStartTime: number | null;
  slotStartTimes?: Record<number, number>;
  meDraftClues?: Record<number, string>; // only for ME
  meChangedClueCount?: number;
  latestVoteResult: VoteResult | null;
  winnerTeam: 'KILLER_TEAM' | 'INVESTIGATORS' | 'JOKER' | null;
  jokerStoleVictory: boolean;
  actualWeapon?: Card; // revealed at end game
  actualEvidence?: Card; // revealed at end game
  activeRandomEvent: RandomEvent | null;
  log: string[];
}
