#include "util/resp.hpp"
#include <sstream>
#include <vector>

std::vector<std::string> split(const std::string &query) {
  std::stringstream ss(query);
  std::string word;
  std::vector<std::string> words;
  while (ss >> word) {
    words.push_back(word);
  }
  return words;
}

std::string RESP::stringify(const std::string &query) {
  std::vector<std::string> words = split(query);
  std::stringstream ss;
  ss << "*" << words.size() << "\r\n";
  for (const auto &word : words) {
    ss << "$" << word.size() << "\r\n" << word << "\r\n";
  }
  return ss.str();
}

std::string RESP::parse(const std::string &response) {
  std::string parsed_response;

  return parsed_response;
}
