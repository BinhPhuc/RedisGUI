#include "enum/request_type_enum.hpp"
#include "socket/redis_connection.hpp"
#include "util/format_response.hpp"
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

  while (std::getline(std::cin, input_line)) {
    if (input_line.empty())
      continue;

    json input_json = json::parse(input_line);

    std::string type = input_json["type"];

    std::string host = input_json["payload"]["host"];
    std::string port = input_json["payload"]["port"];

    if (sockfd == -1 && type == RequestType(RequestTypeEnum::CONNECT)) {
      RedisConnection redis_conn(host, port);
      sockfd = redis_conn.make_connection();
    }

    FormatResponse::ok("OK");

    std::cout << std::flush;
  }

  return 0;
}
