class Game < ApplicationRecord
  scope :stale, -> { where('updated_at < ?', 24.hours.ago) }

  def self.destroy_stale
    stale.destroy_all
  end
end
