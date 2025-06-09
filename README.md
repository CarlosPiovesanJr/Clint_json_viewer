<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
=======
# JSON Viewer Clint

Um visualizador de JSON interativo que permite:
- Visualizar a estrutura hierárquica do JSON
- Expandir e colapsar objetos e arrays
- Visualizar o mapeamento completo dos campos
- Exibir tipos de dados e valores
- Gerar mapeamentos simplificados no formato Clint

## Funcionalidades

- Interface moderna e intuitiva
- Visualização em árvore do JSON
- Detalhamento de campos ao clicar
- Mapeamento automático de caminhos
- Suporte a arrays e objetos aninhados
- Design responsivo

## Como usar

1. Cole seu JSON no campo de texto
2. Clique em "Analisar JSON"
3. Navegue pela estrutura clicando nos campos
4. Veja os detalhes no painel de mapeamento
5. Use o mapeamento Clint para referência simplificada

## Tecnologias

- HTML5
- JavaScript
- Tailwind CSS
- Google Fonts (Inter) 
>>>>>>> 002f9db69e8ea26bc5392fefbac8641a7029d2c5
