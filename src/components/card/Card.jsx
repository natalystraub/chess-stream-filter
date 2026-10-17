import { useEffect, useState } from 'react';

export function Card() {
  const page = 6;
  const [pages, setPages] = useState(page);

  const [user, setUSer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadStream() {
    try {
      setLoading(true);
      const req = await fetch('https://api.chess.com/pub/streamers');
      setLoading(false);
      const json = await req.json();
      if (json) {
        setUSer(json.streamers);
        console.log(json);
        console.log(json.streamers[0].username);
      }
    } catch (error) {
      setUSer(error.message);
    }
  }

  useEffect(() => {
    loadStream();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  return (
    <section>
      <div>
        {user.slice(0, pages).map((streamer) => (
          <div key={streamer.username}>
            <p>{streamer.username}</p>
            {streamer.avatar && <img src={streamer.avatar} alt={streamer.username} />}
            {streamer.twitch_url && (
              <a href={streamer.twitch_url} target="_blank" rel="noreferrer">
                Twitch
              </a>
            )}
          </div>
        ))}
      </div>
      {/*Botao para aparecer mais users */}
      <div>{pages < user.length && <button onClick={() => setPages((v) => v + page)}>Ver mais</button>}</div>
    </section>
  );
}
