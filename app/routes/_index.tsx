import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import styles from '../styles/app.module.css';
import { getMovies } from '~/mocks/data';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Movie Tracker' }, { name: 'An app to track movies' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const movies = await getMovies(q);
  return json({ movies, q });
};

export default function Index() {
  const { movies, q } = useLoaderData<typeof loader>();

  return (
    <div className={styles.app}>
      <header><h1 className={styles.header}>Movies</h1></header>
      <main>
      <ul className={styles.list}>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
      <form>
        <input type="text" name="q" defaultValue={q ?? ''} />
        <button type="submit">Search</button>
      </form>
      </main>
    </div>
  );
}
