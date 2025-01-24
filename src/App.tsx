import React, { useState, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');

  const generateHtml = () => {
    // Separar el texto en líneas
    const lines = inputText.split('\n');
    let html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capacitación: Flujo de Proceso de Servicio de Inicio a Fin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            background-color: #f4f7f9;
            color: #333;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Estilos para las fases principales */
        .phase-section {
            background-color: #ffffff;
            border: 1px solid #e1e4e8;
            border-radius: 10px;
            margin: 20px 0;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .phase-title {
            color: #1a73e8;
            font-size: 1.8em;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        /* Estilos para las secciones */
        .step-section {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            margin: 15px 0;
            padding: 15px;
        }
        
        .step-title {
            color: #2c3e50;
            font-size: 1.4em;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Estilos para los pasos */
        .substep-section {
            background-color: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            margin: 10px 0;
            padding: 15px;
            margin-left: 20px;
        }
        
        .sub-step-title {
            color: #495057;
            font-size: 1.2em;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* Estilos para los detalles del contenido */
        .responsable, .input-output-title {
            font-weight: 600;
            color: #1a73e8;
            margin-top: 15px;
            margin-bottom: 5px;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
        }
        
        li {
            margin: 5px 0;
        }
        
        /* Estilos para los elementos desplegables */
        details {
            transition: all 0.3s ease;
        }
        
        details summary {
            cursor: pointer;
            padding: 10px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        details summary:hover {
            background-color: rgba(0,0,0,0.03);
        }
        
        details[open] summary {
            margin-bottom: 10px;
        }
        
        /* Iconos y sus animaciones */
        i {
            transition: transform 0.3s ease;
        }
        
        details[open] > summary i {
            transform: rotate(90deg);
        }
        
        /* Estilos para las acciones y listas */
        .action-list {
            background-color: #f8f9fa;
            border-left: 3px solid #1a73e8;
            padding: 10px 15px;
            margin: 10px 0;
        }
        
        .action-item {
            margin: 8px 0;
        }
        
        /* Estilos para notas y elementos especiales */
        .note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px 15px;
            margin: 10px 0;
            font-style: italic;
        }
        
        em {
            color: #666;
            font-style: italic;
        }
        
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
    </style>
</head>
<body>`;

    let currentPhase = '';
    let currentStep = '';
    let inPhase = false;
    let inStep = false;
    let inAction = false;
    let inList = false;
    let inSubStep = false;
    let listLevel = 0;

    const processMarkdown = (text) => {
      // Procesar texto en negrita (entre dobles asteriscos)
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Procesar texto en cursiva (entre asteriscos simples)
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return text;
    };

    for (let line of lines) {
      line = line.trim();
      
      if (line.startsWith('## ')) {
        // Cerrar cualquier sección abierta
        if (inSubStep) {
          html += '                </details>\n';
          inSubStep = false;
        }
        if (inStep) {
          html += '            </details>\n';
          inStep = false;
        }
        if (inPhase) {
          html += '        </details>\n';
          inPhase = false;
        }
        currentPhase = processMarkdown(line.substring(3));
        html += `
        <details class="phase-section">
            <summary><h2 class="phase-title"><i class="fas fa-tasks"></i> ${currentPhase}</h2></summary>`;
        inPhase = true;
      } 
      else if (line.startsWith('### ')) {
        // Cerrar secciones anteriores si están abiertas
        if (inSubStep) {
          html += '                </details>\n';
          inSubStep = false;
        }
        if (inStep) {
          html += '            </details>\n';
        }
        currentStep = processMarkdown(line.substring(4));
        html += `
            <details class="step-section">
                <summary><h3 class="step-title"><i class="fas fa-check-circle"></i> ${currentStep}</h3></summary>`;
        inStep = true;
      }
      else if (line.startsWith('#### ')) {
        // Cerrar subsección anterior si está abierta
        if (inSubStep) {
          html += '                </details>\n';
        }
        const subStep = processMarkdown(line.substring(5));
        html += `
                <details class="substep-section">
                    <summary><h4 class="sub-step-title"><i class="fas fa-angle-right"></i> ${subStep}</h4></summary>`;
        inSubStep = true;
      }
      else if (line.startsWith('**Responsable**:')) {
        const content = processMarkdown(line.replace('**Responsable**:', '').trim());
        html += `                    <p><span class="responsable"><i class="fas fa-user"></i> Responsable:</span> ${content}</p>`;
      }
      else if (line.startsWith('**Input**:')) {
        const content = processMarkdown(line.replace('**Input**:', '').trim());
        html += `                    <p class="input-output-title"><i class="fas fa-arrow-right"></i> Input:</p>`;
        if (content) {
          html += `                    <p>${content}</p>`;
        }
      }
      else if (line.startsWith('**Output**:')) {
        if (inAction) {
          html += '                        </ol>\n';
          html += '                    </div>\n';
          inAction = false;
        }
        if (inList) {
          html += '                    </ul>\n';
          inList = false;
        }
        const content = processMarkdown(line.replace('**Output**:', '').trim());
        html += `                    <p class="input-output-title"><i class="fas fa-arrow-left"></i> Output:</p>`;
        if (content) {
          html += `                    <p>${content}</p>`;
        }
        html += '                    <ul>\n';
        inList = true;
      }
      else if (line.startsWith('**Sistema/Herramienta**:')) {
        if (inList) {
          html += '                    </ul>\n';
          inList = false;
        }
        const content = processMarkdown(line.replace('**Sistema/Herramienta**:', '').trim());
        html += `                    <p class="input-output-title"><i class="fas fa-tools"></i> Sistema/Herramienta:</p>`;
        html += '                    <ul>\n';
        inList = true;
      }
      else if (line.startsWith('**Acción**:')) {
        if (inList) {
          html += '                    </ul>\n';
          inList = false;
        }
        html += `                    <div class="action-list">
                        <p class="input-output-title"><i class="fas fa-play"></i> Acción:</p>
                        <ol>\n`;
        inAction = true;
      }
      else if (line.match(/^\d+\./)) {
        const content = processMarkdown(line.replace(/^\d+\.\s*/, '').trim());
        const indentLevel = line.match(/^\s*/)[0].length;
        if (indentLevel > 0 && inAction) {
          html += `                            <li class="action-item">
                                <ol style="list-style-type: lower-alpha;">
                                    <li>${content}</li>
                                </ol>
                            </li>\n`;
        } else {
          html += `                            <li class="action-item">${content}</li>\n`;
        }
      }
      else if (line.startsWith('-')) {
        const content = processMarkdown(line.substring(1).trim());
        if (!inList) {
          html += '                    <ul>\n';
          inList = true;
        }
        html += `                        <li>${content}</li>\n`;
      }
      else if (line.trim() !== '') {
        html += `                    <p>${processMarkdown(line)}</p>\n`;
      }
    }

    // Cerrar todas las secciones abiertas al final
    if (inAction) {
      html += '                        </ol>\n';
      html += '                    </div>\n';
    }
    if (inList) {
      html += '                    </ul>\n';
    }
    if (inSubStep) {
      html += '                </details>\n';
    }
    if (inStep) {
      html += '            </details>\n';
    }
    if (inPhase) {
      html += '        </details>\n';
    }

    html += `
<script>
</script>

</body>
</html>`;

    return html;
  };

  useEffect(() => {
    const html = generateHtml();
    setGeneratedHtml(html);
  }, [inputText]);

  return (
    <div className="app-container" style={{
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto',
      display: 'flex',
      gap: '20px',
      height: '100vh'
    }}>
      <div className="input-section" style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Editor de Markdown</h2>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: '1',
            padding: '15px',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'none'
          }}
          placeholder="Ingresa tu texto en formato Markdown aquí..."
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              const blob = new Blob([generatedHtml], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'manual.html';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Descargar HTML
          </button>
          <button
            onClick={() => {
              const blob = new Blob([inputText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'manual.md';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Descargar Markdown
          </button>
        </div>
      </div>
      
      <div className="preview-section" style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Vista Previa</h2>
        <iframe
          srcDoc={generatedHtml}
          style={{
            flex: '1',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
          title="Preview"
        />
      </div>
    </div>
  );
}

export default App;