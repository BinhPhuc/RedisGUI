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
    : m_host(host), m_port(port), m_sockfd(-1) {}

RedisConnection::~RedisConnection() {
  spdlog::info("RedisConnection to {}:{} destroyed", m_host, m_port);
  stop();
}

void RedisConnection::stop() {
  if (m_sockfd != -1) {
    close(m_sockfd);
    m_sockfd = -1;
    spdlog::info("Connection to {}:{} closed", m_host, m_port);
    FormatResponse::ok("Connection closed successfully");
  } else {
    spdlog::warn("No active connection to {}:{}", m_host, m_port);
  }
}

int RedisConnection::make_connection() {
  struct addrinfo hints;
  struct addrinfo *res, *rp;

  memset(&hints, 0, sizeof(hints));
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;

  if (getaddrinfo(m_host.c_str(), m_port.c_str(), &hints, &res) != 0) {
    spdlog::error("Failed to resolve address for {}:{}", m_host, m_port);
    FormatResponse::error("Failed to resolve address");
    return -1;
  }

  for (rp = res; rp != nullptr; rp = rp->ai_next) {
    m_sockfd = socket(rp->ai_family, rp->ai_socktype, rp->ai_protocol);

    if (m_sockfd == -1) {
      continue;
    }

    if (connect(m_sockfd, rp->ai_addr, rp->ai_addrlen) != -1) {
      break;
    }

    close(m_sockfd);
  }

  freeaddrinfo(res);

  if (rp == nullptr) {
    spdlog::error("Failed to connect to {}:{}", m_host, m_port);
    FormatResponse::error("Failed to connect to server");
    return -1;
  }

  spdlog::info("Successfully connected to {}:{}", m_host, m_port);
  FormatResponse::ok("Connected!!!");

  return m_sockfd;
}
