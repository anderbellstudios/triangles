class ApplicationController < ActionController::Base
  def index
    if params[:id].present?
      @game = Game.find(params[:id])
    end
  end
end
