class Cypress::CleanupController < ActionController::Base
  def destroy
    if !Rails.env.test?
      return head(:bad_request)
    end

    tables = ActiveRecord::Base.connection.tables
    tables.delete 'schema_migrations'
    tables.each do |t|
      ActiveRecord::Base.connection.execute("TRUNCATE #{t} CASCADE")
    end

    head :ok
  end
end
