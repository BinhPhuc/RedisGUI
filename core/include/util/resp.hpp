#pragma once

#include <string>

class RESP {
public:
  static std::string stringify(const std::string &query);
  static std::string parse(const std::string &response);
};
