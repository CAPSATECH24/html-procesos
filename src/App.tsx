import React, { useState } from 'react';

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
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        details {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
            transition: border-color 0.3s ease;
        }
        details.active {
            border-color: #007bff;
            box-shadow: 2px 2px 7px rgba(0, 123, 255, 0.2);
        }
        summary {
            font-weight: 600;
            cursor: pointer;
            padding: 10px;
            border-radius: 5px;
            list-style: none;
            display: flex;
            align-items: center;
        }
        summary::-webkit-details-marker {
            display: none;
        }
        summary::before {
            content: '\\f0da';
            font-family: 'Font Awesome 6 Free';
            font-weight: 900;
            margin-right: 10px;
            color: #007bff;
            transition: transform 0.3s ease;
        }
        details[open] summary::before {
            transform: rotate(90deg);
        }
        details[open] summary {
            margin-bottom: 10px;
        }
        ol {
            list-style-type: decimal;
            padding-left: 25px;
        }
        ul {
            list-style-type: disc;
            padding-left: 25px;
        }
        .responsable {
            font-weight: bold;
            color: #007bff;
        }
        .input-output-title {
            font-weight: bold;
            margin-top: 10px;
            color: #555;
        }
        .sistema-herramienta {
            font-style: italic;
            color: #777;
            margin-top: 5px;
            display: block;
        }
        .kpi {
            font-weight: bold;
            color: #28a745;
            margin-top: 5px;
            display: block;
        }
        .optional-step {
            background-color: #f8f9fa;
            border: 1px dashed #ccc;
            padding: 15px;
            border-radius: 8px;
            margin-top: 10px;
        }
        .optional-step summary {
            font-style: italic;
            font-weight: normal;
            color: #666;
        }
        .phase-title {
            color: #1e8449;
            font-size: 1.5em;
            margin-bottom: 15px;
            border-bottom: 2px solid #d4edda;
            padding-bottom: 5px;
            display: flex;
            align-items: center;
        }
        .phase-title i {
            margin-right: 10px;
            font-size: 1.2em;
        }
        .step-title {
            color: #3498db;
            font-size: 1.2em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .step-title i {
            margin-right: 8px;
            font-size: 0.9em;
        }
        .italic {
            font-style: italic;
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
    let listLevel = 0;

    const processMarkdown = (text) => {
      // Procesar texto en cursiva (entre asteriscos simples)
      return text.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
    };

    for (let line of lines) {
      line = line.trim();
      
      if (line.startsWith('## ')) {
        if (inStep) {
          html += '</details>\n';
          inStep = false;
        }
        if (inPhase) {
          html += '</details>\n';
        }
        currentPhase = line.substring(3).replace(/\*\*/g, '');
        html += `
    <details class="phase-section">
        <summary><h2 class="phase-title"><i class="fas fa-tasks"></i> ${currentPhase}</h2></summary>`;
        inPhase = true;
      } 
      else if (line.startsWith('### ')) {
        if (inStep) {
          html += '</details>\n';
        }
        currentStep = line.substring(4);
        html += `
        <details class="step-section">
            <summary><h3 class="step-title"><i class="fas fa-check-circle"></i> ${currentStep}</h3></summary>`;
        inStep = true;
      }
      else if (line.startsWith('**Responsable**:')) {
        const content = line.replace('**Responsable**:', '').trim();
        html += `            <p><span class="responsable"><i class="fas fa-user"></i> Responsable:</span> ${processMarkdown(content)}</p>`;
      }
      else if (line.startsWith('**Input**:')) {
        const content = line.replace('**Input**:', '').trim();
        html += `
            <p class="input-output-title"><i class="fas fa-arrow-right"></i> Input:</p>
            <ul>`;
        if (content) {
          html += `                <li>${processMarkdown(content)}</li>`;
        }
        inList = true;
      }
      else if (line.startsWith('**Output**:')) {
        if (inAction) {
          html += '</ol>\n';
          inAction = false;
        }
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        const content = line.replace('**Output**:', '').trim();
        html += `
            <p class="input-output-title"><i class="fas fa-arrow-left"></i> Output:</p>
            <ul>`;
        if (content) {
          html += `                <li>${processMarkdown(content)}</li>`;
        }
        inList = true;
      }
      else if (line.startsWith('**Acción**:')) {
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        html += `
            <p class="input-output-title"><i class="fas fa-list-ol"></i> Acción:</p>
            <ol>`;
        inAction = true;
      }
      else if (line.startsWith('**Sistema/Herramienta**:')) {
        if (inAction) {
          html += '</ol>\n';
          inAction = false;
        }
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        const content = line.replace('**Sistema/Herramienta**:', '').trim();
        html += `            <p class="sistema-herramienta"><i class="fas fa-cog"></i> Sistema/Herramienta: ${processMarkdown(content)}</p>`;
      }
      else if (line.startsWith('**KPI')) {
        const content = line.replace(/^\*\*KPI.*?\*\*:/, '').trim();
        html += `            <p class="kpi"><i class="fas fa-chart-line"></i> KPI: ${processMarkdown(content)}</p>`;
      }
      else if (line.startsWith('-')) {
        const content = line.substring(1).trim();
        if (content) {
          html += `                <li>${processMarkdown(content)}</li>`;
        }
      }
      else if (line.match(/^\d+\./)) {
        if (inAction) {
          const content = line.replace(/^\d+\./, '').trim();
          html += `                <li>${processMarkdown(content)}</li>`;
        }
      }
      else if (line.match(/^\d+\.\d+/)) {
        if (inAction) {
          const content = line.replace(/^\d+\.\d+/, '').trim();
          const indent = '    '.repeat(line.split('.').length - 1);
          html += `                ${indent}<li>${processMarkdown(content)}</li>`;
        }
      }
    }

    if (inStep) {
      html += '</details>\n';
    }
    if (inPhase) {
      html += '</details>\n';
    }

    html += `
<script>
    document.querySelectorAll('details > summary').forEach(summary => {
        summary.addEventListener('click', function() {
            const detailsElement = this.parentElement;
            if (!detailsElement.classList.contains('active')) {
                document.querySelectorAll('details.active').forEach(activeDetails => {
                    if (activeDetails !== detailsElement) {
                        activeDetails.classList.remove('active');
                    }
                });
                detailsElement.classList.add('active');
            } else {
                detailsElement.classList.remove('active');
            }
        });
    });
</script>

</body>
</html>`;

    setGeneratedHtml(html);
  };

  const downloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proceso.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Generador de Documentación de Procesos
        </h1>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingrese el texto del proceso:
            </label>
            <textarea
              className="w-full h-64 p-2 border rounded-md"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pegue aquí el texto del proceso..."
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={generateHtml}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generar HTML
            </button>
            {generatedHtml && (
              <button
                onClick={downloadHtml}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Descargar HTML
              </button>
            )}
          </div>

          {generatedHtml && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">HTML Generado:</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                {generatedHtml}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;