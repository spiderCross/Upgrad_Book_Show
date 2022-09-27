import * as React from "react";
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  GridList,
  GridListTile,
  GridListTileBar,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Header from "../../common/header/Header";

import "./Home.css";

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
  const [releasedMovie, setReleasedMovies] = React.useState([]);
  const [genres, setGenres] = React.useState([]);
  const [selectedGenres, setSelectedGenres] = React.useState([]);
  const [artists, setArtists] = React.useState([]);
  const [selectedArtists, setSelectedArtists] = React.useState([]);

  React.useEffect(() => {
    fetch(
      `${homeProps.baseUrl}/movies?page=1&limit=10&start_date=2016-08-29&end_date=2018-09-28`
    ).then((response) =>
      response.json().then((data) => setReleasedMovies(data.movies))
    );
  }, []);

  React.useEffect(() => {
    fetch(
      `${homeProps.baseUrl}/movies?page=1&limit=10&start_date=2018-08-29`
    ).then((response) =>
      response.json().then((data) => setUpcomingMovies(data.movies))
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

  return (
    <div>
      <Header baseUrl={homeProps.baseUrl}></Header>
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
            {releasedMovie.map((tile) => (
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
                  subtitle={`Release Date:${new Date(tile.release_date)
                    .toUTCString()
                    .substring(0, 16)
                    .replace(",", "")}`}
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                />
              </GridListTile>
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
                <Input id="movieName" name="movieName"></Input>
              </FormControl>
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
