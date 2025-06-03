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
import { IUser } from "./types";
import { useAuthStore } from "@/store/auth";

type UserTableProps = {
  data?: IUser[];
};

export const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const t = useTranslations("players");
  const authUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const onEditButtonClick = (auth_user_id: string, id: string) => {
    router.push(
      authUser?.id === auth_user_id
        ? config.routes.profile
        : config.routes.players.edit.replace(":id", id)
    );
  };

  return (
    <>
      <TableContainer
        component={Paper}
        // sx={{ width: "100%", overflowX: "scroll" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">{t("form.id")}</TableCell>
              <TableCell align="left">{t("form.user_name")}</TableCell>
              <TableCell align="left">{t("form.email")}</TableCell>
              {/* <TableCell align="left">{t("first_name")}</TableCell>
              <TableCell align="left">{t("last_name")}</TableCell> */}
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
                <TableCell sx={{ textWrap: "nowrap" }}>{row.id}</TableCell>
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
                            onClick={() => onEditButtonClick(row.id, row.id)}
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
                          config.routes.players.detail.replace(":id", row.id)
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
      {/* </div> */}
      {/* <Modal
        show={Boolean(reservationIdToApprove)}
        onClick={() => setReservationIdToApprove(null)}
        label={t("reservation.approveReservationStatusModal.label")}
        description={
          <Trans
            i18nKey={"reservation.approveReservationStatusModal.description"}
            values={{ email: reservationIdToApprove?.email || "" }}
            components={{ strong: <strong /> }}
          />
        }
        cancelComponent={
          <Button
            type="button"
            variant="outlined"
            onClick={() => setReservationIdToApprove(null)}
          >
            {t("reservation.approveReservationStatusModal.cancel")}
          </Button>
        }
        approveComponent={
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              onApproveReservationStatus(
                reservationIdToApprove?.reservation_id || ""
              );
            }}
          >
            {t("reservation.approveReservationStatusModal.approve")}
          </Button>
        }
      />
      <Modal
        show={Boolean(reservationIdToCancel)}
        onClick={() => setReservationIdToCancel(null)}
        label={t("reservation.cancelReservationStatusModal.label")}
        description={
          <Trans
            i18nKey={"reservation.cancelReservationStatusModal.description"}
            values={{ email: reservationIdToCancel?.email || "" }}
            components={{ strong: <strong /> }}
          />
        }
        cancelComponent={
          <Button
            type="button"
            variant="outlined"
            onClick={() => setReservationIdToCancel(null)}
          >
            {t("reservation.cancelReservationStatusModal.cancel")}
          </Button>
        }
        approveComponent={
          <Button
            variant="contained"
            onClick={() => {
              onCancelReservationStatus(
                reservationIdToCancel?.reservation_id || ""
              );
            }}
          >
            {t("reservation.cancelReservationStatusModal.approve")}
          </Button>
        }
      /> */}
    </>
    // </PageContent>
  );
};
