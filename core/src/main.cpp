#include "enum/request_type_enum.hpp"
#include "socket/redis_connection.hpp"
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

    std::cout << std::flush;
  }

  return 0;
}
