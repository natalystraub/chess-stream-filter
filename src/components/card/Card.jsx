import { useEffect, useState } from 'react';
import styles from './Card.module.css';

export function Card() {
  const page = 6;
  const [pages, setPages] = useState(page);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadStream() {
    try {
      setLoading(true);
      setError(null);

      const req = await fetch('https://api.chess.com/pub/streamers');

      if (!req.ok) {
        throw new Error('Não foi possível carregar os streamers.');
      }

      const json = await req.json();
      setUsers(json.streamers || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStream();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <section className={styles.main}>
      <div className={styles.card}>
        {users.slice(0, pages).map((user, i) => (
          <div className={styles.cardContainer} key={i}>
            <div className={styles.image}>{user.avatar && <img src={user.avatar} alt={user.usersname} />}</div>

            <div className={styles.usersname}>
              <p>{user.username}</p>

              {user.is_live && (
                <p className={styles.url}>
                  <a href={user.twitch_url} target="_blank" rel="noreferrer">
                    Twitch
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>{pages < users.length && <button onClick={() => setPages((v) => v + page)}>Ver mais</button>}</div>
    </section>
  );
}
