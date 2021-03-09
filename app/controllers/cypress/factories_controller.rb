class Cypress::FactoriesController < ActionController::Base
  def create
    factory = FactoryBot.create(factory_name, factory_attributes)
    render json: factory
  end

  private

  def factory_name
    params.fetch(:name)
  end

  def factory_attributes
    params.fetch(:attributes).permit!.to_h
  end
end
