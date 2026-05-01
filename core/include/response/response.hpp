#pragma once

#include <nlohmann/json.hpp>
#include <string>

class Response {
public:
  Response();
  Response(bool ok, const std::string &message);
  virtual ~Response();

  void write_base_json(nlohmann::json &j) const;

  void read_base_json(const nlohmann::json &j);

  virtual void write_json(nlohmann::json &j) const;

  virtual void read_json(const nlohmann::json &j);

  bool ok = false;
  std::string message;
};

void to_json(nlohmann::json &j, const Response &response);

void from_json(const nlohmann::json &j, Response &response);
