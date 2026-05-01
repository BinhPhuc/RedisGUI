#include "util/format_response.hpp"
#include "response/connection_response.hpp"
#include "response/response.hpp"
#include <fmt/base.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

void FormatResponse::print(const Response &response) {
  fmt::print("{}\n", json(response).dump(4));
}

void FormatResponse::ok(const std::string &message) {
  ConnectionResponse response = ConnectionResponse(true, message);
  print(response);
}

void FormatResponse::error(const std::string &error_message) {
  ConnectionResponse response = ConnectionResponse(false, error_message);
  print(response);
}
