import type { JsonPath, JsonValue } from '../types/json';

export const findAllPaths = (obj: JsonValue, currentPath = ''): JsonPath[] => {
  const paths: JsonPath[] = [];

  const traverse = (current: JsonValue, path = ''): void => {
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        const newPath = path ? `${path}[${index}]` : `[${index}]`;
        if (typeof item === 'object' && item !== null) {
          traverse(item, newPath);
        } else {
          paths.push({
            caminho: newPath,
            nome: `Item ${index}`,
            valor: item,
            tipo: typeof item,
          });
        }
      });
    } else if (typeof current === 'object' && current !== null) {
      for (const [key, value] of Object.entries(current)) {
        const newPath = path ? `${path}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          traverse(value, newPath);
        } else {
          paths.push({
            caminho: newPath,
            nome: key,
            valor: value,
            tipo: typeof value,
          });
        }
      }
    }
  };

  traverse(obj, currentPath);
  return paths;
};
