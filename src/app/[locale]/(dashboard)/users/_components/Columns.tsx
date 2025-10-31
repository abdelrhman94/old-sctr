"use client"

import { RoleGuard } from "@/components/shared/RoleAuthWrapper"
import { StatusPill } from "@/components/shared/StatusPill"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserRole } from "@/enums/enums"
import { UsersResponse } from "@/models/Users.model"
import { renderValue } from "@/utils"
import { formatToDDMMYYYY } from "@/utils/dates"
import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"

type ColumnActions = {
  onAssignReviewer: (user: UsersResponse) => void;
  onDeleteUser: (user: UsersResponse) => void;
  onView?: (user: UsersResponse) => void;
  onUpdate?: (user: UsersResponse) => void;
  onAccept: (user: UsersResponse) => void;
  onReject: (user: UsersResponse) => void;
};

export const createUserColumns = ({
  onAssignReviewer,
  onAccept,
  onReject,
  onDeleteUser,
  onView,
  onUpdate,
}: ColumnActions): ColumnDef<UsersResponse>[] => [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <span className="">{renderValue(row.getValue("fullName"))}</span>
      ),
    },
    {
      accessorKey: "userTypeText",
      header: "Account Type",
      cell: ({ row }) => <span className=""> {renderValue(row.getValue("userTypeText"))}</span>,
    },

    {
      accessorKey: "creationDate",
      header: "Creation Date",
      cell: ({ row }) => <span className="">{renderValue(formatToDDMMYYYY(row.getValue("creationDate")))}</span>,
    },
    {
      accessorKey: "isApproved",
      header: "Status",
      cell: ({ row }) => <span className=""> <StatusPill isActive={row.getValue("isApproved")} /></span>,
    },
    {
      id: "actions",
      header: () => <div className="">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const isApproved = row.getValue<boolean>("isApproved");
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {!isApproved && (
                <>
                  <RoleGuard requiredRoles={UserRole.DIRECTOR_MANAGER}>
                    <DropdownMenuItem onClick={() => onAssignReviewer(user)}>
                      Assign Reviewer
                    </DropdownMenuItem>
                  </RoleGuard>
                  <RoleGuard requiredRoles={UserRole.REVIEWER}>
                    <DropdownMenuItem className="text-green-500 focus:text-green-600" onClick={() => onAccept(user)}>
                      Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 focus:text-red-600" onClick={() => onReject(user)}>
                      Reject
                    </DropdownMenuItem>
                  </RoleGuard>
                </>
              )}
              <DropdownMenuItem className="hidden" onClick={() => onView?.(user)}>
                View User Details
              </DropdownMenuItem>

              <DropdownMenuItem className="hidden" onClick={() => onUpdate?.(user)}>
                Update User
              </DropdownMenuItem>

              <DropdownMenuItem

                className="hidden text-red-500 focus:text-red-600"
                onClick={() => onDeleteUser(user)}
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
