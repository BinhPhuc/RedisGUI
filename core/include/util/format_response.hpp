#pragma once

#include <string>

class Response;

class FormatResponse {
public:
  static void print(const Response &response);
  static void ok(const std::string &message);
  static void error(const std::string &error_message);
};
