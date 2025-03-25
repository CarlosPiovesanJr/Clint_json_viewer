let caminhos = [];

function analisarJSON() {
    const jsonInput = document.getElementById('jsonInput').value;
    const jsonOutput = document.getElementById('jsonOutput');
    
    try {
        const jsonData = JSON.parse(jsonInput);
        caminhos = [];
        
        function encontrarCaminhos(obj, caminhoAtual = '') {
            for (const [chave, valor] of Object.entries(obj)) {
                const isArray = Array.isArray(obj);
                const chaveFormatada = isArray ? `[${chave}]` : chave;
                const novoCaminho = caminhoAtual 
                    ? `${caminhoAtual}${isArray ? '' : '.'}${chaveFormatada}` 
                    : chaveFormatada;
                
                if (typeof valor === 'object' && valor !== null) {
                    encontrarCaminhos(valor, novoCaminho);
                } else {
                    caminhos.push({
                        caminho: novoCaminho,
                        nome: chave,
                        valor: valor,
                        tipo: typeof valor
                    });
                }
            }
        }
        
        encontrarCaminhos(jsonData);
        
        // Função para criar a visualização hierárquica
        function criarVisualizacaoHierarquica(obj, nivel = 0, caminhoAtual = '') {
            let html = '';
            const indentacao = nivel * 16;
            
            for (const [chave, valor] of Object.entries(obj)) {
                const isArray = Array.isArray(obj);
                const chaveFormatada = isArray ? `[${chave}]` : chave;
                const isObjeto = typeof valor === 'object' && valor !== null;
                const novoCaminho = caminhoAtual 
                    ? `${caminhoAtual}${isArray ? '' : '.'}${chaveFormatada}` 
                    : chaveFormatada;
                
                html += `
                    <div class="nivel-${nivel}" style="margin-left: ${indentacao}px">
                        <div class="flex items-center space-x-2 py-0.5 hover:bg-gray-50 rounded cursor-pointer" onclick="selecionarCampo('${novoCaminho}')">
                            ${isObjeto ? `
                                <button class="toggle-btn text-gray-400 hover:text-gray-600" onclick="event.stopPropagation(); toggleNivel(this)">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            ` : '<span class="w-3"></span>'}
                            <span class="text-gray-700 text-sm">${chaveFormatada}</span>
                            ${!isObjeto ? `
                                <span class="text-gray-400">:</span>
                                <span class="text-gray-600 text-sm">${valor}</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">${typeof valor}</span>
                            ` : ''}
                        </div>
                        ${isObjeto ? `
                            <div class="conteudo-nivel">
                                ${criarVisualizacaoHierarquica(valor, nivel + 1, novoCaminho)}
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            
            return html;
        }
        
        // Formatar a saída
        let outputHTML = `
            <div class="space-y-2">
                <h3 class="text-sm font-semibold text-gray-800 mb-2">Estrutura do JSON</h3>
                <div class="bg-white rounded-lg p-2 border border-gray-200">
                    ${criarVisualizacaoHierarquica(jsonData)}
                </div>
            </div>
        `;
        
        jsonOutput.innerHTML = outputHTML;
    } catch (erro) {
        jsonOutput.innerHTML = `
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 font-medium text-sm">Erro ao analisar JSON:</p>
                <p class="text-red-500 text-xs mt-1">${erro.message}</p>
            </div>
        `;
    }
}

function toggleNivel(btn) {
    const conteudo = btn.parentElement.nextElementSibling;
    const isExpanded = conteudo.style.display !== 'none';
    
    conteudo.style.display = isExpanded ? 'none' : 'block';
    btn.querySelector('svg').style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(90deg)';
}

function selecionarCampo(caminho) {
    if (!caminho) return;
    
    const campo = caminhos.find(c => c.caminho === caminho);
    if (!campo) return;
    
    // Remove o prefixo 'body' do caminho
    const caminhoSemBody = campo.caminho.replace(/^body\./, '');
    
    const mapeamentoSelecionado = document.getElementById('mapeamentoSelecionado');
    mapeamentoSelecionado.innerHTML = `
        <div class="space-y-2">
            <div class="flex flex-col space-y-1">
                <span class="text-gray-500 text-sm">Nome do Campo:</span>
                <span class="font-medium text-gray-800 text-sm">${campo.nome}</span>
            </div>
            <div class="flex flex-col space-y-1">
                <span class="text-gray-500 text-sm">Tipo:</span>
                <div class="flex">
                    <span class="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700 w-fit">${campo.tipo}</span>
                </div>
            </div>
            <div class="flex flex-col space-y-1">
                <span class="text-gray-500 text-sm">Valor:</span>
                <span class="font-medium text-gray-800 text-sm">${campo.valor}</span>
            </div>
            <div class="flex flex-col space-y-1">
                <span class="text-gray-500 text-sm">Caminho:</span>
                <div class="flex">
                    <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700 w-fit">${campo.caminho}</code>
                </div>
            </div>
            <div class="flex flex-col space-y-1 mt-4 pt-4 border-t border-gray-100">
                <span class="text-gray-500 text-sm font-semibold">Mapeamento Clint:</span>
                <div class="flex">
                    <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-700 w-fit">${caminhoSemBody}</code>
                </div>
            </div>
        </div>
    `;
}
