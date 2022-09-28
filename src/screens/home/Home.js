import * as React from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  GridList,
  GridListTile,
  GridListTileBar,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import "./Home.css";
import { Link } from "react-router-dom";

const styles = (theme) => ({
  root: {
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridListNoWrap: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
  },
  gridListWithWrap: {
    flexWrap: "wrap",
    transform: "translateZ(0)",
  },
  title: {
    color: "white",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
  gridListItem: {
    height: "250px",
  },
});

const Home = (homeProps) => {
  const { classes } = homeProps;
  const [upcomingMovies, setUpcomingMovies] = React.useState([]);
  const [releasedMovies, setReleasedMovies] = React.useState([]);
  const [searchMovies, setSearchMovies] = React.useState([]);
  const [genres, setGenres] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [artists, setArtists] = React.useState([]);
  const [selectedArtists, setSelectedArtists] = React.useState([]);
  const [releaseDateStart, setReleaseDateStart] = React.useState("");
  const [releaseDateEnd, setReleaseDateEnd] = React.useState("");
  const [movieName, setMovieName] = React.useState("");

  React.useEffect(() => {
    fetch(`${homeProps.baseUrl}/movies?page=1&limit=30`).then((response) =>
      response.json().then((data) => {
        const movies = data.movies;
        setUpcomingMovies(
          movies.filter((movie) => {
            return movie.status === "PUBLISHED";
          })
        );

        setReleasedMovies(
          movies.filter((movie) => {
            return movie.status === "RELEASED";
          })
        );

        setSearchMovies(
          movies.filter((movie) => {
            return movie.status === "RELEASED";
          })
        );
      })
    );
  }, []);

  React.useEffect(() => {
    fetch(`${homeProps.baseUrl}genres`).then((response) =>
      response.json().then((data) => {
        setGenres(data.genres);
      })
    );
  }, []);

  React.useEffect(() => {
    fetch(`${homeProps.baseUrl}artists`).then((response) =>
      response.json().then((data) => {
        setArtists(data.artists);
      })
    );
  }, []);

  const nameChangeHandler = (event) => {
    const {
      target: { value },
    } = event;
    setMovieName(value);
  };

  const genreChangeHandler = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedGenres(value);
  };

  const artistChangeHandler = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedArtists(value);
  };

  const releaseDateStartChangeHamdler = (event) => {
    const {
      target: { value },
    } = event;
    setReleaseDateStart(value);
  };

  const releaseDateEndChangeHamdler = (event) => {
    const {
      target: { value },
    } = event;
    setReleaseDateEnd(value);
  };

  const applyButtonClickHandler = (event) => {
    event.preventDefault();
    setSearchMovies(
      releasedMovies.filter((movie) => {
        return movieName === "" ? true : movie.title === movieName;
      })
    );
  };

  return (
    <div>
      <div className="upcomingHeading">Upcoming Movies</div>
      <div className={classes.root}>
        <GridList className={classes.gridListNoWrap} cols={6}>
          {upcomingMovies.map((tile) => (
            <GridListTile key={tile.id} style={{ height: "250px" }}>
              <img
                src={tile.poster_url}
                alt={tile.title}
                style={{ height: "inherit", width: "-webkit-fill-available" }}
              />
              <GridListTileBar
                title={tile.title}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
      <br />
      <div className="releasedMovieDiv">
        <div style={{ width: "75%" }}>
          <GridList className={classes.gridListWithWrap} cols={4}>
            {searchMovies.map((tile) => (
              <Link
                to={"/movie/" + tile.id}
                key={tile.id}
                style={{ height: "350px", width: "23%" }}
              >
                <GridListTile key={tile.id} style={{ height: "350px" }}>
                  <img
                    src={tile.poster_url}
                    alt={tile.title}
                    style={{
                      height: "inherit",
                      width: "-webkit-fill-available",
                    }}
                  />

                  <GridListTileBar
                    title={tile.title}
                    subtitle={`Release Date:${new Date(
                      tile.release_date
                    ).toDateString()}`}
                    classes={{
                      root: classes.titleBar,
                      title: classes.title,
                    }}
                  />
                </GridListTile>
              </Link>
            ))}
          </GridList>
        </div>
        <div style={{ width: "24%", padding: "3px" }}>
          <Card>
            <CardContent>
              <Typography variant="headline" component="h3" color="primary">
                FIND MOVIES BY:
              </Typography>
              <br />
              <FormControl className="formControl">
                <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                <Input
                  id="movieName"
                  name="movieName"
                  onChange={nameChangeHandler}
                ></Input>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <InputLabel htmlFor="genres">Genres</InputLabel>
                <Select
                  id="genres"
                  name="genres"
                  multiple
                  value={selectedGenres}
                  onChange={genreChangeHandler}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {genres.map((item) => (
                    <MenuItem key={item.id} value={item.genre}>
                      <Checkbox checked={selectedGenres.indexOf(item) > -1} />
                      {item.genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <InputLabel htmlFor="artists">Artists</InputLabel>
                <Select
                  id="artists"
                  name="artists"
                  multiple
                  value={selectedArtists}
                  onChange={artistChangeHandler}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {artists.map((item) => {
                    return (
                      <MenuItem
                        key={item.id}
                        value={`${item.first_name} ${item.last_name}`}
                      >
                        <Checkbox
                          checked={selectedArtists.indexOf(item) > -1}
                        />
                        {`${item.first_name} ${item.last_name}`}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <TextField
                  id="Release Date Start"
                  type="date"
                  label="Release Date Start"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={releaseDateStartChangeHamdler}
                ></TextField>
              </FormControl>
              <br />
              <br />
              <FormControl className="formControl">
                <TextField
                  id="Release Date End"
                  type="date"
                  label="Release Date End"
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={releaseDateEndChangeHamdler}
                ></TextField>
              </FormControl>
              <br />
              <br />
              <div className="buttonDiv">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={applyButtonClickHandler}
                >
                  APPLY
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
