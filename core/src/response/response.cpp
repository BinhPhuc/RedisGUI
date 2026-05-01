#include "response/response.hpp"

Response::Response() = default;

Response::Response(bool ok, const std::string &message)
    : ok(ok), message(message) {}

Response::~Response() = default;

void Response::write_base_json(nlohmann::json &j) const {
  j["ok"] = ok;
  j["message"] = message;
}

void Response::read_base_json(const nlohmann::json &j) {
  j.at("ok").get_to(ok);
  j.at("message").get_to(message);
}

void Response::write_json(nlohmann::json &j) const { write_base_json(j); }

void Response::read_json(const nlohmann::json &j) { read_base_json(j); }

void to_json(nlohmann::json &j, const Response &response) {
  response.write_json(j);
}

void from_json(const nlohmann::json &j, Response &response) {
  response.read_json(j);
}
