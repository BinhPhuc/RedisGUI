#pragma once

#include "response/response.hpp"
#include <nlohmann/json.hpp>

class ConnectionResponse : public Response {
public:
  ConnectionResponse();
  ConnectionResponse(bool ok, const std::string &message);
};

void to_json(nlohmann::json &j,
             const ConnectionResponse &connectionResponse);

void from_json(const nlohmann::json &j,
               ConnectionResponse &connectionResponse);
