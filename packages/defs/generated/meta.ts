/* eslint-disable */
import { PostLinkTokensExchangeRequestBody, ErrorSchema } from "./models";

export const schemaDefinitions = {
  PostLinkTokensExchangeRequestBody: info<PostLinkTokensExchangeRequestBody>(
    "PostLinkTokensExchangeRequestBody",
    "#/definitions/PostLinkTokensExchangeRequestBody"
  ),
  ErrorSchema: info<ErrorSchema>("ErrorSchema", "#/definitions/ErrorSchema"),
};

export interface SchemaInfo<T> {
  definitionName: string;
  schemaRef: string;
}

function info<T>(definitionName: string, schemaRef: string): SchemaInfo<T> {
  return { definitionName, schemaRef };
}
