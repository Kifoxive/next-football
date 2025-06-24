"use client";

import { VOTE_OPTION } from "@/config";
import { useMemo } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { LocationMap } from "../../_components/LocationMap";
import { useAuthStore } from "@/store/auth";
import { PictureSection } from "../_components/PictureSection";
import { LocationInfoSection } from "../_components/LocationInfoSection";
import { ReservationInfoSection } from "../_components/ReservationInfoSection";
import { VotingSection } from "../_components/VotingSection";
import { GetOneGame } from "../../types";
import { GameStatusChip } from "@/components/GameStatusChip";

type GameDetailProps = GetOneGame["response"] & {
  isVoteLoading: boolean;
  onVoteChange: (status: VOTE_OPTION) => void;
  canUpdate: boolean;
};

export default function GameDetail({
  status,
  cancelled_reason,
  description,
  date,
  duration,
  reserved,
  min_yes_votes_count,
  locations,
  votes,
  isVoteLoading,
  onVoteChange,
}: GameDetailProps) {
  const authUser = useAuthStore((s) => s.user);

  const { myVote, total, results } = useMemo(() => {
    const myVote = votes.find((vote) => vote.user_id === authUser?.id);
    const results = {
      yes: votes.filter((vote) => vote.vote === VOTE_OPTION.yes).length,
      no: votes.filter((vote) => vote.vote === VOTE_OPTION.no).length,
      maybe: votes.filter((vote) => vote.vote === VOTE_OPTION.maybe).length,
      total: votes.length,
    };

    return {
      myVote,
      total: votes.length,
      results,
    };
  }, [votes]);

  return (
    <Container className="flex flex-col gap-4" disableGutters>
      <Box className="flex items-center gap-4">
        <GameStatusChip value={status} />
        {status === "cancelled" && (
          <Typography color="error">{cancelled_reason}</Typography>
        )}
      </Box>
      <VotingSection
        myVote={myVote?.vote}
        minYesVotesCount={min_yes_votes_count}
        results={results}
        total={total}
        isVoteLoading={isVoteLoading}
        onVoteChange={onVoteChange}
      />
      <Box component={Paper} className="p-4">
        <MarkdownViewer content={description} />
      </Box>
      <ReservationInfoSection
        date={date}
        duration={duration}
        reserved={reserved}
      />
      <PictureSection image_list={locations.image_list} />
      <LocationInfoSection
        name={locations.name}
        address={locations.address}
        price_per_hour={locations.price_per_hour}
        floor_type={locations.floor_type}
        building_type={locations.building_type}
        description="Outdoor sports complex"
        // description={locations.description}
      />
      <Box className="overflow-hidden h-60" component={Paper}>
        <LocationMap
          latitude={locations.latitude}
          longitude={locations.longitude}
          address={locations.address}
        />
      </Box>
    </Container>
  );
}
