export default async function handler(req, res) {
  try {
    const hoje = new Date();
    const format = (d) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    const d12 = new Date();
    d12.setFullYear(d12.getFullYear() - 1);
    const dataInicial = format(d12);
    const dataFinal = format(hoje);
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=${dataInicial}&dataFinal=${dataFinal}`;
    const dados = await fetch(url).then((r) => r.json());
    if (!dados || dados.length === 0) {
      return res.status(500).json({ error: "Sem dados do BACEN" });
    }
    const fator = dados.reduce(
      (acc, d) => acc * (1 + parseFloat(d.valor.replace(",", ".")) / 100),
      1
    );
    const acumulado = ((fator - 1) * 100).toFixed(2);
    res.json({ valor: acumulado, data: dados[dados.length - 1].data });
  } catch (err) {
    res.status(500).json({ error: "Erro ao calcular CDI 12m" });
  }
}
