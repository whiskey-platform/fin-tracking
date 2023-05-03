/* eslint-disable */

import Ajv from "ajv";

import { Decoder } from "./helpers";
import { validateJson } from "./validate";
import { PostLinkTokensExchangeRequestBody, ErrorSchema } from "./models";
import jsonSchema from "./schema.json";

const ajv = new Ajv({ strict: false });
ajv.compile(jsonSchema);

// Decoders
export const PostLinkTokensExchangeRequestBodyDecoder: Decoder<PostLinkTokensExchangeRequestBody> =
  {
    definitionName: "PostLinkTokensExchangeRequestBody",
    schemaRef: "#/definitions/PostLinkTokensExchangeRequestBody",

    decode(json: unknown): PostLinkTokensExchangeRequestBody {
      const schema = ajv.getSchema(
        PostLinkTokensExchangeRequestBodyDecoder.schemaRef
      );
      if (!schema) {
        throw new Error(
          `Schema ${PostLinkTokensExchangeRequestBodyDecoder.definitionName} not found`
        );
      }
      return validateJson(
        json,
        schema,
        PostLinkTokensExchangeRequestBodyDecoder.definitionName
      );
    },
  };
export const ErrorSchemaDecoder: Decoder<ErrorSchema> = {
  definitionName: "ErrorSchema",
  schemaRef: "#/definitions/ErrorSchema",

  decode(json: unknown): ErrorSchema {
    const schema = ajv.getSchema(ErrorSchemaDecoder.schemaRef);
    if (!schema) {
      throw new Error(`Schema ${ErrorSchemaDecoder.definitionName} not found`);
    }
    return validateJson(json, schema, ErrorSchemaDecoder.definitionName);
  },
};
