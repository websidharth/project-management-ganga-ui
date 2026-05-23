'use client';
import { UserDto } from '@/dtos/UserDto';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../../Table/data-table-column-header';
import { GoCheckCircleFill } from 'react-icons/go';
import { IoMdCloseCircle } from 'react-icons/io';
import { useMemo } from 'react';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { container } from '@/config/ioc';
import { BsEnvelope, BsPhone } from 'react-icons/bs';
import { CardDescription } from '@/components/ui/card';

// ─── Tiny composable atoms ────────────────────────────────────────────────────

/** Monogram avatar with a subtle ring */
const Avatar = ({ name }: { name?: string }) => (
  <span
    className="
            inline-flex items-center justify-center
            h-8 w-8 rounded-full shrink-0
            bg-gradient-to-br from-slate-700 to-slate-800
            border border-slate-600/60
            text-[11px] font-semibold tracking-widest uppercase
            text-slate-300 shadow-inner
        "
  >
    {name?.charAt(0) ?? 'U'}
  </span>
);

/** Pill badge with optional glow variant */
const Pill = ({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'neutral' | 'danger' }) => {
  const map = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_8px_rgba(52,211,153,0.15)]',
    warning: 'bg-amber-500/10  text-amber-400  border-amber-500/25  shadow-[0_0_8px_rgba(251,191,36,0.12)]',
    danger: 'bg-red-500/10    text-red-400    border-red-500/25    shadow-[0_0_8px_rgba(248,113,113,0.12)]',
    neutral: 'bg-slate-500/10  text-slate-400  border-slate-500/25',
  };
  return (
    <span
      className={`
                inline-flex items-center gap-1 px-2 py-[3px]
                rounded-full text-[11px] font-medium tracking-wide
                border ${map[variant]}
            `}
    >
      {children}
    </span>
  );
};

/** Small dot indicator */
const Dot = ({ active }: { active: boolean }) => (
  <span
    className={`
            inline-block h-[6px] w-[6px] rounded-full
            ${active ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]' : 'bg-slate-600'}
        `}
  />
);

// ─── Column definitions ───────────────────────────────────────────────────────

export const UserColumns = () =>
  useMemo<ColumnDef<UserDto>[]>(
    () => [
      // ── ID ──────────────────────────────────────────────────────────

      // ── NAME ────────────────────────────────────────────────────────
      {
        id: 'name',
        accessorKey: 'name',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Name"
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={row.original.name} />
            <div className="min-w-0">
              <CardDescription className="font-semibold truncate leading-tight">{row.original.name}</CardDescription>
              <CardDescription className="text-[11px] text-slate-500 truncate leading-tight mt-px font-mono">
                @{row.original.userName}
              </CardDescription>
              <CardDescription className="text-xs text-slate-500 truncate leading-tight mt-px font-mono">@{row.original.usersId}</CardDescription>
            </div>
          </div>
        ),
        meta: { sortingKey: 'name' },
      },

      // ── CONTACT (email column repurposed) ────────────────────────────
      {
        id: 'email',
        accessorKey: 'email',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Contact"
          />
        ),
        cell: ({ row }) => (
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-[12px] text-slate-300">
              <BsEnvelope className="text-slate-500 shrink-0" size={11} />
              <span className="truncate">{row.original.email}</span>
            </p>
            <p className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <BsPhone className="text-slate-500 shrink-0" size={11} />
              <span>{row.original.phone}</span>
            </p>
          </div>
        ),
        meta: { sortingKey: 'email' },
      },

      // ── ACTIVE STATUS (phone column repurposed) ──────────────────────
      {
        id: 'phone',
        accessorKey: 'phone',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Activity"
          />
        ),
        cell: ({ row }) => (
          <Pill variant={row.original.isActive ? 'success' : 'neutral'}>
            <Dot active={!!row.original.isActive} />
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Pill>
        ),
        meta: { sortingKey: 'phone' },
      },

      // ── EMAIL VERIFICATION ───────────────────────────────────────────
      {
        id: 'isEmailVerified',
        accessorKey: 'isEmailVerified',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Verification"
          />
        ),
        cell: ({ row }) => (
          <Pill variant={row.original.isEmailVerified ? 'success' : 'warning'}>
            {row.original.isEmailVerified ? (
              <>
                <GoCheckCircleFill size={10} />
                Verified
              </>
            ) : (
              <>⏳ Pending</>
            )}
          </Pill>
        ),
        meta: { sortingKey: 'isEmailVerified' },
      },

      // ── LAST ACTIVE ──────────────────────────────────────────────────
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Last Active"
          />
        ),
        cell: ({ row }) => {
          const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
          return (
            <span className="text-[12px] text-slate-400 tabular-nums">
              {row.original.tokenUpdated ? (
                unitOfService.DateTimeService.convertToLocalDate(row.original.tokenUpdated, true)
              ) : (
                <span className="text-slate-600 select-none">—</span>
              )}
            </span>
          );
        },
        meta: { sortingKey: 'updatedAt' },
      },

      // ── STATUS ───────────────────────────────────────────────────────
      {
        id: 'status',
        accessorKey: 'status',
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            className="text-center text-[10px] font-semibold uppercase tracking-widest text-slate-500"
            title="Status"
          />
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.status ? (
              <GoCheckCircleFill size={16} className="text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
            ) : (
              <IoMdCloseCircle size={16} className="text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.5)]" />
            )}
          </div>
        ),
        meta: { sortingKey: 'status' },
      },
    ],
    []
  );
