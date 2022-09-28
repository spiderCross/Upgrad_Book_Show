import {
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import * as React from "react";
import { Link } from "react-router-dom";
import { StarBorder } from "@material-ui/icons";

import "./Details.css";

const Details = (props) => {
  const id = props.match.params.id;
  const [movie, setMovie] = React.useState({});
  const [genres, setGenres] = React.useState("");
  const [artists, setArtists] = React.useState([]);
  const [trailer_url, setTrailer_Url] = React.useState("");
  const [rating, setRating] = React.useState(0);

  React.useEffect(() => {
    fetch(`${props.baseUrl}movies/${id}`).then((response) =>
      response.json().then((data) => {
        setMovie(data);
        if (data.genres) {
          setGenres(data.genres);
          setArtists(data.artists);
          let url = data.trailer_url.split("=")[1];
          setTrailer_Url("https://www.youtube.com/embed/" + url);
        }
      })
    );
  }, []);

  const starClickHandler = (value) => {
    setRating(value);
  };

  return (
    <React.Fragment>
      <Link to={"/"} className="back">{`< Back to Home`}</Link>
      <div className="mainDiv">
        <div className="back moviePoster">
          <img src={movie.poster_url} alt={movie.title} />
        </div>

        <div className="movieDetail">
          <Typography variant="headline" component="h2">
            {movie.title}
          </Typography>
          <div className="mainDiv" style={{ alignItems: "center" }}>
            <Typography variant="h6" component="h4">
              Genre:
            </Typography>
            <Typography variant="body2" component="span">
              {genres}
            </Typography>
          </div>
          <div className="mainDiv" style={{ alignItems: "center" }}>
            <Typography variant="h6" component="h4">
              Duration:
            </Typography>
            <Typography variant="body2" component="span">
              {movie.duration}
            </Typography>
          </div>
          <div className="mainDiv" style={{ alignItems: "center" }}>
            <Typography variant="h6" component="h4">
              Release Date:
            </Typography>
            <Typography variant="body2" component="span">
              {new Date(movie.release_date).toDateString()}
            </Typography>
          </div>
          <div className="mainDiv" style={{ alignItems: "center" }}>
            <Typography variant="h6" component="h4">
              Rating:
            </Typography>
            <Typography variant="body2" component="span">
              {movie.rating}
            </Typography>
          </div>

          <div className="mainDiv" style={{ marginTop: "16px" }}>
            <Typography
              variant="h6"
              component="h4"
              style={{ marginTop: "2px" }}
            >
              Plot:
            </Typography>
            <Typography variant="body2" component="span">
              <a href={movie.wiki_url}>(Wiki Link)</a> {movie.storyline}
            </Typography>
          </div>

          <div className="mainDiv" style={{ marginTop: "16px" }}>
            <Typography variant="h6" component="h4">
              Trailer:
            </Typography>
            <div className="you-tube-player video-contr">
              <iframe
                key={movie.id}
                width="100%"
                height={380}
                src={trailer_url}
                title="YouTube video player"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture "
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="movieExtraDeatils">
          <div>
            <Typography variant="h6" component="h4">
              Rate this movie:
            </Typography>
            <div>
              <span key="1" value="1" onClick={() => starClickHandler(1)}>
                {
                  <StarBorder
                    style={
                      rating >= 1 ? { color: "yellow" } : { color: "black" }
                    }
                  />
                }
              </span>
              <span key="2" value="2" onClick={() => starClickHandler(2)}>
                {
                  <StarBorder
                    style={
                      rating >= 2 ? { color: "yellow" } : { color: "black" }
                    }
                  />
                }
              </span>
              <span key="3" value="3" onClick={() => starClickHandler(3)}>
                {
                  <StarBorder
                    style={
                      rating >= 3 ? { color: "yellow" } : { color: "black" }
                    }
                  />
                }
              </span>
              <span key="4" value="4" onClick={() => starClickHandler(4)}>
                {
                  <StarBorder
                    style={
                      rating >= 4 ? { color: "yellow" } : { color: "black" }
                    }
                  />
                }
              </span>
              <span key="5" value="5" onClick={() => starClickHandler(5)}>
                {
                  <StarBorder
                    style={
                      rating >= 5 ? { color: "yellow" } : { color: "black" }
                    }
                  />
                }
              </span>
            </div>
          </div>
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <GridList cols={2}>
              {artists.map((tile) => (
                <GridListTile key={tile.id} style={{ height: "350px" }}>
                  <img
                    src={tile.profile_url}
                    alt={tile.first_name + tile.last_name}
                    style={{
                      height: "inherit",
                      width: "-webkit-fill-available",
                    }}
                  />

                  <GridListTileBar
                    title={tile.first_name + " " + tile.last_name}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Details;
