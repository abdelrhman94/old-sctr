"use client"

import { RoleGuard } from "@/components/shared/RoleAuthWrapper"
import { StatusPill } from "@/components/shared/StatusPill"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserRole } from "@/enums/enums"
import { StudiesResponse } from "@/models/Studies.model"
import { renderValue } from "@/utils"
import { formatToDDMMYYYY } from "@/utils/dates"
import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical } from "lucide-react"

type ColumnActions = {
  onUpdate: (study: StudiesResponse) => void;
  onDeleteStudy: (study: StudiesResponse) => void;
};

export const studiesColumns = ({ onUpdate, onDeleteStudy }: ColumnActions): ColumnDef<StudiesResponse>[] => [
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
    accessorKey: "sctR_RegistrationNumber",
    header: "SCTR Registration No.",
    cell: ({ row }) => <span className=""> {renderValue(row.getValue("sctR_RegistrationNumber"))}</span>,
  },
  {
    accessorKey: "prospective",
    header: "Time Prospective",
    cell: ({ row }) => (
      <span className="">{renderValue(row.getValue("prospective"))}</span>
    ),
  },
  {
    accessorKey: "scientificTitle",
    header: "Scientific Title",
    cell: ({ row }) => <span className="">{renderValue(row.getValue("scientificTitle"))}</span>,
  },

  {
    accessorKey: "studyType",
    header: "Study Type",
    cell: ({ row }) => <span className="">{renderValue(row.getValue("studyType"))}</span>,
  },
  {
    accessorKey: "lastModification",
    header: "Last Modification",
    cell: ({ row }) => <span className="">{renderValue(formatToDDMMYYYY(row.getValue("lastModification")))}</span>,
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
      const studyStatus = study.status

      return (
        <DropdownMenu >
          <RoleGuard requiredRoles={[UserRole.INDIVIDUAL, UserRole.SUB_USER]}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`h-8 w-8 p-0 ${studyStatus === "Draft" ? "visible" : "hidden"}`}>
                <span className="sr-only">Open menu</span>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
          </RoleGuard>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(study.studyId)}
            >
              Copy study ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View Study Details</DropdownMenuItem> */}
            {studyStatus === "Draft" && <DropdownMenuItem onClick={() => onUpdate?.(study)}>Update Study</DropdownMenuItem>}
            {studyStatus === "Draft" || studyStatus === "NotApproved" && <DropdownMenuItem className=" text-red-500 focus:text-red-600" onClick={() => onDeleteStudy?.(study)}>Delete Study</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
