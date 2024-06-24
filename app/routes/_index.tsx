import { json, type LoaderFunctionArgs } from '@remix-run/node';
import styles from '../styles/index.module.css';
import { getMovies } from '~/mocks/data';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const movies = await getMovies(q);
  return json({ movies, q });
};

const List = ({
  movies,
  title,
}: {
  movies: { id: string; title: string }[];
  title?: string;
}) => (
  <div className={styles.listSection}>
    {title && <h2  className={styles.listTitle}>{title}</h2>}
    <ul className={styles.list}>
      {movies.map((movie) => (
        <li key={movie.id}>{movie.title}</li>
      ))}
    </ul>
  </div>
);

const ListCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => (
  <>
    {title && <h2 className={styles.cardTitle}>{title}</h2>}
    <div className={styles.listCard}>{children}</div>
  </>
);

export default function Index() {
  const { movies, q } = useLoaderData<typeof loader>();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Movies</h1>
      </header>
      <main>
        <div className={styles.listColumn}>
          <ListCard>
            <List movies={movies} title="Favorites" />
          </ListCard>
          <ListCard title="2024">
            <List movies={movies} title="Best" />
            <List movies={movies} title="Good" />
          </ListCard>
        </div>
        <form>
          <input type="text" name="q" defaultValue={q ?? ''} />
          <button type="submit">Search</button>
        </form>
      </main>
    </div>
  );
}
