import { nanoid } from 'nanoid';
import CoveyTownsStore from './CoveyTownsStore';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import { ServerConversationArea } from '../client/TownsServiceClient';
import { ChatMessage } from '../CoveyTypes';
import { PlayerCoveyTownListener } from '../types/PlayerCoveyTownListener';

const mockCoveyListenerTownDestroyed = jest.fn();
const mockCoveyListenerOtherFns = jest.fn();

function mockCoveyListener(): CoveyTownListener {
  return {
    onPlayerDisconnected(removedPlayer: Player): void {
      mockCoveyListenerOtherFns(removedPlayer);
    },
    onPlayerMoved(movedPlayer: Player): void {
      mockCoveyListenerOtherFns(movedPlayer);
    },
    onTownDestroyed() {
      mockCoveyListenerTownDestroyed();
    },
    onPlayerJoined(newPlayer: Player) {
      mockCoveyListenerOtherFns(newPlayer);
    }, onConversationAreaDestroyed(_conversationArea : ServerConversationArea){
      mockCoveyListenerOtherFns(_conversationArea);
    }, onConversationAreaUpdated(_conversationArea: ServerConversationArea){
      mockCoveyListenerOtherFns(_conversationArea);
    },
    onChatMessage(message: ChatMessage){
      mockCoveyListenerOtherFns(message);
    },
    onPlayerStatusChanged(changedStatusPlayer: Player){
      mockCoveyListenerOtherFns(changedStatusPlayer);
    },
    onPlayerEmoticonUpdated(changedEmoticonPlayer: Player){
      mockCoveyListenerOtherFns(changedEmoticonPlayer);
    },
  };
}

function mockPlayerCoveyTownListener(): PlayerCoveyTownListener {
  return {
    coveyTownListener: mockCoveyListener(),
    playerUsername: 'username',
  };
}

