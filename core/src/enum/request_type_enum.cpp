#include "enum/request_type_enum.hpp"
#include <algorithm>
#include <cctype>

std::string RequestType(RequestTypeEnum requestType) {
  std::string type = "UNKNOWN";
  if (requestType == RequestTypeEnum::CONNECT) {
    type = "CONNECT";
  } else if (requestType == RequestTypeEnum::DISCONNECT) {
    type = "DISCONNECT";
  } else if (requestType == RequestTypeEnum::QUERY) {
    type = "QUERY";
  }
  std::transform(type.begin(), type.end(), type.begin(),
                 [](unsigned char c) { return std::tolower(c); });
  return type;
}
