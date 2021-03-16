class ApplicationController < ActionController::Base
  protect_from_forgery unless: -> { request.format.json? }

  def index
    if params[:id].present?
      @game = Game.find(params[:id])
    end
  end
end
