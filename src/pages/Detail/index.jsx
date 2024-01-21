import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Background, Container, Cover, Info, ContainerMovies } from './styles'
import {
  getMovieById,
  getMovieCredits,
  getMovieSimilar,
  getMovieTrailer
} from '../../services/getData'
import { getImages } from '../../utils/getImages'
import SpanGenres from '../../components/spanGenres'
import Credits from '../../components/Credits'
import Slider from '../../components/Slider'

function Detail() {
  const { id } = useParams()
  const [movie, setMovie] = useState()
  const [movieTrailer, setMovieTrailer] = useState()
  const [movieCredits, setMovieCredits] = useState()
  const [movieSimilar, setMovieSimilar] = useState()

  useEffect(() => {
    async function getAllData() {
      Promise.all([
        getMovieById(id),
        getMovieTrailer(id),
        getMovieCredits(id),
        getMovieSimilar(id)
      ])
        .then(([movie, trailer, credits, similar]) => {
          setMovie(movie)
          setMovieTrailer(trailer)
          setMovieCredits(credits)
          setMovieSimilar(similar)
        })
        .catch((error) => console.error(error))
    }

    getAllData()
  }, [])
  return (
    <>
      {movie && (
        <>
          <Background image={getImages(movie.backdrop_path)} />
          <Container>
            <Cover>
              <img src={getImages(movie.poster_path)} />
            </Cover>
            <Info>
              <h2>{movie.title}</h2>
              <SpanGenres genres={movie.genres} />
              <p>{movie.overview}</p>
              <div>
                <Credits credits={movieCredits} />
              </div>
            </Info>
          </Container>
          <ContainerMovies>
            {movieTrailer &&
              movieTrailer.map((video) => (
                <div key={video.id}>
                  <h4>{video.name}</h4>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title="Youtube Video Player"
                    height="500px"
                    width="100%"
                  ></iframe>
                </div>
              ))}
          </ContainerMovies>
          {movieSimilar && <Slider info={movieSimilar} title={'+ Filmes'} />}
        </>
      )}
    </>
  )
}
export default Detail
