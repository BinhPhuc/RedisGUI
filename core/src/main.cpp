#include "enum/request_type_enum.hpp"
#include "socket/redis_connection.hpp"
#include "socket/redis_query.hpp"
#include "util/resp.hpp"
#include <fmt/base.h>
#include <iostream>
#include <nlohmann/json.hpp>
#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/spdlog.h>
#include <string>

using json = nlohmann::json;

int main() {
  auto console_logger = spdlog::stderr_color_mt("core");
  spdlog::set_default_logger(console_logger);
  spdlog::info("C++ Core initialized successfully!");

  std::string input_line;
  int sockfd = -1;

  auto redis_conn = std::make_unique<RedisConnection>("", "");

  while (std::getline(std::cin, input_line)) {
    if (input_line.empty())
      continue;

    json input_json = json::parse(input_line);

    std::string type = input_json["type"];

    std::string host, port;

    json payload = input_json["payload"];

    if (payload != nullptr && type == RequestType(RequestTypeEnum::CONNECT)) {
      host = payload["host"];
      port = payload["port"];
    }

    if (sockfd == -1 && type == RequestType(RequestTypeEnum::CONNECT)) {
      auto connection = std::make_unique<RedisConnection>(host, port);
      redis_conn = std::move(connection);
      sockfd = redis_conn->make_connection();
    }

    if (sockfd != -1 && type == RequestType(RequestTypeEnum::DISCONNECT)) {
      redis_conn->stop();
      sockfd = -1;
    }

    if (sockfd != -1 && type == RequestType(RequestTypeEnum::QUERY)) {
      std::string query = payload["query"];
      spdlog::info("Received query: {}", query);
      std::string ecoded_query = RESP::stringify(query);
      spdlog::info("Encoded query: {}", ecoded_query);
      int byte_sent = RedisQuery::send_query(sockfd, ecoded_query);
      if (byte_sent == -1) {
        spdlog::error("Failed to send query");
      }
      std::string response = RedisQuery::receive_response(sockfd);
      if (response.empty()) {
        spdlog::error("Failed to receive response");
      } else {
        spdlog::info("Received response: {}", response);
      }
    }

    std::cout << std::flush;
  }

  return 0;
}
