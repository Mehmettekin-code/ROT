export default function handler(req, res) {
  // Senin verdiğin hazır Discord OAuth2 linki
  const authUrl = "https://discord.com/oauth2/authorize?client_id=1386774159039660082&response_type=code&redirect_uri=https%3A%2F%2Fcs-executor.vercel.app%2Fapi%2Fcallback&scope=guilds.join+identify";
  
  // Kullanıcıyı yönlendir
  res.redirect(authUrl);
}
