import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Backup from "../assets/images/backup.png"

const API_KEY = "c610a6ec2741a951b856f81ca49e9ab2";

export const MovieDetail = () => {
  const params = useParams();
  const [movie, setMovie] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);
  const [providers, setProviders] = useState(null);
  const image = movie.poster_path
    ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
    : Backup;

  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/" + params.id + "?api_key=" + API_KEY
      );
      const json = await response.json();
      setMovie(json);
    }

    async function fetchTrailer() {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/" + params.id + "/videos?api_key=" + API_KEY
      );
      const json = await response.json();
      const trailer =
        (json.results && json.results.find(function (v) {
          return v.site === "YouTube" && v.type === "Trailer" && v.official;
        })) ||
        (json.results && json.results.find(function (v) {
          return v.site === "YouTube" && v.type === "Trailer";
        })) ||
        (json.results && json.results.find(function (v) {
          return v.site === "YouTube";
        }));
      setTrailerKey(trailer ? trailer.key : null);
    }

    async function fetchProviders() {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/" + params.id + "/watch/providers?api_key=" + API_KEY
      );
      const json = await response.json();
      const region = (json.results && json.results.NG) || (json.results && json.results.US) || null;
      setProviders(region);
    }

    fetchMovie();
    fetchTrailer();
    fetchProviders();
  }, [params.id]);

  return (
    <main>
      <section className="flex justify-around flex-wrap py-5">
        <div className="max-w-sm">
          <img className="rounded" src={image} alt={movie.title} />
        </div>
        <div className="max-w-2xl text-gray-700 text-lg dark:text-white">
          <h1 className="text-4xl font-bold my-3 text-center lg:text-left">{movie.title}</h1>
          <p className="my-4">{movie.overview}</p>

          {movie.genres ? (
            <p className="my-7 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span className="mr-2 border border-gray-200 rounded dark:border-gray-600 p-2" key={genre.id}>
                  {genre.name}
                </span>
              ))}
            </p>
          ) : null}

          <div className="flex items-center">
            <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Rating star</title>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <p className="ml-2 text-gray-900 dark:text-white">{movie.vote_average}</p>
            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
            <span className="text-gray-900 dark:text-white">{movie.vote_count} reviews</span>
          </div>

          <p className="my-4">
            <span className="mr-2 font-bold">Runtime:</span>
            <span>{movie.runtime} min.</span>
          </p>
          <p className="my-4">
            <span className="mr-2 font-bold">Budget:</span>
            <span>{movie.budget}</span>
          </p>
          <p className="my-4">
            <span className="mr-2 font-bold">Revenue:</span>
            <span>{movie.revenue}</span>
          </p>
          <p className="my-4">
            <span className="mr-2 font-bold">Release Date:</span>
            <span>{movie.release_date}</span>
          </p>
          <p className="my-4">
            <span className="mr-2 font-bold">IMDB Code:</span>
            <a href={"https://www.imdb.com/title/" + movie.imdb_id} target="_blank" rel="noreferrer">
              {movie.imdb_id}
            </a>
          </p>

          {trailerKey ? (
            <div className="my-6">
              <h2 className="text-2xl font-bold mb-3">Trailer</h2>
              <div className="aspect-video w-full max-w-xl">
                <iframe
                  className="w-full h-full rounded"
                  src={"https://www.youtube.com/embed/" + trailerKey}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : null}

          <div className="my-6">
            <h2 className="text-2xl font-bold mb-3">Where to Watch</h2>
            {providers ? (
              <div className="space-y-4">
                {providers.flatrate ? (
                  <ProviderRow label="Stream" list={providers.flatrate} link={providers.link} />
                ) : null}
                {providers.rent ? (
                  <ProviderRow label="Rent" list={providers.rent} link={providers.link} />
                ) : null}
                {providers.buy ? (
                  <ProviderRow label="Buy" list={providers.buy} link={providers.link} />
                ) : null}
                {!providers.flatrate && !providers.rent && !providers.buy ? (
                  <p className="text-gray-500">Not currently available to watch online.</p>
                ) : null}
              </div>
            ) : (
              <p className="text-gray-500">Not currently available to watch online.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

const ProviderRow = function (props) {
  var label = props.label;
  var list = props.list;
  var link = props.link;
  return (
    <div>
      <p className="font-bold mb-2">{label}</p>
      <div className="flex flex-wrap gap-3">
        {list.map(function (provider) {
          return (
            <a>
              key={provider.provider_id}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center w-16 text-center"
              title={provider.provider_name}
            
              <img
                className="rounded w-12 h-12 object-cover"
                src={"https://image.tmdb.org/t/p/w92" + provider.logo_path}
                alt={provider.provider_name}
              />
              <span className="text-xs mt-1">{provider.provider_name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};