function createTownForTesting(friendlyNameToUse?: string, isPublic = false) {
  const friendlyName = friendlyNameToUse !== undefined ? friendlyNameToUse :
    `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
  return CoveyTownsStore.getInstance()
    .createTown(friendlyName, isPublic);
}

describe('CoveyTownsStore', () => {
  beforeEach(() => {
    mockCoveyListenerTownDestroyed.mockClear();
    mockCoveyListenerOtherFns.mockClear();
  });
  it('should be a singleton', () => {
    const store1 = CoveyTownsStore.getInstance();
    const store2 = CoveyTownsStore.getInstance();
    expect(store1)
      .toBe(store2);
  });

  describe('createTown', () => {
    it('Should allow multiple towns with the same friendlyName', () => {
      const firstTown = createTownForTesting();
      const secondTown = createTownForTesting(firstTown.friendlyName);
      expect(firstTown)
        .not
        .toBe(secondTown);
      expect(firstTown.friendlyName)
        .toBe(secondTown.friendlyName);
      expect(firstTown.coveyTownID)
        .not
        .toBe(secondTown.coveyTownID);
    });
  });

  describe('getControllerForTown', () => {
    it('Should return the same controller on repeated calls', async () => {
      const firstTown = createTownForTesting();
      expect(firstTown)
        .toBe(CoveyTownsStore.getInstance()
          .getControllerForTown(firstTown.coveyTownID));
      expect(firstTown)
        .toBe(CoveyTownsStore.getInstance()
          .getControllerForTown(firstTown.coveyTownID));
    });
  });

  describe('updateTown', () => {
    it('Should check the password before updating any value', () => {
      const town = createTownForTesting();
      const { friendlyName } = town;
      const res = CoveyTownsStore.getInstance()
        .updateTown(town.coveyTownID, 'abcd', 'newName', true);
      expect(res)
        .toBe(false);
      expect(town.friendlyName)
        .toBe(friendlyName);
      expect(town.isPubliclyListed)
        .toBe(false);

    });
    it('Should fail if the townID does not exist', async () => {
      const town = createTownForTesting();
      const { friendlyName } = town;

      const res = CoveyTownsStore.getInstance()
        .updateTown('abcdef', town.townUpdatePassword, 'newName', true);
      expect(res)
        .toBe(false);
      expect(town.friendlyName)
        .toBe(friendlyName);
      expect(town.isPubliclyListed)
        .toBe(false);

    });
    it('Should update the town parameters', async () => {

      // First try with just a visiblity change
      const town = createTownForTesting();
      const { friendlyName } = town;
      const res = CoveyTownsStore.getInstance()
        .updateTown(town.coveyTownID, town.townUpdatePassword, undefined, true);
      expect(res)
        .toBe(true);
      expect(town.isPubliclyListed)
        .toBe(true);
      expect(town.friendlyName)
        .toBe(friendlyName);

      // Now try with just a name change
      const newFriendlyName = nanoid();
      const res2 = CoveyTownsStore.getInstance()
        .updateTown(town.coveyTownID, town.townUpdatePassword, newFriendlyName, undefined);
      expect(res2)
        .toBe(true);
      expect(town.isPubliclyListed)
        .toBe(true);
      expect(town.friendlyName)
        .toBe(newFriendlyName);

      // Now try to change both
      const res3 = CoveyTownsStore.getInstance()
        .updateTown(town.coveyTownID, town.townUpdatePassword, friendlyName, false);
      expect(res3)
        .toBe(true);
      expect(town.isPubliclyListed)
        .toBe(false);
      expect(town.friendlyName)
        .toBe(friendlyName);
    });
  });

  describe('deleteTown', () => {
    it('Should check the password before deleting the town', () => {
      const town = createTownForTesting();
      const res = CoveyTownsStore.getInstance()
        .deleteTown(town.coveyTownID, `${town.townUpdatePassword}*`);
      expect(res)
        .toBe(false);
    });
    it('Should fail if the townID does not exist', async () => {
      const res = CoveyTownsStore.getInstance()
        .deleteTown('abcdef', 'efg');
      expect(res)
        .toBe(false);
    });
    it('Should disconnect all players', async () => {
      const town = createTownForTesting();
      town.addTownListener(mockPlayerCoveyTownListener());
      town.addTownListener(mockPlayerCoveyTownListener());
      town.addTownListener(mockPlayerCoveyTownListener());
      town.addTownListener(mockPlayerCoveyTownListener());
      town.disconnectAllPlayers();

      expect(mockCoveyListenerOtherFns.mock.calls.length)
        .toBe(0);
      expect(mockCoveyListenerTownDestroyed.mock.calls.length)
        .toBe(4);
    });
  });

  describe('updatePlayerStatusMessage', () => {
    it('Should fail if the coveyTownID does not exist', async () => {
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage('fakeTownID', 'fakePlayerID', 'BRB');
      expect(res)
        .toBe(false);
    });
    it('Should return false if player does not exist', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      town.addPlayer(player1);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, 'player2ID', 'AFK');
      expect(res)
        .toBe(false);
      expect(town.players.length).toBe(1);
    });
    it('Should return true if player exists in town', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      town.addPlayer(player1);
      expect(town.players[0].statusMessage).toBeUndefined();
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, 'BRB');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(1);
      expect(town.players[0].statusMessage).toBe('B)');
    });
    it('Should update the correct players status message', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      const player2: Player = new Player('player2');
      const player3: Player = new Player('player3');
      town.addPlayer(player1);
      town.addPlayer(player2);
      town.addPlayer(player3);
      expect(town.players).toEqual([player1, player2, player3]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player3.id, 'AFK');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[2].statusMessage).toBe('AFK');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[1].statusMessage).toBeUndefined();
    });
    it('Should be able to update players status message multiple times', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      const player2: Player = new Player('player2');
      const player3: Player = new Player('player3');
      town.addPlayer(player1);
      town.addPlayer(player2);
      town.addPlayer(player3);
      expect(town.players).toEqual([player1, player2, player3]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, 'Ready to chat');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[1].statusMessage).toBe('Ready to chat');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[2].statusMessage).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, 'AFK');
      expect(town.players[1].statusMessage).toBe('AFK');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[2].statusMessage).toBeUndefined();
    });
    it('Should allow multiple players to have status messages', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      const player2: Player = new Player('player2');
      const player3: Player = new Player('player3');
      town.addPlayer(player1);
      town.addPlayer(player2);
      town.addPlayer(player3);
      expect(town.players).toEqual([player1, player2, player3]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, 'Ready to chat');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[1].statusMessage).toBe('Ready to chat');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[2].statusMessage).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player2.id, 'AFK');
      expect(town.players[1].statusMessage).toBe('Ready to chat');
      expect(town.players[0].statusMessage).toBe('AFK');
      expect(town.players[2].statusMessage).toBeUndefined();
    });
    it('Should allow empty status message', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player(nanoid());
      const player2: Player = new Player(nanoid());
      const player3: Player = new Player(nanoid());
      town.addPlayer(player1);
      town.addPlayer(player2);
      town.addPlayer(player3);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, 'BRB');
      expect(res)
        .toBe(true);
      expect(town.players[1].statusMessage).toBe('BRB');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[2].statusMessage).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerStatusMessage(town.coveyTownID, player1.id, '');
      expect(town.players[1].statusMessage).toBe('');
      expect(town.players[0].statusMessage).toBeUndefined();
      expect(town.players[2].statusMessage).toBeUndefined();
    });
  });

  describe('updatePlayerEmoticon', () => {
    it('Should fail if the coveyTownID does not exist', async () => {
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon('fakeTownID', 'fakePlayer', ':)');
      expect(res)
        .toBe(false);
    });
    it('Should return false if player does not exist', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      town.addPlayer(player1);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, 'player2', 'B)');
      expect(res)
        .toBe(false);
      expect(town.players.length).toBe(1);
    });
    it('Should return true if player exists in town', async () => {
      const town = createTownForTesting();
      const player1: Player = new Player('player1');
      town.addPlayer(player1);
      expect(town.players[0].emoticon).toBeUndefined();
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, player1.id, 'B)');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(1);
      expect(town.players[0].emoticon).toBe('B)');
    });
    it('Should update the correct players emoticon', async () => {
      const town = createTownForTesting();
      const snape: Player = new Player('snape');
      const hagrid: Player = new Player('hagrid');
      const ron: Player = new Player('ron');
      town.addPlayer(snape);
      town.addPlayer(hagrid);
      town.addPlayer(ron);
      expect(town.players).toEqual([snape, hagrid, ron]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, ron.id, 'B)');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[2].emoticon).toBe('B)');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[1].emoticon).toBeUndefined();
    });
    it('Should be able to update players emoticon multiple times', async () => {
      const town = createTownForTesting();
      const snape: Player = new Player('snape');
      const hagrid: Player = new Player('hagrid');
      const ron: Player = new Player('ron');
      town.addPlayer(snape);
      town.addPlayer(hagrid);
      town.addPlayer(ron);
      expect(town.players).toEqual([snape, hagrid, ron]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, hagrid.id, ':(');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[1].emoticon).toBe(':(');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[2].emoticon).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, hagrid.id, ':)');
      expect(town.players[1].emoticon).toBe(':)');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[2].emoticon).toBeUndefined();
    });
    it('Should allow multiple players to have emoticons', async () => {
      const town = createTownForTesting();
      const snape: Player = new Player('snape');
      const hagrid: Player = new Player('hagrid');
      const ron: Player = new Player('ron');
      town.addPlayer(snape);
      town.addPlayer(hagrid);
      town.addPlayer(ron);
      expect(town.players).toEqual([snape, hagrid, ron]);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, hagrid.id, ':(');
      expect(res)
        .toBe(true);
      expect(town.players.length).toBe(3);
      expect(town.players[1].emoticon).toBe(':(');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[2].emoticon).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, snape.id, ';)');
      expect(town.players[1].emoticon).toBe(':(');
      expect(town.players[0].emoticon).toBe(';)');
      expect(town.players[2].emoticon).toBeUndefined();
    });
    it('Should allow empty emoticon', async () => {
      const town = createTownForTesting();
      const snape: Player = new Player('snape');
      const hagrid: Player = new Player('hagrid');
      const ron: Player = new Player('ron');
      town.addPlayer(snape);
      town.addPlayer(hagrid);
      town.addPlayer(ron);
      const res = CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, hagrid.id, ':(');
      expect(res)
        .toBe(true);
      expect(town.players[1].emoticon).toBe(':(');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[2].emoticon).toBeUndefined();
      CoveyTownsStore.getInstance()
        .updatePlayerEmoticon(town.coveyTownID, hagrid.id, '');
      expect(town.players[1].emoticon).toBe('');
      expect(town.players[0].emoticon).toBeUndefined();
      expect(town.players[2].emoticon).toBeUndefined();
    });
  });

  describe('listTowns', () => {
    it('Should include public towns', async () => {
      const town = createTownForTesting(undefined, true);
      const towns = CoveyTownsStore.getInstance()
        .getTowns();
      const entry = towns.filter(townInfo => townInfo.coveyTownID === town.coveyTownID);
      expect(entry.length)
        .toBe(1);
      expect(entry[0].friendlyName)
        .toBe(town.friendlyName);
      expect(entry[0].coveyTownID)
        .toBe(town.coveyTownID);
    });
    it('Should include each CoveyTownID if there are multiple towns with the same friendlyName', async () => {
      const town = createTownForTesting(undefined, true);
      const secondTown = createTownForTesting(town.friendlyName, true);
      const towns = CoveyTownsStore.getInstance()
        .getTowns()
        .filter(townInfo => townInfo.friendlyName === town.friendlyName);
      expect(towns.length)
        .toBe(2);
      expect(towns[0].friendlyName)
        .toBe(town.friendlyName);
      expect(towns[1].friendlyName)
        .toBe(town.friendlyName);

      if (towns[0].coveyTownID === town.coveyTownID) {
        expect(towns[1].coveyTownID)
          .toBe(secondTown.coveyTownID);
      } else if (towns[1].coveyTownID === town.coveyTownID) {
        expect(towns[0].coveyTownID)
          .toBe(town.coveyTownID);
      } else {
        fail('Expected the coveyTownIDs to match the towns that were created');
      }

    });
    it('Should not include private towns', async () => {
      const town = createTownForTesting(undefined, false);
      const towns = CoveyTownsStore.getInstance()
        .getTowns()
        .filter(townInfo => townInfo.friendlyName === town.friendlyName || townInfo.coveyTownID === town.coveyTownID);
      expect(towns.length)
        .toBe(0);
    });
    it('Should not include private towns, even if there is a public town of same name', async () => {
      const town = createTownForTesting(undefined, false);
      const town2 = createTownForTesting(town.friendlyName, true);
      const towns = CoveyTownsStore.getInstance()
        .getTowns()
        .filter(townInfo => townInfo.friendlyName === town.friendlyName || townInfo.coveyTownID === town.coveyTownID);
      expect(towns.length)
        .toBe(1);
      expect(towns[0].coveyTownID)
        .toBe(town2.coveyTownID);
      expect(towns[0].friendlyName)
        .toBe(town2.friendlyName);
    });
    it('Should not include deleted towns', async () => {
      const town = createTownForTesting(undefined, true);
      const towns = CoveyTownsStore.getInstance()
        .getTowns()
        .filter(townInfo => townInfo.friendlyName === town.friendlyName || townInfo.coveyTownID === town.coveyTownID);
      expect(towns.length)
        .toBe(1);
      const res = CoveyTownsStore.getInstance()
        .deleteTown(town.coveyTownID, town.townUpdatePassword);
      expect(res)
        .toBe(true);
      const townsPostDelete = CoveyTownsStore.getInstance()
        .getTowns()
        .filter(townInfo => townInfo.friendlyName === town.friendlyName || townInfo.coveyTownID === town.coveyTownID);
      expect(townsPostDelete.length)
        .toBe(0);
    });
  });
});

