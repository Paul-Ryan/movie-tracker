import { matchSorter } from "match-sorter";
import invariant from "tiny-invariant";

type MovieMutation = {
    id?: string;
    title: string;
}

export type MovieRecord = MovieMutation & {
    id: string;
    createdAt: string;
}

// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeMovies = {
    records: {} as Record<string, MovieRecord>,
  
    async getAll(): Promise<MovieRecord[]> {
      return Object.keys(fakeMovies.records)
        .map((key) => fakeMovies.records[key]);
    },
  
    async get(id: string): Promise<MovieRecord | null> {
      return fakeMovies.records[id] || null;
    },
  
    async create(values: MovieMutation): Promise<MovieRecord> {
      const id = values.id || Math.random().toString(36).substring(2, 9);
      const createdAt = new Date().toISOString();
      const newMovie = { id, createdAt, ...values };
      fakeMovies.records[id] = newMovie;
      return newMovie;
    },
  
    async set(id: string, values: MovieMutation): Promise<MovieRecord> {
      const movie = await fakeMovies.get(id);
      invariant(movie, `No contact found for ${id}`);
      const updatedMovie = { ...movie, ...values };
      fakeMovies.records[id] = updatedMovie;
      return updatedMovie;
    },
  
    destroy(id: string): null {
      delete fakeMovies.records[id];
      return null;
    },
  };

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getMovies(query?: string | null) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let contacts = await fakeMovies.getAll();
    if (query) {
      contacts = matchSorter(contacts, query, {
        keys: ["title"],
      });
    return contacts;
    }
    return contacts;
  }
  
  export async function createEmptyMovie() {
    const contact = await fakeMovies.create({});
    return contact;
  }
  
  export async function getContact(id: string) {
    return fakeMovies.get(id);
  }
  
  export async function updateContact(id: string, updates: MovieMutation) {
    const contact = await fakeMovies.get(id);
    if (!contact) {
      throw new Error(`No contact found for ${id}`);
    }
    await fakeMovies.set(id, { ...contact, ...updates });
    return contact;
  }
  
  export async function deleteContact(id: string) {
    fakeMovies.destroy(id);
  }

  [
    {
      title: "Hunt for the Wilderpeople",
    },
    {
      title: "Mission Impossible: Rogue Nation",
    },
    {
      title: "Her",
    },
    {
      title: "The Little Hours",
    },
    {
      title: "Dr. Strangelove",
    },
    {
      title: "The Fifth Element",
    },
    {
      title: "Terminator 2",
    },
    {
      title: "Mars Express",
    }
  ].forEach((fakeMovieRecord, i) => {
    fakeMovies.create({
      ...fakeMovieRecord,
      id: `${fakeMovieRecord.title.toLowerCase()}-${i}`,
    });
  });