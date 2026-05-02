#pragma once
#include <string>

enum class RequestTypeEnum { CONNECT, DISCONNECT, QUERY };

std::string RequestType(RequestTypeEnum requestType);
