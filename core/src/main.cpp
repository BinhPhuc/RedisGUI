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

  while (std::getline(std::cin, input_line)) {
    if (input_line.empty())
      continue;

    json input_json = json::parse(input_line);

    std::string host = input_json["host"];
    std::string port = input_json["port"];

    std::cout << std::flush;
  }

  return 0;
}
