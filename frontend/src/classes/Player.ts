// import StatusMessageTypes from "../components/VideoCall/VideoFrontend/components/MenuBar/StatusMessage/StatusMessageTypes";

export default class Player {
  public location?: UserLocation;

  private readonly _id: string;

  private readonly _userName: string;

  private _listeners: PlayerListener[] = [];

  public _statusMessage?: string;

  public sprite?: Phaser.GameObjects.Sprite;

  public label?: Phaser.GameObjects.Text;

  // for display
  public statusLabel?: Phaser.GameObjects.Text;

  constructor(id: string, userName: string, location: UserLocation, statusMessage?: string) {
    this._id = id;
    this._userName = userName;
    this.location = location;
    this._statusMessage = statusMessage;
  }

  get userName(): string {
    return this._userName;
  }

  get id(): string {
    return this._id;
  }

  addListener(listener: PlayerListener) {
    this._listeners.push(listener);
  }

  set statusMessage(newStatusMessage: string | undefined) {
    if(this._statusMessage !== newStatusMessage){
      this._listeners.forEach(listener => listener.onStatusChange?.(newStatusMessage));
    }
    this._statusMessage = newStatusMessage;
  }

  get statusMessage() {
    return this._statusMessage;
  }

  static fromServerPlayer(playerFromServer: ServerPlayer): Player {
    return new Player(playerFromServer._id, playerFromServer._userName, playerFromServer.location, playerFromServer.statusMessage);
  }
}
export type ServerPlayer = { _id: string, _userName: string, location: UserLocation, statusMessage?: string };

export type PlayerListener = {
  onStatusChange?: (newStatus: string | undefined) => void;
};

export type Direction = 'front'|'back'|'left'|'right';

export type UserLocation = {
  x: number,
  y: number,
  rotation: Direction,
  moving: boolean,
  conversationLabel?: string
};
