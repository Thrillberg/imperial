class MlWeightsController < ApplicationController
  def index
    send_file "#{Rails.root}/app/javascript/lib/ml_models/weights.bin"
  end
end
