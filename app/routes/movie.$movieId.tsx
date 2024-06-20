import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getMovies } from '~/mocks/data';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.movieId, 'Missing contactId param');

  const movie = await getMovies(params.movieId);
  if (!movie) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ movie });
};


export default function Movie() {
    const { movie } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{movie[0]?.title ?? 'Unknown Movie'}</h1>
    </div>
  );
}