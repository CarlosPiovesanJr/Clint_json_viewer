export interface JsonPath {
  caminho: string;
  nome: string;
  valor: any;
  tipo: string;
}

export interface JsonNode {
  key: string;
  value: any;
  isArray: boolean;
  isObject: boolean;
  path: string;
  level: number;
} 