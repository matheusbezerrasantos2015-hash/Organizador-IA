const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

exports.gerarResumoDiario = async (tarefas) => {
    const lista = tarefas.map(t => {
        return `
Tarefa: ${t.title}
Prioridade: ${t.priority}
Início: ${t.start_date || 'não definido'}
Fim: ${t.end_date || 'não definido'}
`;
    }).join('\n');

    const prompt = `
Você é um organizador pessoal especialista em produtividade.

Organize e priorize as tarefas abaixo.
Leve MUITO em consideração:
- Prioridade (alta > média > baixa)
- Datas finais mais próximas
- Clareza e objetividade

TAREFAS:
${lista}

Retorne:
- Lista priorizada
- Sugestão de foco diário
- Alerta se houver prazos críticos
`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: "Você é um organizador pessoal inteligente." },
            { role: "user", content: prompt }
        ],
        temperature: 0.4
    });

    return completion.choices[0].message.content;
};
