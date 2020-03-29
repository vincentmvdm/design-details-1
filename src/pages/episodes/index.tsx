import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PageWrapper from "../../components/PageWrapper";
import Module from "../../components/Module";
import EpisodesList from "../../components/EpisodesList";
import Welcome from "../../components/Welcome";
import Recommended from "../../components/Recommended";
import { SearchCircle, StarCircle } from "../../components/Icons";
import theme from "../../config/theme";
import { EpisodesPageGrid } from "../../components/PageWrapper/styles";
import EpisodesSidebar from "../../components/EpisodesSidebar";
import { getEpisodes } from "../../data";

const Content = styled.div``;

/*
  grid-area: content;
  display: grid;
  grid-gap: 24px;
  grid-auto-rows: min-content;
  grid-column: span 1;

  @media (max-width: 768px) {
    grid-gap: 12px;
  }
*/

function Episodes({ episodes }) {
  const [played, setPlayed] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedPlayed = localStorage.getItem("played");
    if (storedPlayed) {
      setPlayed(JSON.parse(storedPlayed));
    }
  }, []);

  useEffect(() => {
    function getRecommendations() {
      let playedList = [];
      for (let [id, isPlayed] of Object.entries(played)) {
        if (isPlayed) {
          playedList = [...playedList, id];
        }
      }

      fetch("http://localhost:5000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          played: playedList
        })
      })
        .then(response => response.json())
        .then(data => {
          if (episodes.length > 0) {
            let retrievedRecommendations = [];
            data.forEach(rec => {
              const episode = episodes.find(episode => episode.id == rec);
              if (episode) {
                retrievedRecommendations = [
                  ...retrievedRecommendations,
                  episode
                ];
              }
            });
            setRecommended(retrievedRecommendations);
            console.log(recommended);
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }

    if (hasPlayedEpisodes()) {
      getRecommendations();
    }
  }, [played, episodes]);

  function hasPlayedEpisodes() {
    for (let [id, isPlayed] of Object.entries(played)) {
      if (isPlayed) {
        return true;
      }
    }
    return false;
  }

  function markAsPlayed(id) {
    const playedEpisodes = {
      ...played,
      [id]: !played[id]
    };
    setPlayed(playedEpisodes);
    localStorage.setItem("played", JSON.stringify(playedEpisodes));
  }

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  return (
    <PageWrapper>
      <EpisodesPageGrid>
        <EpisodesSidebar />
        <Content>
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            value={searchTerm}
          />
          {hasPlayedEpisodes() ? (
            <Module tint={theme.brand.primary}>
              <Module.Title tint={theme.brand.primary}>
                <StarCircle />
                Recommended For You
              </Module.Title>
              <Recommended episodes={recommended} />
            </Module>
          ) : (
            <Module tint={theme.brand.primary}>
              <Module.Title tint={theme.brand.primary}>
                <SearchCircle />
                Where to begin?
              </Module.Title>
              <Module.Description tint={theme.brand.primary}>
                In the last five years we’ve recorded more than 300 episodes.
                Here are a few of our favorites that will help make your start a
                little easier!
              </Module.Description>
              <Welcome />
            </Module>
          )}
          <EpisodesList
            episodes={episodes}
            played={played}
            markAsPlayed={markAsPlayed}
            searchTerm={searchTerm}
          />
        </Content>
      </EpisodesPageGrid>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const episodes = await getEpisodes();
  return { props: { episodes } };
}

export default Episodes;
