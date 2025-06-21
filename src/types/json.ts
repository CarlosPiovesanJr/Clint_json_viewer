export type JsonPrimitive = string | number | boolean | null;

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonArray = JsonValue[];

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface JsonPath {
  caminho: string;
  nome: string;
  valor: JsonValue;
  tipo: string;
}

export interface JsonNode {
  key: string;
  value: JsonValue;
  isArray: boolean;
  isObject: boolean;
  path: string;
  level: number;
}
