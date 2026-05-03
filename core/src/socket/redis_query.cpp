#include "socket/redis_query.hpp"
#include <sys/socket.h>
#include <sys/types.h>

int send_all(int sockfd, const char *buffer, size_t length) {
  size_t total_sent = 0;
  while (total_sent < length) {
    ssize_t sent = send(sockfd, buffer + total_sent, length - total_sent, 0);
    if (sent == -1) {
      return -1;
    }
    total_sent += sent;
  }
  return total_sent;
}

char get_response_type(int sockfd) {
  char type;
  ssize_t bytes_received = recv(sockfd, &type, 1, 0);
  if (bytes_received == -1) {
    return '\0';
  }
  return type;
}

std::string handle_length_based_response(int sockfd, char type) {
  return "handle later";
}

std::string handle_simple_response(int sockfd) {
  constexpr size_t buffer_size = 4096;
  char buffer[buffer_size];
  std::string response;
  while (response.find("\r\n") == std::string::npos) {
    ssize_t bytes_received = recv(sockfd, buffer, buffer_size - 1, 0);
    if (bytes_received == -1) {
      return "";
    }
    buffer[bytes_received] = '\0';
    response += buffer;
  }
  return response;
}

std::string recv_all(int sockfd, char type) {
  if (type == '$' || type == '*') {
    return handle_length_based_response(sockfd, type);
  }
  return handle_simple_response(sockfd);
}

int RedisQuery::send_query(int sockfd, const std::string &query) {
  const char *buffer = query.c_str();
  size_t length = query.size();
  return send_all(sockfd, buffer, length);
}

std::string RedisQuery::receive_response(int sockfd) {
  char type = get_response_type(sockfd);
  if (type == '\0') {
    return "";
  }
  return type + recv_all(sockfd, type);
}
