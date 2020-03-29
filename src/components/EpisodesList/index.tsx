import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { PlayCircle } from "../Icons";
import Module from "../Module";
import LoadingSpinner from "../LoadingSpinner";
import theme from "../../config/theme";
import { getEpisodes } from "../../data";
import WhiteButton from "../Button/WhiteButton";
import {
  AutoSizer,
  List,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache
} from "react-virtualized";

function EpisodesList({ episodes, played, markAsPlayed, searchTerm }) {
  const { data, error } = useSWR("episodes", getEpisodes, {
    initialData: episodes,
    revalidateOnFocus: false
  });

  const list = React.useRef<List>(null);

  const cache = new CellMeasurerCache({
    fixedWidth: true
  });

  if (error) {
    return (
      <Module tint={theme.brand.primary}>
        <Module.Title tint={theme.brand.primary}>
          <PlayCircle />
          Error loading episodes
        </Module.Title>
        <Module.Description
          style={{ marginBottom: 0 }}
          tint={theme.brand.primary}
        >
          We had trouble loading episodes. Try refreshing, or please come back
          later!
        </Module.Description>
      </Module>
    );
  }

  if (!data) {
    return (
      <Module tint={theme.brand.primary}>
        <Module.Title tint={theme.brand.primary}>
          <PlayCircle />
          Loading episodes...
        </Module.Title>
        <LoadingSpinner style={{ padding: "85px 0" }} />
      </Module>
    );
  }

  function rowRenderer({ index, isScrolling, key, parent, style }) {
    const episode = data[index];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure, registerChild }) => (
          // 'style' attribute required to position cell (within parent List)
          <div
            key={key}
            ref={registerChild}
            style={{ ...style, paddingTop: "24px" }}
          >
            <Module tint={theme.brand.primary} isLink>
              <Module.Title tint={theme.brand.primary}>
                <PlayCircle />
                {episode.title}
              </Module.Title>

              <Module.Description tint={theme.brand.primary}>
                {episode.description}
              </Module.Description>

              <Module.Description
                style={{ marginBottom: 0 }}
                tint={theme.brand.primary}
              >
                <WhiteButton onClick={() => markAsPlayed(episode.id)}>
                  {played[episode.id] ? "Played" : "Mark as Played"}
                </WhiteButton>
              </Module.Description>
            </Module>
          </div>
        )}
      </CellMeasurer>
    );
  }

  return (
    <WindowScroller
      onResize={() => {
        if (list) {
          cache.clearAll();
          list.current.recomputeRowHeights();
        }
      }}
      serverWidth={1440}
      serverHeight={900}
    >
      {({ width, height, isScrolling, onChildScroll, scrollTop }) => (
        <List
          autoHeight
          autoWidth
          width={width}
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          rowCount={data.length}
          rowHeight={cache.rowHeight}
          ref={list}
          rowRenderer={rowRenderer}
          scrollTop={scrollTop}
          deferredMeasurementCache={cache}
        />
      )}
    </WindowScroller>
  );
}

export default EpisodesList;
