import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cake } from 'lucide-react'
import { cn } from '@/lib/utils'

type AniversariantesListProps = {
  data: { nome: string; data: string; turma: string }[]
  className?: string
}

function formatDate(dateStr: string) {
  try {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}`
  } catch {
    return dateStr
  }
}

export function AniversariantesList({ data, className }: AniversariantesListProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>Aniversariantes do Mês</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Nenhum aniversariante este mês</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((item, i) => (
              <li key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                  <Cake className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{item.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.data)} — {item.turma}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
