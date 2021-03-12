class GamesController < ApplicationController
  before_action :set_game, only: %i[ show ]

  # GET /games/1 or /games/1.json
  def show
  end

  # POST /games or /games.json
  def create
    @game = Game.new(game_params)

    if @game.save
      render :show, status: :created, location: @game
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:data)
    end
end
