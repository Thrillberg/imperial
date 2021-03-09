def define_test_routes
  Rails.logger.info "Loading routes meant only for testing purposes"

  namespace :cypress do
    delete "cleanup", to: "cleanup#destroy"

    resource :factories, only: %i[create]
    resource :sessions, only: %i[create]
  end
end
