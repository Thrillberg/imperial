# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_05_24_210238) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "accounts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false
    t.index ["email"], name: "index_accounts_on_email", unique: true
    t.index ["reset_password_token"], name: "index_accounts_on_reset_password_token", unique: true
  end

  create_table "actions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "data"
    t.uuid "game_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "originally_created_at", precision: nil
    t.datetime "player_notified_at"
    t.index ["game_id"], name: "index_actions_on_game_id"
  end

  create_table "blazer_audits", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "query_id"
    t.text "statement"
    t.string "data_source"
    t.datetime "created_at"
    t.index ["query_id"], name: "index_blazer_audits_on_query_id"
    t.index ["user_id"], name: "index_blazer_audits_on_user_id"
  end

  create_table "blazer_checks", force: :cascade do |t|
    t.bigint "creator_id"
    t.bigint "query_id"
    t.string "state"
    t.string "schedule"
    t.text "emails"
    t.text "slack_channels"
    t.string "check_type"
    t.text "message"
    t.datetime "last_run_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_checks_on_creator_id"
    t.index ["query_id"], name: "index_blazer_checks_on_query_id"
  end

  create_table "blazer_dashboard_queries", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.bigint "query_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dashboard_id"], name: "index_blazer_dashboard_queries_on_dashboard_id"
    t.index ["query_id"], name: "index_blazer_dashboard_queries_on_query_id"
  end

  create_table "blazer_dashboards", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_dashboards_on_creator_id"
  end

  create_table "blazer_queries", force: :cascade do |t|
    t.bigint "creator_id"
    t.string "name"
    t.text "description"
    t.text "statement"
    t.string "data_source"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["creator_id"], name: "index_blazer_queries_on_creator_id"
  end

  create_table "games", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "host_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "force_ended_at", precision: nil
    t.datetime "cancelled_at", precision: nil
    t.datetime "started_at", precision: nil
    t.uuid "winner_id"
    t.integer "base_game", default: 0
    t.uuid "current_player_id"
    t.integer "variant", default: 0
    t.uuid "cloned_from_game_id"
    t.boolean "is_public", default: true
    t.string "discord_channel_id"
    t.boolean "is_imported"
    t.integer "time_commitment", default: 0
    t.index ["cloned_from_game_id"], name: "index_games_on_cloned_from_game_id"
    t.index ["current_player_id"], name: "index_games_on_current_player_id"
    t.index ["host_id"], name: "index_games_on_host_id"
    t.index ["winner_id"], name: "index_games_on_winner_id"
  end

  create_table "players", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "game_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "score"
    t.index ["game_id"], name: "index_players_on_game_id"
    t.index ["user_id"], name: "index_players_on_user_id"
  end

  create_table "snapshots", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.json "state"
    t.uuid "game_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_snapshots_on_game_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "account_id"
    t.datetime "anonymity_confirmed_at", precision: nil
    t.boolean "turn_notifications_enabled", default: false
    t.string "discord_id"
    t.index ["account_id"], name: "index_users_on_account_id"
  end

  add_foreign_key "games", "games", column: "cloned_from_game_id"
  add_foreign_key "games", "users", column: "current_player_id"
  add_foreign_key "games", "users", column: "host_id"
  add_foreign_key "games", "users", column: "winner_id"
  add_foreign_key "users", "accounts"
end
