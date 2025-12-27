const tasks = require('../data/tasksData');

exports.generateSummary = async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY não definida');
        }

        if (!tasks || tasks.length === 0) {
            return res.json({
                resumo: `
📌 Resumo do Dia

Resumo executivo:
Você ainda não possui tarefas cadastradas.

Sugestão de foco:
Cadastre suas tarefas para que eu possa gerar um planejamento inteligente.

Mensagem final:
Organização diária constrói resultados consistentes.
                `
            });
        }

        const tasksText = tasks
            .filter(t => !t.completed)
            .map(t =>
                `- ${t.title} | Prioridade: ${t.priority} | Prazo: ${t.end_date || 'não definido'}`
            )
            .join('\n');

        const prompt = `
Você é um assistente profissional de produtividade.

Analise as tarefas abaixo e gere um resumo claro, bonito e funcional.

Formato obrigatório:

📌 Resumo do Dia

Resumo executivo:
Prioridades:
Riscos:
Sugestão de foco:
Mensagem final:

Tarefas:
${tasksText}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.4
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro Groq:', data);
            throw new Error(data.error?.message || 'Erro desconhecido da Groq');
        }

        const resumo = data.choices?.[0]?.message?.content;

        if (!resumo) {
            throw new Error('Resposta vazia da Groq');
        }

        res.json({ resumo });

    } catch (error) {
        console.error('ERRO IA:', error.message);
        res.status(500).json({
            resumo: `
Erro ao gerar resumo inteligente.

Detalhes técnicos:
${error.message}
            `
        });
    }
};
