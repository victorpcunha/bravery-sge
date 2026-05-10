'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface TabMatrizesProps {
  schoolId: string
}

export function TabMatrizes({ schoolId }: TabMatrizesProps) {
  return (
    <Card className="border-0 shadow-md card-glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[#0f172a]">
          Matrizes Curriculares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#64748b]" />
          </div>
          <p className="text-[#64748b]">Em desenvolvimento...</p>
          <p className="text-sm text-[#94a3b8] mt-2">
            Esta funcionalidade permitirá criar e gerenciar as matrizes curriculares vinculadas a cada ano letivo e etapa de ensino.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}