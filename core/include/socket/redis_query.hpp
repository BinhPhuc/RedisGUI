#pragma once

#include <string>

class RedisQuery {
public:
  static int send_query(int sockfd, const std::string &query);
  static std::string receive_response(int sockfd);
};
