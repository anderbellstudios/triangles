export type Shape = 'cross' | 'circle' | 'triangle'

export type Board = [Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null, Shape | null];

export type Move = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type Game = {
  lastUpdatedBy: string;
  tag: string;
  computerPlayers: Record<Shape, boolean>;
  board: Board;
  startingTurn: Shape;
  currentTurn: Shape;
  moveHistory: Move[];
}
