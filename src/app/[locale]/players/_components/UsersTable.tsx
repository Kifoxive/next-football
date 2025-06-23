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
} from "@mui/material";
import { config, permissions } from "@/config";
import { useRouter } from "next/navigation";
import { UserRoleChip } from "@/components/UserRoleChip";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { IUser } from "./../types";
import { useAuthStore } from "@/store/auth";

type UsersTableProps = {
  data?: IUser[];
};

export const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
  const t = useTranslations("players");
  const authUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const onEditButtonClick = (user_id: string) => {
    router.push(
      authUser?.id === user_id
        ? config.routes.profile
        : config.routes.players.edit.replace(":id", user_id)
    );
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
              <TableCell align="left">{t("form.user_name")}</TableCell>
              <TableCell align="left">{t("form.email")}</TableCell>
              <TableCell align="left">{t("form.role")}</TableCell>
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
                <TableCell align="left" className="flex flex-col">
                  <Typography fontWeight="600">
                    {row.first_name} {row.last_name}
                    {!row.auth_user_id && (
                      <PersonOffIcon
                        fontSize="small"
                        color="action"
                        className="ml-2"
                      />
                    )}
                    {row.invited_at && !row.auth_user_id && (
                      <HourglassTopIcon
                        fontSize="small"
                        color="action"
                        className="ml-2"
                      />
                    )}
                  </Typography>
                  <Box>{row.user_name}</Box>
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  <UserRoleChip value={row.role} />
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
                      onClick={() =>
                        router.push(
                          config.routes.players.list.replace(":id", row.id)
                        )
                      }
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
