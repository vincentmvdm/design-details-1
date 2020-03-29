import { Grid } from "./styles";
import { Chevron } from "../Icons";
import Link from "next/link";

export default ({ episodes }) => (
  <Grid>
    {episodes.map(ep => (
      <Link key={ep.id} href={`/episodes/[id]`} as={`/episodes/${ep.id}`}>
        <a>
          <Chevron />
          {ep.title}
        </a>
      </Link>
    ))}
  </Grid>
);
