import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WorkspaceStat {
  label: string;
  value: string;
  hint: string;
}

interface WorkspaceInsight {
  title: string;
  description: string;
  tag?: string;
}

interface WorkspaceAction {
  label: string;
  variant?: 'default' | 'outline' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface WorkspacePageProps {
  title: string;
  description: string;
  searchPlaceholder: string;
  actions?: WorkspaceAction[];
  stats: WorkspaceStat[];
  columns: string[];
  rows: ReactNode[][];
  insightsTitle: string;
  insights: WorkspaceInsight[];
}

export function WorkspacePage({
  title,
  description,
  searchPlaceholder,
  actions = [],
  stats,
  columns,
  rows,
  insightsTitle,
  insights,
}: WorkspacePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant || 'default'}
              className={action.variant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
            >
              {action.loading ? 'Dang xu ly...' : action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-zinc-800 bg-zinc-900/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold text-white">{stat.value}</div>
              <p className="mt-1 text-xs text-zinc-400">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base text-white">Danh sach cong viec</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  readOnly
                  value=""
                  placeholder={searchPlaceholder}
                  className="h-9 w-56 border-zinc-700 bg-zinc-950 text-zinc-300 placeholder:text-zinc-600"
                />
                <Button variant="outline" className="border-zinc-700 bg-zinc-950 text-zinc-200">
                  Loc nang cao
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  {columns.map((column) => (
                    <TableHead key={column} className="text-zinc-400">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={`row-${index}`} className="border-zinc-800 hover:bg-zinc-800/30">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={`cell-${index}-${cellIndex}`} className="text-zinc-200">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white">{insightsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div key={insight.title} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-white">{insight.title}</h3>
                  {insight.tag ? <Badge className="bg-zinc-800 text-zinc-300">{insight.tag}</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-zinc-400">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
