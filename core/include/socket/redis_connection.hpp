#pragma once

#include <string>

class RedisConnection {
private:
  std::string m_host;
  std::string m_port;

public:
  RedisConnection(const std::string &host, const std::string &port);
  ~RedisConnection();
  int make_connection();
};
