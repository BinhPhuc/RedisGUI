#include "response/connection_response.hpp"

ConnectionResponse::ConnectionResponse() = default;

ConnectionResponse::ConnectionResponse(bool ok, const std::string &message)
    : Response(ok, message) {}

void to_json(nlohmann::json &j,
                         const ConnectionResponse &connectionResponse) {
    connectionResponse.write_json(j);
}

void from_json(const nlohmann::json &j,
                             ConnectionResponse &connectionResponse) {
    connectionResponse.read_json(j);
}
