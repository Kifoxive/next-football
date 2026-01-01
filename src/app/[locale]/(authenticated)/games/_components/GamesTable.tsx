"use server";
import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { config, permissions } from "@/config";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import { GetGames } from "../types";
import { GameStatusChip } from "@/components/GameStatusChip/GameStatusChip";
import { format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import { getTranslations } from "next-intl/server";
import getServerAuthUser from "@/utils/getServerAuthUser";
import Link from "next/link";

type GamesTableProps = {
  data?: GetGames["response"];
};

export default async function GamesTable({ data }: GamesTableProps) {
  const t = await getTranslations("games");
  const authUser = await getServerAuthUser();

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple list">
          <TableHead>
            <TableRow>
              {/* <TableCell align="left">{t("form.id")}</TableCell> */}
              <TableCell align="left">{t("form.location_id")}</TableCell>
              <TableCell align="left">{t("form.date")}</TableCell>
              <TableCell align="left">{t("form.duration")}</TableCell>
              <TableCell align="left">{t("form.status")}</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                  textWrap: "nowrap",
                }}
              >
                <TableCell align="left">{row.locations.name}</TableCell>
                <TableCell align="left">
                  <Box className="flex items-center gap-2">
                    <CalendarMonthIcon
                      sx={{ color: "var(--themed-icon-color)" }}
                      fontSize="small"
                    />
                    {format(row.date, "EEEE, d MMMM")}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box className="flex items-center gap-2">
                    <TimerIcon
                      sx={{ color: "var(--themed-icon-color)" }}
                      fontSize="small"
                    />
                    {row.duration} {t("minutes")}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <GameStatusChip value={row.status} />
                </TableCell>
                <TableCell align="right">
                  <Box className="flex justify-end">
                    {authUser?.role &&
                      permissions.moderator.includes(authUser?.role) && (
                        <Link
                          href={config.routes.games.edit.replace(":id", row.id)}
                        >
                          <IconButton aria-label="edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Link>
                      )}
                    <Link
                      href={config.routes.games.detail.replace(":id", row.id)}
                    >
                      <IconButton aria-label="view">
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </Link>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
