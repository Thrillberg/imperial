class GenerateCsvController < ApplicationController
  def index
    @snapshots = Snapshot.includes(:game).where(game: {base_game: 0}).order(created_at: :asc)

    respond_to do |format|
      format.csv { send_data data, filename: "gameStates.csv" }
    end
  end

  private

  def data
    [
      "AHRondelPosition",
      "ITRondelPosition",
      "FRRondelPosition",
      "GBRondelPosition",
      "GERondelPosition",
      "RURondelPosition",
      "AHPowerPoints",
      "ITPowerPoints",
      "FRPowerPoints",
      "GBPowerPoints",
      "GEPowerPoints",
      "RUPowerPoints",
      "NumberOfAvailableBonds",
      "CurrentPlayerCash",
      "CurrentPlayerRawScore",
      "CurrentPlayerBondCount",
      "annotation"
    ].join(",") + "\n" + @snapshots.map(&:to_csv).join("\n")
  end
end
