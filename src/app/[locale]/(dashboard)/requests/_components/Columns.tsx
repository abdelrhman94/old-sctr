"use client"

import { RoleGuard } from "@/components/shared/RoleAuthWrapper"
import { StatusPill } from "@/components/shared/StatusPill"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserRole } from "@/enums/enums"
import { RequestsResponse } from "@/models/Requests.model"
import { renderValue } from "@/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"


type ColumnActions = {
  onAssignReviewer: (request: RequestsResponse) => void;
  onView: (request: RequestsResponse) => void;
};

export const createRequestColumns = ({
  onAssignReviewer,
  onView,
}: ColumnActions): ColumnDef<RequestsResponse>[] => [
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
      accessorKey: "recordNumber",
      header: "Record No.",
      cell: ({ row }) => (
        <span className="">{renderValue(row.getValue("recordNumber"))}</span>
      ),
    },
    {
      accessorKey: "studyName",
      header: "Study Name",
      cell: ({ row }) => <span className=""> {renderValue(row.getValue("studyName"))}</span>,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className=""> <StatusPill status={row.getValue("status") as string | null | undefined} /></span>,
    },

    {
      id: "actions",
      header: () => <div className="">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const study = row.original
        const statusType = study.status
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(study.studyId)}
              >
                Copy study ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {statusType === "PendingReviewerAssignment" && (
                <RoleGuard requiredRoles={UserRole.DIRECTOR_MANAGER}>
                  <DropdownMenuItem onClick={() => onAssignReviewer(study)}>
                    Assign Reviewer
                  </DropdownMenuItem>
                </RoleGuard>
              )}
              <DropdownMenuItem onClick={() => onView?.(study)}>View Request Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
