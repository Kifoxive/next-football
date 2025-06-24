"use client";
import React from "react";
import { useTranslations } from "next-intl";
// import { AccessAlarm, CalendarMonth, Person } from "@mui/icons-material";
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
  Typography,
  useTheme,
} from "@mui/material";
import { config, permissions } from "@/config";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import { GetGames } from "../types";
import { useAuthStore } from "@/store/auth";
import { GameStatusChip } from "@/components/GameStatusChip";
import { format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import { getThemedColor } from "@/utils/getThemedColor";

type GamesTableProps = {
  data?: GetGames["response"];
};

export const GamesTable: React.FC<GamesTableProps> = ({ data }) => {
  const t = useTranslations("games");

  const authUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const theme = useTheme();

  const onEditButtonClick = (id: string) => {
    router.push(config.routes.games.edit.replace(":id", id));
  };
  const onOpenButtonClick = (id: string) => {
    router.push(config.routes.games.detail.replace(":id", id));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        // sx={{ width: "100%", overflowX: "scroll" }}
      >
        <Table aria-label="simple list">
          <TableHead>
            <TableRow>
              <TableCell align="left">{t("form.id")}</TableCell>
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
                <TableCell sx={{ textWrap: "nowrap" }}>
                  <Typography color="primary">{row.id}</Typography>
                </TableCell>
                <TableCell align="left">{row.locations.name}</TableCell>
                <TableCell align="left">
                  <Box className="flex items-center gap-2">
                    <CalendarMonthIcon
                      sx={{ color: getThemedColor(theme) }}
                      fontSize="small"
                    />
                    {format(row.date, "EEEE, d MMMM")}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box className="flex items-center gap-2">
                    <TimerIcon
                      sx={{ color: getThemedColor(theme) }}
                      fontSize="small"
                    />
                    {row.duration} {t("minutes")}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <GameStatusChip value={row.status} />
                  {/* <GameStatusChip value={GAME_STATUS["initialization"]} />
                  <GameStatusChip value={GAME_STATUS["voting"]} />
                  <GameStatusChip value={GAME_STATUS["confirmed"]} />
                  <GameStatusChip value={GAME_STATUS["completed"]} />
                  <GameStatusChip value={GAME_STATUS["cancelled"]} /> */}
                </TableCell>
                <TableCell align="right">
                  <Box className="flex justify-end">
                    {authUser?.role &&
                      permissions.moderator.includes(authUser?.role) && (
                        <>
                          <IconButton
                            aria-label="edit"
                            onClick={() => onEditButtonClick(row.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {/* <IconButton
                          aria-label="remove"
                          // onClick={() =>
                          //   onEditButtonClick(row.auth_user_id, row.id)
                          // }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton> */}
                        </>
                      )}
                    <IconButton
                      aria-label="view"
                      onClick={() => onOpenButtonClick(row.id)}
                    >
                      <LaunchIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
