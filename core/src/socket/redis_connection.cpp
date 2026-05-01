#include "socket/redis_connection.hpp"
#include "util/format_response.hpp"
#include <fmt/base.h>
#include <netdb.h>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

using json = nlohmann::json;

RedisConnection::RedisConnection(const std::string &host,
                                 const std::string &port)
    : m_host(host), m_port(port) {}

RedisConnection::~RedisConnection() {
  spdlog::info("RedisConnection to {}:{} destroyed", m_host, m_port);
  fmt::print("RedisConnection to {}:{} destroyed\n", m_host, m_port);
}

int RedisConnection::make_connection() {
  int sockfd;
  struct addrinfo hints;
  struct addrinfo *res, *rp;

  memset(&hints, 0, sizeof(hints));
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_protocol = 0;

  if (getaddrinfo(m_host.c_str(), m_port.c_str(), &hints, &res) != 0) {
    spdlog::error("Failed to resolve address for {}:{}", m_host, m_port);
    FormatResponse::error("Failed to resolve address");
    return -1;
  }

  for (rp = res; rp != nullptr; rp = rp->ai_next) {
    sockfd = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);
    if (sockfd == -1) {
      continue;
    }

    if (connect(sockfd, rp->ai_addr, rp->ai_addrlen) != -1) {
      break;
    }

    close(sockfd);
  }

  freeaddrinfo(res);

  if (rp == nullptr) {
    spdlog::error("Failed to connect to {}:{}", m_host, m_port);
    FormatResponse::error("Failed to connect to server");
  }

  spdlog::info("Successfully connected to {}:{}", m_host, m_port);
  FormatResponse::ok("Successfully connected to server");

  return sockfd;
}
