#pragma once

#include <string>

class RedisConnection {
private:
  std::string m_host;
  std::string m_port;
  int m_sockfd;

public:
  RedisConnection(const std::string &host, const std::string &port);
  ~RedisConnection();
  int make_connection();
  void stop();
};
