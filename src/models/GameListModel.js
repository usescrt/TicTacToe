class GameListModel {
  constructor(
    gameAreaID,
    listType,
    createrName,
    rowNumber,
    joinUsername,
    winner
  ) {
    this.gameAreaID = gameAreaID;
    this.listType = listType;
    this.createrName = createrName;
    this.rowNumber = rowNumber;
    this.joinUsername = joinUsername;
    this.winner = winner
  }
}

export default GameListModel;
