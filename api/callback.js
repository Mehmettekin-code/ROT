import fetch from "node-fetch";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Code yok.");
  }

  try {
    // 1. Access token al
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: "1386774159039660082",
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://cs-executor.vercel.app/api/callback",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error(tokenData);
      return res.status(400).send("Token alınamadı.");
    }

    // 2. Kullanıcı bilgilerini al
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const user = await userResponse.json();

    // 3. Kullanıcıyı sunucuya ekle
    const guildId = "1120088648398930054"; // Buraya kendi sunucu ID'n gelecek
    const botToken = process.env.DISCORD_BOT_TOKEN; // Bot token .env'de olmalı

    await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
      }),
    });

    // 4. Kullanıcıya hoşgeldin sayfası göster
    res.send(`<h1>Hoşgeldin, ${user.username}!</h1><p>Sunucuya başarıyla eklendin.</p>`);

  } catch (err) {
    console.error(err);
    res.status(500).send("Bir hata oluştu.");
  }
}
