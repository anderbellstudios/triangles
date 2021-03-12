require 'json'

class GameChannel < ApplicationCable::Channel
  def subscribed
    set_game
    stream_for @game
  end

  def unsubscribe
  end

  def receive(data)
    set_game

    if @game.update(data: data.to_json)
      broadcast_to(@game, data)
    else
      Rails.logger.error(@game.errors)
    end
  end

  private
    def set_game
      @game = Game.find(params[:id])
    end
end
